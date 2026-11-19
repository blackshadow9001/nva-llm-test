import { useEffect, useRef, useState } from "react"
import { CalendarCheck, Phone, Plus, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCompanionChat, type Turn } from "@/companion/useCompanionChat"
import { AppHeader } from "../AppHeader"
import { AskField } from "../AskBar"
import { Avatar, Badge, Btn, LinkBtn, TextInput } from "../ui"
import { CLINIC, IMG } from "../data"
import { DESKTOP } from "../routes"
import "../desktop.css"

/**
 * LP02 · Conversation. The two earlier threads are the design's demo chats;
 * anything Lucy asks (here, or from another page via ?q=) is answered live by
 * the companion, and a follow-up in an old thread keeps that thread's context.
 */

type Msg = { user: boolean; text: string }
type Thread = { id: string; title: string; when: string; msgs: Msg[]; ears?: boolean }

const DEMO: Thread[] = [
  {
    id: "ears",
    title: "Waffles has been scratching her ears",
    when: "Just now",
    ears: true,
    msgs: [
      { user: true, text: "Waffles has been scratching her ears a lot since yesterday. Should I be worried?" },
      { user: false, text: "Thanks for telling me. Ear scratching is common in puppies, and Golden Retrievers can be prone to ear and skin irritation, especially in damp weather." },
      { user: false, text: "Things worth noting before a visit: redness, a smell, head shaking, or if it gets worse. If you see any of those today, call the clinic." },
      { user: false, text: "Dr. Patel can take a look. These are the soonest openings at Cedar Bay, and the exam is covered by your Plus plan." },
    ],
  },
  {
    id: "food",
    title: "How much should a puppy eat?",
    when: "Last week",
    msgs: [
      { user: true, text: "How much should Waffles eat each day? She’s 14 weeks and about 24 lb." },
      { user: false, text: "Puppies her age usually eat three or four small meals a day. The right amount depends on her food and growth, so Dr. Patel can set a target at her next visit." },
      { user: false, text: "I added a weigh-in to Waffles’ key dates so you can track it together." },
    ],
  },
]

const SUGGESTIONS = ["Ask a follow-up"]

/** The demo messages as a conversation the companion can continue. */
function asTurns(msgs: Msg[]): Turn[] {
  const out: Turn[] = []
  for (const m of msgs) {
    const role = m.user ? "user" : "assistant"
    const last = out.at(-1)
    if (last?.role === role) last.content += `\n\n${m.text}`
    else out.push({ role, content: m.text })
  }
  return out
}

function readQuestion(): string {
  const q = new URLSearchParams(window.location.hash.split("?")[1] ?? "").get("q")
  return q?.trim().slice(0, 1500) ?? ""
}

export function LP02Conversation() {
  const [question] = useState(readQuestion)
  const [live, setLive] = useState<Thread | null>(() =>
    question ? { id: "live", title: question, when: "Just now", msgs: [] } : null,
  )
  const [current, setCurrent] = useState(question ? "live" : "ears")
  const [search, setSearch] = useState("")

  // The question has been taken; drop it from the address so a reload doesn't ask again.
  useEffect(() => {
    if (question) history.replaceState(null, "", DESKTOP.conversation)
  }, [question])

  const threads = [
    ...(live ? [live] : []),
    ...DEMO.map((t) => (live && t.id === "ears" ? { ...t, when: "Earlier today" } : t)),
  ]
  const shown = threads.filter((t) => t.title.toLowerCase().includes(search.trim().toLowerCase()))

  const newConversation = () => {
    setLive({ id: "live", title: "New conversation", when: "Just now", msgs: [] })
    setCurrent("live")
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground" style={{ fontFamily: "var(--font-ui)" }}>
      <AppHeader current="companion" />
      <div className="flex min-h-0 flex-1">
        <aside aria-label="Conversations" className="flex w-[280px] shrink-0 flex-col gap-3 overflow-y-auto border-r border-border px-4 py-5" style={{ background: "var(--sidebar)" }}>
          <Btn variant="outline" className="w-full" onClick={newConversation}>
            <Plus size={16} />
            Start a new conversation
          </Btn>
          <TextInput aria-label="Search conversations" placeholder="Search conversations" value={search} onChange={(e) => setSearch(e.target.value)} />
          <span className="small mt-2 text-muted-foreground">Recent</span>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {shown.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setCurrent(t.id)}
                  aria-current={t.id === current ? "true" : undefined}
                  className="flex min-h-[52px] w-full cursor-pointer items-center gap-3 rounded-[var(--radius)] border-0 p-2 text-left"
                  style={{ background: t.id === current ? "var(--sidebar-accent)" : "transparent", font: "inherit" }}
                >
                  <img src={IMG.waffles} alt="" className="size-7 shrink-0 rounded-full bg-muted object-cover" />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="ui line-clamp-2 font-medium text-foreground">{t.title}</span>
                    <span className="small text-muted-foreground">{t.when}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Every thread stays mounted so a live answer keeps streaming while you look at another. */}
        {threads.map((t) => (
          <ThreadView
            key={t.id === "live" ? `live-${live?.title === "New conversation" ? "new" : "q"}` : t.id}
            thread={t}
            hidden={t.id !== current}
            firstQuestion={t.id === "live" ? question : ""}
            onFirstAsk={(q) => t.id === "live" && setLive((l) => (l && l.title === "New conversation" ? { ...l, title: q } : l))}
          />
        ))}
      </div>
    </div>
  )
}

function ThreadView({
  thread,
  hidden,
  firstQuestion,
  onFirstAsk,
}: {
  thread: Thread
  hidden: boolean
  firstQuestion: string
  onFirstAsk: (q: string) => void
}) {
  const seeded = asTurns(thread.msgs)
  const { turns, busy, send } = useCompanionChat(seeded)
  const end = useRef<HTMLDivElement>(null)
  const asked = useRef(false)
  const [slot, setSlot] = useState(0)

  // A question carried over from another page is asked straight away (once).
  useEffect(() => {
    if (firstQuestion && !asked.current) {
      asked.current = true
      void send(firstQuestion)
    }
  }, [firstQuestion, send])

  const lastLength = turns.at(-1)?.content.length ?? 0
  useEffect(() => {
    if (!hidden && turns.length > seeded.length) end.current?.scrollIntoView({ block: "end", behavior: "smooth" })
  }, [hidden, turns.length, lastLength, seeded.length])

  const ask = (q: string) => {
    if (turns.length === 0) onFirstAsk(q)
    return send(q)
  }

  const liveTurns = turns.slice(seeded.length)
  const slots = ["Fri, Nov 13 · 4:30 PM", "Sat, Nov 14 · 9:00 AM", "Mon, Nov 16 · 7:30 AM"]

  return (
    <main className={cn("flex min-w-0 flex-1 flex-col", hidden && "hidden")}>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto box-border flex max-w-[760px] flex-col gap-6 px-10 py-8">
          <div className="flex items-center gap-2">
            <Badge>
              <img src={IMG.waffles} alt="" className="size-3.5 rounded-full object-cover" />
              Waffles
            </Badge>
            <h1 className="h3 m-0 text-foreground">{thread.title}</h1>
          </div>

          {thread.msgs.map((m, i) => (m.user ? <UserBubble key={i} text={m.text} /> : <BotBubble key={i} text={m.text} />))}

          {thread.ears && (
            <div className="ml-11 flex flex-col gap-3 rounded-[calc(var(--radius)*1.4)] border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <Avatar>PP</Avatar>
                <span className="flex flex-col">
                  <strong className="ui font-semibold text-foreground">{CLINIC.vet}</strong>
                  <span className="small text-muted-foreground">Waffles' vet · {CLINIC.name} · 0.8 mi</span>
                </span>
                <Badge variant="outline" className="ml-auto">
                  Wellness exam covered by Plus
                </Badge>
              </div>
              <div role="group" aria-label="Soonest openings" className="flex flex-wrap gap-2">
                {slots.map((s, i) => (
                  <Btn key={s} variant={i === slot ? "default" : "outline"} aria-pressed={i === slot} onClick={() => setSlot(i)}>
                    {s}
                  </Btn>
                ))}
              </div>
              <div className="flex gap-2">
                <LinkBtn href={DESKTOP.petCare}>
                  <CalendarCheck size={16} />
                  Book {slots[slot]}
                </LinkBtn>
                <LinkBtn variant="outline" href={CLINIC.tel}>
                  <Phone size={16} />
                  Talk to a person
                </LinkBtn>
              </div>
              <p className="small m-0 text-muted-foreground">I'll share a short summary of this conversation with Dr. Patel, so you don't have to explain it again.</p>
            </div>
          )}

          {liveTurns.map((t, i) =>
            t.role === "user" ? (
              <UserBubble key={`l${i}`} text={t.content} />
            ) : (
              <BotBubble key={`l${i}`} text={t.content} thinking={busy && i === liveTurns.length - 1} />
            ),
          )}

          {thread.msgs.length === 0 && liveTurns.length === 0 && (
            <p className="body m-0 text-muted-foreground">Ask anything about Waffles' care. Your care companion answers right away, and a person is one click away.</p>
          )}
          <div ref={end} />
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-background">
        <div className="mx-auto box-border max-w-[760px] px-10 pt-4 pb-5">
          <div className="flex items-center rounded-[calc(var(--radius)*1.4)] border border-input bg-card py-2 pr-2 pl-4 shadow-xs">
            <AskField suggestions={SUGGESTIONS} placeholder="Ask a follow-up" label="Ask a follow-up" onAsk={ask} busy={busy} autoFocus={!hidden} />
          </div>
          <p className="small mt-2 mb-0 text-muted-foreground">
            Your care companion isn't a vet. For anything urgent, call {CLINIC.short} at {CLINIC.phone}.
          </p>
        </div>
      </div>
    </main>
  )
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="body max-w-[520px] self-end rounded-[calc(var(--radius)*1.4)] bg-secondary px-4 py-3 text-pretty whitespace-pre-wrap text-secondary-foreground">
      {text}
    </div>
  )
}

function BotBubble({ text, thinking = false }: { text: string; thinking?: boolean }) {
  return (
    <div className="flex gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Sparkles size={16} />
      </span>
      <p className="body m-0 min-w-0 pt-1 whitespace-pre-wrap text-foreground">
        {text || (thinking ? <span className="text-muted-foreground">Thinking…</span> : null)}
      </p>
    </div>
  )
}
