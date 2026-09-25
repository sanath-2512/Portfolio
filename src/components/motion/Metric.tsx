import { useEffect, useRef, type ReactNode } from 'react'
import type { SourceKey } from '@/data/content'
import { ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion, cx } from '@/lib/utils'
import { Citation } from '@/components/motion/Citation'

/**
 * A number, DETECTed and cited. Inline (default) it carries a compact [n]
 * mark that opens the source; `tagged` prints the long form —
 * [1] FUSION CARDS INTERNSHIP — as the DETECT tag, for numbers that stand alone.
 */
export function Metric({
  children,
  source,
  tagged = false,
  className,
}: {
  children: ReactNode
  source: SourceKey
  tagged?: boolean
  className?: string
}) {
  const ref = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      el.classList.add('is-on')
      return
    }
    const st = ScrollTrigger.create({ trigger: el, start: 'top 82%', once: true, onEnter: () => el.classList.add('is-on') })
    return () => st.kill()
  }, [])

  return (
    <span className={cx('whitespace-nowrap', className)}>
      <span ref={ref} className="detect text-measure">
        <span className="detect-box" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        {tagged ? (
          <span className="detect-tag">
            <Citation k={source} variant="tag" />
          </span>
        ) : null}
        {children}
      </span>
      {tagged ? null : <Citation k={source} className="ml-1.5" />}
    </span>
  )
}
