import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NextButton, BrandMark, Screen } from "../parts"
import heroImg from "../assets/hero-team-dog.webp"

export function IS00Home() {
  return (
    <Screen>
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <img
          src={heroImg}
          alt="A smiling ACME team member holds a scruffy gray dog on a city sidewalk"
          className="absolute inset-0 size-full object-cover object-[60%_30%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, color-mix(in oklch, var(--foreground) 45%, transparent) 0%, transparent 30%)" }}
        />
        <div className="absolute top-[50px] right-5 left-5 flex items-center justify-between text-primary-foreground">
          <span className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[.2em]">
            <BrandMark size={22} />
            ACME
          </span>
          <Button variant="secondary" size="icon" aria-label="Menu" className="size-11">
            <Menu className="size-[18px]" />
          </Button>
        </div>
      </div>

      <div className="relative z-[1] -mt-11 border-t border-border bg-background">
        <div className="ap-rise flex flex-col gap-3.5 px-5 pt-8 pb-5">
          <span className="ap-eyebrow">Rooted in care. Guided by science.</span>
          <h1 className="h3 m-0 text-balance text-foreground">Care that grows with them.</h1>
          <p className="m-0 text-base leading-6 text-pretty text-muted-foreground">
            One photo and a few taps. We'll shape everything around them, from the first visit on.
          </p>
          <div className="mt-1.5">
            <NextButton to="is01">Get started with ACME</NextButton>
          </div>
          <a href="#signin" className="flex h-11 items-center justify-center text-sm font-semibold text-primary">
            Sign in to your account
          </a>
        </div>
      </div>
    </Screen>
  )
}
