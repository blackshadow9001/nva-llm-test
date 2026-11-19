import { useEffect, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react"
import {
  ArrowRight,
  Calendar,
  CalendarPlus,
  Check,
  CircleCheck,
  Heart,
  MessageSquare,
  Mic,
  Phone,
  Plus,
  Scale,
  Sparkles,
} from "lucide-react"
import { AppHeader } from "../AppHeader"
import { Avatar, Badge, Btn, LinkBtn, TextInput, btnClass } from "../ui"
import { BRAND, CLINIC, IMG } from "../data"
import { DESKTOP, askHref } from "../routes"
import { cn } from "@/lib/utils"

const sp = (n: number) => `calc(var(--spacing) * ${n})`

type Appt = { id: string; title: string; mon: string; day: string; when: string; vet: string }

const PET = {
  name: "Waffles",
  photo: "Waffles, a golden retriever puppy, smiling",
  line: "Golden Retriever · Female · 14 weeks old",
  badges: ["Puppy"],
  stats: [
    { Icon: Scale, top: "24 lb", sub: "Recorded Nov 5" },
    { Icon: Calendar, top: "Next vaccine", sub: "Dec 3 · final DHPP booster" },
    { Icon: Heart, top: "All good", sub: "Last checked Nov 5" },
  ],
  dates: [
    { label: "Flea and tick refill", date: "Nov 24, 2026" },
    { label: "Final booster", date: "Dec 3, 2026" },
    { label: "Monthly weigh-in", date: "Dec 5, 2026" },
  ],
  insights: [
    { title: "She’s in a big growth stage", body: "Puppy joints are still forming, so short, frequent play suits her better than long runs.", cta: "Get a play plan" },
    { title: "Teething can get chewy", body: "Chewing peaks around now. Cold chew toys can ease sore gums and save your shoes.", cta: "See chew tips" },
  ],
  history: [
    { when: "Nov 5, 2026", title: "DHPP vaccine, round 3", note: "24 lb · Dr. Priya Patel · all clear" },
    { when: "Oct 22, 2026", title: "DHPP vaccine, round 2", note: CLINIC.name },
    { when: "Oct 1, 2026", title: "First exam, DHPP round 1 and microchip", note: "Microchip registered to Lucy Brooks" },
  ],
  emptyHint: "Book her final booster to stay on track.",
}

const INITIAL_APPTS: Appt[] = [
  { id: "w1", title: "Final puppy booster (DHPP)", mon: "Dec", day: "3", when: "Thu, Dec 3 at 10:30 AM", vet: "Dr. Priya Patel" },
  { id: "w2", title: "Spay consult", mon: "Jan", day: "14", when: "Thu, Jan 14 at 1:00 PM", vet: "Dr. Priya Patel" },
]

const TYPE_LABELS = ["Wellness exam", "Vaccination", "Spay consult", "Sick visit"]
const TIME_LABELS = ["Mon, Nov 16 · 7:30 AM", "Tue, Nov 17 · 12:15 PM", "Wed, Nov 18 · 5:30 PM", "Sat, Nov 21 · 9:00 AM"]

const TEAM = [
  { name: "Dr. Priya Patel", note: "Waffles’ vet", initials: "PP" },
  { name: "Sam Rivera", note: "Care coordinator: visits and records", initials: "SR" },
]

const SUGGESTIONS = [
  "What vaccines is Waffles due for?",
  "Is Waffles’ weight on track for her age?",
  "Does my plan cover dental cleanings?",
  "Find a vet who’s good with puppies",
]

const SUG_CSS = `.lp-sug-a{animation:lpSugA 4.4s ease forwards}.lp-sug-b{animation:lpSugB 4.4s ease forwards}@keyframes lpSugA{0%{opacity:0;transform:translateY(8px)}10%,86%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-8px)}}@keyframes lpSugB{0%{opacity:0;transform:translateY(8px)}10%,86%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-8px)}}@media (prefers-reduced-motion: reduce){.lp-sug-a,.lp-sug-b{animation:none}}`

const ui600: CSSProperties = { fontWeight: 600, color: "var(--foreground)" }
const muted: CSSProperties = { color: "var(--muted-foreground)" }

function Strong({ children, className = "ui" }: { children: ReactNode; className?: string }) {
  return (
    <strong className={className} style={ui600}>
      {children}
    </strong>
  )
}

/** Shad.Button variant="destructive". */
const destructiveBtn = btnClass("default", "default", "bg-destructive/10 text-destructive hover:bg-destructive/20")

export function LP03PetCare() {
  const [appts, setAppts] = useState<Appt[]>(INITIAL_APPTS)
  const [booking, setBooking] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [type, setType] = useState(0)
  const [time, setTime] = useState(0)
  const [confirming, setConfirming] = useState<string | null>(null)
  const [notice, setNotice] = useState("")

  const editing = editId ? appts.find((a) => a.id === editId) : undefined
  const [datePart, timePart] = TIME_LABELS[time].split(" · ")
  const dParts = datePart.split(" ")

  const openBook = () => {
    setBooking(true)
    setEditId(null)
    setType(0)
    setTime(0)
    setNotice("")
  }
  const closeBook = () => {
    setBooking(false)
    setEditId(null)
  }
  const confirmBook = () => {
    const when = `${datePart} at ${timePart}`
    if (editing) {
      setAppts(appts.map((a) => (a.id === editing.id ? { ...a, mon: dParts[1], day: dParts[2], when } : a)))
      setNotice(`${editing.title} moved to ${when}.`)
    } else {
      const t = TYPE_LABELS[type]
      setAppts([...appts, { id: `n${Date.now()}`, title: `${t} for ${PET.name}`, mon: dParts[1], day: dParts[2], when, vet: "Dr. Priya Patel" }])
      setNotice(`${t} booked for ${when}.`)
    }
    setBooking(false)
    setEditId(null)
  }

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-background text-foreground" style={{ fontFamily: "var(--font-ui)" }}>
      <style>{SUG_CSS}</style>
      <AppHeader current="petCare" />

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto box-border flex max-w-[1200px] flex-col" style={{ padding: `${sp(8)} ${sp(10)} ${sp(28)}`, gap: sp(6) }}>
          {/* Title row */}
          <div className="flex items-center justify-between" style={{ gap: sp(6), width: `calc(100% - 360px - ${sp(8)})`, marginBottom: sp(4) }}>
            <div className="flex min-w-0 flex-1 flex-col" style={{ gap: sp(2) }}>
              <h1 className="h1 m-0 text-foreground">My Pet Care</h1>
              <p className="lead m-0 whitespace-nowrap" style={muted}>
                Everything about Waffles’ care in one place.
              </p>
            </div>
            <div role="group" aria-label="Choose a pet" className="flex items-center" style={{ gap: sp(3), padding: sp(2) }}>
              <button
                type="button"
                aria-pressed
                aria-label="Show Waffles"
                title="Waffles"
                className="box-border flex size-12 cursor-pointer items-center justify-center overflow-hidden rounded-full border-0 p-0"
                style={{ background: "var(--muted)", color: "var(--foreground)", boxShadow: "0 0 0 2px var(--background), 0 0 0 4px var(--primary)" }}
              >
                <img src={IMG.waffles} alt="" className="size-full rounded-full object-cover" />
              </button>
              <button
                type="button"
                aria-label="Add a pet"
                title="Add a pet"
                className="box-border flex size-12 cursor-pointer items-center justify-center rounded-full bg-transparent"
                style={{ border: "2px dashed var(--border)", color: "var(--muted-foreground)" }}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="grid items-start" style={{ gridTemplateColumns: "minmax(0, 1fr) 360px", gap: sp(8) }}>
            <div className="flex flex-col" style={{ gap: sp(8) }}>
              {/* Pet profile */}
              <section
                aria-label={PET.name}
                className="flex flex-col"
                style={{ gap: sp(6), padding: sp(6), borderRadius: "calc(var(--radius) * 1.8)", background: "var(--card)", boxShadow: "var(--shadow-md)" }}
              >
                <div className="flex items-center" style={{ gap: sp(5) }}>
                  <img src={IMG.waffles} alt={PET.photo} className="shrink-0 rounded-full object-cover" style={{ width: 104, height: 104, background: "var(--muted)" }} />
                  <div className="flex flex-col" style={{ gap: sp(1) }}>
                    <div className="flex items-center" style={{ gap: sp(2) }}>
                      <h2 className="h2 m-0 text-foreground">{PET.name}</h2>
                      {PET.badges.map((b) => (
                        <Badge key={b}>{b}</Badge>
                      ))}
                    </div>
                    <span className="body" style={muted}>
                      {PET.line}
                    </span>
                  </div>
                </div>
                <div className="flex items-stretch">
                  {PET.stats.map(({ Icon, top, sub }, i) => (
                    <div
                      key={top}
                      className="flex items-start"
                      style={{ gap: sp(3), padding: `0 ${sp(6)}`, ...(i === 0 ? { paddingLeft: 0 } : { borderLeft: "1px solid var(--border)" }) }}
                    >
                      <span className="flex pt-0.5" style={{ color: "var(--primary)" }}>
                        <Icon size={18} />
                      </span>
                      <span className="flex flex-col" style={{ gap: sp(0.5) }}>
                        <Strong>{top}</Strong>
                        <span className="small" style={muted}>
                          {sub}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Appointments and dates */}
              <section aria-label="Appointments and dates" className="flex flex-col" style={{ gap: sp(4) }}>
                <div className="flex items-center justify-between">
                  <h2 className="h4 m-0 text-foreground">Appointments and dates</h2>
                  <Btn variant="outline" onClick={openBook}>
                    <CalendarPlus size={16} />
                    Book for {PET.name}
                  </Btn>
                </div>

                {notice && (
                  <div role="status" className="grid w-full grid-cols-[calc(var(--spacing)*4)_1fr] items-start gap-x-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-card-foreground">
                    <CircleCheck size={16} className="translate-y-0.5" />
                    <div className="col-start-2 font-medium">{notice}</div>
                  </div>
                )}

                {booking && (
                  <div
                    className="flex flex-col"
                    style={{ gap: sp(4), padding: sp(5), border: "1px solid var(--primary)", borderRadius: "calc(var(--radius) * 1.4)", background: "var(--card)" }}
                  >
                    <Strong>{editing ? `Pick a new time for ${editing.title}` : `Book a visit for ${PET.name}`}</Strong>
                    {!editing && (
                      <div role="group" aria-label="Visit type" className="flex flex-wrap" style={{ gap: sp(2) }}>
                        {TYPE_LABELS.map((l, i) => (
                          <Btn key={l} variant={i === type ? "default" : "outline"} aria-pressed={i === type} onClick={() => setType(i)}>
                            {l}
                          </Btn>
                        ))}
                      </div>
                    )}
                    <div role="group" aria-label="Choose a time" className="flex flex-wrap" style={{ gap: sp(2) }}>
                      {TIME_LABELS.map((l, i) => (
                        <Btn key={l} variant={i === time ? "default" : "outline"} aria-pressed={i === time} onClick={() => setTime(i)}>
                          {l}
                        </Btn>
                      ))}
                    </div>
                    <span className="small" style={muted}>
                      {editing
                        ? "Same visit, same vet. Cedar Bay will update your confirmation."
                        : "Wellness exam estimate: $85, covered by your Plus plan. Other services are 10% off."}
                    </span>
                    <div className="flex" style={{ gap: sp(2) }}>
                      <Btn onClick={confirmBook}>{editing ? "Save the new time" : "Confirm the booking"}</Btn>
                      <Btn variant="ghost" onClick={closeBook}>
                        Keep current plans
                      </Btn>
                    </div>
                  </div>
                )}

                {appts.length === 0 && !booking && (
                  <div
                    className="ui text-center"
                    style={{ padding: sp(6), border: "1px dashed var(--border)", borderRadius: "calc(var(--radius) * 1.4)", color: "var(--muted-foreground)" }}
                  >
                    No upcoming visits for {PET.name} yet. {PET.emptyHint}
                  </div>
                )}

                <ul className="m-0 flex list-none flex-col p-0" style={{ gap: sp(3) }}>
                  {appts.map((a) => (
                    <li
                      key={a.id}
                      className="flex flex-col"
                      style={{ gap: sp(3), padding: `${sp(4)} ${sp(5)}`, border: "1px solid var(--border)", borderRadius: "calc(var(--radius) * 1.4)", background: "var(--card)" }}
                    >
                      <div className="flex items-center" style={{ gap: sp(4) }}>
                        <div
                          aria-hidden="true"
                          className="flex shrink-0 flex-col items-center"
                          style={{ width: 56, padding: `${sp(2)} 0`, borderRadius: "var(--radius)", background: "var(--muted)" }}
                        >
                          <span className="small" style={muted}>
                            {a.mon}
                          </span>
                          <strong className="h4 text-foreground">{a.day}</strong>
                        </div>
                        <div className="flex flex-1 flex-col" style={{ gap: sp(0.5) }}>
                          <Strong>{a.title}</Strong>
                          <span className="ui" style={muted}>
                            {a.when} · {a.vet}
                          </span>
                          <span className="small" style={muted}>
                            {CLINIC.name}
                          </span>
                        </div>
                        <Badge variant="outline">Confirmed</Badge>
                      </div>
                      {confirming === a.id ? (
                        <div
                          role="alertdialog"
                          aria-label="Confirm cancellation"
                          className="flex items-center"
                          style={{ gap: sp(3), padding: sp(3), borderRadius: "var(--radius)", background: "var(--muted)" }}
                        >
                          <span className="ui flex-1 text-foreground">Cancel this visit? Cedar Bay will free up the time.</span>
                          <button
                            type="button"
                            className={destructiveBtn}
                            onClick={() => {
                              setAppts(appts.filter((x) => x.id !== a.id))
                              setConfirming(null)
                              setNotice(`${a.title} was cancelled.`)
                            }}
                          >
                            Cancel the visit
                          </button>
                          <Btn variant="ghost" onClick={() => setConfirming(null)}>
                            Keep it
                          </Btn>
                        </div>
                      ) : (
                        <div className="flex" style={{ gap: sp(2) }}>
                          <Btn
                            variant="outline"
                            onClick={() => {
                              setBooking(true)
                              setEditId(a.id)
                              setTime(0)
                              setNotice("")
                            }}
                          >
                            Reschedule
                          </Btn>
                          <Btn variant="outline">Add to calendar</Btn>
                          <LinkBtn variant="outline" href={DESKTOP.clinics}>
                            Get directions
                          </LinkBtn>
                          <Btn variant="outline" className="ml-auto text-destructive" onClick={() => setConfirming(a.id)}>
                            Cancel visit
                          </Btn>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                <ul className="m-0 grid list-none p-0" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: sp(3) }}>
                  {PET.dates.map((d) => (
                    <li
                      key={d.label}
                      className="flex items-center"
                      style={{ gap: sp(3), padding: `${sp(3)} ${sp(4)}`, border: "1px solid var(--border)", borderRadius: "var(--radius)" }}
                    >
                      <span className="flex" style={{ color: "var(--primary)" }}>
                        <Calendar size={16} />
                      </span>
                      <span className="flex flex-col">
                        <Strong>{d.label}</Strong>
                        <span className="small" style={muted}>
                          {d.date}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Insights */}
              <section aria-label={`Insights for ${PET.name}`} className="flex flex-col" style={{ gap: sp(4) }}>
                <h2 className="h4 m-0 text-foreground">Insights for {PET.name}</h2>
                <div className="grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: sp(3) }}>
                  {PET.insights.map((i) => (
                    <div
                      key={i.title}
                      className="flex flex-col"
                      style={{ gap: sp(2), padding: sp(5), border: "1px solid var(--border)", borderRadius: "calc(var(--radius) * 1.4)", background: "var(--card)" }}
                    >
                      <Strong>{i.title}</Strong>
                      <p className="ui m-0" style={muted}>
                        {i.body}
                      </p>
                      <a
                        href={askHref(`${i.cta} for ${PET.name}`)}
                        data-slot="button"
                        className="inline-flex h-9 items-center gap-1.5 self-start px-0 text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        {i.cta}
                        <ArrowRight size={14} />
                      </a>
                    </div>
                  ))}
                </div>
              </section>

              {/* History */}
              <section aria-label="History" className="flex flex-col" style={{ gap: sp(4) }}>
                <h2 className="h4 m-0 text-foreground">History</h2>
                <ul className="m-0 list-none p-0" style={{ border: "1px solid var(--border)", borderRadius: "calc(var(--radius) * 1.4)", background: "var(--card)" }}>
                  {PET.history.map((h) => (
                    <li
                      key={h.title}
                      className="flex items-center border-b border-border last:border-b-0"
                      style={{ gap: sp(4), padding: `${sp(4)} ${sp(5)}` }}
                    >
                      <span className="small shrink-0" style={{ width: 110, ...muted }}>
                        {h.when}
                      </span>
                      <span className="flex flex-col">
                        <Strong>{h.title}</Strong>
                        <span className="small" style={muted}>
                          {h.note}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="flex flex-col" style={{ gap: sp(6) }}>
              <section aria-label="My care team" className="flex flex-col" style={{ gap: sp(3) }}>
                <h2 className="h4 m-0 text-foreground">My care team</h2>
                {TEAM.map((m) => (
                  <div key={m.name} data-slot="item" className="flex items-center gap-4 rounded-md border border-border p-4">
                    <Avatar>{m.initials}</Avatar>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="text-sm leading-snug font-medium">{m.name}</div>
                      <p className="m-0 text-sm leading-normal text-muted-foreground">{m.note}</p>
                    </div>
                  </div>
                ))}
                <div className="flex" style={{ gap: sp(2) }}>
                  <LinkBtn variant="outline" href="sms:+14255550148">
                    <MessageSquare size={16} />
                    Message
                  </LinkBtn>
                  <LinkBtn variant="outline" href={CLINIC.tel}>
                    <Phone size={16} />
                    Call {CLINIC.phone}
                  </LinkBtn>
                </div>
              </section>

              <div data-slot="card" className="flex flex-col gap-6 rounded-xl border border-border bg-card py-6 text-card-foreground shadow-sm">
                <div className="grid auto-rows-min grid-cols-[1fr_auto] items-start gap-1.5 px-6">
                  <div className="leading-none font-semibold">{BRAND} Care Plan · Plus</div>
                  <div className="text-sm text-muted-foreground">Renews Mar 14 · Covers Waffles</div>
                  <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
                    <Badge>Active</Badge>
                  </div>
                </div>
                <div className="px-6">
                  <ul className="m-0 flex list-none flex-col p-0" style={{ gap: sp(2) }}>
                    {["Annual exam (est. $85, covered)", "Core vaccines", "10% off services", "End-of-life care covered"].map((t) => (
                      <li key={t} className="ui flex items-center text-foreground" style={{ gap: sp(2) }}>
                        <span className="flex" style={{ color: "var(--primary)" }}>
                          <Check size={16} />
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col items-start gap-1 px-6">
                  <Strong>Trupanion · policy on file</Strong>
                  <span className="small" style={muted}>
                    90% reimbursement after a $250 deductible
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <AskBar />
    </div>
  )
}

function AskBar() {
  const [tick, setTick] = useState(0)
  const [value, setValue] = useState("")

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 4400)
    return () => clearInterval(id)
  }, [])

  const suggestion = SUGGESTIONS[tick % SUGGESTIONS.length]
  const href = value.trim() ? askHref(value.trim()) : DESKTOP.conversation

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && !e.shiftKey && !value) {
      e.preventDefault()
      setValue(suggestion)
    }
  }

  return (
    <form
      aria-label="Ask your care companion"
      onSubmit={(e) => {
        e.preventDefault()
        window.location.hash = href.slice(1)
      }}
      className="absolute left-1/2 z-30 box-border flex -translate-x-1/2 items-center"
      style={{
        bottom: sp(6),
        width: 640,
        maxWidth: "calc(100% - 32px)",
        gap: sp(3),
        padding: `${sp(2)} ${sp(2)} ${sp(2)} ${sp(4)}`,
        border: "1px solid var(--border)",
        borderRadius: "calc(var(--radius) * 1.4)",
        background: "var(--card)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <span className="flex" style={{ color: "var(--primary)" }}>
        <Sparkles size={18} />
      </span>
      <div className="relative flex min-w-0 flex-1 items-center">
        <TextInput
          aria-label="Ask your care companion"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          className="flex-1 border-0 bg-transparent px-0 shadow-none"
        />
        {!value && (
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center overflow-hidden" style={{ gap: sp(2) }}>
            <span key={tick} className={cn("ui min-w-0 truncate", tick % 2 ? "lp-sug-a" : "lp-sug-b")} style={muted}>
              {suggestion}
            </span>
            <kbd
              className="small shrink-0"
              style={{ fontFamily: "var(--font-code)", padding: `0 ${sp(1.5)}`, border: "1px solid var(--border)", borderRadius: "calc(var(--radius) * 0.6)", color: "var(--muted-foreground)" }}
            >
              Tab
            </kbd>
          </span>
        )}
      </div>
      <Btn variant="ghost" size="icon" aria-label="Start voice input" className="size-10">
        <Mic size={18} />
      </Btn>
      <LinkBtn size="icon" href={href} aria-label="Send" className="size-10">
        <ArrowRight size={18} />
      </LinkBtn>
    </form>
  )
}
