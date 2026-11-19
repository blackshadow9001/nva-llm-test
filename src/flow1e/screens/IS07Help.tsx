import { useState } from "react"
import { Check, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Toggle } from "@/components/ui/toggle"
import { AddedChip, Heading, Hero, HeroBar, NextButton, ProfileCard, Screen, Sheet, StepDots } from "../parts"

const OPTIONS = ["Puppy shots", "Finding a vet", "House training", "Food and nutrition", "Socializing"]

export function IS07Help() {
  const [picked, setPicked] = useState<string[]>(["Puppy shots", "Finding a vet"])

  return (
    <Screen>
      <Hero className="pb-6" contours={258}>
        <HeroBar back="is06" center={<StepDots step={3} />} />
        <ProfileCard chips={["Golden puppy", "Fremont", "Close by · evenings · online"]} added={<AddedChip>Monthly plan</AddedChip>} />
      </Hero>

      <Sheet footer={<NextButton to="is08">Build Waffles' plan</NextButton>}>
        <Heading title="What would help most right now?" body="Pick any, or just tell us." />

        <div role="group" aria-label="What would help most right now?" className="flex flex-col gap-2.5">
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

        <Card className="h-14 flex-row items-center gap-3 rounded-full border border-border py-0 pr-2 pl-4.5 ring-0">
          <span className="grow text-[15px] text-muted-foreground">"She chews everything..."</span>
          <span className="ap-wave flex h-6 items-center gap-0.75" aria-hidden="true">
            <i />
            <i style={{ animationDelay: ".15s" }} />
            <i style={{ animationDelay: ".3s" }} />
            <i style={{ animationDelay: ".45s" }} />
          </span>
          <Button size="icon" aria-label="Speak" className="size-[42px] bg-accent-3 px-0 text-foreground hover:bg-accent-3/80">
            <Mic className="size-[18px]" />
          </Button>
        </Card>
      </Sheet>
    </Screen>
  )
}
