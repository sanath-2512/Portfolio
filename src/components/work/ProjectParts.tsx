import type { ReactNode } from 'react'
import type { Maybe, ProjectLinks } from '@/data/content'
import { cx } from '@/lib/utils'
import { Known } from '@/components/ui/Todo'
import { StretchText } from '@/components/motion/StretchText'

/** Project masthead: number, name, one-liner, and the mono meta line. */
export function ProjectHead({
  id,
  no,
  name,
  oneLiner,
  meta,
  className,
}: {
  id: string
  no: string
  name: string
  oneLiner: string
  meta: string[]
  className?: string
}) {
  return (
    <header className={cx('grid12 gap-y-4', className)}>
      <p className="mono col-span-4 text-ink-muted md:col-span-12">
        <span className="text-ink">{no}</span> / {meta.join(' · ')}
      </p>
      <h3 id={`${id}-title`} className="col-span-4 text-[clamp(2.75rem,7vw,6.5rem)] font-extrabold uppercase leading-[0.9] md:col-span-7" style={{ fontVariationSettings: "'wdth' 118" }}>
        {name}
      </h3>
      <p className="col-span-4 self-end text-[clamp(1.1rem,1.5vw,1.3rem)] leading-snug md:col-span-5">{oneLiner}</p>
    </header>
  )
}

/** Problem / solution / challenge / outcome — labelled in mono. */
export function Facts({
  items,
  className,
  columns = 2,
}: {
  items: Array<{ k: string; v: ReactNode }>
  className?: string
  columns?: 1 | 2 | 4
}) {
  return (
    <dl
      className={cx(
        'grid gap-x-8 gap-y-6',
        columns === 4 ? 'md:grid-cols-2 xl:grid-cols-4' : columns === 2 ? 'md:grid-cols-2' : '',
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.k} className="border-t border-line pt-3">
          <dt className="mono text-ink-muted">{item.k}</dt>
          <dd className="mt-2 max-w-[62ch] text-[16px] leading-relaxed">{item.v}</dd>
        </div>
      ))}
    </dl>
  )
}

export function StackLine({ items, className }: { items: string[]; className?: string }) {
  return (
    <p className={cx('mono leading-relaxed text-ink-muted', className)}>
      <span className="text-ink">Stack</span> — {items.join(' · ')}
    </p>
  )
}

/** GitHub / live demo as mono text links; unknown links show as dev TODOs. */
export function ProjectLinksRow({
  links,
  extra,
  className,
}: {
  links: ProjectLinks | { github: Maybe<string>; demo: Maybe<string> }
  extra?: ReactNode
  className?: string
}) {
  return (
    <div className={cx('flex flex-wrap items-center gap-x-6 gap-y-1', className)}>
      <Known value={links.github} label="GitHub URL">
        {(href) => (
          <a href={href} target="_blank" rel="noreferrer" className="link mono stretch-host">
            <StretchText reserve to={112}>
              <span className="link-rule">GitHub</span>
            </StretchText>{' '}
            ↗
          </a>
        )}
      </Known>
      <Known value={links.demo} label="Live demo URL">
        {(href) => (
          <a href={href} target="_blank" rel="noreferrer" className="link mono stretch-host">
            <StretchText reserve to={112}>
              <span className="link-rule">Live demo</span>
            </StretchText>{' '}
            ↗
          </a>
        )}
      </Known>
      {extra}
    </div>
  )
}
