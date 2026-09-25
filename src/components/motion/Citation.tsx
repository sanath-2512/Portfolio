import { useEffect, useId, useRef, useState } from 'react'
import { sources, type Source, type SourceKey } from '@/data/content'
import { cx } from '@/lib/utils'

/**
 * A citation, the way a grounded RAG answer cites its documents. Opens on
 * hover, keyboard focus or tap; links out when the source is public.
 * `variant="tag"` prints the long form used as a DETECT tag on numbers.
 */
export function Citation({ k, variant = 'mark', className }: { k: SourceKey; variant?: 'mark' | 'tag'; className?: string }) {
  const source: Source = sources[k]
  const [open, setOpen] = useState(false)
  const [alignRight, setAlignRight] = useState(false)
  const id = useId()
  const root = useRef<HTMLSpanElement | null>(null)
  const button = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!open) return
    const rect = root.current?.getBoundingClientRect()
    if (rect) setAlignRight(rect.left > window.innerWidth - 300)
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      // Closing removes the link; don't let focus fall back to <body>.
      if (root.current?.contains(document.activeElement)) button.current?.focus()
      setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const label = variant === 'tag' ? `[${source.n}] ${source.label}` : `[${source.n}]`

  return (
    <span
      ref={root}
      className={cx('relative inline-block', className)}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button
        ref={button}
        type="button"
        className={variant === 'tag' ? 'mono mono-sm tap -my-3 inline-flex items-center text-measure' : 'cite'}
        aria-expanded={open}
        aria-controls={id}
        aria-label={`Source ${source.n}: ${source.label}`}
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
      >
        {label}
      </button>
      {open ? (
        <span
          id={id}
          role="note"
          className="cite-pop mono block"
          style={{ top: 'calc(100% + 2px)', ...(alignRight ? { right: 0 } : { left: 0 }) }}
        >
          <span className="block text-measure">
            [{source.n}] {source.label}
          </span>
          <span className="mt-1 block text-ink-muted">{source.detail}</span>
          {source.href ? (
            <a href={source.href} target="_blank" rel="noreferrer" className="link text-ink">
              <span className="link-rule">View source</span> ↗
            </a>
          ) : null}
        </span>
      ) : null}
    </span>
  )
}
