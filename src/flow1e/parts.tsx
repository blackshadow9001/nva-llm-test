import type { ReactNode } from "react"
import { ArrowRight, ChevronLeft, PawPrint, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { href, type ScreenId } from "./routes"
import avatar from "./assets/avatar-realistic.jpg"

/** Placeholder brand mark (a paw) while the prototype is shared as ACME. */
export function BrandMark({ className, size = 16 }: { className?: string; size?: number }) {
  return <PawPrint aria-hidden="true" size={size} strokeWidth={2.2} className={cn("shrink-0", className)} />
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2 text-sm font-semibold tracking-[.18em] text-primary-foreground">
      <BrandMark />
      ACME
    </span>
  )
}

/** Primary CTA that navigates to the next screen. */
export function NextButton({ to, children }: { to: ScreenId; children: ReactNode }) {
  return (
    <a href={href(to)} data-slot="button" className={buttonVariants({ size: "lg", className: "w-full" })}>
      {children}
      <ArrowRight className="size-[18px]" />
    </a>
  )
}

export function BackButton({ to }: { to: ScreenId }) {
  return (
    <a
      href={href(to)}
      aria-label="Back"
      data-slot="button"
      className={buttonVariants({ variant: "secondary", size: "icon", className: "size-11" })}
    >
      <ChevronLeft className="size-5" />
    </a>
  )
}

/** The contour lines drawn over the forest hero. */
function Contours({ height, count = 10, strength = 22 }: { height: number; count?: number; strength?: number }) {
  const lines = Array.from({ length: count }, (_, i) => {
    const y = 30 + i * 16
    const d = height - 30 - i * 10
    return `M0 ${y} C 120 ${y}, 140 ${d}, 195 ${d} S 270 ${y}, 390 ${y}`
  })
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 390 ${height}`}
      preserveAspectRatio="none"
      className="absolute inset-0 size-full"
      fill="none"
      stroke={`color-mix(in oklch, var(--accent-3) ${strength}%, transparent)`}
      strokeWidth={1.2}
    >
      {lines.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}

/** Forest-green hero band at the top of most screens. */
export function Hero({
  children,
  className,
  contours,
  contourCount,
  contourStrength,
  glow,
}: {
  children: ReactNode
  className?: string
  /** nominal height used to draw the contour lines; omit for none */
  contours?: number
  contourCount?: number
  contourStrength?: number
  glow?: boolean
}) {
  return (
    <section className={cn("relative shrink-0 overflow-hidden bg-primary pt-11 text-primary-foreground", className)}>
      <div aria-hidden="true" className="ap-flute absolute inset-0" />
      {glow && (
        <div
          aria-hidden="true"
          className="absolute top-[220px] left-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, color-mix(in oklch, var(--accent-3) 28%, transparent) 0%, transparent 65%)" }}
        />
      )}
      {contours && <Contours height={contours} count={contourCount} strength={contourStrength} />}
      {children}
    </section>
  )
}

/** Back button, a centre slot (wordmark or progress) and a right slot. */
export function HeroBar({ back, center, right }: { back: ScreenId; center?: ReactNode; right?: ReactNode }) {
  return (
    <div className="relative z-[2] flex items-center justify-between px-5 pt-1">
      <BackButton to={back} />
      {center ?? <Wordmark />}
      {right ?? <span className="w-11" />}
    </div>
  )
}

export function StepDots({ step }: { step: 1 | 2 | 3 }) {
  return (
    <span
      role="progressbar"
      aria-label={`Step ${step} of 3`}
      aria-valuemin={1}
      aria-valuemax={3}
      aria-valuenow={step}
      className="flex gap-1.5"
    >
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full",
            i === step ? "w-[22px]" : "w-1.5",
            i <= step ? "bg-accent-3" : "bg-card/30",
          )}
        />
      ))}
    </span>
  )
}

/** White sheet below the hero: scrolling body plus a pinned footer. */
export function Sheet({
  children,
  footer,
  footerBorder,
  className,
}: {
  children: ReactNode
  footer?: ReactNode
  footerBorder?: boolean
  className?: string
}) {
  return (
    <section className="relative z-[1] flex min-h-0 flex-1 flex-col border-t border-border bg-background">
      <div className={cn("ap-rise flex min-h-0 flex-1 flex-col gap-5.5 overflow-y-auto px-5 pt-7.5 pb-4 *:shrink-0", className)}>
        {children}
      </div>
      {footer && (
        <div className={cn("flex shrink-0 flex-col gap-2.5 bg-background px-5 pt-2.5 pb-4", footerBorder && "border-t border-border")}>
          {footer}
        </div>
      )}
    </section>
  )
}

export function Heading({ title, body, eyebrow }: { title: ReactNode; body?: ReactNode; eyebrow?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      {eyebrow && <span className="ap-eyebrow">{eyebrow}</span>}
      <h1 className="h3 m-0 text-balance text-foreground">{title}</h1>
      {body && <p className="m-0 text-[15px] leading-[22px] text-muted-foreground">{body}</p>}
    </div>
  )
}

/** Small rounded square holding an icon. */
export function IconTile({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("flex size-[34px] shrink-0 items-center justify-center rounded-lg bg-secondary text-primary", className)}>
      {children}
    </span>
  )
}

/** Waffles' profile, growing as the intake answers come in (IS05–IS07). */
export function ProfileCard({ chips, added }: { chips: string[]; added?: ReactNode }) {
  return (
    <div className="ap-glass ap-rise relative z-[1] mx-5 mt-4.5 flex flex-col gap-3 rounded-xl p-3.5">
      <div className="flex items-center gap-3">
        <span className="ap-photo relative size-12 shrink-0 rounded-lg" role="img" aria-label="Waffles' avatar">
          <img src={avatar} alt="" className="absolute inset-0 size-full object-cover object-[50%_40%]" />
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-base font-semibold">Waffles' profile</span>
          <span className="text-xs text-primary-foreground/80">Golden Retriever · 10 wks · 14 lb · Fremont</span>
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <span key={c} className="ap-glass inline-flex h-7 items-center rounded-full px-2.75 text-xs font-medium">
            {c}
          </span>
        ))}
        {added}
      </div>
    </div>
  )
}

export function AddedChip({ children }: { children: ReactNode }) {
  return (
    <span
      className="ap-pop inline-flex h-7 items-center gap-1.25 rounded-full bg-accent-3 px-2.75 text-xs font-semibold text-foreground"
      style={{ animationDelay: ".5s" }}
    >
      <Plus className="size-3" />
      {children}
    </span>
  )
}

/** Full-height screen column. */
export function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("ap relative flex h-full flex-col overflow-hidden bg-muted text-foreground", className)}>{children}</div>
}
