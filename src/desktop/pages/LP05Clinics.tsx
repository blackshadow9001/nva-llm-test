import { useLayoutEffect, useRef, useState, type ComponentProps, type CSSProperties, type ReactNode } from "react"
import {
  Building2,
  CalendarPlus,
  ChevronLeft,
  Clock,
  List,
  Map as MapIcon,
  Navigation,
  PawPrint,
  Phone,
  Search,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AppHeader } from "../AppHeader"
import { Badge, Btn, LinkBtn } from "../ui"
import { BRAND } from "../data"
import { DESKTOP } from "../routes"

/** LP05 · Clinic finder: a list of nearby clinics beside a street map, or a 3-column list. */

type Clinic = {
  name: string
  mine: boolean
  type: string
  distance: string
  rating: string
  reviews: string
  hours: string
  next: string
  address: string
  phone: string
  tel: string
  photo: string
  note: string
  x: number
  y: number
}

const CLINICS: Clinic[] = [
  {
    name: "Cedar Bay Veterinary Clinic",
    mine: true,
    type: "General and urgent care",
    distance: "0.8 mi",
    rating: "4.9",
    reviews: "328",
    hours: "Open until 10 PM",
    next: "Next opening 4:30 PM",
    address: "1820 Cedar Bay Ave, Kirkland",
    phone: "(425) 555-0148",
    tel: "tel:+14255550148",
    photo: "Cedar Bay front entrance",
    note: "Dr. Priya Patel knows Waffles. Wellness exam (est. $85) covered by your Plus plan.",
    x: 330,
    y: 520,
  },
  {
    name: "Juniper Hill Pet Hospital",
    mine: false,
    type: "Fear Free certified",
    distance: "1.4 mi",
    rating: "4.8",
    reviews: "214",
    hours: "Open 24 hours",
    next: "Walk-ins welcome",
    address: "410 Juniper Hill Rd, Kirkland",
    phone: "(425) 555-0172",
    tel: "tel:+14255550172",
    photo: "Juniper Hill lobby",
    note: `Quiet, low-stress rooms. Part of the ${BRAND} family, so Waffles’ records come with her.`,
    x: 470,
    y: 150,
  },
  {
    name: "Eastlake Emergency Vet",
    mine: false,
    type: "24/7 emergency care",
    distance: "2.1 mi",
    rating: "4.7",
    reviews: "590",
    hours: "Open 24 hours",
    next: "Call before arrival",
    address: "9 Eastlake Way, Kirkland",
    phone: "(425) 555-0193",
    tel: "tel:+14255550193",
    photo: "Eastlake emergency entrance",
    note: "ER triage is an estimated $175. Call ahead so the team can get ready.",
    x: 700,
    y: 470,
  },
]

const sp = (n: number) => `calc(var(--spacing) * ${n})`

/* ---------- small local controls ---------- */

function InputGroup({ icon, className, style, ...input }: { icon: ReactNode; className?: string; style?: CSSProperties } & ComponentProps<"input">) {
  return (
    <div
      data-slot="input-group"
      className={cn(
        "flex h-9 min-w-0 items-center rounded-[calc(var(--radius)*0.8)] border border-input bg-transparent shadow-xs transition-[color,box-shadow] has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/50",
        className,
      )}
      style={style}
    >
      <span className="flex items-center pl-2.5 text-muted-foreground">{icon}</span>
      <input data-slot="input-group-control" className="h-full min-w-0 flex-1 bg-transparent px-2 text-base outline-none placeholder:text-muted-foreground" {...input} />
    </div>
  )
}

function ToggleGroup<T extends string>({
  value,
  onChange,
  items,
  className,
  label,
}: {
  value: T
  onChange: (v: T) => void
  items: { value: T; label: string; icon: ReactNode }[]
  className?: string
  label: string
}) {
  return (
    <div role="group" aria-label={label} className={cn("flex w-fit items-center rounded-[calc(var(--radius)*0.8)] shadow-xs", className)}>
      {items.map((it, i) => {
        const on = it.value === value
        return (
          <button
            key={it.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(it.value)}
            className={cn(
              "inline-flex h-9 min-w-9 cursor-pointer items-center justify-center gap-1.5 border border-input bg-transparent px-2.5 text-sm font-medium whitespace-nowrap transition-colors outline-none hover:bg-muted focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:shrink-0",
              i === 0 ? "rounded-l-[calc(var(--radius)*0.8)]" : "-ml-px",
              i === items.length - 1 && "rounded-r-[calc(var(--radius)*0.8)]",
              on && "bg-muted text-foreground",
            )}
          >
            {it.icon}
            {it.label}
          </button>
        )
      })}
    </div>
  )
}

/* ---------- map ---------- */

const MAP_W = 900
const MAP_H = 772

/** Mirrors preserveAspectRatio="xMidYMid slice" so HTML overlays stay on the drawing. */
function useSliceTransform() {
  const ref = useRef<HTMLElement>(null)
  const [t, setT] = useState({ s: 1, ox: 0, oy: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      const s = Math.max(w / MAP_W, h / MAP_H)
      setT({ s, ox: (w - MAP_W * s) / 2, oy: (h - MAP_H * s) / 2 })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return { ref, at: (x: number, y: number) => ({ left: t.ox + x * t.s, top: t.oy + y * t.s }) }
}

const labelStyle: CSSProperties = { position: "absolute", fontWeight: 600, color: "var(--muted-foreground)" }

function ClinicMap({ sel, onPick }: { sel: number; onPick: (i: number) => void }) {
  const { ref, at } = useSliceTransform()
  const c = CLINICS[sel]
  return (
    <section ref={ref} aria-label="Map of nearby clinics" className="relative min-w-0 flex-1 overflow-hidden" style={{ background: "var(--muted)" }}>
      <svg aria-hidden="true" width="100%" height="100%" viewBox={`0 0 ${MAP_W} ${MAP_H}`} preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
        <rect x="0" y="0" width="210" height="772" fill="var(--accent)" />
        <path d="M0 210 L900 160 M0 420 L900 470 M0 640 L900 600 M330 0 L300 772 M560 0 L600 772 M780 0 L760 772" stroke="var(--border)" strokeWidth="14" fill="none" />
        <path d="M210 0 L240 772" stroke="var(--background)" strokeWidth="20" fill="none" />
      </svg>
      <span aria-hidden="true" className="small" style={{ ...labelStyle, ...at(40, MAP_H * 0.48), writingMode: "vertical-rl" }}>
        LAKE SHORE
      </span>
      <span aria-hidden="true" className="small" style={{ ...labelStyle, ...at(380, 90) }}>
        JUNIPER HILL
      </span>
      <span aria-hidden="true" className="small" style={{ ...labelStyle, ...at(640, 520) }}>
        EASTLAKE
      </span>
      <span aria-hidden="true" className="small" style={{ ...labelStyle, ...at(300, 560) }}>
        CEDAR BAY
      </span>
      {CLINICS.map((p, i) => {
        const on = i === sel
        return (
          <button
            key={p.name}
            type="button"
            onClick={() => onPick(i)}
            aria-label={`${p.name}, ${p.distance}`}
            aria-pressed={on}
            style={{
              position: "absolute",
              ...at(p.x, p.y),
              width: 40,
              height: 40,
              margin: "-20px 0 0 -20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              border: "3px solid var(--background)",
              cursor: "pointer",
              boxShadow: "var(--shadow-md)",
              background: on ? "var(--primary)" : "var(--card)",
              color: on ? "var(--primary-foreground)" : "var(--foreground)",
            }}
          >
            <PawPrint size={16} />
          </button>
        )
      })}
      <div
        aria-label="You are here"
        style={{
          position: "absolute",
          ...at(430, 380),
          width: 16,
          height: 16,
          margin: "-8px 0 0 -8px",
          borderRadius: 999,
          background: "var(--foreground)",
          boxShadow: "0 0 0 4px var(--background)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: sp(6),
          right: sp(6),
          bottom: sp(6),
          display: "flex",
          alignItems: "center",
          gap: sp(5),
          padding: sp(5),
          borderRadius: "calc(var(--radius) * 1.4)",
          background: "var(--popover)",
          color: "var(--popover-foreground)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: sp(1) }}>
          <strong className="h4" style={{ color: "var(--popover-foreground)" }}>
            {c.name}
          </strong>
          <span className="ui" style={{ color: "var(--muted-foreground)" }}>
            {c.address} · {c.hours}
          </span>
          <span className="small" style={{ color: "var(--muted-foreground)" }}>
            {c.note}
          </span>
        </div>
        <LinkBtn href={DESKTOP.petCare}>
          <CalendarPlus size={16} />
          Book a visit
        </LinkBtn>
        <LinkBtn variant="outline" href={c.tel}>
          <Phone size={16} />
          Call {c.phone}
        </LinkBtn>
        <Btn variant="outline">
          <Navigation size={16} />
          Get directions
        </Btn>
      </div>
    </section>
  )
}

/* ---------- list card ---------- */

function ClinicCard({ c, on, onPick }: { c: Clinic; on: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={on}
      style={{
        display: "flex",
        gap: sp(4),
        width: "100%",
        boxSizing: "border-box",
        padding: sp(4),
        borderRadius: "calc(var(--radius) * 1.4)",
        background: "var(--card)",
        font: "inherit",
        cursor: "pointer",
        border: `1px solid ${on ? "var(--primary)" : "var(--border)"}`,
        boxShadow: on ? "0 0 0 1px var(--primary)" : "var(--shadow-xs)",
      }}
    >
      <div
        role="img"
        aria-label={`Photo: ${c.photo}`}
        className="small"
        style={{
          width: 96,
          height: 96,
          flexShrink: 0,
          boxSizing: "border-box",
          padding: sp(2),
          borderRadius: "var(--radius)",
          background: "var(--muted)",
          color: "var(--muted-foreground)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: sp(1),
          textAlign: "center",
        }}
      >
        <Building2 size={18} />
        <span style={{ color: "var(--muted-foreground)" }}>Photo: {c.photo}</span>
      </div>
      <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: sp(1), textAlign: "left" }}>
        <span style={{ display: "flex", alignItems: "center", gap: sp(2) }}>
          <strong className="ui" style={{ fontWeight: 600, color: "var(--foreground)" }}>
            {c.name}
          </strong>
          {c.mine && <Badge variant="secondary">Your clinic</Badge>}
        </span>
        <span className="small" style={{ color: "var(--muted-foreground)" }}>
          {c.type} · {c.distance}
        </span>
        <span className="small" style={{ display: "flex", alignItems: "center", gap: sp(1), color: "var(--foreground)" }}>
          <Star size={14} />
          {c.rating} <span style={{ color: "var(--muted-foreground)" }}>({c.reviews} reviews)</span>
        </span>
        <span
          className="small"
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: `${sp(1)} ${sp(3)}`, color: "var(--muted-foreground)" }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: sp(1), color: "var(--muted-foreground)" }}>
            <Clock size={14} />
            <span style={{ whiteSpace: "nowrap" }}>{c.hours}</span>
          </span>
          <span style={{ color: "var(--primary)", fontWeight: 500, whiteSpace: "nowrap" }}>{c.next}</span>
        </span>
      </span>
    </button>
  )
}

/* ---------- page ---------- */

export function LP05Clinics() {
  const [view, setView] = useState<"map" | "list">("map")
  const [sel, setSel] = useState(0)
  const isMap = view === "map"

  const listStyle: CSSProperties = isMap
    ? {
        width: 480,
        flexShrink: 0,
        boxSizing: "border-box",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: sp(3),
        padding: `${sp(5)} ${sp(6)} ${sp(5)} ${sp(10)}`,
        borderRight: "1px solid var(--border)",
      }
    : {
        flex: 1,
        boxSizing: "border-box",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: sp(3),
        padding: `${sp(5)} ${sp(10)}`,
      }
  const gridStyle: CSSProperties = isMap
    ? { display: "flex", flexDirection: "column", gap: sp(3) }
    : { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: sp(4) }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground" style={{ fontFamily: "var(--font-ui)" }}>
      <AppHeader current="careHub" />

      <div className="flex shrink-0 items-center border-b border-border" style={{ gap: sp(4), padding: `${sp(4)} ${sp(10)}` }}>
        <LinkBtn variant="ghost" href={DESKTOP.careHub}>
          <ChevronLeft size={16} />
          Back to Care Hub
        </LinkBtn>
        <h1 className="h3" style={{ margin: 0, color: "var(--foreground)" }}>
          Find a clinic
        </h1>
        <InputGroup icon={<Search size={16} />} aria-label="Search near" defaultValue="Kirkland, WA 98033" style={{ width: 320, marginLeft: sp(4) }} />
        <ToggleGroup
          label="View"
          className="ml-auto"
          value={view}
          onChange={setView}
          items={[
            { value: "map", label: "Map", icon: <MapIcon size={16} /> },
            { value: "list", label: "List", icon: <List size={16} /> },
          ]}
        />
      </div>

      <div className="flex min-h-0 flex-1">
        <section aria-label="Clinics near Kirkland" style={listStyle}>
          <span className="small" style={{ color: "var(--muted-foreground)" }}>
            3 clinics within 3 mi · sorted by distance
          </span>
          <div style={gridStyle}>
            {CLINICS.map((c, i) => (
              <ClinicCard key={c.name} c={c} on={i === sel} onPick={() => setSel(i)} />
            ))}
          </div>
        </section>

        {isMap && <ClinicMap sel={sel} onPick={setSel} />}
      </div>
    </div>
  )
}
