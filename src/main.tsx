import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/martian-mono/wdth.css'
import App from '@/App'
import '@/styles/globals.css'

const render = () =>
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )

// Both faces are preloaded, so this is usually already settled. Waiting a
// beat for it keeps the first layout on the real metrics (no swap shift)
// without ever holding the page back for long.
const faces = document.fonts
const fonts = faces
  ? Promise.all([
      faces.load("800 1em 'Archivo Variable'"),
      faces.load("400 1em 'Archivo Variable'"),
      faces.load("400 1em 'Martian Mono Variable'"),
    ])
  : Promise.resolve()
const cap = new Promise((resolve) => setTimeout(resolve, 250))

Promise.race([fonts, cap]).finally(render)
