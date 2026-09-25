import type { CSSProperties, ReactNode } from 'react'
import { cx } from '@/lib/utils'

/**
 * STRETCH: width axis widens on hover / focus of the nearest `.stretch-host`
 * (or the element itself). `reserve` keeps a hidden copy at full width so
 * neighbours don't move while it animates.
 */
export function StretchText({
  children,
  to = 125,
  reserve = false,
  className,
}: {
  children: ReactNode
  to?: number
  reserve?: boolean
  className?: string
}) {
  const style = { '--wdth-to': to } as CSSProperties
  if (!reserve) {
    return (
      <span className={cx('stretch', className)} style={style}>
        {children}
      </span>
    )
  }
  return (
    <span className={cx('inline-grid', className)} style={style}>
      <span
        aria-hidden="true"
        className="invisible col-start-1 row-start-1 whitespace-nowrap"
        style={{ fontVariationSettings: `'wdth' ${to}` }}
      >
        {children}
      </span>
      <span className="stretch col-start-1 row-start-1 whitespace-nowrap">{children}</span>
    </span>
  )
}
