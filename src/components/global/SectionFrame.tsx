import { useCallback, useEffect, useRef, type ReactNode, type Ref } from 'react'
import { sections } from '@/data/content'
import { cx } from '@/lib/utils'

const TOTAL = String(sections.length).padStart(2, '0')

/**
 * Every section: mono index top-left (§03 — EXPERIENCE · [03/08]), `+`
 * registration marks on its corners, and the `data-cal` stop the field reads.
 */
export function SectionFrame({
  id,
  children,
  className,
  headerClassName,
  field,
  as: Tag = 'section',
  ref: outerRef,
}: {
  id: string
  children: ReactNode
  className?: string
  headerClassName?: string
  /** Optional field nudge for the whole section. */
  field?: 'chunks' | 'lanes' | 'furrows' | 'dim'
  as?: 'section' | 'header'
  ref?: Ref<HTMLElement>
}) {
  const meta = sections.find((s) => s.id === id)
  const ref = useRef<HTMLElement | null>(null)
  const setRef = useCallback(
    (el: HTMLElement | null) => {
      ref.current = el
      if (typeof outerRef === 'function') outerRef(el)
      else if (outerRef) outerRef.current = el
    },
    [outerRef],
  )

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in')
          io.disconnect()
        }
      },
      { threshold: 0.08 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (!meta) throw new Error(`Unknown section ${id}`)

  return (
    <Tag
      ref={setRef}
      id={id}
      className={cx('frame relative', className)}
      data-cal={meta.cal}
      data-cal-end={meta.calEnd}
      data-field={field}
      aria-labelledby={`${id}-title`}
    >
      <span className="reg" style={{ left: 'var(--gutter)', top: 0, transform: 'translate(-50%,-50%)' }} aria-hidden="true" />
      <span
        className="reg"
        style={{ right: 'calc(var(--gutter) + var(--ruler-w))', top: 0, transform: 'translate(50%,-50%)' }}
        aria-hidden="true"
      />
      <span className="reg" style={{ left: 'var(--gutter)', bottom: 0, transform: 'translate(-50%,50%)' }} aria-hidden="true" />
      <span
        className="reg"
        style={{ right: 'calc(var(--gutter) + var(--ruler-w))', bottom: 0, transform: 'translate(50%,50%)' }}
        aria-hidden="true"
      />

      <div className={cx('shell', headerClassName)}>
        <p className="mono flex items-baseline justify-between gap-4 text-ink-muted">
          <span>
            §{meta.index} — {meta.label}
          </span>
          <span aria-hidden="true">
            [{meta.index}/{TOTAL}]
          </span>
        </p>
      </div>
      {children}
    </Tag>
  )
}
