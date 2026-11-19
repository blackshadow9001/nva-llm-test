import type { CSSProperties } from "react"
import { Bell, Camera, CloudRain, GraduationCap, House, Siren, Sprout, Video, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BrandMark, Screen } from "../parts"
import avatar from "../assets/avatar-realistic.jpg"

const AROUND: { icon: LucideIcon; title: string; sub: string; tile: CSSProperties }[] = [
  { icon: House, title: "Pet Resort daycare", sub: "Fremont · puppy intro after shots", tile: { background: "var(--accent-4)", color: "var(--accent-4-foreground)" } },
  { icon: GraduationCap, title: "Puppy class", sub: "Saturdays · starts Dec 5", tile: { background: "var(--accent-2)", color: "var(--accent-2-foreground)" } },
  { icon: Siren, title: "24/7 emergency", sub: "Ethos Seattle · 4.1 mi", tile: { background: "var(--emergency-subtle)", color: "var(--emergency)" } },
  { icon: Video, title: "Video vet", sub: "Quick questions, any hour", tile: { background: "var(--accent-3)", color: "var(--accent-3-foreground)" } },
]

export function IS09Home() {
  return (
    <Screen>
      <main className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">
        <section className="relative shrink-0 overflow-hidden bg-primary px-5 pt-12.5 pb-16 text-primary-foreground">
          <div className="relative flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold tracking-[.18em]">
              <BrandMark />
              ACME
            </span>
            <span className="flex gap-2">
              <Button variant="secondary" size="icon" aria-label="Notifications" className="size-11">
                <Bell className="size-4" />
              </Button>
              <span className="flex size-10 items-center justify-center rounded-full bg-accent-3 text-sm font-bold text-foreground">L</span>
            </span>
          </div>

          <div className="ap-rise relative mt-4.5 flex items-center gap-4">
            <div className="relative size-[132px] shrink-0">
              <svg aria-hidden="true" width="132" height="132" viewBox="0 0 100 100" className="absolute inset-0">
                <circle cx="50" cy="50" r="46" fill="none" stroke="color-mix(in oklch, var(--primary-foreground) 16%, transparent)" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="var(--accent-3)" strokeWidth="2.5" strokeLinecap="round" className="ap-ring" transform="rotate(-90 50 50)" />
              </svg>
              <span className="absolute top-1/2 left-1/2 -mt-14 -ml-14 size-28 overflow-hidden rounded-full">
                <img src={avatar} alt="Waffles' avatar" className="size-full object-cover" />
              </span>
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[13px] text-primary-foreground/82">Good afternoon, Lucy</span>
              <span className="text-4xl leading-[38px] font-semibold tracking-[-.03em]">Waffles</span>
              <span className="text-[13px] text-primary-foreground/82">
                Golden Retriever
                <br />
                10 weeks old&nbsp;&nbsp;·&nbsp;14 lb
              </span>
              <span
                className="mt-1 inline-flex items-center gap-1.25 self-start rounded-full px-2.5 py-1 text-xs font-semibold text-accent-3"
                style={{ background: "color-mix(in oklch, var(--accent-3) 16%, transparent)" }}
              >
                <Sprout className="size-3" />
                Puppy year · week 10 of 52
              </span>
            </div>
          </div>
        </section>

        <div className="ap-rise relative z-[1] -mt-11 flex flex-col gap-4.5 border-t border-border bg-background px-5 pt-7.5 pb-27.5">
          <section aria-label="Needs you" className="flex flex-col gap-3.5 rounded-xl bg-primary p-4.5 text-primary-foreground">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-semibold tracking-[.1em] text-accent-3 uppercase">
                <span className="ap-dot" />
                Held for Waffles
              </span>
              <span className="text-xs">Expires in 24 hrs</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[22px] leading-7 font-semibold text-balance">First puppy visit · Tue, Nov 17, 6:00 PM</span>
              <span className="text-[13px] leading-[19px] text-pretty">
                Maple Grove Animal Hospital, 1.2 mi. Dr. Ruiz sees lots of Golden puppies and checks hips early.
              </span>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Button variant="secondary" size="lg" className="w-full">
                Confirm visit
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-[1.5px] border-primary-foreground bg-transparent text-primary-foreground shadow-none hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Explore more
              </Button>
            </div>
          </section>

          <Card aria-label="Growth" className="gap-3 rounded-xl border border-border p-4.5 ring-0">
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-semibold">Growing right on track</span>
              <span className="text-xs text-muted-foreground">From her photos</span>
            </div>
            <svg
              role="img"
              aria-label="Weight from 8 to 10 weeks: 9, 11.5, 14 lb, inside the typical Golden range"
              viewBox="0 0 320 90"
              className="h-[90px] w-full"
            >
              <path d="M0 70 C 80 62, 160 46, 320 22 L 320 52 C 160 70, 80 80, 0 84 Z" fill="var(--secondary)" />
              <path d="M10 74 C 90 66, 170 50, 300 34" fill="none" stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round" className="ap-line" />
              <circle cx="300" cy="34" r="6" fill="var(--accent-3)" stroke="var(--foreground)" strokeWidth="2" />
            </svg>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>8 wks · 9 lb</span>
              <span>Typical range shaded</span>
              <span className="font-semibold text-foreground">Now · 14 lb</span>
            </div>
            <Button variant="outline" size="lg" className="w-full">
              <Camera />
              Snap a weekly photo
            </Button>
          </Card>

          <span className="mt-1 text-xl font-semibold">Around ACME for Waffles</span>
          <div className="grid grid-cols-2 gap-2.5">
            {AROUND.map(({ icon: Icon, title, sub, tile }) => (
              <Card key={title} className="ap-lift min-h-[126px] gap-2.5 rounded-xl border border-border p-3.5 ring-0">
                <span className="flex size-[38px] items-center justify-center rounded-lg" style={tile}>
                  <Icon className="size-[18px]" />
                </span>
                <span className="text-[15px] leading-[19px] font-semibold">{title}</span>
                <span className="text-xs leading-4 text-muted-foreground">{sub}</span>
              </Card>
            ))}
          </div>

          <section aria-label="Local" className="flex gap-3 rounded-xl bg-muted p-4">
            <CloudRain className="size-5 shrink-0 text-primary" />
            <span className="flex flex-col gap-1">
              <span className="text-[15px] font-semibold">Rainy week in Fremont</span>
              <span className="text-[13px] leading-[19px] text-muted-foreground">
                Puddles raise leptospirosis risk. We added a lepto vaccine question to Tuesday's visit.{" "}
                <code className="text-[11px]">[vet-approved content]</code>
              </span>
            </span>
          </section>
        </div>
      </main>

      <a
        href="#ask-waffles"
        aria-label="Ask ACME about Waffles"
        className="ap-lift absolute right-5 bottom-4 z-[3] flex h-14 items-center gap-2.5 rounded-full bg-primary pr-5.5 pl-2 text-[15px] font-semibold text-primary-foreground"
        style={{ boxShadow: "0 6px 18px -10px color-mix(in oklch, var(--foreground) 50%, transparent)" }}
      >
        <span className="flex size-[42px] items-center justify-center rounded-full bg-accent-3 text-foreground">
          <BrandMark size={18} />
        </span>
        Ask about Waffles
      </a>
    </Screen>
  )
}
