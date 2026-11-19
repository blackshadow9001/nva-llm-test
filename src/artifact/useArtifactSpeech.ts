import { useCallback, useEffect, useRef, useState } from "react"
import { dictationReady, type Dictation } from "./claude"

/**
 * Artifact version of useSpeechInput: same shape, but uses claude.ai's own
 * dictation instead of the browser's recogniser (which the Artifact frame
 * blocks). Words appear as you speak; a short pause sends them.
 */

const PAUSE_MS = 1800

export function useSpeechInput({
  onText,
  onDone,
}: {
  onText: (text: string) => void
  onDone: (text: string) => void
}) {
  const [d, setD] = useState<Dictation | null>(null)
  const [listening, setListening] = useState(false)
  const [problem, setProblem] = useState("")
  const handlers = useRef({ onText, onDone })
  useEffect(() => {
    handlers.current = { onText, onDone }
  })

  useEffect(() => {
    let live = true
    dictationReady.then((x) => live && setD(x))
    return () => {
      live = false
    }
  }, [])

  // Wire up the dictation events once it's available.
  useEffect(() => {
    if (!d) return
    let heard = ""
    let timer: ReturnType<typeof setTimeout> | undefined
    const pauseThenSend = () => {
      clearTimeout(timer)
      timer = setTimeout(() => void d.stop().catch(() => {}), PAUSE_MS)
    }
    const offFinal = d.onFinal(({ text }) => {
      heard = (heard ? heard + text : text.trimStart())
      handlers.current.onText(heard)
      pauseThenSend()
    })
    const offPartial = d.onPartial(({ text }) => {
      if (!text) return
      clearTimeout(timer)
      handlers.current.onText(heard ? `${heard} ${text.trim()}` : text.trim())
    })
    const offState = d.onState(({ state, reason }) => {
      if (state === "starting") {
        heard = ""
        setProblem("")
      }
      setListening(state !== "idle")
      if (state !== "idle") return
      clearTimeout(timer)
      if (reason === "not_granted") setProblem("Microphone access is blocked. Allow it for this page to talk to the companion.")
      else if (reason === "upstream_error" || reason === "rate_limited") setProblem("Voice input isn't working right now. You can type instead.")
      const text = heard.trim()
      heard = ""
      if (text && (reason === "stopped" || reason === "viewer_stopped")) handlers.current.onDone(text)
    })
    return () => {
      clearTimeout(timer)
      offFinal()
      offPartial()
      offState()
    }
  }, [d])

  // Must run straight from the click: no awaiting before d.start().
  const start = useCallback(() => {
    if (!d) return
    d.start({ language: "en-US" }).catch((e: { code?: string }) => {
      if (e?.code === "not_granted") setProblem("Microphone access is blocked. Allow it for this page to talk to the companion.")
      else if (e?.code === "unavailable") setD(null)
      else if (e?.code && e.code !== "dismissed" && e.code !== "stopped") setProblem("Voice input isn't working right now. You can type instead.")
    })
  }, [d])

  const stop = useCallback(() => void d?.stop().catch(() => {}), [d])

  return { supported: Boolean(d), listening, problem, start, stop }
}
