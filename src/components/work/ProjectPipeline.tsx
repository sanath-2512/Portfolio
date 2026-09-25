import { Fragment, useLayoutEffect, useRef, type ReactNode } from 'react'
import { worthyApply as wa } from '@/data/content'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { EASE, MQ } from '@/lib/motion'
import { linkHandler } from '@/lib/router'
import { cx } from '@/lib/utils'
import { Citation } from '@/components/motion/Citation'
import { DetectBox } from '@/components/motion/DetectBox'
import { DimensionLine } from '@/components/motion/DimensionLine'
import { StretchText } from '@/components/motion/StretchText'
import { Facts, ProjectHead, ProjectLinksRow, StackLine } from '@/components/work/ProjectParts'

type PanelKind = 'intro' | 'stage' | 'failover' | 'end'

/** The panel sequence: intro, the six stages with failover after analysis, the close. */
const panels: Array<{ kind: PanelKind; id: string; label: string; stageIndex?: number }> = [
  { kind: 'intro', id: 'wa-intro', label: 'Problem' },
  ...wa.pipeline.flatMap((stage, i) => {
    const item = { kind: 'stage' as const, id: `wa-${stage.id}`, label: stage.label, stageIndex: i }
    return stage.id === 'analysis' ? [item, { kind: 'failover' as const, id: 'wa-failover', label: 'Failover' }] : [item]
  }),
  { kind: 'end', id: 'wa-end', label: 'Result' },
]

function Panel({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  return (
    <div
      id={id}
      data-panel=""
      className={cx(
        'wa-panel relative flex shrink-0 flex-col justify-center border-t border-line py-14 lg:h-full lg:w-[min(80vw,1080px)] lg:border-l lg:border-t-0 lg:px-14 lg:py-10',
        className,
      )}
    >
      {children}
    </div>
  )
}

function StagePanel({ index }: { index: number }) {
  const stage = wa.pipeline[index]
  const total = String(wa.pipeline.length).padStart(2, '0')
  const check = stage.id === 'factcheck'
  const body = (
    <div>
      <p className="mono text-ink-muted">
        Stage <span className="text-ink">{String(index + 1).padStart(2, '0')}</span> / {total}
      </p>
      <h4 className="mt-4 text-[clamp(2.25rem,5.4vw,5rem)] font-bold uppercase leading-[0.92]" style={{ fontVariationSettings: "'wdth' 112" }}>
        {stage.label}
      </h4>
      <p className="mt-6 max-w-[46ch] text-[clamp(1.05rem,1.4vw,1.25rem)] leading-snug">{stage.does}</p>
      <div className="mt-8 max-w-[52ch] border-l-2 border-signal pl-4">
        <p className="mono text-ink-muted">Decision</p>
        <p className="mt-1 leading-relaxed">{stage.decision}</p>
      </div>
      <p className="mono mono-sm mt-8 text-ink-muted">
        Code <span className="break-all text-ink">{stage.code}</span>
      </p>
    </div>
  )
  if (!check) return body
  return (
    <div className="grid items-center gap-x-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      {body}
      <FactCheck />
    </div>
  )
}

/** Real case: backend/tests/test_grounding.py::test_claim_checks. */
function FactCheck() {
  const fc = wa.factCheck
  const flagged = fc.generated.filter((part) => part.flag)
  return (
    <div className="wa-factcheck mt-10 border border-line bg-bg p-5 lg:mt-0 lg:p-6">
      <p className="mono mono-sm flex flex-wrap items-center justify-between gap-2 text-ink-muted">
        <span>
          Case from <span className="text-ink">{fc.test}</span>
        </span>
        <Citation k={fc.source_key} />
      </p>
      <dl className="mt-4 grid gap-4">
        <div>
          <dt className="mono mono-sm text-ink-muted">Source entry</dt>
          <dd className="mt-1">{fc.source}</dd>
        </div>
        <div>
          <dt className="mono mono-sm text-ink-muted">Generated rewrite</dt>
          <dd className="mt-1 text-[1.05rem] leading-[2.1]">
            {fc.generated.map((part, i) =>
              part.flag ? (
                <DetectBox key={i} tag={String(flagged.indexOf(part) + 1).padStart(2, '0')} className="fc-flag whitespace-nowrap">
                  <span className="fc-strike">{part.text}</span>
                </DetectBox>
              ) : (
                <Fragment key={i}>{part.text}</Fragment>
              ),
            )}
          </dd>
        </div>
        <div>
          <dt className="mono mono-sm text-ink-muted">Claims checked against the source</dt>
          <dd className="mt-2">
            <ol className="mono mono-sm">
              {flagged.map((part, i) => (
                <li key={i} className="fc-claim grid grid-cols-[28px_minmax(0,1fr)_auto] gap-3 border-t border-line py-1.5">
                  <span className="text-ink-muted">{String(i + 1).padStart(2, '0')}</span>
                  <span className="normal-case tracking-normal text-ink">
                    {part.text} <span className="text-ink-muted">· {part.flag}</span>
                  </span>
                  <span className="text-measure">Unverified → removed</span>
                </li>
              ))}
            </ol>
          </dd>
        </div>
        <div>
          <dt className="mono mono-sm text-ink-muted">What ships</dt>
          <dd className="fc-restored mt-1">
            Hard claims removed; the original wording is restored: “{fc.source}”
          </dd>
        </div>
      </dl>
      <p className="mono mono-sm mt-4 text-ink-muted">
        26 tests in test_grounding.py <Citation k="waGrounding" /> · 49 across the backend <Citation k="waTests" />
      </p>
    </div>
  )
}

/** ILLUSTRATIVE: lane 1 times out, the request reroutes to lane 2. */
function Failover() {
  return (
    <>
      <p className="mono flex flex-wrap items-center gap-3 text-ink-muted">
        Failover
        <span className="border border-line-strong px-1.5 py-0.5 text-ink">Illustrative</span>
        <Citation k="waRouter" />
      </p>
      <h4 className="mt-4 text-[clamp(2.25rem,5.4vw,5rem)] font-bold uppercase leading-[0.92]" style={{ fontVariationSettings: "'wdth' 112" }}>
        Five lanes
      </h4>
      <p className="mt-6 max-w-[50ch] leading-relaxed">
        Every agent calls through one router. Providers are tried in priority order with a hard timeout each; a
        circuit breaker skips a provider after repeated failures, and cooldowns depend on the error.
      </p>
      <ol className="wa-lanes mt-10 max-w-[760px]" aria-label="Provider priority order with per-provider timeouts">
        {wa.providers.map((p, i) => (
          <li key={p.name} className="grid grid-cols-[124px_minmax(0,1fr)_44px] items-center gap-3 border-b border-line py-3 first:border-t md:grid-cols-[132px_minmax(0,1fr)_56px] md:gap-4">
            <span className="mono whitespace-nowrap">
              <span className="text-ink-muted">{i + 1} · </span>
              {p.name}
            </span>
            <span className="lane relative block h-px bg-line-strong" aria-hidden="true">
              {i === 0 ? <span className="lane-fail mono mono-sm absolute -top-5 left-[58%] text-signal opacity-0">Timeout</span> : null}
              {i === 1 ? <span className="lane-ok mono mono-sm absolute -top-5 right-0 text-measure opacity-0">200 · streamed</span> : null}
            </span>
            <span className="mono mono-sm text-right text-ink-muted">{p.timeout} s</span>
          </li>
        ))}
      </ol>
      <span aria-hidden="true" className="wa-packet pointer-events-none absolute left-0 top-0 h-[9px] w-[9px] bg-signal opacity-0" />
    </>
  )
}

/**
 * 01 · WorthyApply. Desktop: the section pins and the pipeline scrolls
 * sideways, one full-height panel per stage. Mobile / reduced motion: a
 * vertical stepper with a sticky progress rail.
 */
export function ProjectPipeline() {
  const root = useRef<HTMLElement | null>(null)
  const pin = useRef<HTMLDivElement | null>(null)
  const track = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const scope = root.current
    if (!scope || !pin.current || !track.current) return
    const mm = gsap.matchMedia(scope)

    const factCheck = (containerAnimation?: gsap.core.Animation) => {
      const box = scope.querySelector('.wa-factcheck')
      if (!box) return
      const flags = gsap.utils.toArray<HTMLElement>('.fc-flag', box)
      ScrollTrigger.create({
        trigger: box,
        start: containerAnimation ? 'left 60%' : 'top 70%',
        containerAnimation,
        once: true,
        onEnter: () => flags.forEach((f, i) => gsap.delayedCall(0.25 + i * 0.22, () => f.classList.add('is-on', 'is-struck'))),
      })
    }

    const failover = (containerAnimation?: gsap.core.Animation) => {
      const panel = scope.querySelector<HTMLElement>('#wa-failover')
      const packet = scope.querySelector<HTMLElement>('.wa-packet')
      const lanes = gsap.utils.toArray<HTMLElement>('.wa-lanes .lane', scope)
      if (!panel || !packet || lanes.length < 2) return
      const at = (lane: HTMLElement, f: number) => {
        const p = panel.getBoundingClientRect()
        const r = lane.getBoundingClientRect()
        return { x: r.left - p.left + r.width * f - 4, y: r.top - p.top - 4 }
      }
      const run = () => {
        const a = at(lanes[0], 0)
        const t = at(lanes[0], 0.58)
        const b = at(lanes[1], 0.58)
        const c = at(lanes[1], 1)
        gsap
          .timeline()
          .set(packet, { x: a.x, y: a.y, opacity: 1 })
          .to(packet, { x: t.x, duration: 0.9, ease: 'none' })
          .to(scope.querySelector('.lane-fail'), { opacity: 1, duration: 0.2 })
          .to(packet, { y: b.y, duration: 0.35, ease: EASE })
          .to(packet, { x: c.x, duration: 0.6, ease: 'none' })
          .to(scope.querySelector('.lane-ok'), { opacity: 1, duration: 0.2 })
      }
      ScrollTrigger.create({
        trigger: panel,
        start: containerAnimation ? 'left 55%' : 'top 60%',
        containerAnimation,
        once: true,
        onEnter: run,
      })
    }

    mm.add(MQ.desktop, () => {
      const distance = () => track.current!.scrollWidth - window.innerWidth
      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin.current,
          start: 'top top+=48',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      factCheck(tween)
      failover(tween)
    })

    mm.add(MQ.mobile, () => {
      const items = gsap.utils.toArray<HTMLElement>('.wa-rail li', scope)
      gsap.utils.toArray<HTMLElement>('[data-panel]', scope).forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => items[i]?.classList.toggle('is-active', self.isActive),
        })
      })
      factCheck()
      failover()
    })

    mm.add(MQ.reduced, () => {
      scope.querySelectorAll('.fc-flag').forEach((f) => f.classList.add('is-on', 'is-struck'))
      gsap.set(scope.querySelectorAll('.lane-fail, .lane-ok'), { opacity: 1 })
    })

    return () => mm.revert()
  }, [])

  return (
    <article ref={root} id="worthyapply" aria-labelledby="worthyapply-title" data-field="lanes" className="relative mt-32 scroll-mt-16">
      <div className="shell">
        <ProjectHead
          id="worthyapply"
          no={wa.no}
          name={wa.name}
          oneLiner={wa.oneLiner}
          meta={[wa.domain, wa.year, 'Solo build']}
        />
      </div>

      <div ref={pin} className="relative mt-12 overflow-hidden lg:h-[calc(100svh-48px)]">
        <div className="shell grid grid-cols-[28px_minmax(0,1fr)] gap-x-4 lg:block lg:h-full lg:max-w-none lg:px-0">
          {/* Mobile stepper rail */}
          <ol className="wa-rail sticky top-20 h-max self-start pt-14 lg:hidden" aria-hidden="true">
            {panels.map((p, i) => (
              <li key={p.id} className="mono mono-sm py-1 text-ink-muted [&.is-active]:text-signal">
                {String(i + 1).padStart(2, '0')}
              </li>
            ))}
          </ol>

          <div ref={track} className="flex flex-col lg:h-full lg:w-max lg:flex-row lg:pl-[var(--gutter)] lg:pr-[20vw]">
            {panels.map((p) => (
              <Panel key={p.id} id={p.id}>
                {p.kind === 'intro' ? (
                  <>
                    <p className="mono text-ink-muted">Before the pipeline</p>
                    <h4 className="mt-4 text-[clamp(2.25rem,5.4vw,5rem)] font-bold uppercase leading-[0.92]" style={{ fontVariationSettings: "'wdth' 112" }}>
                      Invented <span className="text-signal">experience</span>
                    </h4>
                    <Facts
                      className="mt-10"
                      items={[
                        { k: 'Problem', v: wa.problem },
                        { k: 'For whom', v: wa.forWhom },
                        { k: 'Solution', v: wa.solution },
                        { k: 'Hard part', v: wa.challenge },
                      ]}
                    />
                  </>
                ) : p.kind === 'stage' ? (
                  <StagePanel index={p.stageIndex!} />
                ) : p.kind === 'failover' ? (
                  <Failover />
                ) : (
                  <>
                    <p className="mono text-ink-muted">Result</p>
                    <p className="mt-4 max-w-[34ch] text-[clamp(1.5rem,2.6vw,2.4rem)] font-medium leading-tight">{wa.outcome}</p>
                    <div className="mt-10 grid max-w-[720px] gap-6">
                      <DimensionLine value={wa.metrics.providers.value} label={wa.metrics.providers.label} after={<Citation k="waRouter" className="ml-2" />} />
                      <DimensionLine value={wa.metrics.tests.value} label={wa.metrics.tests.label} after={<Citation k="waTests" className="ml-2" />} />
                    </div>
                    <p className="mono mt-10 text-ink">{wa.deployLine}</p>
                    <StackLine className="mt-3" items={wa.stack} />
                    <ProjectLinksRow
                      className="mt-6"
                      links={wa.links}
                      extra={
                        <a href="/work/worthyapply" onClick={linkHandler('/work/worthyapply')} className="link mono stretch-host text-ink">
                          <StretchText reserve to={112}>
                            <span className="link-rule">Read the case study</span>
                          </StretchText>{' '}
                          →
                        </a>
                      }
                    />
                  </>
                )}
              </Panel>
            ))}
          </div>
        </div>
      </div>
      <p className="sr-only">Pipeline order: {wa.pipeline.map((s) => s.label).join(', then ')}.</p>
    </article>
  )
}
