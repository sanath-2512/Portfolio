import type { ReactNode } from 'react'
import { SectionFrame } from '@/components/global/SectionFrame'

/**
 * Checkpoint scaffold for §02–§08: real headings from the content module,
 * correct ids and field stops, so nav, ruler and the field can be reviewed.
 * Replaced section by section in Phases 3–5.
 */
export function Pending({
  id,
  title,
  children,
  field,
  regions,
}: {
  id: string
  title: ReactNode
  children?: ReactNode
  field?: 'chunks' | 'dim'
  regions?: Array<{ field: 'lanes' | 'furrows'; label: string }>
}) {
  return (
    <SectionFrame id={id} field={field} className="section-pad relative z-10">
      <div className="shell mt-10">
        <h2 id={`${id}-title`} className="h2 max-w-[18ch]">
          {title}
        </h2>
        {children ? <div className="mt-8 max-w-[62ch] text-ink-muted">{children}</div> : null}
        {import.meta.env.DEV ? <p className="todo mt-8">Scaffold — full section lands in the next phase.</p> : null}
      </div>
      {regions?.map((r) => (
        <div key={r.label} data-field={r.field} className="shell flex min-h-[90vh] items-center">
          <p className="mono text-ink-muted">{r.label}</p>
        </div>
      ))}
    </SectionFrame>
  )
}
