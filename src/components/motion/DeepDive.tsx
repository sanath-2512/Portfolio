import { useId, useRef, useState, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { DUR, EASE } from '@/lib/motion'
import { cx, prefersReducedMotion } from '@/lib/utils'

/**
 * Level 3 of every project. The technical detail stays on the page — it is
 * just folded until someone asks for it. Opening re-measures the page so the
 * field, the ruler and every trigger below stay aligned.
 */
export function DeepDive({
  label = 'Deep dive',
  summary,
  children,
  className,
}: {
  label?: string
  /** What's inside, shown next to the button so nobody opens it blind. */
  summary?: string
  children: ReactNode
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const panel = useRef<HTMLDivElement | null>(null)
  const button = useRef<HTMLButtonElement | null>(null)
  const id = useId()

  const settle = () => requestAnimationFrame(() => ScrollTrigger.refresh())

  const toggle = () => {
    const el = panel.current
    if (!el) return
    const next = !open
    setOpen(next)
    if (prefersReducedMotion()) {
      el.hidden = !next
      settle()
      return
    }
    gsap.killTweensOf(el)
    if (next) {
      el.hidden = false
      gsap.fromTo(
        el,
        { height: 0, clipPath: 'inset(0 0 100% 0)' },
        {
          height: 'auto',
          clipPath: 'inset(0 0 0% 0)',
          duration: DUR.in,
          ease: EASE,
          onComplete: () => {
            gsap.set(el, { clearProps: 'height,clipPath' })
            settle()
          },
        },
      )
    } else {
      gsap.to(el, {
        height: 0,
        clipPath: 'inset(0 0 100% 0)',
        duration: DUR.micro * 1.6,
        ease: 'power2.in',
        onComplete: () => {
          el.hidden = true
          gsap.set(el, { clearProps: 'height,clipPath' })
          settle()
        },
      })
    }
  }

  return (
    <div className={cx('border-t border-line-strong', className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4">
        <button
          ref={button}
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={toggle}
          className="stretch-host group inline-flex min-h-[48px] items-center gap-3 text-left"
        >
          <span
            aria-hidden="true"
            className={cx(
              'grid h-7 w-7 place-items-center border border-ink font-mono text-[14px] transition-colors duration-300',
              open ? 'bg-ink text-bg' : 'group-hover:bg-ink group-hover:text-bg',
            )}
          >
            {open ? '−' : '+'}
          </span>
          <span className="stretch mono text-[13px] text-ink" style={{ '--wdth-to': 125 } as React.CSSProperties}>
            {open ? `Close ${label.toLowerCase()}` : label}
          </span>
        </button>
        {summary ? <p className="mono mono-sm max-w-[60ch] text-ink-muted">{summary}</p> : null}
      </div>
      <div ref={panel} id={id} hidden className="overflow-hidden">
        <div className="pb-10 pt-2">{children}</div>
      </div>
    </div>
  )
}
