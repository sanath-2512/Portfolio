import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from '@/lib/gsap'
import { useFinePointer, useReducedMotion } from '@/hooks/useMediaQuery'
import { clamp, cx } from '@/lib/utils'
import { DUR } from '@/lib/motion'

/** Pulls its child toward the pointer, at most `strength` px. Primary CTAs only. */
export function Magnetic({ children, strength = 10, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const fine = useFinePointer()
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || !fine || reduced) return

    const xTo = gsap.quickTo(el, 'x', { duration: DUR.micro * 1.4, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: DUR.micro * 1.4, ease: 'power3.out' })
    let rect: DOMRect | null = null

    const onEnter = () => {
      gsap.set(el, { x: 0, y: 0 })
      rect = el.getBoundingClientRect()
    }
    const onMove = (e: PointerEvent) => {
      if (!rect) rect = el.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      xTo(clamp(dx * 0.3, -strength, strength))
      yTo(clamp(dy * 0.3, -strength, strength))
    }
    const onLeave = () => {
      rect = null
      xTo(0)
      yTo(0)
    }

    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.set(el, { clearProps: 'transform' })
    }
  }, [fine, reduced, strength])

  return (
    <span ref={ref} className={cx('inline-block will-change-transform', className)}>
      {children}
    </span>
  )
}
