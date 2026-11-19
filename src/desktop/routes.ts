/** Desktop pages, from the canvas page "Landing Page - Agent Companion". */
export const DESKTOP = {
  home: "#/desktop", // LP06 · Companion home, scrolling
  conversation: "#/desktop/conversation", // LP02 · Conversation
  petCare: "#/desktop/pet-care", // LP03 · My Pet Care
  careHub: "#/desktop/care-hub", // LP04 · Care Hub
  clinics: "#/desktop/clinics", // LP05 · Clinic finder
} as const

export type DesktopPage = keyof typeof DESKTOP

/** Opens the conversation and asks the companion `q` straight away. */
export const askHref = (q: string) => `${DESKTOP.conversation}?q=${encodeURIComponent(q)}`
