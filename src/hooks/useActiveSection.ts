import { useEffect, useState } from 'react'
import { ScrollTrigger } from '@/lib/gsap'

/**
 * Tracks which section currently owns the viewport, using the same
 * ScrollTrigger instance that drives the rest of the page so the nav
 * indicator can never disagree with the scroll position.
 */
export function useActiveSection(ids: string[]): string {
  // Nothing is highlighted until a section actually owns the viewport.
  const [active, setActive] = useState('')

  useEffect(() => {
    const triggers = ids
      .map((id) => {
        const el = document.getElementById(id)
        if (!el) return null
        return ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => {
            if (self.isActive) setActive(id)
          },
        })
      })
      .filter(Boolean) as ScrollTrigger[]

    ScrollTrigger.refresh()
    return () => triggers.forEach((t) => t.kill())
  }, [ids])

  return active
}
