import { Bell, Heart, LayoutGrid, PawPrint, Sparkles } from "lucide-react"
import { Avatar, Btn, LinkBtn } from "./ui"
import { BRAND_FULL, CLINIC } from "./data"
import { DESKTOP } from "./routes"

/** The ACME shield mark from the designs (a shield with a roof line). */
export function ShieldMark({ size = 22 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={(size * 26) / 22} viewBox="0 0 26 30" fill="none" stroke="var(--primary)" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
      <path d="M2 2h22v13c0 6.5-4.8 10.8-11 13C6.8 25.8 2 21.5 2 15V2z" />
      <path d="M6.5 16.5L13 5.5l6.5 11" />
      <path d="M6.5 16.5v3M19.5 16.5v3" />
    </svg>
  )
}

/** Header for the inner desktop pages (LP02–LP05). */
export function AppHeader({ current }: { current: "companion" | "petCare" | "careHub" }) {
  const nav = [
    { id: "companion", label: "Companion", href: DESKTOP.home, Icon: Sparkles },
    { id: "petCare", label: "My Pet Care", href: DESKTOP.petCare, Icon: PawPrint },
    { id: "careHub", label: "Care Hub", href: DESKTOP.careHub, Icon: LayoutGrid },
  ] as const
  return (
    <header className="grid h-16 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-8 border-b border-border bg-background px-10">
      <a href={DESKTOP.home} aria-label={`${BRAND_FULL}, Companion home`} className="flex items-center gap-2 justify-self-start">
        <ShieldMark />
        <span className="h4 text-foreground">{BRAND_FULL}</span>
      </a>
      <nav aria-label="Main" className="flex items-center gap-1">
        {nav.map(({ id, label, href, Icon }) => (
          <LinkBtn key={id} href={href} variant={id === current ? "secondary" : "ghost"} aria-current={id === current ? "page" : undefined}>
            <Icon size={16} />
            {label}
          </LinkBtn>
        ))}
      </nav>
      <div className="flex items-center gap-2 justify-self-end">
        <CareTeamButton />
        <NotificationsButton />
        <LucyAvatar />
      </div>
    </header>
  )
}

export function CareTeamButton({ label = "Call my care team" }: { label?: string }) {
  return (
    <LinkBtn variant="outline" href={CLINIC.tel} aria-label={`${label}, ${CLINIC.name}, open until 10 PM`} className="h-10 text-foreground">
      <Heart size={16} />
      <span className="flex flex-col items-start leading-[1.1]">
        <span className="small text-muted-foreground">{label}</span>
        <span className="small font-semibold text-foreground">{CLINIC.name}</span>
      </span>
      <span aria-hidden="true" className="size-2 rounded-full bg-primary" />
    </LinkBtn>
  )
}

export function NotificationsButton() {
  return (
    <Btn variant="ghost" size="icon" aria-label="Notifications, 2 unread" className="relative size-10">
      <Bell size={18} />
      <span aria-hidden="true" className="small absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
        2
      </span>
    </Btn>
  )
}

export function LucyAvatar() {
  return (
    <Avatar className="bg-primary">
      <span className="font-semibold text-primary-foreground">L</span>
    </Avatar>
  )
}
