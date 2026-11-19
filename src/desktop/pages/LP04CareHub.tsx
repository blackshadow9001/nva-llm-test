import { useEffect, useState, type KeyboardEvent } from "react"
import {
  ArrowRight,
  Clock,
  Dog,
  HeartPulse,
  LayoutGrid,
  MapPin,
  Mic,
  ShieldCheck,
  Siren,
  Smile,
  Sparkles,
  Stethoscope,
  Syringe,
  Video,
  type LucideIcon,
} from "lucide-react"
import { AppHeader } from "../AppHeader"
import { Badge, Btn, LinkBtn } from "../ui"
import { BRAND } from "../data"
import { DESKTOP, askHref } from "../routes"

const sp = (n: number) => `calc(var(--spacing) * ${n})`

const offers: { Icon: LucideIcon; title: string; body: string; cta: string }[] = [
  { Icon: HeartPulse, title: "Wellness and preventive care", body: "Annual exams, screenings and a plan that keeps small issues small. The exam (est. $85) is covered by Plus.", cta: "Ask about wellness care" },
  { Icon: Siren, title: "Urgent care", body: "Same-day help when something feels off, with clear next steps before you arrive.", cta: "Ask about urgent care" },
  { Icon: Syringe, title: "Vaccinations", body: "Core vaccines on a schedule built around Waffles’ age and habits.", cta: "Check vaccine timing" },
  { Icon: Video, title: "Telehealth consults", body: "Talk to a vet from home for quick questions, follow-ups and second opinions.", cta: "Ask about telehealth" },
  { Icon: Smile, title: "Dental care", body: "Cleanings are an estimated $450–$900, or $405–$810 with your Plus plan.", cta: "Ask about dental care" },
  { Icon: ShieldCheck, title: "Plans and coverage", body: "Your Plus plan renews Mar 14, and your Trupanion policy is on file.", cta: "Review my coverage" },
]

const steps = [
  { n: "1", title: "Ask", body: "Tell your care companion what’s going on with Waffles, in your own words." },
  { n: "2", title: "Get guidance", body: "Get clear, vet-approved answers and one recommended next step." },
  { n: "3", title: "Book care", body: "Find a nearby clinic and book a time in a couple of clicks." },
]

const resources = [
  { kind: "Guide", title: "Your new puppy checklist: the first 90 days", time: "6 min read" },
  { kind: "Article", title: "Puppy vaccine schedules, step by step", time: "4 min read" },
  { kind: "Article", title: "Signs Waffles needs a vet today", time: "3 min read" },
  { kind: "Explainer", title: "Pet insurance, explained simply", time: "5 min read" },
]

const suggestions = [
  `What services does ${BRAND} offer?`,
  "How do wellness plans work?",
  "Do you offer telehealth visits?",
  "What should I bring to a first visit?",
  `Is there an ${BRAND} clinic near me?`,
]

const SUG_CSS = `.lp-sug-a{animation:lpSugA 4.4s ease forwards}.lp-sug-b{animation:lpSugB 4.4s ease forwards}@keyframes lpSugA{0%{opacity:0;transform:translateY(8px)}10%,86%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-8px)}}@keyframes lpSugB{0%{opacity:0;transform:translateY(8px)}10%,86%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-8px)}}@media (prefers-reduced-motion: reduce){.lp-sug-a,.lp-sug-b{animation:none}}`

const photoBox = "small flex flex-col items-center justify-center text-center text-muted-foreground bg-muted"

export function LP04CareHub() {
  const [sug, setSug] = useState(0)
  const [value, setValue] = useState("")

  useEffect(() => {
    const t = setInterval(() => setSug((s) => s + 1), 4400)
    return () => clearInterval(t)
  }, [])

  const sugText = suggestions[sug % suggestions.length]

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Tab" || e.shiftKey || value) return
    e.preventDefault()
    setValue(sugText)
  }

  const submit = () => {
    const q = value.trim()
    window.location.hash = q ? askHref(q) : DESKTOP.conversation
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground" style={{ fontFamily: "var(--font-ui)", position: "relative" }}>
      <style>{SUG_CSS}</style>
      <AppHeader current="careHub" />

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-[1200px] flex-col box-border" style={{ padding: `${sp(10)} ${sp(10)} ${sp(28)}`, gap: sp(12) }}>
          {/* Hero */}
          <section className="grid items-center" style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: sp(10) }}>
            <div className="flex flex-col" style={{ gap: sp(5) }}>
              <Badge variant="secondary" className="self-start">
                <LayoutGrid size={12} />
                {BRAND} Care Hub
              </Badge>
              <h1 className="h1 m-0 text-foreground">Care that follows Waffles through every stage.</h1>
              <p className="lead m-0 text-muted-foreground">
                From puppy boosters to her first big milestones, everything Waffles needs is in one place, close to home in Kirkland.
              </p>
              <div className="flex" style={{ gap: sp(3) }}>
                <LinkBtn size="lg" href={DESKTOP.clinics}>
                  <MapPin size={16} />
                  Find a clinic
                </LinkBtn>
                <LinkBtn size="lg" variant="outline" href={DESKTOP.petCare}>
                  Book a wellness visit
                </LinkBtn>
              </div>
            </div>
            <div aria-hidden="true" className="grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gridTemplateRows: "180px 180px", gap: sp(3) }}>
              <div className={photoBox} style={{ gridRow: "span 2", borderRadius: "calc(var(--radius) * 1.8)", gap: sp(2), padding: sp(4) }}>
                <Dog size={32} />
                <span>Photo: a vet greets a golden puppy at the front desk</span>
              </div>
              <div className={photoBox} style={{ borderRadius: "calc(var(--radius) * 1.8)", gap: sp(2), padding: sp(4) }}>
                <Stethoscope size={24} />
                <span>Photo: a calm exam room</span>
              </div>
              <div className="flex flex-col justify-end bg-primary text-primary-foreground" style={{ borderRadius: "calc(var(--radius) * 1.8)", gap: sp(1), padding: sp(5) }}>
                <strong className="h2 text-primary-foreground">8 AM–10 PM</strong>
                <span className="ui text-primary-foreground">Cedar Bay is open every day</span>
              </div>
            </div>
          </section>

          {/* What we offer */}
          <section aria-label="What we offer" className="flex flex-col" style={{ gap: sp(5) }}>
            <h2 className="h3 m-0 text-foreground">What we offer</h2>
            <div className="grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: sp(4) }}>
              {offers.map(({ Icon, title, body, cta }) => (
                <a
                  key={title}
                  href={askHref(cta)}
                  className="flex flex-col border border-border bg-card text-inherit no-underline"
                  style={{ gap: sp(3), padding: sp(5), borderRadius: "calc(var(--radius) * 1.4)", boxShadow: "var(--shadow-xs)" }}
                >
                  <span className="flex size-10 items-center justify-center bg-muted text-primary" style={{ borderRadius: "var(--radius)" }}>
                    <Icon size={18} />
                  </span>
                  <strong className="body font-semibold text-foreground">{title}</strong>
                  <span className="ui text-muted-foreground" style={{ textWrap: "pretty" }}>{body}</span>
                  <span className="ui flex items-center font-medium text-primary" style={{ gap: sp(1) }}>
                    {cta}
                    <ArrowRight size={14} />
                  </span>
                </a>
              ))}
            </div>
          </section>

          {/* Banner */}
          <section className="flex items-center bg-primary text-primary-foreground" style={{ gap: sp(8), padding: `${sp(8)} ${sp(10)}`, borderRadius: "calc(var(--radius) * 1.8)" }}>
            <div className="flex flex-1 flex-col" style={{ gap: sp(2) }}>
              <strong className="h3 text-primary-foreground" style={{ textWrap: "balance" }}>Every visit should end with a wagging tail.</strong>
              <p className="body m-0 text-primary-foreground">
                Gentle, low-stress care built around how Waffles and other pets feel, with quiet rooms, extra time and treats on hand.
              </p>
            </div>
            <LinkBtn size="lg" variant="secondary" href={askHref("How do low-stress visits work?")}>
              Learn about low-stress visits
            </LinkBtn>
          </section>

          {/* How it works */}
          <section aria-label="How it works" className="flex flex-col" style={{ gap: sp(5) }}>
            <h2 className="h3 m-0 text-foreground">How it works</h2>
            <ol className="m-0 grid list-none p-0" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: sp(4) }}>
              {steps.map((s) => (
                <li key={s.n} className="flex border border-border" style={{ gap: sp(4), padding: sp(5), borderRadius: "calc(var(--radius) * 1.4)" }}>
                  <span className="ui flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">{s.n}</span>
                  <span className="flex flex-col" style={{ gap: sp(1) }}>
                    <strong className="body font-semibold text-foreground">{s.title}</strong>
                    <span className="ui text-muted-foreground">{s.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* Resources */}
          <section aria-label="Resources" className="flex flex-col" style={{ gap: sp(5) }}>
            <h2 className="h3 m-0 text-foreground">Resources</h2>
            <div className="grid" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: sp(4) }}>
              {resources.map((r) => (
                <a
                  key={r.title}
                  href={askHref(r.title)}
                  className="flex flex-col border border-border bg-card text-inherit no-underline"
                  style={{ gap: sp(3), padding: sp(5), borderRadius: "calc(var(--radius) * 1.4)" }}
                >
                  <Badge variant="outline" className="self-start">{r.kind}</Badge>
                  <strong className="ui font-semibold text-foreground" style={{ textWrap: "balance" }}>{r.title}</strong>
                  <span className="small mt-auto flex items-center text-muted-foreground" style={{ gap: sp(1.5) }}>
                    <Clock size={14} />
                    {r.time}
                  </span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Floating ask bar */}
      <form
        aria-label="Ask your care companion"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className="absolute left-1/2 z-30 box-border flex w-[640px] max-w-[calc(100%-32px)] -translate-x-1/2 items-center border border-border bg-card"
        style={{ bottom: sp(6), gap: sp(3), padding: `${sp(2)} ${sp(2)} ${sp(2)} ${sp(4)}`, borderRadius: "calc(var(--radius) * 1.4)", boxShadow: "var(--shadow-lg)" }}
      >
        <span className="flex text-primary">
          <Sparkles size={18} />
        </span>
        <div className="relative flex min-w-0 flex-1 items-center">
          <input
            data-slot="input"
            aria-label="Ask your care companion"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            className="h-9 w-full min-w-0 flex-1 border-0 bg-transparent px-0 py-1 text-base shadow-none outline-none"
          />
          {!value && (
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center overflow-hidden" style={{ gap: sp(2) }}>
              <span key={sug} className={`ui ${sug % 2 ? "lp-sug-a" : "lp-sug-b"} min-w-0 truncate text-muted-foreground`}>
                {sugText}
              </span>
              <kbd
                className="small shrink-0 border border-border text-muted-foreground"
                style={{ fontFamily: "var(--font-code)", padding: `0 ${sp(1.5)}`, borderRadius: "calc(var(--radius) * 0.6)" }}
              >
                Tab
              </kbd>
            </span>
          )}
        </div>
        <Btn variant="ghost" size="icon" aria-label="Start voice input" className="size-10">
          <Mic size={18} />
        </Btn>
        <Btn type="submit" size="icon" aria-label="Send" className="size-10">
          <ArrowRight size={18} />
        </Btn>
      </form>
    </div>
  )
}
