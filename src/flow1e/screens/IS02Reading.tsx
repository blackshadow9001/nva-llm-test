import { Cake, Check, Dna, MapPin, PawPrint, Scale, Sparkles, type LucideIcon } from "lucide-react"
import { BackButton, IconTile, NextButton, Screen, Sheet } from "../parts"
import snow from "../assets/waffles-snow.jpg"

const TAGS = [
  { text: "Dog", left: 22, top: 118, delay: 0.7 },
  { text: "Golden Retriever", left: 196, top: 96, delay: 1.15 },
  { text: "~10 weeks", left: 26, top: 236, delay: 1.6 },
  { text: "~14 lb", left: 262, top: 218, delay: 2.05 },
]

const FINDINGS: { icon: LucideIcon; label: string; value: string; delay: number }[] = [
  { icon: PawPrint, label: "Species", value: "Dog", delay: 0.6 },
  { icon: Dna, label: "Breed", value: "Golden Retriever · 92% match", delay: 1.1 },
  { icon: Cake, label: "Age", value: "About 10 weeks", delay: 1.5 },
  { icon: Scale, label: "Weight", value: "About 14 lb", delay: 2.0 },
  { icon: MapPin, label: "Location", value: "Fremont, Seattle", delay: 2.4 },
]

export function IS02Reading() {
  return (
    <Screen>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-[120px]"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklch, var(--foreground) 60%, transparent) 0%, color-mix(in oklch, var(--foreground) 25%, transparent) 60%, transparent 100%)",
        }}
      />
      <header className="absolute top-[50px] right-5 left-5 z-[4] flex items-center justify-between">
        <BackButton to="is01" />
        <span className="flex h-9 items-center gap-2 rounded-full bg-foreground/55 px-3.5 text-[13px] font-semibold text-primary-foreground backdrop-blur-sm">
          <Sparkles className="size-3.5" />
          Reading the photo
        </span>
      </header>

      <section className="relative h-[320px] shrink-0 overflow-hidden">
        <div role="img" aria-label="Your photo: Waffles sitting in the snow" className="ap-photo absolute inset-0">
          <img src={snow} alt="" className="absolute inset-0 size-full object-cover object-[50%_28%]" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <span className="ap-scan" />
        </div>
        <svg
          aria-hidden="true"
          width="190"
          height="190"
          viewBox="0 0 250 250"
          className="absolute top-[92px] left-[100px]"
          fill="none"
          stroke="var(--primary-foreground)"
          strokeWidth={3}
          strokeLinecap="round"
        >
          <path d="M2 30V2h28M220 2h28v28M248 220v28h-28M30 248H2v-28" />
        </svg>
        {TAGS.map((t) => (
          <span key={t.text} className="ap-tag" style={{ left: t.left, top: t.top, animationDelay: `${t.delay}s` }}>
            <span className="ap-dot" />
            {t.text}
          </span>
        ))}
      </section>

      <Sheet className="pb-6" footerBorder footer={<NextButton to="is03">Check the details</NextButton>}>
        <div className="flex flex-col gap-1.5">
          <span className="ap-eyebrow">Getting to know them</span>
          <h1 className="h3 m-0 text-foreground">Here's what we can tell.</h1>
        </div>

        <div aria-live="polite" className="flex flex-col gap-3">
          {FINDINGS.map(({ icon: Icon, label, value, delay }) => (
            <div key={label} className="ap-seq flex items-center gap-3" style={{ animationDelay: `${delay}s` }}>
              <IconTile>
                <Icon className="size-4" />
              </IconTile>
              <span className="flex grow flex-col gap-0.25">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-[15px] font-semibold">{value}</span>
              </span>
              <span
                className="ap-pop flex size-[22px] items-center justify-center rounded-full bg-foreground text-accent-3"
                style={{ animationDelay: `${delay + 0.2}s` }}
              >
                <Check className="size-3" />
              </span>
            </div>
          ))}
        </div>

        <p className="m-0 text-xs leading-[17px] text-muted-foreground">
          Location comes from the photo's place tag, only because you chose this photo. You can change any of this next.
        </p>
      </Sheet>
    </Screen>
  )
}
