import { useCallback, useRef, useState } from "react"
import { COMPANION_BRIEF } from "../../worker/src/companion"
import { sampleReady, type SampleError } from "./claude"

/**
 * Artifact version of useCompanionChat: same shape, but asks Claude through
 * claude.ai's built-in "sample" feature instead of the Worker. It runs on the
 * viewer's own Claude account, so there's no key and nothing to host.
 */

export type Turn = { role: "user" | "assistant"; content: string }

const MAX_TURNS = 20
const MAX_CHARS = 1500

const INSTRUCTIONS = `${COMPANION_BRIEF}

Everything after this message is the chat with Lucy. Reply to her latest message only, in plain text.`

function explain(code: string): string {
  switch (code) {
    case "not_granted":
      return "The companion needs your OK to use Claude. Reload the page and choose Allow when asked."
    case "sampling_disabled":
    case "capability_disabled":
    case "not_declared":
      return "Claude isn't available on this account, so the companion can't answer here."
    case "rate_limited":
      return "That's a lot of questions at once. Wait a minute, then try again."
    case "session_expired":
      return "Your claude.ai sign-in has expired. Sign in again, then reload this page."
    case "refused":
      return "I can't help with that one. Try asking about Waffles' care instead."
    default:
      return "Sorry, I couldn't answer just now. Please try again in a moment."
  }
}

export function useCompanionChat(initial: Turn[] = []) {
  const [turns, setTurns] = useState<Turn[]>(initial)
  const [busy, setBusy] = useState(false)
  const abort = useRef<AbortController | null>(null)

  /** Same contract as the Worker version: null when answered, else a message. */
  const send = useCallback(
    async (text: string): Promise<string | null> => {
      const question = text.trim().slice(0, MAX_CHARS)
      if (!question || busy) return null

      const history = [...turns, { role: "user", content: question } as Turn].slice(-(MAX_TURNS - 1))
      while (history[0]?.role !== "user") history.shift()

      const setReply = (content: string) =>
        setTurns((t) => [...t.slice(0, -1), { role: "assistant", content }])

      setTurns([...history, { role: "assistant", content: "" }])
      setBusy(true)
      const ctl = new AbortController()
      abort.current = ctl

      try {
        const sample = await sampleReady
        if (!sample) {
          setTurns(history.slice(0, -1))
          return "The AI chat only works when this page is opened on claude.ai."
        }
        const { text: reply } = await sample([{ role: "user", content: INSTRUCTIONS }, ...history], {
          modelTier: "quick",
          cache: false,
          signal: ctl.signal,
          onText: ({ text }) => setReply(text),
        })
        setReply(reply)
        return null
      } catch (err) {
        const e = err as SampleError
        if (e?.code === "cancelled") return null
        setTurns(history.slice(0, -1))
        return explain(e?.code)
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
