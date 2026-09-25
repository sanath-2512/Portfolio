import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { ScrollTrigger } from '@/lib/gsap'
import { measure } from '@/lib/motion'
import { cx } from '@/lib/utils'

/**
 * MEASURE: ├── 49 tests ──┤ — the two half-rules grow outward from the
 * label while the counter runs. Without a real number, pass only `label`.
 */
export function DimensionLine({
  value,
  decimals = 0,
  suffix = '',
  label,
  after,
  start = 'top 85%',
  className,
}: {
  value?: number
  decimals?: number
  suffix?: string
  label: ReactNode
  after?: ReactNode
  start?: string
  className?: string
}) {
  const root = useRef<HTMLDivElement | null>(null)
  const left = useRef<HTMLSpanElement | null>(null)
  const right = useRef<HTMLSpanElement | null>(null)
  const counter = useRef<HTMLSpanElement | null>(null)

  useLayoutEffect(() => {
    if (!root.current || !left.current || !right.current) return
    const tl = measure([left.current, right.current], counter.current, { value, decimals, suffix })
    tl.pause()
    const st = ScrollTrigger.create({ trigger: root.current, start, once: true, onEnter: () => tl.play() })
    return () => {
      st.kill()
      tl.progress(1).kill()
    }
  }, [value, decimals, suffix, start])

  return (
    <div ref={root} className={cx('dim', className)}>
      <span className="dim-end" aria-hidden="true" />
      <span ref={left} className="dim-rule" style={{ '--from': '100%' } as CSSProperties} aria-hidden="true" />
      <span className="mono whitespace-nowrap">
        {value !== undefined ? (
          <span ref={counter} className="tabular-nums">
            {value.toFixed(decimals)}
            {suffix}
          </span>
        ) : null}
        {value !== undefined ? ' ' : null}
        {label}
        {after}
      </span>
      <span ref={right} className="dim-rule" style={{ '--from': '0%' } as CSSProperties} aria-hidden="true" />
      <span className="dim-end" aria-hidden="true" />
    </div>
  )
}
