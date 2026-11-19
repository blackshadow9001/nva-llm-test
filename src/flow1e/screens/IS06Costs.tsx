import { useState } from "react"
import { Check, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { href } from "../routes"
import { AddedChip, Heading, Hero, HeroBar, NextButton, ProfileCard, Screen, Sheet, StepDots } from "../parts"

const TIPS: Record<string, [string, string]> = {
  "A predictable monthly plan": [
    "About $45 a month",
    "Puppy Care Plan covers the shot series, checkups and exams. First-year routine care is usually around $1,100 to $1,400.",
  ],
  "Pay as I go": ["About $85 per puppy visit", "Waffles needs 3 to 4 visits before 16 weeks. We'll show prices before you book."],
  "Use pet insurance": [
    "Plans from about $30 a month",
    "Insurance helps with accidents and illness. Routine shots usually aren't covered, so many owners pair it with a plan.",
  ],
  "Not sure yet": ["We'll show you both", "You'll see plan and per-visit prices side by side, so you can decide later."],
}

export function IS06Costs() {
  const [choice, setChoice] = useState("A predictable monthly plan")
  const [big, small] = TIPS[choice]

  return (
    <Screen>
      <Hero className="pb-6" contours={258}>
        <HeroBar
          back="is05"
          center={<StepDots step={2} />}
          right={
            <a href={href("is07")} className="w-11 text-right text-sm font-semibold text-primary-foreground/85">
              Skip
            </a>
          }
        />
        <ProfileCard chips={["Golden puppy", "Fremont"]} added={<AddedChip>Close by · evenings · online</AddedChip>} />
      </Hero>

      <Sheet footer={<NextButton to="is07">Continue</NextButton>}>
        <Heading title="How do you like to handle care costs?" body="Optional. Change it any time." />

        <ToggleGroup
          aria-label="How do you like to handle care costs?"
          orientation="vertical"
          value={[choice]}
          onValueChange={(v) => v[0] && setChoice(v[0] as string)}
          className="w-full gap-2.5"
        >
          {Object.keys(TIPS).map((label) => (
            <ToggleGroupItem key={label} value={label} className="ap-pill">
              <span className="ap-ck">
                <Check className="size-4" />
              </span>
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <Card aria-live="polite" className="ap-lift gap-2 rounded-xl bg-muted p-4 ring-0">
          <span className="flex items-center gap-2 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            For a Golden puppy near Fremont
          </span>
          <span className="text-[22px] font-semibold tracking-[-.02em]">{big}</span>
          <span className="text-[13px] leading-[19px] text-muted-foreground">{small}</span>
        </Card>
      </Sheet>
    </Screen>
  )
}
