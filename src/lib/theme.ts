import { DUR, EASE_CSS } from '@/lib/motion'
import { prefersReducedMotion } from '@/lib/utils'

export type Theme = 'darkroom' | 'paper'

export const THEME_EVENT = 'themechange'

export function getTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'paper' ? 'paper' : 'darkroom'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  root.style.colorScheme = theme === 'paper' ? 'light' : 'dark'
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'paper' ? '#EFEAE0' : '#0E110F')
  try {
    localStorage.setItem('theme', theme)
  } catch {
    /* private mode: the choice just isn't remembered */
  }
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }))
}

/**
 * Switches theme with a SCAN wipe: the new page is revealed left to right
 * while a 1px beam rides the edge. Instant where View Transitions aren't
 * supported or motion is reduced.
 */
export function switchTheme(next: Theme) {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> }
  }
  if (!doc.startViewTransition || prefersReducedMotion()) {
    applyTheme(next)
    return
  }

  // The beam gets its own transition group; moving it between the old and
  // new snapshots makes the browser sweep it across in step with the wipe.
  const beam = document.createElement('div')
  beam.setAttribute('aria-hidden', 'true')
  Object.assign(beam.style, {
    position: 'fixed',
    top: '0',
    bottom: '0',
    left: '0',
    width: '1px',
    background: 'var(--measure)',
    zIndex: '120',
    pointerEvents: 'none',
    viewTransitionName: 'scan-beam',
  })
  document.body.appendChild(beam)

  const transition = doc.startViewTransition(() => {
    applyTheme(next)
    beam.style.left = 'calc(100% - 1px)'
  })

  transition.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'] },
        { duration: DUR.wipe * 1000 + 60, easing: EASE_CSS, pseudoElement: '::view-transition-new(root)' },
      )
    })
    .catch(() => {})
  transition.finished.finally(() => beam.remove())
}
