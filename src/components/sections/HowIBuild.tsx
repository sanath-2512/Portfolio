import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { processStages, processTabs } from '@/data/content'
import { gsap } from '@/lib/gsap'
import { EASE, STAGGER, WDTH } from '@/lib/motion'
import { scrollToId } from '@/lib/smoothScroll'
import { cx, prefersReducedMotion } from '@/lib/utils'
import { SectionFrame } from '@/components/global/SectionFrame'
import { StretchHeading } from '@/components/motion/StretchHeading'
import { StretchText } from '@/components/motion/StretchText'

const anchors: Record<string, string> = { worthyapply: 'worthyapply', eduai: 'eduai', agrimind: 'agrimind', fusion: 'experience' }

/**
 * §05 How I build. Six stages on one measured line, revealed in order as the
 * line is read. Below, a project tab shows what each stage looked like on
 * real work — stages a project didn't have stay empty rather than padded.
 */
export default function HowIBuild() {
  const [index, setIndex] = useState(0)
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  const line = useRef<HTMLDivElement | null>(null)
  const panel = useRef<HTMLDivElement | null>(null)
  const uid = useId()
  const tab = processTabs[index]

  // Stages reveal one after another, scrubbed to the scroll: 01 before 02 before 03…
  useLayoutEffect(() => {
    const el = line.current
    if (!el || prefersReducedMotion()) return
    const rule = el.querySelector('.proc-rule')
    const stages = el.querySelectorAll('.proc-stage')
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 60%', scrub: 0.5 },
    })
    tl.fromTo(rule, { scaleX: 0, scaleY: 0 }, { scaleX: 1, scaleY: 1, ease: 'none', duration: stages.length }, 0)
    stages.forEach((stage, i) => {
      tl.fromTo(
        stage,
        { clipPath: 'inset(0 0 100% 0)', y: 16 },
        { clipPath: 'inset(0 0 0% 0)', y: 0, ease: 'power1.out', duration: 0.8 },
        i,
      )
    })
    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
      gsap.set([rule, ...stages], { clearProps: 'transform,clipPath' })
    }
  }, [])

  // STRETCH-crossfade the project captions on every tab change.
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
      e.key === 'ArrowRight'
        ? index === last
          ? 0
          : index + 1
        : e.key === 'ArrowLeft'
          ? index === 0
            ? last
            : index - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : null
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

        {/* The process itself */}
        <div ref={line} className="relative mt-16">
          <div
            aria-hidden="true"
            className="proc-rule absolute bottom-3 left-[7px] top-3 w-px origin-top bg-ink-muted xl:bottom-auto xl:left-0 xl:right-0 xl:top-[7px] xl:h-px xl:w-auto xl:origin-left"
          />
          <ol className="relative grid gap-y-10 xl:grid-cols-6 xl:gap-x-6">
            {processStages.map((stage, i) => (
              <li key={stage.id} className="proc-stage relative grid grid-cols-[22px_1fr] gap-4 xl:block">
                <span
                  aria-hidden="true"
                  className={cx(
                    'relative z-[1] mt-1 block h-[15px] w-[15px] border xl:mt-0',
                    stage.id === 'Break' ? 'border-signal bg-signal' : stage.id === 'Measure' ? 'border-measure bg-measure' : 'border-ink bg-ink',
                  )}
                />
                <div className="xl:mt-6">
                  <p className="mono text-ink-muted">{String(i + 1).padStart(2, '0')}</p>
                  <p className="mt-1 text-[clamp(1.35rem,1.5vw,1.5rem)] font-extrabold uppercase leading-none" style={{ fontVariationSettings: "'wdth' 104" }}>
                    {stage.id}
                  </p>
                  <div className="mt-4 grid gap-0.5 text-[15px] leading-snug text-ink-muted">
                    {stage.prompt.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* …and how real projects moved through it */}
        <div className="mt-20 border-t border-line-strong pt-8">
          <p className="mono text-ink-muted">Through a real project</p>
          <div role="tablist" aria-label="Project" className="mt-4 flex flex-wrap gap-x-1 gap-y-2 border-b border-line">
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
                    className={cx(
                      'absolute inset-x-3 bottom-0 h-[2px] bg-signal transition-transform duration-300',
                      selected ? 'scale-x-100' : 'scale-x-0',
                    )}
                  />
                </button>
              )
            })}
          </div>

          <div
            ref={panel}
            role="tabpanel"
            id={`${uid}-panel`}
            aria-labelledby={`${uid}-tab-${tab.id}`}
            tabIndex={0}
            className="mt-8 focus-visible:outline-offset-8"
          >
            <ol className="grid gap-y-4 xl:grid-cols-6 xl:gap-x-6">
              {processStages.map((stage, i) => {
                const text = tab.steps[stage.id]
                return (
                  <li key={stage.id} className="grid grid-cols-[110px_minmax(0,1fr)] gap-3 border-t border-line pt-3 xl:block xl:border-t-0 xl:pt-0">
                    <p className={cx('mono mono-sm', text ? 'text-ink' : 'text-ink-muted')}>
                      {String(i + 1).padStart(2, '0')} {stage.id}
                    </p>
                    {text ? (
                      <p key={`${tab.id}-${stage.id}`} className="proc-cap wdth text-[15px] leading-snug xl:mt-2">
                        {text}
                      </p>
                    ) : (
                      <p className="mono mono-sm text-ink-muted xl:mt-2">— not part of this one</p>
                    )}
                  </li>
                )
              })}
            </ol>
          </div>

          <p className="mt-10">
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
      </div>
    </SectionFrame>
  )
}
