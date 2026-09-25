import { useSyncExternalStore } from 'react'
import { DUR, EASE_CSS } from '@/lib/motion'
import { prefersReducedMotion } from '@/lib/utils'

/**
 * Two routes don't need a router library: `/` and `/work/worthyapply`.
 * History API + one event; route changes SCAN-wipe in under 600 ms.
 */

const EVENT = 'routechange'

function subscribe(notify: () => void) {
  window.addEventListener('popstate', notify)
  window.addEventListener(EVENT, notify)
  return () => {
    window.removeEventListener('popstate', notify)
    window.removeEventListener(EVENT, notify)
  }
}

export function usePath() {
  return useSyncExternalStore(
    subscribe,
    () => window.location.pathname.replace(/\/+$/, '') || '/',
    () => '/',
  )
}

/** Navigate within the site. `hash` scrolls to a section once the page is up. */
export function navigate(to: string) {
  const url = new URL(to, window.location.origin)
  const commit = () => {
    window.history.pushState({}, '', url.pathname + url.hash)
    window.dispatchEvent(new Event(EVENT))
  }

  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }
  if (!doc.startViewTransition || prefersReducedMotion()) {
    commit()
    return
  }
  const t = doc.startViewTransition(commit)
  t.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'] },
        { duration: DUR.wipe * 1000, easing: EASE_CSS, pseudoElement: '::view-transition-new(root)' },
      )
    })
    .catch(() => {})
}

/** onClick handler for in-site links: keeps new-tab / modified clicks native. */
export function linkHandler(to: string) {
  return (e: React.MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(to)
  }
}
