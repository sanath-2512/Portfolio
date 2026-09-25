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
    const triggers = ids
      .map((id) => {
        const el = document.getElementById(id)
        if (!el) return null
        return ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) setActive(id)
            else setActive((current) => (current === id ? '' : current))
          },
        })
      })
      .filter(Boolean) as ScrollTrigger[]

    return () => triggers.forEach((t) => t.kill())
  }, [ids])

  return active
}
