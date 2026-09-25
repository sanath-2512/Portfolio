import { useEffect, useState } from 'react'
import { ScrollTrigger } from '@/lib/gsap'

/**
 * Which section owns the middle of the viewport. Uses ScrollTrigger so the
 * nav can never disagree with the rest of the scroll choreography, and only
 * re-renders when the owner changes.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState('')

  useEffect(() => {
    const triggers = new Map<string, ScrollTrigger>()
    // Sections below the fold mount after the nav, so (re)bind on every refresh.
    const bind = () =>
      ids.forEach((id) => {
        const el = document.getElementById(id)
        const existing = triggers.get(id)
        if (existing && existing.trigger === el) return
        existing?.kill()
        if (!el) return
        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) setActive(id)
            else setActive((current) => (current === id ? '' : current))
          },
        })
        triggers.set(id, st)
      })

    bind()
    ScrollTrigger.addEventListener('refreshInit', bind)
    return () => {
      ScrollTrigger.removeEventListener('refreshInit', bind)
      triggers.forEach((t) => t.kill())
    }
  }, [ids])

  return active
}
