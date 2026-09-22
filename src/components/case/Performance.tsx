import { useEffect, useRef } from 'react'
import { worthyApply, whyNotes } from '@/data/content'
import { useGsapContext } from '@/hooks/useGsapContext'
import { gsap } from '@/lib/gsap'
import { countUp, DUR, EASE } from '@/lib/motion'
import { prefersReducedMotion } from '@/lib/utils'
import { WhyNote } from '@/components/ui/WhyNote'

const { before, after, reduction, note } = worthyApply.performance
const RATIO = after.seconds / before.seconds

/**
 * The latency story: three sequential calls collapsing into one pipeline.
 * Bar lengths are proportional to measured seconds; the segments show how
 * many calls were made, not how long each one took.
 */
export function Performance() {
  const root = useRef<HTMLDivElement | null>(null)
  const scrubRef = useRef<HTMLSpanElement | null>(null)
  const headlineRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (scrubRef.current) {
      countUp(scrubRef.current, after.seconds, {
        from: before.seconds,
        decimals: 2,
        suffix: 's',
        scrub: true,
        trigger: root.current,
        start: 'top 78%',
        end: 'center 45%',
      })
    }
    if (headlineRef.current) {
      countUp(headlineRef.current, reduction, {
        decimals: 1,
        suffix: '%',
        trigger: root.current,
        start: 'top 70%',
      })
    }
  }, [])

  useGsapContext(root, () => {
    const trigger = root.current
    if (prefersReducedMotion()) {
      gsap.set('.perf-bar', { scaleX: 1 })
      return
    }
    gsap.fromTo(
      '.perf-bar',
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: DUR.long,
        ease: EASE,
        stagger: 0.08,
        scrollTrigger: { trigger, start: 'top 72%', once: true },
      },
    )
    gsap.fromTo(
      '.perf-meta',
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: DUR.base,
        ease: EASE,
        stagger: 0.1,
        scrollTrigger: { trigger, start: 'top 72%', once: true },
      },
    )
  })

  return (
    <div ref={root}>
      <h3 className="mono text-fg-faint">Performance</h3>

      <div className="grid12 mt-8 gap-y-12">
        <div className="col-span-4 md:col-span-5">
          <p className="numeric font-display text-[clamp(4.5rem,13vw,10rem)] font-bold leading-[0.82] tracking-tighter text-accent">
            <span ref={headlineRef}>{reduction.toFixed(1)}%</span>
          </p>
          <p className="perf-meta mt-5 max-w-[34ch] text-[15px] leading-relaxed text-fg-dim">
            lower average latency after combining three sequential analysis calls into one pipeline.
          </p>
          <p className="perf-meta mono mt-8 text-fg-faint">Average latency</p>
          <p className="numeric mt-2 font-display text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight text-fg">
            <span ref={scrubRef}>{before.seconds.toFixed(2)}s</span>
          </p>
        </div>

        <div className="col-span-4 md:col-span-6 md:col-start-7">
          {/* Before — three segments, one per sequential call */}
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <p className="mono text-fg-faint">Before</p>
              <p className="numeric mono text-fg">{before.seconds.toFixed(2)}s</p>
            </div>
            {/* A waterfall: each call only starts once the previous one ends. */}
            <div className="mt-3 flex flex-col gap-1.5" aria-hidden="true">
              {Array.from({ length: before.bars }).map((_, index) => (
                <div
                  key={index}
                  className="perf-bar h-5 origin-left bg-fg-faint"
                  style={{
                    width: `${100 / before.bars}%`,
                    marginLeft: `${(index * 100) / before.bars}%`,
                  }}
                />
              ))}
            </div>
            <p className="perf-meta mt-3 text-[13px] text-fg-dim">{before.label}</p>
          </div>

          {/* After — one bar, proportional to the same scale */}
          <div className="mt-10">
            <div className="flex items-baseline justify-between gap-4">
              <p className="mono text-accent">After</p>
              <p className="numeric mono text-accent">{after.seconds.toFixed(2)}s</p>
            </div>
            <div className="mt-3 flex" aria-hidden="true">
              <div className="perf-bar h-5 origin-left bg-accent" style={{ width: `${RATIO * 100}%` }} />
            </div>
            <p className="perf-meta mt-3 text-[13px] text-fg-dim">{after.label}</p>
          </div>

          <p className="perf-meta mt-8 max-w-[52ch] border-t border-line pt-4 text-[13px] leading-relaxed text-fg-faint">
            {note} Bar length is proportional to measured seconds; the segments above show the number of
            calls, not per-call timing.
          </p>
        </div>
      </div>

      <WhyNote note={whyNotes.combined} className="perf-meta mt-14" />
    </div>
  )
}
