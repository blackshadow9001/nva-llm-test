import type { ComponentType } from "react"
import { cn } from "@/lib/utils"
import { SCREENS, href, useScreen, type ScreenId } from "@/flow1e/routes"
import { IS00Home } from "@/flow1e/screens/IS00Home"
import { IS01Meet } from "@/flow1e/screens/IS01Meet"
import { IS02Reading } from "@/flow1e/screens/IS02Reading"
import { IS03Confirm } from "@/flow1e/screens/IS03Confirm"
import { IS04Avatar } from "@/flow1e/screens/IS04Avatar"
import { IS05Easy } from "@/flow1e/screens/IS05Easy"
import { IS06Costs } from "@/flow1e/screens/IS06Costs"
import { IS07Help } from "@/flow1e/screens/IS07Help"
import { IS08Building } from "@/flow1e/screens/IS08Building"
import { IS09Home } from "@/flow1e/screens/IS09Home"
import { CompanionHome } from "@/companion/CompanionHome"
import { DesktopApp } from "@/desktop/DesktopApp"
import "@/flow1e/flow1e.css"

const VIEWS: Record<ScreenId, ComponentType> = {
  is00: IS00Home,
  is01: IS01Meet,
  is02: IS02Reading,
  is03: IS03Confirm,
  is04: IS04Avatar,
  is05: IS05Easy,
  is06: IS06Costs,
  is07: IS07Help,
  is08: IS08Building,
  is09: IS09Home,
}

export default function App() {
  const id = useScreen()

  // The desktop companion page (live AI chat) sits outside the phone frame.
  if (id === "companion") return <CompanionHome />
  // The desktop design (canvas page "Landing Page - Agent Companion").
  if (id === "desktop") return <DesktopApp />
  const View = VIEWS[id]

  return (
    <div className="flex min-h-dvh items-center justify-center gap-10 bg-background sm:bg-muted sm:p-8">
      {/* Phone-width column: full screen on a phone, a 390×844 frame on larger screens */}
      <div className="h-dvh w-full overflow-hidden bg-background sm:h-[844px] sm:w-[390px] sm:rounded-[40px] sm:shadow-2xl sm:ring-1 sm:ring-foreground/10">
        {/* key restarts the entrance animations on every screen change */}
        <View key={id} />
      </div>

      <nav aria-label="Flow 1e screens" className="hidden w-64 flex-col gap-1 lg:flex">
        <span className="ap-eyebrow mb-2">Flow 1e · Photo-first intake</span>
        {SCREENS.map((s) => (
          <a
            key={s.id}
            href={href(s.id)}
            aria-current={s.id === id ? "page" : undefined}
            className={cn(
              "rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-card hover:text-foreground",
              s.id === id && "bg-card font-semibold text-foreground",
            )}
          >
            {s.label}
          </a>
        ))}
        <span className="ap-eyebrow mt-6 mb-2">Desktop</span>
        <a href="#/desktop" className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-card hover:text-foreground">
          Desktop prototype · live AI
        </a>
        <a href="#/companion" className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-card hover:text-foreground">
          Companion test page
        </a>
      </nav>
    </div>
  )
}
