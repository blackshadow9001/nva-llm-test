import { useEffect, useState, type ComponentType } from "react"
import { DESKTOP, type DesktopPage } from "./routes"
import { LP06Home } from "./pages/LP06Home"
import { LP02Conversation } from "./pages/LP02Conversation"
import { LP03PetCare } from "./pages/LP03PetCare"
import { LP04CareHub } from "./pages/LP04CareHub"
import { LP05Clinics } from "./pages/LP05Clinics"

const PAGES: Record<DesktopPage, ComponentType> = {
  home: LP06Home,
  conversation: LP02Conversation,
  petCare: LP03PetCare,
  careHub: LP04CareHub,
  clinics: LP05Clinics,
}

function current(): DesktopPage {
  const path = window.location.hash.split("?")[0]
  const hit = (Object.keys(DESKTOP) as DesktopPage[]).find((k) => DESKTOP[k] === path)
  return hit ?? "home"
}

/** The desktop prototype: five pages, each filling the browser window. */
export function DesktopApp() {
  const [page, setPage] = useState<DesktopPage>(current)
  useEffect(() => {
    const onChange = () => setPage(current())
    window.addEventListener("hashchange", onChange)
    return () => window.removeEventListener("hashchange", onChange)
  }, [])
  const Page = PAGES[page]
  return <Page key={window.location.hash} />
}
