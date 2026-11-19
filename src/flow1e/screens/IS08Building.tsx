import {
  BellRing,
  Bone,
  CalendarCheck,
  CalendarHeart,
  CalendarRange,
  CircleCheck,
  Hospital,
  House,
  Syringe,
  type LucideIcon,
} from "lucide-react"
import { Hero, IconTile, NextButton, Screen, Sheet } from "../parts"
import avatar from "../assets/avatar-realistic.jpg"

const STEPS: { icon: LucideIcon; title: string; sub: string }[] = [
  { icon: CalendarRange, title: "Puppy year mapped", sub: "4 milestones, starting with first puppy shots on Nov 17" },
  { icon: Hospital, title: "Held a time at Maple Grove", sub: "Tue 6:00 PM · 1.2 mi · fits your calendar" },
  { icon: CalendarCheck, title: "Added to your calendar", sub: "We'll release the hold if you don't confirm" },
  { icon: House, title: "ACME Pet Resort Fremont", sub: "Puppy daycare intro, once shots are done" },
  { icon: BellRing, title: "Reminders on", sub: "Flea and tick season starts in March here" },
]

export function IS08Building() {
  return (
    <Screen>
      <Hero className="h-[330px]">
        <div className="relative mt-6.5 flex justify-center">
          <div className="relative size-[230px]">
            <span aria-hidden="true" className="absolute inset-3.5 rounded-full border border-dashed border-card/28" />
            <div className="ap-orbit" aria-hidden="true">
              <span style={{ left: "calc(50% - 20px)", top: -6 }}>
                <Syringe className="size-[18px]" />
              </span>
              <span style={{ left: "calc(100% - 34px)", top: "calc(50% - 20px)" }}>
                <Hospital className="size-[18px]" />
              </span>
              <span style={{ left: "calc(50% - 20px)", top: "calc(100% - 34px)" }}>
                <CalendarHeart className="size-[18px]" />
              </span>
              <span style={{ left: -6, top: "calc(50% - 20px)" }}>
                <Bone className="size-[18px]" />
              </span>
            </div>
            <span
              className="ap-float absolute top-1/2 left-1/2 -mt-[66px] -ml-[66px] size-[132px] overflow-hidden rounded-full"
              style={{
                boxShadow:
                  "0 14px 30px -14px color-mix(in oklch, var(--foreground) 55%, transparent), 0 0 0 4px color-mix(in oklch, var(--accent-3) 35%, transparent)",
              }}
            >
              <img src={avatar} alt="Waffles' avatar" className="size-full object-cover" />
            </span>
          </div>
        </div>
      </Hero>

      <Sheet footer={<NextButton to="is09">Open Waffles' home</NextButton>}>
        <div className="flex flex-col gap-1.5">
          <span className="ap-eyebrow">Almost there</span>
          <h1 className="h3 m-0 text-foreground">Building Waffles' world</h1>
          <p className="m-0 text-[15px] leading-[22px] text-muted-foreground">Using her photo, your answers and your calendar.</p>
        </div>

        <div aria-live="polite" className="flex flex-col gap-2">
          {STEPS.map(({ icon: Icon, title, sub }, i) => (
            <div
              key={title}
              className="ap-seq flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3"
              style={{ animationDelay: `${0.5 + i * 0.5}s` }}
            >
              <IconTile className="size-9">
                <Icon className="size-[18px]" />
              </IconTile>
              <span className="flex min-w-0 grow flex-col gap-0.25">
                <span className="text-sm font-semibold">{title}</span>
                <span className="text-xs leading-[17px] text-muted-foreground">{sub}</span>
              </span>
              <span className="ap-pop flex text-primary" style={{ animationDelay: `${0.8 + i * 0.5}s` }}>
                <CircleCheck className="size-[18px]" />
              </span>
            </div>
          ))}
        </div>
      </Sheet>
    </Screen>
  )
}
