import { useLayoutEffect, useRef } from 'react'
import type { FlowNode } from '@/data/content'
import { gsap } from '@/lib/gsap'
import { MQ } from '@/lib/motion'
import { cx } from '@/lib/utils'

/**
 * A project's architecture as one line of steps. A packet travels it as you
 * scroll and each step registers as the packet reaches it, so the order of
 * the system is read, not just seen. Vertical by default; `horizontal` lays
 * it out left to right from the lg breakpoint.
 */
export function Flow({
  nodes,
  label,
  horizontal = false,
  className,
}: {
  nodes: FlowNode[]
  label: string
  horizontal?: boolean
  className?: string
}) {
  const root = useRef<HTMLDivElement | null>(null)
  const packet = useRef<HTMLSpanElement | null>(null)

  useLayoutEffect(() => {
    const scope = root.current
    if (!scope || !packet.current) return
    const steps = Array.from(scope.querySelectorAll<HTMLElement>('.flow-step'))
    const light = (p: number) =>
      steps.forEach((s, i) => s.classList.toggle('is-on', p >= i / Math.max(1, steps.length - 1) - 0.001))
    const mm = gsap.matchMedia(scope)
    const run = (axis: 'x' | 'y') => {
      const track = packet.current!.parentElement!
      gsap.fromTo(
        packet.current,
        { x: 0, y: 0 },
        {
          ...(axis === 'x' ? { x: () => track.offsetWidth } : { y: () => track.offsetHeight }),
          ease: 'none',
          scrollTrigger: {
            trigger: scope,
            start: 'top 75%',
            end: axis === 'x' ? 'bottom 55%' : 'bottom 60%',
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => light(self.progress),
          },
        },
      )
    }
    if (horizontal) {
      mm.add(MQ.desktop, () => run('x'))
      mm.add(MQ.mobile, () => run('y'))
    } else {
      mm.add(MQ.motion, () => run('y'))
    }
    mm.add(MQ.reduced, () => light(1))
    return () => mm.revert()
  }, [horizontal])

  const h = horizontal
  return (
    <div ref={root} className={cx('relative', className)}>
      <div
        aria-hidden="true"
        className={cx(
          'absolute w-px bg-line-strong',
          h ? 'bottom-3 left-[7px] top-3 lg:bottom-auto lg:left-0 lg:right-0 lg:top-[7px] lg:h-px lg:w-auto' : 'bottom-3 left-[7px] top-3',
        )}
      >
        <span ref={packet} className="absolute -left-[4px] -top-[4px] h-[9px] w-[9px] bg-signal" />
      </div>
      <ol
        aria-label={label}
        className={cx('relative grid', h ? 'gap-y-5 lg:grid-flow-col lg:auto-cols-fr lg:gap-x-4' : 'gap-y-5')}
      >
        {nodes.map((n, i) => (
          <li key={n.label} className={cx('flow-step relative pl-8', h && 'lg:pl-0 lg:pt-8')}>
            <span
              aria-hidden="true"
              className={cx(
                'flow-dot absolute left-[3px] top-[5px] h-[9px] w-[9px] border bg-bg',
                h && 'lg:left-0 lg:top-[3px]',
                n.tone === 'signal' ? 'border-signal' : n.tone === 'measure' ? 'border-measure' : 'border-ink-muted',
              )}
              data-tone={n.tone}
            />
            <p className="mono mono-sm text-ink-muted">{String(i + 1).padStart(2, '0')}</p>
            <p className="flow-label mt-0.5 text-[clamp(1.05rem,1.5vw,1.3rem)] font-semibold uppercase leading-tight" style={{ fontVariationSettings: "'wdth' 108" }}>
              {n.label}
            </p>
            {n.note ? <p className="mono mono-sm mt-1 text-ink-muted normal-case tracking-[0.02em]">{n.note}</p> : null}
          </li>
        ))}
      </ol>
    </div>
  )
}
