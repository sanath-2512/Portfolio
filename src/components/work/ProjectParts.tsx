import type { ReactNode } from 'react'
import type { Maybe, ProjectLinks, StoryRow } from '@/data/content'
import { cx } from '@/lib/utils'
import { Known } from '@/components/ui/Todo'
import { StretchText } from '@/components/motion/StretchText'

/**
 * Project masthead: `01 / WORTHYAPPLY` in mono, the kicker as the headline,
 * and an optional one-liner. The kicker says what the project is *about*.
 */
export function ProjectHead({
  id,
  no,
  name,
  kicker,
  oneLiner,
  meta,
  className,
}: {
  id: string
  no: string
  name: string
  kicker: string
  oneLiner?: ReactNode
  meta: string[]
  className?: string
}) {
  return (
    <header className={cx('grid12 gap-y-5', className)}>
      <p className="mono col-span-4 flex flex-wrap items-baseline gap-x-3 text-ink-muted md:col-span-12">
        <span className="text-ink">
          {no} / {name.toUpperCase()}
        </span>
        <span aria-hidden="true">·</span>
        <span>{meta.join(' · ')}</span>
      </p>
      <h3
        id={`${id}-title`}
        className="col-span-4 max-w-[20ch] text-[clamp(2.25rem,5.2vw,5.25rem)] font-extrabold uppercase leading-[0.92] md:col-span-12"
        style={{ fontVariationSettings: "'wdth' 116" }}
      >
        <span className="sr-only">{name}: </span>
        {kicker}
      </h3>
      {oneLiner ? (
        <div className="col-span-4 max-w-[52ch] text-[clamp(1.1rem,1.6vw,1.4rem)] leading-snug md:col-span-9 lg:col-span-8">{oneLiner}</div>
      ) : null}
    </header>
  )
}

/**
 * Level 1: the short story, in a fixed order (what it is, why, the
 * interesting problem, how it works, what I learned). Rows are optional.
 */
export function Story({ rows, className }: { rows: StoryRow[]; className?: string }) {
  return (
    <dl className={cx('grid content-start gap-y-8 self-start', className)}>
      {rows.map((row) => (
        <div key={row.k} className="grid gap-x-8 gap-y-2 border-t border-line pt-4 md:grid-cols-[180px_minmax(0,1fr)]">
          <dt className="mono text-ink-muted">{row.k}</dt>
          <dd className="grid max-w-[60ch] content-start gap-3 text-[clamp(1.05rem,1.35vw,1.2rem)] leading-relaxed">
            {(Array.isArray(row.v) ? row.v : [row.v]).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </dd>
        </div>
      ))}
    </dl>
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
