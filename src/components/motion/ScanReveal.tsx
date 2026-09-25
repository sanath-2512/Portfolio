import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { scan } from '@/lib/motion'
import { prefersReducedMotion, cx } from '@/lib/utils'

/**
 * SCAN: a 1px measure beam sweeps across and reveals the content behind it.
 * Plays once when the block enters the viewport (`start`), or never when
 * `manual` — the caller then drives `scan()` itself.
 */
export function ScanReveal({
  children,
  axis = 'x',
  start = 'top 82%',
  delay = 0,
  className,
  contentClassName,
}: {
  children: ReactNode
  axis?: 'x' | 'y'
  start?: string
  delay?: number
  className?: string
  contentClassName?: string
}) {
  const root = useRef<HTMLDivElement | null>(null)
  const content = useRef<HTMLDivElement | null>(null)
  const beam = useRef<HTMLSpanElement | null>(null)

  useLayoutEffect(() => {
    const el = content.current
    if (!el || !root.current || prefersReducedMotion()) return
    gsap.set(el, { clipPath: axis === 'x' ? 'inset(0 100% 0 0)' : 'inset(0 0 100% 0)' })
    let tl: gsap.core.Timeline | null = null
    const st = ScrollTrigger.create({
      trigger: root.current,
      start,
      once: true,
      onEnter: () => {
        tl = scan(el, beam.current, { axis, delay })
      },
    })
    return () => {
      st.kill()
      tl?.kill()
      gsap.set(el, { clearProps: 'clipPath' })
    }
  }, [axis, start, delay])

  return (
    <div ref={root} className={cx('relative', className)}>
      <div ref={content} className={contentClassName}>
        {children}
      </div>
      <span
        ref={beam}
        aria-hidden="true"
        className="scan-beam"
        style={axis === 'y' ? { width: 'auto', right: 0, bottom: 'auto', height: 1 } : undefined}
      />
    </div>
  )
}
