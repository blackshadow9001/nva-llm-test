import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Syrup Design System tokens, used unchanged as the shadcn theme
import './styles/tokens.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
