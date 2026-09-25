import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { isTodo, worthyApply as wa } from '@/data/content'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { MQ } from '@/lib/motion'
import { linkHandler } from '@/lib/router'
import { scrollToId } from '@/lib/smoothScroll'
import { Citation } from '@/components/motion/Citation'
import { DimensionLine } from '@/components/motion/DimensionLine'
import { StretchHeading } from '@/components/motion/StretchHeading'
import { TodoNote } from '@/components/ui/Todo'
import { ProjectLinksRow, StackLine } from '@/components/work/ProjectParts'

const totalTests = wa.tests.reduce((n, t) => n + t.count, 0)

interface Chapter {
  id: string
  title: string
  body: ReactNode
}

/** The pipeline, drawn as you reach it. */
function PipelineDiagram() {
  const ref = useRef<SVGSVGElement | null>(null)
  useLayoutEffect(() => {
    const svg = ref.current
    if (!svg) return
    const mm = gsap.matchMedia(svg)
    mm.add(MQ.motion, () => {
      const paths = svg.querySelectorAll<SVGGeometryElement>('.draw')
      paths.forEach((p) => {
        const len = p.getTotalLength()
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
      })
      gsap.to(paths, {
        strokeDashoffset: 0,
        ease: 'none',
        stagger: 0.12,
        scrollTrigger: { trigger: svg, start: 'top 80%', end: 'bottom 55%', scrub: 0.4 },
      })
    })
    return () => mm.revert()
  }, [])

  const stages = wa.pipeline
  const w = 150
  return (
    <figure className="mt-8">
      <svg ref={ref} viewBox={`0 0 ${stages.length * w} 250`} className="w-full" role="img" aria-labelledby="cs-diagram-desc">
        <desc id="cs-diagram-desc">
          {`Pipeline: ${stages.map((s) => s.label).join(' then ')}. Every model call in analysis and tailoring goes through the provider router, which fails over across ${wa.providers.length} providers.`}
        </desc>
        {stages.map((s, i) => {
          const x = i * w + 8
          const check = s.id === 'factcheck'
          return (
            <g key={s.id}>
              <rect className="draw" x={x} y="40" width={w - 36} height="56" fill="none" stroke={check ? 'var(--signal)' : 'var(--ink)'} strokeWidth="1.2" />
              <text x={x + 10} y="62" fill="var(--ink-muted)" style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>
                {String(i + 1).padStart(2, '0')}
              </text>
              <text x={x + 10} y="82" fill="var(--ink)" style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600 }}>
                {s.label}
              </text>
              {i < stages.length - 1 ? (
                <path className="draw" d={`M ${x + w - 28} 68 H ${x + w - 4}`} stroke="var(--ink-muted)" strokeWidth="1.2" fill="none" />
              ) : null}
            </g>
          )
        })}
        {/* the router under analysis + tailoring */}
        <path className="draw" d={`M ${1 * w + 65} 96 V 150 M ${3 * w + 65} 96 V 150`} stroke="var(--measure)" strokeDasharray="0" strokeWidth="1.2" fill="none" />
        <rect className="draw" x={w + 8} y="150" width={3 * w - 36} height="64" fill="none" stroke="var(--measure)" strokeWidth="1.2" />
        <text x={w + 20} y="174" fill="var(--measure)" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em' }}>
          LLM ROUTER · FAILOVER
        </text>
        <text x={w + 20} y="196" fill="var(--ink)" style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>
          {wa.providers.map((p) => p.name).join(' → ')}
        </text>
      </svg>
      <figcaption className="mono mono-sm mt-3 text-ink-muted">Simplified · names from pipeline.py, resume_tailor.py, grounding.py, app.py</figcaption>
    </figure>
  )
}

const chapters: Chapter[] = [
  {
    id: 'cs-problem',
    title: 'Problem',
    body: (
      <>
        <p className="text-[clamp(1.25rem,2vw,1.6rem)] leading-snug">{wa.problem}</p>
        <p className="mt-6 text-ink-muted">For: {wa.forWhom}</p>
      </>
    ),
  },
  {
    id: 'cs-constraints',
    title: 'Constraints',
    body: (
      <ol className="grid gap-4">
        {[
          ['Only verified experience', 'Nothing may appear on the tailored resume that the source resume does not support.'],
          ['Providers fail or time out', `${wa.providers.length} providers, each with its own hard timeout, rate limits and outages.`],
          ['Results must stream', 'A long structured generation cannot sit behind a blank spinner.'],
        ].map(([k, v], i) => (
          <li key={k} className="grid grid-cols-[36px_1fr] gap-3 border-t border-line pt-4">
            <span className="mono text-ink-muted">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <p className="font-semibold">{k}</p>
              <p className="mt-1 text-ink-muted">{v}</p>
            </div>
          </li>
        ))}
      </ol>
    ),
  },
  {
    id: 'cs-architecture',
    title: 'Architecture',
    body: (
      <>
        <p className="leading-relaxed">
          {wa.deployLine}. A single structured call does the analysis; Python computes the score; tailoring is a patch that a
          deterministic fact-check audits; every model call goes through one router that fails over across providers.
        </p>
        <PipelineDiagram />
      </>
    ),
  },
  {
    id: 'cs-implementation',
    title: 'Implementation',
    body: (
      <>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="mono mono-sm text-ink-muted">
              <th scope="col" className="w-10 py-2 font-normal">No.</th>
              <th scope="col" className="py-2 font-normal">Stage</th>
              <th scope="col" className="hidden py-2 font-normal md:table-cell">Decision</th>
              <th scope="col" className="py-2 text-right font-normal">Code</th>
            </tr>
          </thead>
          <tbody>
            {wa.pipeline.map((s, i) => (
              <tr key={s.id} className="border-t border-line align-top">
                <td className="mono py-3 text-ink-muted">{String(i + 1).padStart(2, '0')}</td>
                <th scope="row" className="py-3 pr-4 font-semibold">{s.label}</th>
                <td className="hidden py-3 pr-4 text-[15px] text-ink-muted md:table-cell">{s.decision}</td>
                <td className="mono mono-sm break-all py-3 text-right normal-case tracking-normal text-ink">{s.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div>
            <p className="mono text-ink-muted">Scoring — Python owns the arithmetic</p>
            <ul className="mt-3 grid gap-2 text-[15px] leading-relaxed">
              <li>Each requirement is weighted by priority: required › conditional › preferred › nice-to-have.</li>
              <li>Credit per verdict: matched full, partial half, cannot_verify limited, missing none.</li>
              <li>Score = weighted credit ÷ weighted maximum, with a readable account of how it was derived.</li>
            </ul>
          </div>
          <div>
            <p className="mono text-ink-muted">Evidence — the verdict is checked against the resume</p>
            <ul className="mt-3 grid gap-2 text-[15px] leading-relaxed">
              <li>A specific technology proves its family, never the reverse: “AWS Bedrock” satisfies AWS; “AWS” alone does not satisfy AWS Lambda.</li>
              <li>A claimed match on a tool the resume never names is overruled to missing.</li>
              <li>Years are summed from dated roles, overlaps merged, education excluded.</li>
            </ul>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'cs-evaluation',
    title: 'Evaluation',
    body: (
      <>
        <DimensionLine value={totalTests} label="pytest tests, no network" after={<Citation k="waTests" className="ml-2" />} />
        <table className="mt-8 w-full border-collapse text-left">
          <caption className="mono mono-sm mb-3 text-left text-ink-muted">Lab notebook · backend/tests · grouped by file</caption>
          <thead>
            <tr className="mono mono-sm text-ink-muted">
              <th scope="col" className="py-2 font-normal">File</th>
              <th scope="col" className="py-2 text-right font-normal">Tests</th>
              <th scope="col" className="py-2 pl-4 font-normal">Covers</th>
            </tr>
          </thead>
          <tbody>
            {wa.tests.map((t) => (
              <tr key={t.file} className="border-t border-line align-top">
                <th scope="row" className="mono mono-sm py-3 pr-2 font-normal normal-case tracking-normal text-ink">{t.file}</th>
                <td className="mono py-3 text-right text-measure tabular-nums">{t.count}</td>
                <td className="py-3 pl-4 text-[15px]">
                  {t.covers}
                  <span className="mono mono-sm mt-1 block break-all normal-case tracking-normal text-ink-muted">
                    e.g. {t.examples.join(' · ')}
                  </span>
                </td>
              </tr>
            ))}
            <tr className="border-t border-line-strong">
              <th scope="row" className="mono py-3 font-normal text-ink-muted">Total</th>
              <td className="mono py-3 text-right text-measure tabular-nums">{totalTests}</td>
              <td />
            </tr>
          </tbody>
        </table>
        <p className="mt-8 leading-relaxed">
          Beyond the unit tests: <span className="mono mono-sm normal-case tracking-normal">{wa.confirmedExtras.benchmarkHarness}</span>.
          The grounding benchmark replays fixed adversarial model outputs offline, so the fact-check is measured without calling a
          model.
        </p>
      </>
    ),
  },
  {
    id: 'cs-optimization',
    title: 'Optimization',
    body: (
      <>
        <p className="leading-relaxed">
          The analysis used to be three chained calls — job analysis, match analysis, optimisation. It now runs as one structured
          generation that returns one typed object, which keeps the three phases consistent and removes two round-trips. The old
          three-call path is kept as <span className="mono mono-sm normal-case tracking-normal">run_full_pipeline_legacy</span> for
          regression comparison, and <span className="mono mono-sm normal-case tracking-normal">benchmark_analyze.py</span> compares the two.
        </p>
        {isTodo(wa.latency) ? <TodoNote item={wa.latency} className="mt-6" /> : null}
      </>
    ),
  },
  {
    id: 'cs-results',
    title: 'Results',
    body: (
      <>
        <div className="grid max-w-[640px] gap-5">
          <DimensionLine value={wa.metrics.providers.value} label="LLM providers behind one router" after={<Citation k="waRouter" className="ml-2" />} />
          <DimensionLine value={wa.metrics.tests.value} label="pytest tests" after={<Citation k="waTests" className="ml-2" />} />
        </div>
        <ul className="mt-8 grid gap-2">
          {[
            'Fabricated numbers, scale, outcomes, ownership and seniority are removed before a tailored resume is shown.',
            'The match score is computed in Python from per-requirement verdicts, not produced by the model.',
            'A request survives a provider timing out: the router moves to the next provider.',
            'Results stream over server-sent events.',
            'A resume builder with PDF import and export sits on top of the analysis.',
          ].map((line) => (
            <li key={line} className="grid grid-cols-[20px_1fr] gap-2 border-t border-line py-2">
              <span aria-hidden="true" className="mono text-ink-muted">+</span>
              {line}
            </li>
          ))}
        </ul>
        <StackLine className="mt-8" items={wa.stack} />
        <ProjectLinksRow className="mt-4" links={wa.links} />
      </>
    ),
  },
  {
    id: 'cs-lessons',
    title: 'Lessons',
    body: (
      <div className="grid gap-3">
        {wa.lessons.map((l, i) => (isTodo(l) ? <TodoNote key={i} item={l} /> : null))}
      </div>
    ),
  },
]

/** Lessons are drafts awaiting Sanath's approval: hidden in production. */
const visible = chapters.filter((c) => import.meta.env.DEV || c.id !== 'cs-lessons')

/**
 * /work/worthyapply. Sticky chapter index with progress ticks on the left,
 * chapters on the right.
 */
export default function CaseStudy() {
  const root = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Lazy chunk: re-measure the field stops, ruler and triggers now it's in.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    document.title = `WorthyApply — case study · Sanath Waraikar`
    return () => {
      cancelAnimationFrame(raf)
      document.title = 'Sanath Waraikar — Backend × Applied AI'
    }
  }, [])

  // Each chapter's tick fills with its own scroll progress.
  useLayoutEffect(() => {
    const scope = root.current
    if (!scope) return
    const ctx = gsap.context(() => {
      visible.forEach((c) => {
        const el = document.getElementById(c.id)
        const tick = scope.querySelector<HTMLElement>(`[data-tick="${c.id}"]`)
        const link = scope.querySelector<HTMLElement>(`[data-chapter="${c.id}"]`)
        if (!el || !tick) return
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onUpdate: (self) => gsap.set(tick, { scaleX: self.progress }),
          onToggle: (self) => {
            link?.setAttribute('aria-current', self.isActive ? 'true' : 'false')
            if (!self.isActive) gsap.set(tick, { scaleX: self.progress > 0.5 ? 1 : 0 })
          },
        })
      })
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} data-cal="0.75" className="relative z-10 pb-24 pt-[calc(var(--nav-h)+40px)]">
      <div className="shell">
        <a href="/#work" onClick={linkHandler('/#work')} className="link mono">
          ← <span className="link-rule">All work</span>
        </a>
        <p className="mono mt-10 text-ink-muted">
          <span className="text-ink">Case study</span> · {wa.no} · {wa.domain} · {wa.year}
        </p>
        <h1 id="case-title" className="mt-4 text-[clamp(3rem,9vw,8.5rem)] font-extrabold uppercase leading-[0.88]" style={{ fontVariationSettings: "'wdth' 122" }}>
          {wa.name}
        </h1>
        <p className="mt-6 max-w-[44ch] text-[clamp(1.1rem,1.6vw,1.4rem)] leading-snug">{wa.oneLiner}</p>

        <div className="mt-20 grid gap-x-12 gap-y-10 lg:grid-cols-[220px_minmax(0,1fr)]">
          <nav aria-label="Chapters" className="lg:sticky lg:top-24 lg:h-max">
            <ol className="mono grid gap-1 border-t border-line pt-3">
              {visible.map((c, i) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    data-chapter={c.id}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToId(c.id)
                    }}
                    className="group grid min-h-[36px] grid-cols-[28px_1fr] items-center gap-2 text-ink-muted hover:text-ink aria-[current=true]:text-ink"
                  >
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <span>
                      {c.title}
                      <span aria-hidden="true" className="mt-1 block h-px w-full bg-line">
                        <span data-tick={c.id} className="block h-px w-full origin-left scale-x-0 bg-signal" />
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div>
            {visible.map((c, i) => (
              <section key={c.id} id={c.id} aria-labelledby={`${c.id}-title`} className="border-t border-line pb-20 pt-8">
                <p className="mono text-ink-muted">Chapter {String(i + 1).padStart(2, '0')}</p>
                <StretchHeading id={`${c.id}-title`} className="mt-3">
                  {c.title}
                </StretchHeading>
                <div className="mt-8 max-w-[72ch]">{c.body}</div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
