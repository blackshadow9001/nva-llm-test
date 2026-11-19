import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import {
  ArrowUp,
  CloudRain,
  Heart,
  House,
  Mic,
  PawPrint,
  PhoneCall,
  RotateCcw,
  Smile,
  Sparkles,
  MapPin,
  Syringe,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BrandMark } from "@/flow1e/parts"
import { useCompanionChat, type Turn } from "./useCompanionChat"
import { useSpeechInput } from "./useSpeechInput"

/** Rotating placeholder suggestions; Tab drops the current one into the bar. */
const SUGGESTIONS = [
  "How do I start brushing Waffles' teeth?",
  "Is 14 pounds normal for a 12-week Golden?",
  "What should I bring to her puppy shots?",
  "How do I tire her out on a rainy day?",
]

const PILLS = [
  { icon: CloudRain, label: "Rainy-day ideas for Waffles", ask: "It's raining all day. What are some good indoor games for Waffles?", featured: true },
  { icon: Syringe, label: "Get ready for her puppy shots", ask: "How can I get Waffles ready for her second puppy shots on Tuesday?" },
  { icon: Smile, label: "Start a tooth-brushing habit", ask: "How do I start a tooth-brushing habit with Waffles?" },
  { icon: MapPin, label: "Puppy-friendly spots in Fremont", ask: "Where can I take Waffles in Fremont before she's fully vaccinated?" },
]

export function CompanionHome() {
  const { turns, busy, send, reset } = useCompanionChat()
  const [draft, setDraft] = useState("")
  const [sug, setSug] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const end = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setInterval(() => setSug((s) => (s + 1) % SUGGESTIONS.length), 4400)
    return () => clearInterval(t)
  }, [])

  // Keep the newest words in view while a reply streams in.
  const lastLength = turns.at(-1)?.content.length ?? 0
  useEffect(() => {
    if (turns.length) end.current?.scrollIntoView({ block: "end", behavior: "smooth" })
  }, [turns.length, lastLength])

  const [chatProblem, setChatProblem] = useState("")
  const lastAsked = useRef("")

  // The bar empties on send (the question shows in the conversation). If the
  // reply fails, the question comes back so it can be sent again.
  const ask = async (text: string) => {
    if (!text.trim() || busy) return
    lastAsked.current = text.trim()
    setChatProblem("")
    setDraft("")
    input.current?.focus()
    const problem = await send(text)
    if (problem) {
      setChatProblem(problem)
      setDraft((d) => d || text.trim())
    }
  }

  // Mic: words appear in the bar as you speak, then send when you pause.
  const voice = useSpeechInput({ onText: setDraft, onDone: ask })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void ask(draft)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && !e.shiftKey && !draft) {
      e.preventDefault()
      setDraft(SUGGESTIONS[sug])
    }
    // Up arrow in an empty bar brings back the last question to edit or resend.
    if (e.key === "ArrowUp" && !draft && lastAsked.current) {
      e.preventDefault()
      setDraft(lastAsked.current)
    }
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <TopBar />

      <section className="rounded-b-[48px] bg-secondary">
        <div className="mx-auto flex max-w-[1064px] flex-col gap-8 px-6 pt-14 pb-14">
          <div className="flex flex-col gap-4">
            <p className="m-0 flex items-center gap-2 text-sm font-medium text-secondary-foreground">
              <CloudRain className="size-4" />
              Thursday, December 3 · Rain all day in Fremont
            </p>
            <h1 className="m-0 max-w-[820px] text-[clamp(2.5rem,5vw,3.75rem)] leading-[1.05] font-bold tracking-[-0.03em] text-balance text-foreground">
              Good morning, Lucy. What's on your mind for Waffles?
            </h1>
          </div>

          <form
            onSubmit={onSubmit}
            className="flex items-center gap-3 rounded-[28px] bg-card py-2.5 pr-2.5 pl-6 shadow-lg shadow-primary/5 ring-1 ring-foreground/5 focus-within:ring-2 focus-within:ring-ring/50"
          >
            <Sparkles className="size-5 shrink-0 text-primary" />
            <div className="relative flex min-w-0 flex-1 items-center">
              <input
                ref={input}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label="Ask your care companion"
                maxLength={1500}
                className="h-12 w-full min-w-0 bg-transparent text-lg outline-none"
              />
              {!draft && voice.listening && (
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center text-lg text-primary">
                  Listening…
                </span>
              )}
              {!draft && !voice.listening && (
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center gap-2.5 overflow-hidden">
                  <span key={sug} className="ap-rise truncate text-lg text-muted-foreground">
                    {SUGGESTIONS[sug]}
                  </span>
                  <kbd className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">Tab</kbd>
                </span>
              )}
            </div>
            {voice.supported && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={voice.listening ? "Stop listening" : "Ask by voice"}
                aria-pressed={voice.listening}
                disabled={busy}
                onClick={voice.listening ? voice.stop : voice.start}
                className={cn(
                  "relative size-12",
                  voice.listening ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "bg-muted",
                )}
              >
                {voice.listening && <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-primary/30" />}
                <Mic className="relative size-5" />
              </Button>
            )}
            <Button type="submit" size="icon" aria-label="Send" disabled={busy || !draft.trim()} className="size-14">
              <ArrowUp className="size-6" />
            </Button>
          </form>

          {(chatProblem || voice.problem) && (
            <p role="status" className="-mt-4 m-0 text-sm text-warning">
              {chatProblem || voice.problem}
            </p>
          )}

          <div aria-label="Suggested questions" className="flex flex-wrap gap-2.5">
            {PILLS.map(({ icon: Icon, label, ask: question, featured }) => (
              <Button
                key={label}
                variant="outline"
                disabled={busy}
                onClick={() => void ask(question)}
                className={cn(
                  "h-10 border-0 font-semibold shadow-none",
                  featured ? "bg-accent-5 text-accent-5-foreground hover:bg-accent-5/85" : "bg-card",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Button>
            ))}
          </div>

          {turns.length > 0 && <Conversation turns={turns} busy={busy} onReset={reset} />}
          <div ref={end} />

          <p className="m-0 text-xs text-muted-foreground">
            Your care companion isn't a vet. For anything urgent, use Urgent help. Demo data only: please don't enter real personal details.
          </p>
        </div>
      </section>
    </div>
  )
}

function TopBar() {
  return (
    <header className="bg-background">
      <div className="mx-auto grid h-[76px] max-w-[1064px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-6">
        <span className="flex items-center gap-2 text-lg font-bold tracking-[.18em] text-primary">
          <BrandMark size={18} />
          ACME
        </span>
        <nav aria-label="Main" className="hidden items-center gap-1 rounded-full bg-muted p-1 md:flex">
          <a href="#/companion" aria-current="page" className="flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
            <House className="size-4" />
            Home
          </a>
          <a href="#/is09" className="flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold hover:bg-card">
            <PawPrint className="size-4" />
            My Pet Care
          </a>
          <a href="#/is00" className="flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold hover:bg-card">
            <Heart className="size-4" />
            ACME
          </a>
        </nav>
        <div className="flex items-center justify-end gap-4">
          <a
            href="tel:+14255550148"
            className="hidden h-9 items-center gap-2 rounded-full border border-emergency/30 bg-emergency-subtle px-4 text-sm font-semibold text-emergency sm:flex"
          >
            <PhoneCall className="size-4" />
            Urgent help
          </a>
          <span aria-label="Lucy" className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            L
          </span>
        </div>
      </div>
    </header>
  )
}

function Conversation({ turns, busy, onReset }: { turns: Turn[]; busy: boolean; onReset: () => void }) {
  return (
    <div aria-live="polite" className="flex flex-col gap-5 rounded-[28px] bg-card p-6 ring-1 ring-foreground/5">
      {turns.map((t, i) =>
        t.role === "user" ? (
          <p key={i} className="m-0 max-w-[80%] self-end rounded-2xl bg-secondary px-4 py-3 text-[15px] text-secondary-foreground">
            {t.content}
          </p>
        ) : (
          <div key={i} className="flex gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            <p className="m-0 min-w-0 pt-1 text-[15px] leading-6 whitespace-pre-wrap">
              {t.content || <span className="text-muted-foreground">Thinking…</span>}
            </p>
          </div>
        ),
      )}
      {!busy && (
        <Button variant="ghost" size="sm" onClick={onReset} className="self-start text-muted-foreground">
          <RotateCcw className="size-3.5" />
          Start over
        </Button>
      )}
    </div>
  )
}
