import type { ReactNode } from 'react'
import { cx } from '@/lib/utils'

interface SectionHeaderProps {
  index: string
  label: string
  title: ReactNode
  lead?: ReactNode
  className?: string
  /** Extra class for the title element, e.g. a larger display size. */
  titleClassName?: string
}

export function SectionHeader({
  index,
  label,
  title,
  lead,
  className,
  titleClassName = 'display-lg',
}: SectionHeaderProps) {
  return (
    <div className={cx('reveal-group', className)}>
      <div className="flex items-center gap-4 border-t border-line pt-4">
        <span className="mono text-accent">{index}</span>
        <span className="mono text-fg-faint">{label}</span>
      </div>
      <h2 className={cx('mt-8 max-w-[18ch] text-fg', titleClassName)}>{title}</h2>
      {lead ? <p className="body-lg mt-6 max-w-[52ch]">{lead}</p> : null}
    </div>
  )
}
