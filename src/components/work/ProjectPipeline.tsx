import { useLayoutEffect, useRef } from 'react'
import { worthyApply as wa } from '@/data/content'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { DUR, EASE, MQ } from '@/lib/motion'
import { linkHandler } from '@/lib/router'
import { cx } from '@/lib/utils'
import { Citation } from '@/components/motion/Citation'
import { DeepDive } from '@/components/motion/DeepDive'
import { StretchText } from '@/components/motion/StretchText'
import { Flow } from '@/components/work/Flow'
import { ProjectHead, ProjectLinksRow, StackLine, Story } from '@/components/work/ProjectParts'

const flagged = wa.factCheck.generated.filter((p) => p.flag)
/** The claim labels as a person would say them. */
const claimLabel: Record<string, string> = {
  Led: 'Led',
  production: 'Production',
  RAG: 'RAG',
  '1M+': '1M+',
  'reduced latency by 40%': '40% reduction',
}

/**
 * WHEN THE MODEL LIES — the real case from test_grounding.py::test_claim_checks,
 * played as it happens: the rewrite arrives, each invented claim is caught and
 * struck, and the original wording comes back.
 */
function ModelLies() {
  const root = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const scope = root.current
    if (!scope) return
    const parts = Array.from(scope.querySelectorAll<HTMLElement>('.ml-part'))
    const flags = Array.from(scope.querySelectorAll<HTMLElement>('.ml-flag'))
    const rows = Array.from(scope.querySelectorAll<HTMLElement>('.ml-row'))
    const restored = scope.querySelector<HTMLElement>('.ml-restored')
    const finish = () => {
      gsap.set([...parts, ...rows, restored], { opacity: 1, clearProps: 'transform,clipPath' })
      flags.forEach((f) => f.classList.add('is-on', 'is-struck'))
    }
    const mm = gsap.matchMedia(scope)
    mm.add(MQ.motion, () => {
      gsap.set(parts, { opacity: 0 })
      gsap.set(rows, { opacity: 0, x: -8 })
      gsap.set(restored, { clipPath: 'inset(0 100% 0 0)' })
      const tl = gsap.timeline({ paused: true })
      tl.to(parts, { opacity: 1, duration: 0.25, stagger: 0.09, ease: 'none' })
      flags.forEach((f, i) => {
        tl.add(() => f.classList.add('is-on'), 0.4 + i * 0.09)
      })
      tl.addLabel('check', '+=0.35')
      rows.forEach((row, i) => {
        const at = `check+=${i * 0.32}`
        tl.to(row, { opacity: 1, x: 0, duration: DUR.micro, ease: EASE }, at)
        tl.add(() => flags[i]?.classList.add('is-struck'), at)
      })
      tl.to(restored, { clipPath: 'inset(0 0% 0 0)', duration: DUR.in, ease: EASE }, '+=0.2')
      const st = ScrollTrigger.create({ trigger: scope, start: 'top 62%', once: true, onEnter: () => tl.play() })
      return () => {
        st.kill()
        tl.kill()
      }
    })
    mm.add(MQ.reduced, finish)
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} aria-labelledby="ml-title" className="mt-24 border border-line bg-bg">
      <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line px-5 py-4 lg:px-8">
        <h4 id="ml-title" className="text-[clamp(1.6rem,3.4vw,3rem)] font-extrabold uppercase leading-none" style={{ fontVariationSettings: "'wdth' 125" }}>
          When the model <span className="text-signal">lies</span>
        </h4>
        <p className="mono mono-sm flex items-center gap-2 text-ink-muted">
          Real test case · {wa.factCheck.test} <Citation k={wa.factCheck.source_key} />
        </p>
      </header>

      <div className="grid lg:grid-cols-3">
        <div className="border-b border-line p-5 lg:border-b-0 lg:border-r lg:p-8">
          <p className="mono text-ink-muted">01 · Source</p>
          <p className="mt-4 text-[clamp(1.1rem,1.5vw,1.35rem)] leading-snug">“{wa.factCheck.source}”</p>
        </div>
        <div className="border-b border-line p-5 lg:border-b-0 lg:border-r lg:p-8">
          <p className="mono text-ink-muted">02 · Model output</p>
          <p className="mt-4 text-[clamp(1.1rem,1.5vw,1.35rem)] leading-[2.05]">
            “
            {wa.factCheck.generated.map((part, i) =>
              part.flag ? (
                <span key={i} className="ml-part ml-flag detect whitespace-nowrap">
                  <span className="detect-box" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="fc-strike">{part.text}</span>
                </span>
              ) : (
                <span key={i} className="ml-part">
                  {part.text}
                </span>
              ),
            )}
            ”
          </p>
        </div>
        <div className="p-5 lg:p-8">
          <p className="mono text-ink-muted">03 · System response</p>
          <ul className="mt-4">
            {flagged.map((part) => (
              <li key={part.text} className="ml-row grid grid-cols-[minmax(0,1fr)_auto_24px] items-baseline gap-3 border-t border-line py-2 first:border-t-0">
                <span className="mono text-ink">{claimLabel[part.text] ?? part.text}</span>
                <span className="mono mono-sm text-ink-muted">{part.flag}</span>
                <span className="mono text-right text-signal" aria-label="removed">
                  ✕
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ml-restored flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-line bg-bg-raised px-5 py-5 lg:px-8">
        <p className="mono text-measure">Original wording restored →</p>
        <p className="text-[clamp(1.05rem,1.4vw,1.25rem)]">“{wa.factCheck.source}”</p>
      </div>
    </section>
  )
}

/** Five provider lanes. ILLUSTRATIVE: lane 1 times out; the request reroutes to lane 2. */
function Lanes() {
  const root = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const panel = root.current
    if (!panel) return
    const packet = panel.querySelector<HTMLElement>('.wa-packet')
    const lanes = Array.from(panel.querySelectorAll<HTMLElement>('.lane'))
    const fail = panel.querySelector('.lane-fail')
    const ok = panel.querySelector('.lane-ok')
    const mm = gsap.matchMedia(panel)
    mm.add(MQ.motion, () => {
      if (!packet || lanes.length < 2) return
      const at = (lane: HTMLElement, f: number) => {
        const p = panel.getBoundingClientRect()
        const r = lane.getBoundingClientRect()
        return { x: r.left - p.left + r.width * f - 4, y: r.top - p.top - 4 }
      }
      const st = ScrollTrigger.create({
        trigger: panel,
        start: 'top 65%',
        once: true,
        onEnter: () => {
          const a = at(lanes[0], 0)
          const t = at(lanes[0], 0.58)
          const b = at(lanes[1], 0.58)
          const c = at(lanes[1], 1)
          gsap
            .timeline()
            .set(packet, { x: a.x, y: a.y, opacity: 1 })
            .to(packet, { x: t.x, duration: 0.9, ease: 'none' })
            .to(fail, { opacity: 1, duration: 0.2 })
            .to(packet, { y: b.y, duration: 0.35, ease: EASE })
            .to(packet, { x: c.x, duration: 0.6, ease: 'none' })
            .to(ok, { opacity: 1, duration: 0.2 })
        },
      })
      return () => st.kill()
    })
    mm.add(MQ.reduced, () => gsap.set([fail, ok], { opacity: 1 }))
    return () => mm.revert()
  }, [])

  return (
    <div ref={root} className="relative">
      <p className="mono flex flex-wrap items-center gap-3 text-ink-muted">
        When a provider fails
        <span className="border border-line-strong px-1.5 py-0.5 text-ink">Illustrative</span>
        <Citation k="waRouter" />
      </p>
      <ol className="mt-5" aria-label="Providers in priority order, with per-provider timeouts">
        {wa.providers.map((p, i) => (
          <li
            key={p.name}
            className="grid grid-cols-[124px_minmax(0,1fr)_44px] items-center gap-3 border-b border-line py-3 first:border-t md:grid-cols-[132px_minmax(0,1fr)_56px] md:gap-4"
          >
            <span className="mono whitespace-nowrap">
              <span className="text-ink-muted">{i + 1} · </span>
              {p.name}
            </span>
            <span className="lane relative block h-px bg-line-strong" aria-hidden="true">
              {i === 0 ? <span className="lane-fail mono mono-sm absolute -top-5 left-[58%] signal-sm opacity-0">Timeout</span> : null}
              {i === 1 ? <span className="lane-ok mono mono-sm absolute -top-5 right-0 text-measure opacity-0">200 · streamed</span> : null}
            </span>
            <span className="mono mono-sm text-right text-ink-muted">{p.timeout} s</span>
          </li>
        ))}
      </ol>
      <span aria-hidden="true" className="wa-packet pointer-events-none absolute left-0 top-0 h-[9px] w-[9px] bg-signal opacity-0" />
    </div>
  )
}

/** 5 · 49 · SSE · DETERMINISTIC — each number counts up once and cites its source. */
function Numbers() {
  const root = useRef<HTMLDListElement | null>(null)
  useLayoutEffect(() => {
    const scope = root.current
    if (!scope) return
    const counters = Array.from(scope.querySelectorAll<HTMLElement>('[data-count]'))
    const mm = gsap.matchMedia(scope)
    mm.add(MQ.motion, () => {
      const st = ScrollTrigger.create({
        trigger: scope,
        start: 'top 80%',
        once: true,
        onEnter: () =>
          counters.forEach((el) => {
            const target = Number(el.dataset.count)
            const state = { n: 0 }
            gsap.to(state, { n: target, duration: DUR.long, ease: EASE, onUpdate: () => (el.textContent = String(Math.round(state.n))) })
          }),
      })
      counters.forEach((el) => (el.textContent = '0'))
      return () => {
        st.kill()
        counters.forEach((el) => (el.textContent = el.dataset.count ?? ''))
      }
    })
    return () => mm.revert()
  }, [])

  const cells = [
    { big: String(wa.metrics.providers.value), count: true, label: 'LLM providers', cite: 'waRouter' as const },
    { big: String(wa.metrics.tests.value), count: true, label: 'pytest tests', cite: 'waTests' as const },
    { big: 'SSE', count: false, label: 'Streaming' },
    { big: 'Deterministic', count: false, label: 'Scoring' },
  ]
  return (
    <dl ref={root} className="grid grid-cols-2 self-start border-l border-t border-line">
      {cells.map((c) => (
        <div key={c.label} className="flex min-h-[150px] flex-col justify-between border-b border-r border-line p-4 lg:p-6">
          <dt className="mono order-2 mt-4 flex items-center gap-2 text-ink-muted">
            {c.label}
            {c.cite ? <Citation k={c.cite} /> : null}
          </dt>
          <dd
            className={cx(
              'order-1 font-extrabold uppercase leading-[0.9] text-measure',
              c.count ? 'text-[clamp(3rem,6vw,5.5rem)] tabular-nums' : 'text-[clamp(1.15rem,1.9vw,1.75rem)]',
            )}
            style={{ fontVariationSettings: c.count ? "'wdth' 100" : "'wdth' 104" }}
          >
            {c.count ? <span data-count={c.big}>{c.big}</span> : c.big}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/** Level 3: everything that used to fill the horizontal panels, and more. */
function Deep() {
  const total = wa.tests.reduce((n, t) => n + t.count, 0)
  return (
    <div className="grid gap-16">
      <section aria-labelledby="wa-dd-stages">
        <h5 id="wa-dd-stages" className="mono text-ink">
          The pipeline, stage by stage
        </h5>
        <ol className="mt-5 grid gap-px border border-line bg-line md:grid-cols-2 xl:grid-cols-3">
          {wa.pipeline.map((s, i) => (
            <li key={s.id} className="bg-bg p-5">
              <p className="mono mono-sm text-ink-muted">Stage {String(i + 1).padStart(2, '0')}</p>
              <p className="mt-2 text-[1.3rem] font-bold uppercase leading-tight" style={{ fontVariationSettings: "'wdth' 112" }}>
                {s.label}
              </p>
              <p className="mt-3 text-[15px] leading-relaxed">{s.does}</p>
              <p className="mt-3 border-l-2 border-signal pl-3 text-[15px] leading-relaxed text-ink-muted">{s.decision}</p>
              <p className="mono mono-sm mt-4 break-all normal-case tracking-normal text-ink">{s.code}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="wa-dd-router" className="grid gap-8 lg:grid-cols-2">
        <div>
          <h5 id="wa-dd-router" className="mono text-ink">
            Provider router <Citation k="waRouter" />
          </h5>
          <ul className="mt-4 grid gap-2 text-[15px] leading-relaxed">
            <li>Every agent calls one router; providers are tried in priority order.</li>
            <li>Each provider has a hard timeout, so a hung provider is abandoned, not waited on.</li>
            <li>A circuit breaker opens after repeated failures, skips the provider during a cooldown, then allows a recovery trial.</li>
            <li>Cooldowns depend on the error: rate limit, timeout, auth.</li>
            <li>Output that fails structured validation also triggers fallback.</li>
          </ul>
        </div>
        <table className="w-full self-start border-collapse text-left">
          <caption className="mono mono-sm mb-2 text-left text-ink-muted">Priority · provider · timeout</caption>
          <tbody>
            {wa.providers.map((p, i) => (
              <tr key={p.name} className="border-t border-line">
                <td className="mono w-10 py-2 text-ink-muted">{i + 1}</td>
                <th scope="row" className="py-2 text-left font-medium">
                  {p.name}
                </th>
                <td className="mono py-2 text-right text-measure">{p.timeout} s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section aria-labelledby="wa-dd-tests">
        <h5 id="wa-dd-tests" className="mono text-ink">
          {total} tests, no network <Citation k="waTests" />
        </h5>
        <table className="mt-4 w-full border-collapse text-left">
          <thead>
            <tr className="mono mono-sm text-ink-muted">
              <th scope="col" className="py-2 font-normal">File</th>
              <th scope="col" className="py-2 text-right font-normal">Tests</th>
              <th scope="col" className="hidden py-2 pl-6 font-normal md:table-cell">Covers</th>
            </tr>
          </thead>
          <tbody>
            {wa.tests.map((t) => (
              <tr key={t.file} className="border-t border-line align-top">
                <th scope="row" className="mono mono-sm py-3 pr-2 font-normal normal-case tracking-normal text-ink">
                  {t.file}
                  <span className="mt-1 block font-sans text-[14px] normal-case text-ink-muted md:hidden">{t.covers}</span>
                </th>
                <td className="mono py-3 text-right text-measure tabular-nums">{t.count}</td>
                <td className="hidden py-3 pl-6 text-[15px] md:table-cell">{t.covers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section aria-labelledby="wa-dd-bench" className="grid gap-8 lg:grid-cols-2">
        <div>
          <h5 id="wa-dd-bench" className="mono text-ink">
            Benchmarks
          </h5>
          <ul className="mt-4 grid gap-2 text-[15px] leading-relaxed">
            <li>
              <span className="mono mono-sm normal-case tracking-normal">benchmark_grounding.py</span> replays fixed adversarial model outputs
              offline, so the fact-check is measured without calling a model.
            </li>
            <li>
              <span className="mono mono-sm normal-case tracking-normal">benchmark_analyze.py</span> compares the one-call analysis with the
              original three-call path, kept as <span className="mono mono-sm normal-case tracking-normal">run_full_pipeline_legacy</span>.
            </li>
          </ul>
        </div>
        <div>
          <h5 className="mono text-ink">Deployment</h5>
          <p className="mt-4 leading-relaxed">{wa.deployLine}</p>
          <StackLine className="mt-4" items={wa.stack} />
          <ProjectLinksRow
            className="mt-4"
            links={wa.links}
            extra={
              <a href="/work/worthyapply" onClick={linkHandler('/work/worthyapply')} className="link mono stretch-host text-ink">
                <StretchText reserve to={112}>
                  <span className="link-rule">Full case study</span>
                </StretchText>{' '}
                →
              </a>
            }
          />
        </div>
      </section>
    </div>
  )
}

/** 01 · WorthyApply — the hero project: story, a lie caught in the act, the numbers, then the deep dive. */
export function ProjectPipeline() {
  return (
    <article id="worthyapply" aria-labelledby="worthyapply-title" data-field="lanes" className="relative mt-32 scroll-mt-16">
      <div className="shell">
        <ProjectHead
          id="worthyapply"
          no={wa.no}
          name={wa.name}
          kicker={wa.kicker}
          meta={[wa.year, 'Solo build']}
          oneLiner={
            <>
              <p className="text-ink-muted">A resume–job matching system designed around one rule:</p>
              <p className="mt-2 text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-tight">
                Never make the candidate more impressive than their <span className="text-signal">evidence</span>.
              </p>
            </>
          }
        />

        <div className="grid12 mt-16 gap-y-14">
          <Story className="col-span-4 md:col-span-12 lg:col-span-7" rows={wa.story.slice(1)} />
          <div className="col-span-4 md:col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="mono text-ink-muted">Architecture</p>
            <Flow className="mt-5" nodes={wa.flow} label="WorthyApply architecture, in order" />
          </div>
        </div>

        <ModelLies />

        <div className="mt-20 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <Numbers />
          <Lanes />
        </div>

        <div className="mt-20 grid12 gap-y-6">
          <p className="mono col-span-4 text-ink-muted md:col-span-3">The interesting part</p>
          <div className="col-span-4 md:col-span-9">
            <p className="text-[clamp(1.6rem,3.4vw,3rem)] font-semibold leading-[1.1]">{wa.interesting[0]}</p>
            <p className="mt-4 max-w-[52ch] text-[clamp(1.05rem,1.4vw,1.25rem)] leading-relaxed text-ink-muted">{wa.interesting[1]}</p>
          </div>
        </div>

        <DeepDive
          className="mt-16"
          summary="Stages & decisions · provider router · circuit breaker · 49 tests · benchmarks · deployment"
        >
          <Deep />
        </DeepDive>
      </div>
    </article>
  )
}
