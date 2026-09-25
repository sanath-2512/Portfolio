import { Fragment, useLayoutEffect, useRef } from 'react'
import { experience } from '@/data/content'
import { gsap } from '@/lib/gsap'
import { MQ } from '@/lib/motion'
import { cx } from '@/lib/utils'
import { DetectBox } from '@/components/motion/DetectBox'
import { TodoNote } from '@/components/ui/Todo'

const { pipeline } = experience

/**
 * The Fusion Cards retrieval pipeline, system level only. A query packet
 * travels the line as you scroll and each stage is DETECTed as it passes.
 * The list itself is the text alternative.
 */
export function ArchitectureStrip({ focus = [] }: { focus?: string[] }) {
  const root = useRef<HTMLDivElement | null>(null)
  const packet = useRef<HTMLSpanElement | null>(null)

  useLayoutEffect(() => {
    const scope = root.current
    if (!scope) return
    const nodes = Array.from(scope.querySelectorAll<HTMLElement>('.strip-node'))
    const mm = gsap.matchMedia(scope)

    const run = (axis: 'x' | 'y') => {
      const track = packet.current?.parentElement
      if (!track || !packet.current) return
      const light = (p: number) =>
        nodes.forEach((n, i) => n.classList.toggle('is-on', p >= i / Math.max(1, nodes.length - 1) - 0.001))
      gsap.fromTo(
        packet.current,
        { x: 0, y: 0 },
        {
          ...(axis === 'x' ? { x: () => track.offsetWidth } : { y: () => track.offsetHeight }),
          ease: 'none',
          scrollTrigger: {
            trigger: scope,
            start: 'top 78%',
            end: 'bottom 45%',
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => light(self.progress),
          },
        },
      )
    }

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => run('x'))
    mm.add(MQ.mobile, () => run('y'))
    mm.add(MQ.reduced, () => nodes.forEach((n) => n.classList.add('is-on')))
    return () => mm.revert()
  }, [])

  return (
    <div ref={root} className="relative mt-16 border-y border-line bg-bg py-10 lg:py-14">
      <div className="shell">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-[clamp(1.3rem,2.4vw,2rem)] font-bold uppercase leading-none" style={{ fontVariationSettings: "'wdth' 120" }}>
            {pipeline.phases.map((ph, i) => (
              <Fragment key={ph.id}>
                {i > 0 ? <span className="text-ink-muted"> → </span> : null}
                {ph.label}
              </Fragment>
            ))}
          </p>
          <p className="mono text-ink-muted">
            <span className="border border-line-strong px-1.5 py-0.5 text-ink">{pipeline.label}</span>
            <span className="ml-3">System level · no client detail</span>
          </p>
        </div>
        <p className="mt-3 text-ink-muted">{pipeline.caption}</p>
        {import.meta.env.DEV ? <TodoNote item={pipeline.orderNote} label="Confirm stage order" className="mt-3" /> : null}

        {/* phase bands over the stages they group */}
        <div className="mt-10 hidden grid-cols-9 gap-x-3 lg:grid" aria-hidden="true">
          {pipeline.phases.map((ph) => (
            <p
              key={ph.id}
              className="mono mono-sm border-t-2 border-ink pt-2 text-ink"
              style={{ gridColumn: `${ph.from + 1} / ${ph.to + 1}` }}
            >
              {ph.label}
            </p>
          ))}
        </div>

        <div className="relative mt-6">
          {/* the line and the packet */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[7px] top-0 w-px bg-line-strong lg:bottom-auto lg:left-0 lg:right-0 lg:top-[7px] lg:h-px lg:w-auto"
          >
            <span
              ref={packet}
              className="absolute -left-[4px] -top-[4px] h-[9px] w-[9px] bg-signal"
            />
          </div>

          <ol
            className="relative grid grid-cols-1 gap-y-6 lg:grid-cols-9 lg:gap-x-3"
            aria-label="Fusion Cards retrieval pipeline, simplified, in order"
          >
            {pipeline.stages.map((stage, i) => (
              <li
                key={stage.id}
                className={cx(
                  'strip-node detect-host relative pl-8 transition-opacity duration-300 lg:pl-0 lg:pt-8',
                  focus.length > 0 && !focus.includes(stage.id) && 'strip-dim',
                  focus.includes(stage.id) && 'strip-focus',
                )}
              >
                {pipeline.phases.some((ph) => ph.from === i) ? (
                  <p className="mono mono-sm mb-2 text-ink lg:hidden">{pipeline.phases.find((ph) => ph.from === i)?.label}</p>
                ) : null}
                <span
                  aria-hidden="true"
                  className={cx(
                    'absolute left-[3px] top-1 h-[9px] w-[9px] border lg:left-0 lg:top-[3px]',
                    stage.touched ? 'border-signal bg-signal' : 'border-ink-muted bg-bg',
                  )}
                />
                <p className="mono mono-sm text-ink-muted">{String(i + 1).padStart(2, '0')}</p>
                <p className="mt-1 text-[15px] font-medium leading-tight">
                  <DetectBox>{stage.label}</DetectBox>
                </p>
                {stage.note ? <p className="mono mono-sm mt-1 text-measure">{stage.note}</p> : null}
                {stage.touched ? (
                  <p className="mono mono-sm mt-1 text-ink">
                    <span aria-hidden="true" className="mr-1.5 inline-block h-1.5 w-1.5 bg-signal align-middle" />
                    {stage.touched === 'improved' ? 'Improved' : 'Proposed changes'}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
        <p className="mono mono-sm mt-8 text-ink-muted">
          <span aria-hidden="true" className="mr-1.5 inline-block h-1.5 w-1.5 bg-signal align-middle" />
          Stages I worked on: chunking (improved) · scraper, extractor, chunking (architecture proposals)
        </p>
      </div>
    </div>
  )
}
