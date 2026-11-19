import { useState } from "react"
import { Cake, Check, ChevronUp, Dna, MapPin, PawPrint, Pencil, Scale, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Heading, Hero, HeroBar, IconTile, NextButton, Screen, Sheet } from "../parts"
import snow from "../assets/waffles-snow.jpg"

type Key = "species" | "breed" | "age" | "weight" | "place"

const ROWS: { id: Key; icon: LucideIcon; label: string; sure: boolean; options: string[] }[] = [
  { id: "species", icon: PawPrint, label: "Species", sure: true, options: ["Dog", "Cat", "Something else"] },
  { id: "breed", icon: Dna, label: "Breed", sure: true, options: ["Golden Retriever", "Labrador Retriever", "Golden mix"] },
  { id: "age", icon: Cake, label: "Age", sure: false, options: ["8 weeks", "10 weeks", "12 weeks", "Enter birthday"] },
  { id: "weight", icon: Scale, label: "Weight", sure: false, options: ["12 lb", "14 lb", "16 lb"] },
  { id: "place", icon: MapPin, label: "Location", sure: true, options: ["Fremont, Seattle", "Use a different ZIP", "Don't use location"] },
]

export function IS03Confirm() {
  const [open, setOpen] = useState<Key | "">("age")
  const [values, setValues] = useState<Record<Key, string>>({
    species: "Dog",
    breed: "Golden Retriever",
    age: "10 weeks",
    weight: "14 lb",
    place: "Fremont, Seattle",
  })

  return (
    <Screen>
      <Hero className="pb-6" contours={220}>
        <HeroBar back="is02" />
        <div className="relative mt-3.5 flex justify-center">
          <span
            role="img"
            aria-label="Your photo"
            className="ap-photo relative size-24 rounded-xl border-4 border-card"
            style={{ boxShadow: "0 6px 18px -10px color-mix(in oklch, var(--foreground) 40%, transparent)" }}
          >
            <img src={snow} alt="" className="absolute inset-0 size-full object-cover object-[50%_28%]" />
          </span>
        </div>
      </Hero>

      <Sheet footer={<NextButton to="is04">Confirm details</NextButton>}>
        <Heading title="Did we get it right?" body="Tap anything that's off. Best guesses are marked." />

        <label className="flex flex-col gap-2">
          <span className="text-[13px] font-semibold text-muted-foreground">Their name</span>
          <Input
            defaultValue="Waffles"
            aria-label="Pet name"
            className="ap-field h-[52px] rounded-lg border-[1.5px] bg-card px-4 text-[17px] font-semibold md:text-[17px]"
          />
          <span
            className="ap-pop inline-flex items-center gap-1.5 self-start rounded-full bg-secondary px-3 py-1.5 text-[13px] font-semibold text-primary"
            style={{ animationDelay: ".4s" }}
          >
            <Check className="size-3.5" />
            Lovely name
          </span>
        </label>

        <Card className="gap-0 rounded-xl py-0 ring-0 border border-border">
          {ROWS.map(({ id, icon: Icon, label, sure, options }) => {
            const isOpen = open === id
            return (
              <div key={id} className="border-b border-border last:border-b-0">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? "" : id)}
                  className="flex w-full cursor-pointer items-center gap-3.5 bg-transparent px-4 py-3.5 text-left text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-foreground"
                >
                  <IconTile>
                    <Icon className="size-4" />
                  </IconTile>
                  <span className="flex min-w-0 grow flex-col gap-0.25">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className="text-[15px] font-semibold">{values[id]}</span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.25 py-0.75 text-[11px] font-semibold",
                      sure ? "bg-foreground/6 text-muted-foreground" : "bg-warning-subtle text-warning",
                    )}
                  >
                    {sure ? "Sure" : "Best guess"}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="size-4 text-muted-foreground" />
                  ) : (
                    <Pencil className="size-4 text-muted-foreground" />
                  )}
                </button>
                {isOpen && (
                  <ToggleGroup
                    aria-label={label}
                    value={[values[id]]}
                    onValueChange={(v) => v[0] && setValues({ ...values, [id]: v[0] as string })}
                    className="ap-pop w-full flex-wrap origin-top-left gap-2 pr-4 pb-3.5 pl-16"
                  >
                    {options.map((o) => (
                      <ToggleGroupItem key={o} value={o} className="ap-chip">
                        {o}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                )}
              </div>
            )
          })}
        </Card>
      </Sheet>
    </Screen>
  )
}
