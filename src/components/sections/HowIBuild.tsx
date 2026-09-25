import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { processStages, processTabs } from '@/data/content'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { DUR, EASE, STAGGER, WDTH } from '@/lib/motion'
import { scrollToId } from '@/lib/smoothScroll'
import { cx, prefersReducedMotion } from '@/lib/utils'
import { SectionFrame } from '@/components/global/SectionFrame'
import { StretchHeading } from '@/components/motion/StretchHeading'
import { StretchText } from '@/components/motion/StretchText'

const anchors: Record<string, string> = { worthyapply: 'worthyapply', eduai: 'eduai', agrimind: 'agrimind', fusion: 'experience' }

/**
 * §05 How I build. Seven stages on one measured line; the tabs swap what
 * each stage looked like on a real project. Stages a project didn't have
 * stay dim — nothing is padded to fill the row.
 */
export default function HowIBuild() {
  const [index, setIndex] = useState(0)
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  const line = useRef<HTMLDivElement | null>(null)
  const panel = useRef<HTMLDivElement | null>(null)
  const uid = useId()
  const tab = processTabs[index]

  // The line MEASUREs in once, then the nodes register one by one.
  useLayoutEffect(() => {
    const el = line.current
    if (!el || prefersReducedMotion()) return
    const rule = el.querySelector('.proc-rule')
    const nodes = el.querySelectorAll('.proc-node')
    gsap.set(rule, { scaleX: 0, scaleY: 0 })
    gsap.set(nodes, { scale: 0 })
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(rule, { scaleX: 1, scaleY: 1, duration: DUR.in, ease: EASE })
        gsap.to(nodes, { scale: 1, duration: DUR.micro, ease: 'power2.out', stagger: 0.08, delay: 0.2 })
      },
    })
    return () => {
      st.kill()
      gsap.set([rule, ...nodes], { clearProps: 'transform' })
    }
  }, [])

  // STRETCH-crossfade the captions on every tab change.
  useLayoutEffect(() => {
    if (!panel.current || prefersReducedMotion()) return
    const caps = panel.current.querySelectorAll('.proc-cap')
    const tween = gsap.fromTo(
      caps,
      { opacity: 0, '--wdth': WDTH.min },
      { opacity: 1, '--wdth': WDTH.rest, duration: 0.55, ease: EASE, stagger: STAGGER * 0.6 },
    )
    return () => {
      tween.kill()
    }
  }, [index])

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = processTabs.length - 1
    const next =
      e.key === 'ArrowRight' ? (index === last ? 0 : index + 1) : e.key === 'ArrowLeft' ? (index === 0 ? last : index - 1) : e.key === 'Home' ? 0 : e.key === 'End' ? last : null
    if (next === null) return
    e.preventDefault()
    setIndex(next)
    tabs.current[next]?.focus()
  }

  return (
    <SectionFrame id="process" className="section-pad relative z-10">
      <div className="shell mt-12 lg:mt-16">
        <StretchHeading id="process-title" className="max-w-[20ch]">
          I build <span className="text-signal">systems</span> around models, not just calls to them.
        </StretchHeading>

        <div role="tablist" aria-label="Project" className="mt-12 flex flex-wrap gap-x-1 gap-y-2 border-b border-line">
          {processTabs.map((t, i) => {
            const selected = i === index
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabs.current[i] = el
                }}
                role="tab"
                id={`${uid}-tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`${uid}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setIndex(i)}
                onKeyDown={onKey}
                className={cx(
                  'stretch-host relative -mb-px min-h-[48px] px-4 text-[16px] font-medium transition-colors duration-300',
                  selected ? 'text-ink' : 'text-ink-muted hover:text-ink',
                )}
              >
                <StretchText reserve to={120}>
                  {t.label}
                </StretchText>
                <span
                  aria-hidden="true"
                  className={cx('absolute inset-x-3 bottom-0 h-[2px] bg-signal transition-transform duration-300', selected ? 'scale-x-100' : 'scale-x-0')}
                />
              </button>
            )
          })}
        </div>

        <div ref={line} className="relative mt-14">
          {/* the measured line */}
          <div
            aria-hidden="true"
            className="proc-rule absolute bottom-3 left-[7px] top-3 w-px origin-top bg-ink-muted lg:bottom-auto lg:left-[calc(100%/14)] lg:right-[calc(100%/14)] lg:top-[7px] lg:h-px lg:w-auto lg:origin-left"
          />
          <div
            ref={panel}
            role="tabpanel"
            id={`${uid}-panel`}
            aria-labelledby={`${uid}-tab-${tab.id}`}
            tabIndex={0}
            className="focus-visible:outline-offset-8"
          >
            <ol className="relative grid gap-y-6 lg:grid-cols-7 lg:gap-x-4">
              {processStages.map((stage, i) => {
                const text = tab.steps[stage]
                return (
                  <li
                    key={stage}
                    className="relative grid grid-cols-[22px_1fr] gap-3 lg:block lg:text-center"
                    aria-hidden={text ? undefined : true}
                  >
                    <span
                      className={cx(
                        'proc-node relative z-[1] block h-[15px] w-[15px] border lg:mx-auto',
                        text ? 'border-ink bg-ink' : 'border-dashed border-ink-muted bg-bg',
                      )}
                    />
                    <div className="lg:mt-4">
                      <p className="mono text-ink-muted">
                        {String(i + 1).padStart(2, '0')} <span className={text ? 'text-ink' : undefined}>{stage}</span>
                      </p>
                      {text ? (
                        <p key={`${tab.id}-${stage}`} className="proc-cap wdth mt-2 text-[15px] leading-snug lg:mx-auto lg:max-w-[22ch]">
                          {text}
                        </p>
                      ) : null}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        <p className="mt-12">
          <a
            href={`#${anchors[tab.id]}`}
            onClick={(e) => {
              e.preventDefault()
              scrollToId(anchors[tab.id])
            }}
            className="link mono stretch-host text-ink"
          >
            <StretchText reserve to={112}>
              <span className="link-rule">See {tab.label} in full</span>
            </StretchText>{' '}
            ↑
          </a>
        </p>
      </div>
    </SectionFrame>
  )
}
