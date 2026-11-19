import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "../styles/tokens.css"
import "../index.css"
import { DesktopApp } from "../desktop/DesktopApp"

// Entry for the desktop prototype as a claude.ai Artifact
// (npm run build:artifact:desktop). The pages route on the hash, starting at home.
if (!window.location.hash.startsWith("#/desktop")) {
  history.replaceState(null, "", "#/desktop")
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DesktopApp />
  </StrictMode>,
)
