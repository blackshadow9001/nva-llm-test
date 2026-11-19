import { useState, type CSSProperties, type UIEvent } from "react"
import {
  ArrowRight,
  BadgeCheck,
  Bone,
  BookOpen,
  Brain,
  Building2,
  CalendarCheck,
  CalendarPlus,
  Camera,
  ClipboardList,
  CloudRain,
  Compass,
  Dog,
  Feather,
  FlaskConical,
  Frown,
  House,
  MapPin,
  Microscope,
  Network,
  PawPrint,
  Phone,
  Receipt,
  ShieldCheck,
  Sparkles,
  Sprout,
  Stethoscope,
  Syringe,
  Video,
  type LucideIcon,
} from "lucide-react"
import { AskField } from "../AskBar"
import { CareTeamButton, LucyAvatar, NotificationsButton } from "../AppHeader"
import { Badge, LinkBtn } from "../ui"
import { BRAND, BRAND_FULL, CLINIC, EMERGENCY, IMG } from "../data"
import { DESKTOP, askHref } from "../routes"
import "../desktop.css"

/** LP06 · Companion home, scrolling. Signed in as Lucy unless the hash ends ?view=signed-out. */
export function LP06Home() {
  const signedIn = !window.location.hash.includes("view=signed-out")
  const [dock, setDock] = useState(false)
  const go = (q: string) => {
    window.location.hash = askHref(q)
  }
  const onScroll = (e: UIEvent<HTMLElement>) => {
    const on = e.currentTarget.scrollTop > 640
    if (on !== dock) setDock(on)
  }
  const c = signedIn ? SIGNED_IN : SIGNED_OUT

  return (
    <div className="lp-deep relative flex h-dvh flex-col overflow-hidden bg-background text-foreground" style={{ fontFamily: "var(--font-ui)" }}>
      <HomeHeader signedIn={signedIn} />

      <main onScroll={onScroll} className="min-h-0 flex-1 overflow-y-auto pt-[72px]">
        {/* a. Hero: prompt on the left, panel on the right */}
        <section aria-label="Ask your care companion" className="relative grid h-[828px] grid-cols-[minmax(0,1fr)_520px] gap-1 bg-background p-1">
          <div
            className="relative flex flex-col justify-center gap-6 overflow-hidden px-18 py-10 text-primary-foreground"
            style={{ borderRadius: "calc(var(--radius) * 3)", backgroundColor: "var(--surface-brand, #062932)" }}
          >
            <svg aria-hidden="true" viewBox="0 0 400 200" preserveAspectRatio="none" className="pointer-events-none absolute right-0 bottom-0 h-[150px] w-[420px]">
              <path d="M0 200 C120 200 170 120 260 90 C330 66 370 40 400 0 L400 200 Z" fill="var(--accent-1)" opacity="0.85" />
            </svg>
            <span className="small relative font-semibold tracking-[0.12em] uppercase" style={{ color: "var(--accent-1)" }}>
              Your expert pet care companion
            </span>
            <h1 className="display relative m-0 text-primary-foreground">
              {c.greeting}
              <br />
              <span style={{ color: "var(--accent-1)" }}>How can I help?</span>
            </h1>
            <div className="relative flex max-w-[720px] flex-col overflow-hidden rounded-[28px] bg-card text-foreground">
              <div className="py-3 pr-3 pl-6">
                <AskField suggestions={c.suggestions} onAsk={go} />
              </div>
              <div className="small flex items-center justify-between bg-muted px-6 py-2.5 text-muted-foreground">
                <span>
                  Press{" "}
                  <kbd className="rounded-[calc(var(--radius)*0.6)] border border-border px-1.5 text-foreground" style={{ fontFamily: "var(--font-code)" }}>
                    Tab
                  </kbd>{" "}
                  to use the suggestion
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  Private and secure
                </span>
              </div>
            </div>
            <div aria-label="Suggested prompts" className="relative flex flex-wrap gap-2">
              {c.quick.map((q) => (
                <a key={q.label} className="lp-ghost ui" href={q.href}>
                  {q.pet ? <img src={IMG.waffles} alt="" className="size-5 shrink-0 rounded-full object-cover" /> : q.Icon && <q.Icon size={16} />}
                  {q.label}
                </a>
              ))}
            </div>
          </div>

          <Bento signedIn={signedIn} />
        </section>

        {/* b. Pet world (signed in) / Make ACME yours (signed out) */}
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-10 pt-16 pb-20">
          <div className="flex items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              <span className="small font-semibold tracking-[0.08em] text-primary uppercase">{c.worldKicker}</span>
              <h2 className="h1 m-0 text-foreground">{c.worldTitle}</h2>
            </div>
          </div>
          <PetWorld signedIn={signedIn} />
        </div>

        <Explore signedIn={signedIn} />
        <Footer />
      </main>

      {dock && (
        <>
          <div className="lp-scrim" aria-hidden="true" />
          <div
            className="lp-dock absolute bottom-6 left-1/2 z-30 box-border flex w-[640px] items-center rounded-full bg-card py-2 pr-2 pl-6"
            style={{ transform: "translateX(-50%)", boxShadow: "var(--shadow-lg)" }}
          >
            <AskField suggestions={c.suggestions} offset={3} onAsk={go} showTabKey round />
          </div>
        </>
      )}
    </div>
  )
}

/* ---------- header ---------- */

function HomeHeader({ signedIn }: { signedIn: boolean }) {
  return (
    <header
      className="absolute top-2 right-6 left-6 z-40 box-border grid h-[60px] grid-cols-[1fr_auto_1fr] items-center gap-8 pr-3 pl-6 text-foreground"
      style={{
        borderRadius: "calc(var(--radius) * 3)",
        background: "color-mix(in oklab, var(--muted) 90%, transparent)",
        WebkitBackdropFilter: "blur(12px)",
        backdropFilter: "blur(12px)",
      }}
    >
      <a href={DESKTOP.home} aria-label={`${BRAND_FULL}, home`} className="flex items-center gap-2 justify-self-start">
        <span className="h3 leading-none font-black tracking-[-0.04em] text-primary">{BRAND}</span>
      </a>
      <nav aria-label="Main" className="flex items-center gap-1">
        <LinkBtn variant="ghost" href={DESKTOP.petCare}>
          <PawPrint size={16} />
          Care Hub
        </LinkBtn>
        <LinkBtn variant="ghost" href={DESKTOP.careHub}>
          <Compass size={16} />
          Explore
        </LinkBtn>
      </nav>
      <div className="flex items-center gap-2 justify-self-end">
        {signedIn ? (
          <>
            <CareTeamButton label="My care team" />
            <NotificationsButton />
            <LucyAvatar />
          </>
        ) : (
          <>
            <LinkBtn variant="ghost" href={DESKTOP.clinics}>
              <MapPin size={16} />
              Find a clinic
            </LinkBtn>
            <LinkBtn variant="outline" href={DESKTOP.home} className="text-foreground">
              Sign in
            </LinkBtn>
          </>
        )}
      </div>
    </header>
  )
}

/* ---------- hero bento ---------- */

type Tile = { tag: string; TagIcon: LucideIcon; title: string; body: string; cta: string; href: string }

function Bento({ signedIn }: { signedIn: boolean }) {
  const t = signedIn ? BENTO_IN : BENTO_OUT
  const r3 = { borderRadius: "calc(var(--radius) * 3)" } satisfies CSSProperties
  return (
    <aside
      aria-label={signedIn ? "Insights for Waffles" : `What's happening at ${BRAND}`}
      className="grid min-h-0 grid-cols-2 gap-1"
      style={{ gridTemplateRows: "minmax(0, 1.3fr) minmax(0, 1fr) minmax(0, 0.85fr)" }}
    >
      <a
        className="lp-lift relative col-span-2 block overflow-hidden text-foreground"
        href={t.hb.href}
        style={{ ...r3, background: "color-mix(in oklab, var(--accent-1) 28%, var(--background))" }}
      >
        <span className="absolute top-0 right-0 bottom-0 flex w-[46%] flex-col">
          <img src={IMG.wafflesCouch} alt={t.hb.alt} className="block min-h-0 w-full flex-1 object-cover" style={{ objectPosition: "50% 35%" }} />
        </span>
        <span className="relative box-border flex h-full w-[54%] flex-col gap-3 p-6">
          <span className="small font-semibold tracking-[0.12em] uppercase" style={{ color: "var(--accent-1-foreground)" }}>
            {t.hb.kicker}
          </span>
          <strong className="h4 text-balance text-foreground">{t.hb.title}</strong>
          <span className="ui text-pretty text-foreground">{t.hb.body}</span>
          <span className="ui mt-auto flex h-11 items-center gap-2 self-start rounded-full bg-primary px-5 font-semibold text-primary-foreground">
            {t.hb.cta}
            <ArrowRight size={16} />
          </span>
        </span>
      </a>
      {[t.ta, t.tb].map((tile, i) => (
        <a key={tile.title} className="lp-lift relative flex gap-3 overflow-hidden bg-muted p-5 text-foreground" href={tile.href} style={r3}>
          <span className="relative flex min-w-0 flex-1 flex-col gap-2">
            <span className="small flex items-center gap-1.5 font-semibold text-primary">
              <tile.TagIcon size={14} />
              {tile.tag}
            </span>
            {/* The design sets the first small tile's title a touch larger. */}
            <strong className="h4 text-balance text-foreground" style={i === 0 ? { fontSize: 24, lineHeight: 1.33, fontWeight: 600, letterSpacing: "-0.36px" } : undefined}>
              {tile.title}
            </strong>
            <span className="ui text-pretty text-foreground">{tile.body}</span>
            <span className="ui mt-auto flex items-center gap-1.5 font-semibold text-foreground">
              {tile.cta}
              <ArrowRight size={16} />
            </span>
          </span>
        </a>
      ))}
      <a
        className="lp-lift relative col-span-2 flex items-stretch gap-4 overflow-hidden p-6 text-foreground"
        href={t.tc.href}
        style={{ ...r3, background: "color-mix(in oklab, var(--accent-3) 35%, var(--background))" }}
      >
        <span className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="small flex items-center gap-1.5 font-semibold text-primary">
            <t.tc.TagIcon size={14} />
            {t.tc.tag}
          </span>
          <strong className="h4 text-balance text-foreground">{t.tc.title}</strong>
          <span className="ui text-pretty text-foreground">{t.tc.body}</span>
          <span className="ui mt-auto flex items-center gap-1.5 font-semibold text-foreground">
            {t.tc.cta}
            <ArrowRight size={16} />
          </span>
        </span>
        <span aria-hidden="true" className="relative w-[120px] shrink-0">
          <span className="absolute -right-10 -bottom-15 size-[170px] rounded-full" style={{ background: "color-mix(in oklab, var(--accent-3) 70%, var(--background))" }} />
          <img src={t.tc.sticker} alt="" className="absolute h-auto" style={t.tc.stickerStyle} />
        </span>
      </a>
    </aside>
  )
}

/* ---------- pet world ---------- */

function PetWorld({ signedIn }: { signedIn: boolean }) {
  const w = signedIn ? WORLD_IN : WORLD_OUT
  return (
    <div className="grid grid-cols-12 gap-4" style={{ gridAutoRows: 112 }}>
      {signedIn ? (
        <a
          className="lp-lift relative overflow-hidden rounded-[calc(var(--radius)*2)] bg-muted"
          href={DESKTOP.petCare}
          aria-label="Open Waffles' care"
          style={{ gridColumn: "1 / 6", gridRow: "1 / 5" }}
        >
          <img src={IMG.waffles} alt="Waffles, a golden retriever puppy" className="absolute inset-0 size-full object-cover" />
          <div
            className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-3 rounded-[calc(var(--radius)*1.4)] px-5 py-4 backdrop-blur-[8px]"
            style={{ background: "color-mix(in oklab, var(--card) 88%, transparent)" }}
          >
            <span className="flex flex-col gap-1">
              <span className="flex items-center gap-2">
                <strong className="h3 text-foreground">Waffles</strong>
                <Badge>Puppy</Badge>
              </span>
              <span className="ui text-muted-foreground">Golden Retriever · 14 weeks · 24 lb</span>
            </span>
            <span className="ui flex items-center gap-1.5 font-semibold whitespace-nowrap text-primary">
              Her care
              <ArrowRight size={14} />
            </span>
          </div>
        </a>
      ) : (
        <a
          className="lp-lift relative flex flex-col justify-end gap-3 overflow-hidden rounded-[calc(var(--radius)*2)] p-8"
          href={DESKTOP.home}
          style={{ gridColumn: "1 / 6", gridRow: "1 / 5", background: "color-mix(in oklab, var(--primary) 16%, var(--background))" }}
        >
          <span aria-hidden="true" className="absolute top-8 right-8 flex text-primary opacity-35">
            <PawPrint size={96} />
          </span>
          <strong className="h2 text-foreground">Tell us who you care for, and this page becomes theirs.</strong>
          <span className="ui text-muted-foreground">Name, breed and age is all it takes. Your clinic gets it before you walk in.</span>
          <span className="ui flex items-center gap-1.5 font-semibold text-primary">
            Add a pet
            <ArrowRight size={14} />
          </span>
        </a>
      )}

      <a
        className="lp-lift flex flex-col justify-between rounded-[calc(var(--radius)*2)] bg-primary p-6 text-primary-foreground"
        href={w.visit.href}
        style={{ gridColumn: "6 / 10", gridRow: "1 / 3" }}
      >
        <span className="flex items-center justify-between">
          <span className="small font-semibold tracking-[0.08em] uppercase">{w.visit.kicker}</span>
          <w.visit.Icon size={24} />
        </span>
        <span className="flex flex-col gap-1">
          <strong className="h3 text-primary-foreground">{w.visit.title}</strong>
          <span className="ui">{w.visit.sub}</span>
        </span>
      </a>

      <a
        className="lp-lift flex flex-col justify-between rounded-[calc(var(--radius)*2)] p-6"
        href={w.cover.href}
        style={{ gridColumn: "10 / 13", gridRow: "1 / 3", background: "color-mix(in oklab, var(--primary) 12%, var(--background))" }}
      >
        <span className="flex text-primary">
          <ShieldCheck size={24} />
        </span>
        <span className="flex flex-col gap-1">
          <strong className="h4 text-foreground">{w.cover.title}</strong>
          <span className="ui text-muted-foreground">{w.cover.sub}</span>
        </span>
      </a>

      <a
        className="lp-lift flex flex-col justify-between rounded-[calc(var(--radius)*2)] bg-foreground p-6 text-background"
        href={askHref(signedIn ? "I think something's wrong with Waffles." : "I think something's wrong with my pet.")}
        style={{ gridColumn: "6 / 9", gridRow: "3 / 5" }}
      >
        <Frown size={24} />
        <span className="flex flex-col gap-1">
          <strong className="h4 text-background">{w.offTitle}</strong>
          <span className="ui">Tell the companion what you’re seeing. A person is one click away.</span>
        </span>
      </a>

      <div className="flex flex-col gap-2 rounded-[calc(var(--radius)*2)] bg-card p-5 shadow-sm" style={{ gridColumn: "9 / 13", gridRow: "3 / 5" }}>
        <strong className="ui font-semibold text-foreground">{w.listTitle}</strong>
        {w.list.map((d) => (
          <a key={d.label} className="lp-card flex items-center gap-3 rounded-[var(--radius)] p-2" href={d.href}>
            {d.Icon ? (
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                <d.Icon size={14} />
              </span>
            ) : (
              <img src={IMG.waffles} alt="" className="size-7 shrink-0 rounded-full object-cover" />
            )}
            <span className="flex min-w-0 flex-col">
              <strong className="ui font-semibold text-foreground">{d.label}</strong>
              <span className="small text-muted-foreground">{d.when}</span>
            </span>
          </a>
        ))}
      </div>

      <a
        className="lp-lift grid grid-cols-2 overflow-hidden rounded-[calc(var(--radius)*2)] bg-card shadow-sm"
        href={DESKTOP.careHub}
        style={{ gridColumn: "1 / 8", gridRow: "5 / 8" }}
      >
        <PhotoPlaceholder label={w.read.photo} Icon={w.read.Icon} style={{ background: "color-mix(in oklab, var(--primary) 22%, var(--background))", color: "var(--primary)" }} />
        <div className="flex flex-col justify-end gap-2 p-6">
          <span className="small text-primary">
            {w.read.kind} · {w.read.time}
          </span>
          <strong className="h3 text-foreground">{w.read.title}</strong>
          <span className="ui text-muted-foreground">{w.read.body}</span>
        </div>
      </a>

      <div
        className="flex flex-col gap-3 rounded-[calc(var(--radius)*2)] p-6"
        style={{ gridColumn: "8 / 13", gridRow: "5 / 8", background: "color-mix(in oklab, var(--primary) 12%, var(--background))" }}
      >
        <span className="flex items-center gap-2 text-primary">
          <Sparkles size={18} />
          <strong className="ui font-semibold text-foreground">{w.askTitle}</strong>
        </span>
        {w.asks.map((q) => (
          <a key={q} className="lp-lift flex items-center justify-between gap-3 rounded-[calc(var(--radius)*1.4)] bg-background p-4" href={askHref(q)}>
            <span className="ui text-foreground">{q}</span>
            <span className="flex text-primary">
              <ArrowRight size={16} />
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

function PhotoPlaceholder({ label, Icon, style, iconSize = 48 }: { label: string; Icon: LucideIcon; style: CSSProperties; iconSize?: number }) {
  return (
    <div role="img" aria-label={`Photo: ${label}`} className="flex flex-col items-center justify-center gap-2 p-4 text-center" style={style}>
      <Icon size={iconSize} />
      <span className="small" style={{ color: style.color === "var(--primary)" ? "var(--foreground)" : undefined }}>
        Photo: {label}
      </span>
    </div>
  )
}

/* ---------- explore ---------- */

function Explore({ signedIn }: { signedIn: boolean }) {
  const entries = [
    { href: DESKTOP.clinics, Icon: MapPin, tint: { background: "color-mix(in oklab, var(--primary) 18%, var(--background))", color: "var(--primary)" }, photo: "Cedar Bay Veterinary Clinic’s front entrance", title: "Find a clinic", body: `Four ${BRAND} hospitals within 5 mi, with evening and weekend times.`, cta: "Find a clinic" },
    { href: DESKTOP.clinics, Icon: Bone, tint: { background: "var(--primary)", color: "var(--primary-foreground)" }, photo: "a specialist examining a golden puppy’s hips", title: "Specialists close to home", body: signedIn ? "Dermatology, orthopedics and cardiology, with Waffles’ history already shared." : "Dermatology, orthopedics and cardiology, with the full history shared.", cta: "Ask about a referral" },
    { href: askHref("Can I talk to a vet from home?"), Icon: Video, tint: { background: "color-mix(in oklab, var(--primary) 60%, var(--foreground))", color: "var(--primary-foreground)" }, photo: "a pet parent on a video call with a vet at home", title: "Talk to a vet from home", body: "Quick questions, follow-ups and second opinions by video.", cta: "Start a video visit" },
  ]
  const research = [
    { kind: "Study", status: "Enrolling", Icon: FlaskConical, title: signedIn ? "Growing Goldens: joint health from puppyhood" : "Growing up healthy: joint health from puppyhood" },
    { kind: "Study", status: "Results shared", Icon: BookOpen, title: "Calmer visits, better checkups" },
    { kind: "New", status: "Coming soon", Icon: Camera, title: "Ear check from home" },
    { kind: "New", status: "Available now", Icon: ClipboardList, title: `One record across ${BRAND}` },
  ]
  const reasons = [
    { Icon: Building2, title: "Your local hospital", body: `Each ${BRAND} hospital keeps its own team and character. Your vet knows you by name.` },
    { Icon: Network, title: "One record, everywhere", body: signedIn ? `Waffles’ history goes with her to any ${BRAND} hospital or specialist.` : `A pet’s history goes with them to any ${BRAND} hospital or specialist.` },
    { Icon: Feather, title: "Low-stress visits", body: "Quiet rooms, gentle handling and time to settle, so checkups don’t get put off." },
    { Icon: Receipt, title: "No surprises", body: "Estimates up front, a Care Plan for the routine, and financing when you need it." },
  ]
  const wrap = "mx-auto box-border max-w-[1200px] px-10 pb-6"
  return (
    <section aria-label={`Explore ${BRAND}`} className="bg-background">
      <div className={`${wrap} flex flex-col gap-2`}>
        <span className="small font-semibold tracking-[0.08em] text-primary uppercase">Explore {BRAND}</span>
        <h2 className="h1 m-0 text-foreground">Care for every stage, close to home.</h2>
      </div>

      <div className={wrap}>
        <a className="lp-lift grid min-h-[440px] grid-cols-[7fr_5fr] overflow-hidden rounded-[calc(var(--radius)*2)]" href={DESKTOP.careHub}>
          <PhotoPlaceholder
            label="a vet kneeling to greet a golden puppy in a bright exam room"
            Icon={Stethoscope}
            style={{ background: "color-mix(in oklab, var(--primary) 28%, var(--background))", color: "var(--primary)" }}
          />
          <div className="flex flex-col justify-between gap-6 bg-primary p-10 text-primary-foreground">
            <span className="small font-semibold tracking-[0.08em] uppercase">Care Hub</span>
            <span className="flex flex-col gap-3">
              <strong className="h2 text-primary-foreground">Wellness, vaccines, dental and more, in one place.</strong>
              <span className="body">Everything from puppy boosters to senior care, at hospitals that know you by name.</span>
            </span>
            <span className="ui flex items-center gap-1.5 font-semibold">
              Explore Care Hub
              <ArrowRight size={16} />
            </span>
          </div>
        </a>
      </div>

      <div className={`${wrap} grid grid-cols-3 gap-6`}>
        {entries.map((e) => (
          <a key={e.title} className="lp-lift flex flex-col overflow-hidden rounded-[calc(var(--radius)*2)] bg-card shadow-sm" href={e.href}>
            <div role="img" aria-label={`Photo: ${e.photo}`} className="flex h-[220px] flex-col items-center justify-center gap-2 p-4 text-center" style={e.tint}>
              <e.Icon size={48} />
              <span className="small">Photo: {e.photo}</span>
            </div>
            <div className="flex flex-col gap-2 p-6">
              <strong className="h3 text-foreground">{e.title}</strong>
              <span className="ui text-muted-foreground">{e.body}</span>
              <span className="ui mt-2 flex items-center gap-1.5 font-semibold text-primary">
                {e.cta}
                <ArrowRight size={14} />
              </span>
            </div>
          </a>
        ))}
      </div>

      <div className={wrap}>
        <div className="grid min-h-[400px] grid-cols-[5fr_7fr] overflow-hidden rounded-[calc(var(--radius)*2)]" style={{ background: "color-mix(in oklab, var(--primary) 12%, var(--background))" }}>
          <div className="flex flex-col justify-center gap-4 p-10">
            <span className="small font-semibold tracking-[0.08em] text-primary uppercase">Research and new ideas</span>
            <strong className="h2 text-foreground">What we learn becomes everyday care.</strong>
            {research.map((z) => (
              <a key={z.title} className="lp-card flex items-center gap-3 rounded-[var(--radius)] p-3" href={DESKTOP.careHub}>
                <span className="flex text-primary">
                  <z.Icon size={18} />
                </span>
                <span className="flex flex-col">
                  <strong className="ui font-semibold text-foreground">{z.title}</strong>
                  <span className="small text-muted-foreground">
                    {z.kind} · {z.status}
                  </span>
                </span>
              </a>
            ))}
          </div>
          <PhotoPlaceholder
            label="a researcher reviewing joint scans with a vet"
            Icon={FlaskConical}
            style={{ background: "color-mix(in oklab, var(--primary) 70%, var(--foreground))", color: "var(--primary-foreground)" }}
          />
        </div>
      </div>

      <div className="text-primary-foreground" style={{ background: "color-mix(in oklab, var(--primary) 60%, var(--foreground))" }}>
        <div className="mx-auto box-border flex max-w-[1200px] flex-col gap-10 px-10 py-16">
          <div className="flex items-end justify-between gap-8">
            <strong className="h1 max-w-[640px] text-primary-foreground">Local hospitals you know, with a whole network behind them.</strong>
            <div className="flex gap-3">
              <LinkBtn variant="secondary" size="lg" href={DESKTOP.petCare}>
                <CalendarPlus size={16} />
                {signedIn ? "Book a visit for Waffles" : "Book a visit"}
              </LinkBtn>
              <LinkBtn variant="outline" size="lg" href={CLINIC.tel} className="text-foreground">
                <Phone size={16} />
                Talk to a person
              </LinkBtn>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-8">
            {reasons.map((r) => (
              <div key={r.title} className="flex flex-col gap-3 pt-6" style={{ borderTop: "1px solid color-mix(in oklab, var(--primary-foreground) 30%, transparent)" }}>
                <r.Icon size={24} />
                <strong className="h4 text-primary-foreground">{r.title}</strong>
                <span className="ui">{r.body}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto box-border max-w-[1200px] px-10 pt-4 pb-16">
        <span className="small text-muted-foreground">Studies, figures and photos are illustrative for this prototype.</span>
      </div>
    </section>
  )
}

function Footer() {
  const link = "ui text-muted-foreground"
  return (
    <footer className="border-t border-border bg-muted pb-24">
      <div className="mx-auto box-border grid max-w-[1200px] grid-cols-[2fr_repeat(3,1fr)] gap-8 p-10">
        <div className="flex flex-col gap-3">
          <span className="h4 text-foreground">{BRAND_FULL}</span>
          <span className="ui text-muted-foreground">Caring for pets and the people who love them, at every stage.</span>
        </div>
        <div className="flex flex-col gap-2">
          <strong className="ui font-semibold text-foreground">Care</strong>
          <a className={link} href={DESKTOP.careHub}>Care Hub</a>
          <a className={link} href={DESKTOP.clinics}>Find a clinic</a>
          <a className={link} href={DESKTOP.conversation}>Ask the companion</a>
        </div>
        <div className="flex flex-col gap-2">
          <strong className="ui font-semibold text-foreground">Plans</strong>
          <a className={link} href={DESKTOP.petCare}>{BRAND} Care Plan</a>
          <a className={link} href={DESKTOP.petCare}>Insurance and financing</a>
        </div>
        <div className="flex flex-col gap-2">
          <strong className="ui font-semibold text-foreground">Urgent help</strong>
          <span className="ui text-muted-foreground">{EMERGENCY.name} is open 24/7</span>
          <a className={link} href={EMERGENCY.tel}>{EMERGENCY.phone}</a>
        </div>
      </div>
    </footer>
  )
}

/* ---------- content (from the design's renderVals, Waffles only) ---------- */

type Quick = { label: string; href: string; Icon?: LucideIcon; pet?: boolean }

const SIGNED_IN = {
  greeting: "Good morning, Lucy.",
  suggestions: [
    "Is Waffles doing okay for her age?",
    "What happened at Waffles’ last vet visit?",
    "Can you find a vet who’s good with puppies?",
    "Waffles has been scratching a lot lately...",
    "How do I know if my pet needs to see a vet?",
  ],
  quick: [
    { label: "I need to book a visit", Icon: CalendarPlus, href: DESKTOP.petCare },
    { label: "I think something’s wrong", Icon: Frown, href: askHref("I think something's wrong with Waffles.") },
    { label: "What’s upcoming for Waffles?", pet: true, href: askHref("What's upcoming for Waffles?") },
  ] as Quick[],
  worldKicker: "My Pet Care",
  worldTitle: "Waffles’ world",
}

const SIGNED_OUT = {
  greeting: "Every pet deserves great care.",
  suggestions: [
    "My dog is vomiting. Should I be worried?",
    "How much should I feed a puppy?",
    "Find a vet near me.",
    "What should I know before getting a puppy?",
    "How do I know if my cat is in pain?",
    "How often should my cat see a vet?",
    "What should I expect at a first vet visit?",
    "How does pet insurance work?",
    "What are signs my pet needs a vet today?",
    "What vaccines does a new puppy need?",
    "How much does a wellness exam cost?",
    "What does a pet wellness plan include?",
    "Is chocolate dangerous for dogs?",
    "How do I help my dog with separation anxiety?",
    "Can I talk to a vet from home?",
    "How do I choose a vet I’ll trust?",
  ],
  quick: [
    { label: "I just brought home a puppy", Icon: Dog, href: askHref("I just brought home a puppy.") },
    { label: "I think something’s wrong", Icon: Frown, href: askHref("I think something's wrong with my pet.") },
    { label: `Is there an ${BRAND} clinic near me?`, Icon: MapPin, href: DESKTOP.clinics },
  ] as Quick[],
  worldKicker: `Make ${BRAND} yours`,
  worldTitle: "Start with who you care for",
}

const BENTO_IN = {
  hb: { kicker: "Behavior science", title: "Her socialization window is open.", body: "Pups are most open to new things until about 16 weeks. Waffles has two weeks left.", cta: "Plan outings", href: askHref("How can I plan safe socialization outings for Waffles?"), alt: "Waffles sitting happily on a teal couch" },
  ta: { tag: `From ${BRAND} vets`, TagIcon: Stethoscope, title: "Ready for Dec 3?", body: "Come a little hungry. Pups who get treats during exams stay calmer, and calm visits make the next one easier.", cta: "Prep for the visit", href: askHref("How should I prepare Waffles for her booster on Dec 3?") } as Tile,
  tb: { tag: "Learning science", TagIcon: Brain, title: "Leash basics, 5 minutes a day.", body: "Short, spaced sessions stick better than one long one, especially at 14 weeks.", cta: "Start a training plan", href: askHref("Can you give me a 5-minute-a-day leash training plan for Waffles?") } as Tile,
  tc: { tag: "Breed insight", TagIcon: Microscope, title: "A rainy week in Kirkland.", body: "Floppy ears trap moisture, which makes Goldens prone to ear infections. Towel-dry after walks.", cta: "Get rainy-day ideas", href: askHref("It's raining all week. What are some good indoor games for Waffles?"), sticker: IMG.stickerGolden, stickerStyle: { right: 4, bottom: 0, width: 112 } as CSSProperties },
}

const BENTO_OUT = {
  hb: { kicker: "Vet-reviewed", title: "Good care starts with a conversation.", body: `Answers grounded in veterinary research and the experience of ${BRAND} vets.`, cta: "See how it works", href: DESKTOP.conversation, alt: "A golden retriever puppy sitting on a teal couch" },
  ta: { tag: `${BRAND} network`, TagIcon: Building2, title: "Find a vet who fits.", body: `Local hospitals with their own teams, backed by specialists across ${BRAND}.`, cta: "Explore local care", href: DESKTOP.clinics } as Tile,
  tb: { tag: "Vet-reviewed answers", TagIcon: BadgeCheck, title: "Not sure what’s going on?", body: "Clear answers to everyday questions, checked by veterinarians.", cta: "Ask a question", href: DESKTOP.conversation } as Tile,
  tc: { tag: "Every life stage", TagIcon: Sprout, title: "From puppyhood to the golden years.", body: "What changes at each age, and the care that matters most when it does.", cta: "Explore pet care", href: DESKTOP.careHub, sticker: IMG.stickerSprout, stickerStyle: { right: 8, bottom: "calc(var(--spacing) * -6)", width: 96 } as CSSProperties },
}

type ListItem = { label: string; when: string; href: string; Icon?: LucideIcon }

const WORLD_IN = {
  visit: { href: DESKTOP.petCare, kicker: "Next visit", Icon: CalendarCheck, title: "Final puppy booster, Thu Dec 3", sub: `10:30 AM with ${CLINIC.vet} at ${CLINIC.short}` },
  cover: { href: DESKTOP.petCare, title: "Plus · her exam covered", sub: "Renews Mar 14 · 10% off services" },
  offTitle: "Something off with Waffles?",
  listTitle: "Coming up",
  list: [
    { label: "Flea and tick refill", when: "Waffles · Nov 24", href: DESKTOP.petCare },
    { label: "Final DHPP booster", when: "Waffles · Thu, Dec 3 at 10:30 AM", href: DESKTOP.petCare },
    { label: "Monthly weigh-in", when: "Waffles · Dec 5", href: DESKTOP.petCare },
  ] as ListItem[],
  read: { kind: "Picked for Waffles", time: "6 min read", Icon: Dog, photo: "a golden puppy meeting a calm older dog", title: "Socializing a Golden puppy, week by week", body: "Simple outings that build confidence before her socialization window closes." },
  askTitle: "Ask about Waffles",
  asks: ["Is Waffles eating enough for her age?", "When should Waffles be spayed?", "How do I keep her ears healthy in the rain?"],
}

const WORLD_OUT = {
  visit: { href: DESKTOP.clinics, kicker: "Near you", Icon: MapPin, title: `Find an ${BRAND} clinic`, sub: "Four hospitals within 5 mi of Kirkland, one open 24/7" },
  cover: { href: DESKTOP.careHub, title: `${BRAND} Care Plans`, sub: "Exams, core vaccines and 10% off, monthly" },
  offTitle: "Something feel off?",
  listTitle: "Start here",
  list: [
    { label: "Your first 90 days with a new pet", when: "Guide · 6 min read", href: DESKTOP.careHub, Icon: House },
    { label: "Vaccine schedules for dogs and cats", when: "Guide · 5 min read", href: DESKTOP.careHub, Icon: Syringe },
    { label: "Care plans and insurance, explained", when: "Article · 7 min read", href: DESKTOP.careHub, Icon: ShieldCheck },
  ] as ListItem[],
  read: { kind: "Seasonal guide", time: "4 min read", Icon: CloudRain, photo: "a dog shaking off rain on a Seattle porch", title: "Rainy-season ear and skin care", body: "Damp Pacific Northwest weather can be hard on ears and skin. Here’s what to watch for." },
  askTitle: "Popular questions",
  asks: ["What does a first puppy visit include?", `How do ${BRAND} Care Plans work?`, "Is there a clinic open late near me?"],
}
