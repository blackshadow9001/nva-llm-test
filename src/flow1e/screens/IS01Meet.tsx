import { useState } from "react"
import { Camera, Check, Images, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Heading, Hero, HeroBar, NextButton, Screen, Sheet } from "../parts"
import snow from "../assets/waffles-snow.jpg"
import sun from "../assets/waffles-sun.jpg"
import paws from "../assets/waffles-paws.jpg"

const PHOTOS = [
  { src: snow, pos: "50% 30%", label: "Golden Retriever puppy sitting in the snow" },
  { src: sun, pos: "70% 82%", label: "Golden Retriever puppy asleep in a patch of sun on a wood floor" },
  { src: paws, pos: "50% 62%", label: "Golden Retriever puppy resting its head on its paws" },
]

export function IS01Meet() {
  const [sel, setSel] = useState(0)

  return (
    <Screen>
      <Hero className="h-[318px]" contours={318}>
        <HeroBar back="is00" />
        <div className="relative mt-5.5 flex justify-center">
          <span
            aria-hidden="true"
            className="ap-breathe absolute top-1/2 left-1/2 -mt-25 -ml-25 size-50 rounded-full border-[1.5px] border-dashed"
            style={{ borderColor: "color-mix(in oklch, var(--accent-3) 50%, transparent)" }}
          />
          <span className="ap-glass relative flex size-[150px] items-center justify-center rounded-full text-accent-3">
            <Camera className="size-10" />
          </span>
        </div>
      </Hero>

      <Sheet footer={<NextButton to="is02">Use this photo</NextButton>}>
        <Heading title="We'd love to meet your pet." body="Add a photo and we'll take it from there. No long forms." />

        <div className="flex flex-col gap-3">
          <span className="flex items-center justify-between text-sm font-semibold">
            Recent uploads
            <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Lock className="size-3" />
              On device
            </span>
          </span>
          <div role="radiogroup" aria-label="Choose a photo" className="grid grid-cols-3 gap-2.5">
            {PHOTOS.map((p, i) => {
              const on = sel === i
              return (
                <button
                  key={p.src}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-label={`Photo ${i + 1}: ${p.label}`}
                  onClick={() => setSel(i)}
                  className={cn(
                    "ap-lift relative h-28 cursor-pointer overflow-hidden rounded-[20px] bg-transparent p-0",
                    on ? "border-[3px] border-foreground" : "border border-foreground/12",
                  )}
                >
                  <img src={p.src} alt="" className="absolute inset-0 size-full object-cover" style={{ objectPosition: p.pos }} />
                  {on && (
                    <span className="ap-pop absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-accent-3 text-foreground">
                      <Check className="size-3.5" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <Button variant="outline" size="lg" className="w-full">
            <Camera />
            Take a photo
          </Button>
          <Button variant="outline" size="lg" className="w-full">
            <Images />
            Choose from library
          </Button>
        </div>
      </Sheet>
    </Screen>
  )
}
