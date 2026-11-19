import { useCallback, useRef, useState } from "react"

export type Turn = { role: "user" | "assistant"; content: string }

/**
 * Where the companion Worker lives. Locally, Vite forwards /api to the Worker
 * running on port 8787; the live build gets the Worker's address at build time.
 */
const CHAT_URL = import.meta.env.VITE_COMPANION_URL || "/api/chat"

/** Matches the Worker's limit, so a long demo restarts instead of failing. */
const MAX_TURNS = 20

export function useCompanionChat(initial: Turn[] = []) {
  const [turns, setTurns] = useState<Turn[]>(initial)
  const [busy, setBusy] = useState(false)
  const abort = useRef<AbortController | null>(null)

  /**
   * Resolves null once answered (or cancelled), or with a message for the
   * viewer if it failed. A failed exchange is taken out of the conversation,
   * so the question can simply be sent again.
   */
  const send = useCallback(
    async (text: string): Promise<string | null> => {
      const question = text.trim()
      if (!question || busy) return null

      const history = [...turns, { role: "user", content: question } as Turn].slice(-(MAX_TURNS - 1))
      // Keep the conversation starting with a user turn after trimming.
      while (history[0]?.role !== "user") history.shift()

      setTurns([...history, { role: "assistant", content: "" }])
      setBusy(true)
      abort.current = new AbortController()

      const append = (chunk: string) =>
        setTurns((t) => {
          const last = t[t.length - 1]
          return [...t.slice(0, -1), { ...last, content: last.content + chunk }]
        })

      try {
        const res = await fetch(CHAT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: abort.current.signal,
        })
        if (!res.ok || !res.body) throw new Error(`Companion returned ${res.status}`)

        const reader = res.body.pipeThrough(new TextDecoderStream()).getReader()
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          append(value)
        }
        return null
      } catch (err) {
        if ((err as Error).name === "AbortError") return null
        setTurns(history.slice(0, -1))
        return "Sorry, I can't reach the companion right now. Your question is back in the bar, so you can send it again."
      } finally {
        setBusy(false)
      }
    },
    [busy, turns],
  )

  const reset = useCallback(() => {
    abort.current?.abort()
    setTurns([])
  }, [])

  return { turns, busy, send, reset }
}
