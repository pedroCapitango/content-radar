import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const THEME_KEY = 'cr_theme'

function initTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)')?.matches
    const theme =
      stored === 'light' || stored === 'dark'
        ? stored
        : prefersLight
          ? 'light'
          : 'dark'

    document.documentElement.dataset.theme = theme
  } catch {
    // If storage or matchMedia is unavailable, we simply keep the CSS default.
  }
}

initTheme()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
