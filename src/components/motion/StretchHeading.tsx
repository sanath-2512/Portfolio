import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { DUR, EASE, WDTH } from '@/lib/motion'
import { cx, prefersReducedMotion } from '@/lib/utils'

/**
 * STRETCH entrance: the heading arrives ultra-condensed and settles to its
 * resting width as it enters. One emphasised word can rest wider (`rest`).
 */
export function StretchHeading({
  id,
  children,
  rest = WDTH.rest,
  as: Tag = 'h2',
  className,
}: {
  id?: string
  children: ReactNode
  rest?: number
  as?: 'h2' | 'h3'
  className?: string
}) {
  const ref = useRef<HTMLHeadingElement | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--wdth', String(rest))
    if (prefersReducedMotion()) return
    el.style.setProperty('--wdth', String(WDTH.min))
    let tween: gsap.core.Tween | null = null
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        tween = gsap.to(el, { '--wdth': rest, duration: DUR.long, ease: EASE })
      },
    })
    return () => {
      st.kill()
      tween?.kill()
      el.style.setProperty('--wdth', String(rest))
    }
  }, [rest])

  return (
    <Tag ref={ref} id={id} className={cx('h2 wdth', className)}>
      {children}
    </Tag>
  )
}
