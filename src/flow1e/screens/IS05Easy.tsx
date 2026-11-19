import { useState } from "react"
import { CalendarSync, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Toggle } from "@/components/ui/toggle"
import { Heading, Hero, HeroBar, NextButton, ProfileCard, Screen, Sheet, StepDots } from "../parts"

const OPTIONS = ["Close to home", "Evening and weekend times", "Book online", "Video visits", "Short waits"]

export function IS05Easy() {
  const [picked, setPicked] = useState<string[]>(["Close to home", "Evening and weekend times", "Book online"])
  const [calendar, setCalendar] = useState(true)

  return (
    <Screen>
      <Hero className="pb-6" contours={258}>
        <HeroBar back="is04" center={<StepDots step={1} />} />
        <ProfileCard
          chips={["Golden puppy", "Fremont"]}
          added={
            <span className="inline-flex h-7 items-center rounded-full border border-dashed border-card/40 px-2.75 text-xs text-primary-foreground/80">
              What makes care easy
            </span>
          }
        />
      </Hero>

      <Sheet footer={<NextButton to="is06">Continue</NextButton>}>
        <Heading title="What makes care easy for you?" body="Pick any. Waffles' plan will work around them." />

        <div role="group" aria-label="What makes care easy for you?" className="flex flex-col gap-2.5">
          {OPTIONS.map((label) => (
            <Toggle
              key={label}
              className="ap-pill"
              pressed={picked.includes(label)}
              onPressedChange={(on) => setPicked(on ? [...picked, label] : picked.filter((p) => p !== label))}
            >
              <span className="ap-ck">
                <Check className="size-4" />
              </span>
              {label}
            </Toggle>
          ))}
        </div>

        <Card className="flex-row items-center gap-3 rounded-xl border border-border px-4 py-3.5 ring-0">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
            <CalendarSync className="size-[18px]" />
          </span>
          <span className="flex grow flex-col gap-0.5">
            <span className="text-[15px] font-semibold">Connect your calendar</span>
            <span className="text-[13px] leading-[18px] text-muted-foreground">We'll only suggest times you're free.</span>
          </span>
          <Switch size="lg" aria-label="Connect your calendar" checked={calendar} onCheckedChange={setCalendar} />
        </Card>
      </Sheet>
    </Screen>
  )
}
