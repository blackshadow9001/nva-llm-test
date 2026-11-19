import { useState } from "react"
import { RefreshCw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Heading, Hero, HeroBar, NextButton, Screen, Sheet } from "../parts"
import realistic from "../assets/avatar-realistic.jpg"
import stylized from "../assets/avatar-stylized.jpg"
import felted from "../assets/avatar-felted.jpg"

/** The design offers three avatar looks; "Realistic" is the default. */
const LOOKS = {
  realistic: { src: realistic, alt: "a 3D Golden Retriever puppy" },
  stylized: { src: stylized, alt: "a stylized 3D Golden Retriever puppy" },
  felted: { src: felted, alt: "a needle-felted wool Golden Retriever puppy" },
} as const

const COLLARS = [
  { name: "Lime", color: "var(--accent-3)" },
  { name: "Teal", color: "var(--primary)" },
  { name: "Sand", color: "var(--accent-4)" },
  { name: "Charcoal", color: "var(--foreground)" },
]

export function IS04Avatar({ look = "realistic" }: { look?: keyof typeof LOOKS }) {
  const [collar, setCollar] = useState(COLLARS[0].name)
  const avatar = LOOKS[look]

  return (
    <Screen>
      <Hero className="h-[400px]" contours={400} contourCount={12} contourStrength={18} glow>
        <HeroBar back="is03" />
        <div className="relative mt-4 flex justify-center">
          <svg aria-hidden="true" width="230" height="230" viewBox="0 0 100 100" className="absolute top-1/2 left-1/2 -mt-[115px] -ml-[115px]">
            <circle cx="50" cy="50" r="46" fill="none" stroke="color-mix(in oklch, var(--primary-foreground) 16%, transparent)" strokeWidth="1" />
            <circle cx="50" cy="50" r="46" fill="none" stroke="var(--accent-3)" strokeWidth="1.2" strokeLinecap="round" className="ap-ring" transform="rotate(-90 50 50)" />
          </svg>
          <span className="ap-pop relative" style={{ animationDelay: ".9s" }}>
            <span className="ap-float block">
              <img
                src={avatar.src}
                alt={`Waffles' ACME avatar: ${avatar.alt} with a ${collar.toLowerCase()} collar`}
                width={196}
                height={196}
                className="block size-[196px] rounded-full object-cover"
                style={{
                  boxShadow:
                    "0 18px 40px -18px color-mix(in oklch, var(--foreground) 55%, transparent), 0 0 0 4px color-mix(in oklch, var(--accent-3) 35%, transparent)",
                }}
              />
            </span>
          </span>
        </div>
      </Hero>

      <Sheet
        footer={
          <>
            <NextButton to="is05">Keep this look</NextButton>
            <Button variant="outline" size="lg" className="w-full">
              <RefreshCw />
              Try another look
            </Button>
          </>
        }
      >
        <Heading
          eyebrow="Your pet, ACME edition"
          title="Here's Waffles."
          body="Made from her photo. You'll see her on her profile and in reminders."
        />

        <div className="flex flex-col gap-2.5">
          <span className="text-[13px] font-semibold text-muted-foreground">Pick her collar</span>
          <div role="radiogroup" aria-label="Collar color" className="flex gap-3">
            {COLLARS.map((c) => {
              const on = collar === c.name
              return (
                <button
                  key={c.name}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-label={c.name}
                  onClick={() => setCollar(c.name)}
                  className="size-11 cursor-pointer rounded-full border-[3px] border-card"
                  style={{
                    background: c.color,
                    boxShadow: on ? "0 0 0 2px var(--foreground)" : "0 0 0 1px color-mix(in oklch, var(--foreground) 15%, transparent)",
                    transform: `scale(${on ? 1.08 : 1})`,
                    transition: "box-shadow .25s ease, transform .4s var(--spring)",
                  }}
                />
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-muted px-3.5 py-3">
          <Sparkles className="size-[18px] shrink-0 text-primary" />
          <span className="text-[13px] leading-[19px] text-muted-foreground">
            Updates as she grows. Add a new photo any time and her avatar, weight and size estimates refresh.
          </span>
        </div>
      </Sheet>
    </Screen>
  )
}
