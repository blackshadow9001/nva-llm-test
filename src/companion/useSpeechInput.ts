import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Speech-to-text using the browser's built-in recogniser (Chrome, Edge,
 * Safari). Free and keyless; the browser sends the audio to its own service
 * (Google or Apple) to transcribe it. Not available in Firefox.
 */

// Minimal shape of the Web Speech API, which isn't in every TypeScript lib.
type Recognition = {
  lang: string
  interimResults: boolean
  continuous: boolean
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}
type RecognitionCtor = new () => Recognition

function recogniser(): RecognitionCtor | undefined {
  if (typeof window === "undefined") return undefined
  const w = window as unknown as Record<string, RecognitionCtor | undefined>
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

export function useSpeechInput({
  onText,
  onDone,
}: {
  /** Called with the words so far, as they're recognised. */
  onText: (text: string) => void
  /** Called once with the final words when the speaker stops. */
  onDone: (text: string) => void
}) {
  const [listening, setListening] = useState(false)
  const [problem, setProblem] = useState("")
  const rec = useRef<Recognition | null>(null)
  const latest = useRef("")
  // Keep the newest callbacks without restarting the recogniser.
  const handlers = useRef({ onText, onDone })
  useEffect(() => {
    handlers.current = { onText, onDone }
  })

  useEffect(() => () => rec.current?.abort(), [])

  const start = useCallback(() => {
    const Ctor = recogniser()
    if (!Ctor || rec.current) return
    const r = new Ctor()
    r.lang = "en-US"
    r.interimResults = true
    r.continuous = false // stop on a pause, then send
    latest.current = ""
    setProblem("")

    r.onresult = (e) => {
      latest.current = Array.from(e.results, (res) => res[0]?.transcript ?? "").join("")
      handlers.current.onText(latest.current)
    }
    r.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setProblem("Microphone access is blocked. Allow it in the browser's address bar to talk to the companion.")
      } else if (e.error === "no-speech") {
        setProblem("I didn't catch that. Tap the mic and try again.")
      } else if (e.error !== "aborted") {
        setProblem("Voice input isn't working right now. You can type instead.")
      }
    }
    r.onend = () => {
      rec.current = null
      setListening(false)
      const text = latest.current.trim()
      if (text) handlers.current.onDone(text)
    }

    rec.current = r
    r.start()
    setListening(true)
  }, [])

  /** Stop listening; whatever was heard is sent. */
  const stop = useCallback(() => rec.current?.stop(), [])

  return { supported: Boolean(recogniser()), listening, problem, start, stop }
}
