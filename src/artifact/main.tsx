import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "../styles/tokens.css"
import "../index.css"
import { CompanionHome } from "../companion/CompanionHome"

// Entry for the single-file claude.ai Artifact build (npm run build:artifact).
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CompanionHome />
  </StrictMode>,
)
