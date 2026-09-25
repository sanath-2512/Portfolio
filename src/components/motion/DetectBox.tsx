import type { ReactNode } from 'react'
import { cx } from '@/lib/utils'

/**
 * DETECT: thin corner brackets draw in around a term, with a tiny mono tag.
 * Turned on by adding `.is-on` (a parent's scroll trigger, or `on`).
 */
export function DetectBox({
  tag,
  on,
  className,
  children,
}: {
  tag?: ReactNode
  on?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <span className={cx('detect', on && 'is-on', className)} data-detect="">
      <span className="detect-box" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      {tag ? (
        <span className="detect-tag" aria-hidden="true">
          {tag}
        </span>
      ) : null}
      {children}
    </span>
  )
}
