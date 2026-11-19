import { useEffect, useState } from "react"

export const SCREENS = [
  { id: "is00", label: "IS00 · Homepage, Get Started" },
  { id: "is01", label: "IS01 · Meet your pet: add a photo" },
  { id: "is02", label: "IS02 · AI reads the photo" },
  { id: "is03", label: "IS03 · Confirm or correct" },
  { id: "is04", label: "IS04 · Avatar reveal" },
  { id: "is05", label: "IS05 · What makes care easy" },
  { id: "is06", label: "IS06 · Care costs" },
  { id: "is07", label: "IS07 · What would help" },
  { id: "is08", label: "IS08 · Building her plan" },
  { id: "is09", label: "IS09 · Waffles' home" },
] as const

export type ScreenId = (typeof SCREENS)[number]["id"]

/** Every page: the phone screens, the companion test page and the desktop pages. */
export type PageId = ScreenId | "companion" | "desktop"

export const href = (id: ScreenId) => `#/${id}`

function read(): PageId {
  const id = window.location.hash.replace(/^#\/?/, "")
  if (id === "companion") return id
  if (id === "desktop" || id.startsWith("desktop/") || id.startsWith("desktop?")) return "desktop"
  return (SCREENS.find((s) => s.id === id)?.id ?? "is00") as ScreenId
}

/** Tiny hash router: each screen lives at #/is00 … #/is09. */
export function useScreen(): PageId {
  const [id, setId] = useState<PageId>(read)
  useEffect(() => {
    const onChange = () => {
      setId(read())
      window.scrollTo(0, 0)
    }
    window.addEventListener("hashchange", onChange)
    return () => window.removeEventListener("hashchange", onChange)
  }, [])
  return id
}
