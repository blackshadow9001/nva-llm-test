import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react"
import { ArrowRight, Mic, Paperclip } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSpeechInput } from "@/companion/useSpeechInput"
import { Btn } from "./ui"

/** Rotates through `list` every 4.4 s, like the design's suggestion ticker. */
export function useTicker(length: number, offset = 0) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 4400)
    return () => clearInterval(t)
  }, [])
  return { index: (tick + offset) % Math.max(length, 1), cls: tick % 2 ? "lp-sug-a" : "lp-sug-b", key: tick }
}

/**
 * The companion's ask field, used by the home hero, the floating dock and the
 * conversation. Rotating suggestions (Tab fills one), live mic dictation, and
 * `onAsk` with the final text.
 */
export function AskField({
  suggestions,
  offset = 0,
  onAsk,
  busy = false,
  placeholder,
  showTabKey = false,
  round = false,
  label = "Ask your care companion",
  autoFocus = false,
  after,
}: {
  suggestions: string[]
  offset?: number
  /** Resolve with a message if asking failed: the question goes back in the field. */
  onAsk: (text: string) => void | Promise<string | null | void>
  busy?: boolean
  /** A fixed placeholder instead of rotating suggestions. */
  placeholder?: string
  showTabKey?: boolean
  round?: boolean
  label?: string
  autoFocus?: boolean
  after?: ReactNode
}) {
  const [draft, setDraft] = useState("")
  const [lastAsked, setLastAsked] = useState("")
  const input = useRef<HTMLInputElement>(null)
  const sug = useTicker(suggestions.length, offset)
  const suggestion = suggestions[sug.index] ?? ""

  const [problem, setProblem] = useState("")
  const ask = async (text: string) => {
    const q = text.trim()
    if (!q || busy) return
    setLastAsked(q)
    setDraft("")
    setProblem("")
    const failed = await onAsk(q)
    if (typeof failed === "string" && failed) {
      setProblem(failed)
      setDraft((d) => d || q)
    }
  }
  const voice = useSpeechInput({ onText: setDraft, onDone: (t) => void ask(t) })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void ask(draft)
  }
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && !e.shiftKey && !draft && !placeholder && suggestion) {
      e.preventDefault()
      setDraft(suggestion)
    }
    if (e.key === "ArrowUp" && !draft && lastAsked) {
      e.preventDefault()
      setDraft(lastAsked)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full min-w-0 flex-col gap-1">
      <div className="flex w-full min-w-0 items-center gap-3">
        <div className="relative flex min-w-0 flex-1 items-center">
          <input
            ref={input}
            value={draft}
            autoFocus={autoFocus}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label={label}
            placeholder={placeholder}
            maxLength={1500}
            className="h-9 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          {!draft && voice.listening && (
            <span aria-hidden="true" className="ui pointer-events-none absolute inset-0 flex items-center text-primary">
              Listening…
            </span>
          )}
          {!draft && !voice.listening && !placeholder && (
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center gap-2 overflow-hidden">
              <span key={sug.key} className={cn("ui min-w-0 truncate text-muted-foreground", sug.cls)}>
                {suggestion}
              </span>
              {showTabKey && (
                <kbd className="small shrink-0 rounded-[calc(var(--radius)*0.6)] border border-border px-1.5 text-muted-foreground" style={{ fontFamily: "var(--font-code)" }}>
                  Tab
                </kbd>
              )}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Btn variant="ghost" size="icon" aria-label="Attach a file" className={cn("size-10", round && "rounded-full")} title="Attachments aren't part of this prototype">
            <Paperclip size={18} />
          </Btn>
          {voice.supported && (
            <Btn
              variant={voice.listening ? "default" : "ghost"}
              size="icon"
              aria-label={voice.listening ? "Stop voice input" : "Start voice input"}
              aria-pressed={voice.listening}
              disabled={busy}
              onClick={voice.listening ? voice.stop : voice.start}
              className={cn("size-10", round && "rounded-full", voice.listening && "lp-listening")}
            >
              <Mic size={18} />
            </Btn>
          )}
          <Btn type="submit" size="icon" aria-label="Send" disabled={busy || !draft.trim()} className={cn("size-10", round && "rounded-full")}>
            <ArrowRight size={18} />
          </Btn>
        </div>
      </div>
      {(problem || voice.problem) && (
        <p role="status" className="small m-0 text-warning">
          {problem || voice.problem}
        </p>
      )}
      {after}
    </form>
  )
}
