import { useEffect, useRef } from 'react'
import { agriMind as a } from '@/data/content'
import { ScrollTrigger } from '@/lib/gsap'
import { cx, prefersReducedMotion } from '@/lib/utils'
import { Citation } from '@/components/motion/Citation'
import { DeepDive } from '@/components/motion/DeepDive'
import { Flow } from '@/components/work/Flow'
import { ProjectHead, ProjectLinksRow, StackLine, Story } from '@/components/work/ProjectParts'
import { TodoNote } from '@/components/ui/Todo'

const n = a.graph.length
const x = (i: number) => ((i + 0.5) / n) * 100

/**
 * THE DETAIL THAT MATTERS — the retrieval query, taken apart. The generic
 * question is struck; the real query is built, and the part that comes from
 * the prediction is detected as it arrives.
 */
function QueryAnatomy() {
  const root = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = root.current
    if (!el) return
    if (prefersReducedMotion()) {
      el.classList.add('is-on')
      return
    }
    const st = ScrollTrigger.create({ trigger: el, start: 'top 70%', once: true, onEnter: () => el.classList.add('is-on') })
    return () => st.kill()
  }, [])

  return (
    <div ref={root} className="qa-anatomy border border-line bg-bg p-5 lg:p-8">
      <p className="mono text-ink-muted">The detail that matters</p>
      <p className="mt-4 max-w-[48ch] text-[clamp(1.15rem,1.7vw,1.5rem)] leading-snug">{a.detail[0]}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <p className="mono mono-sm text-ink-muted">Not this</p>
          <p className="qa-generic mt-2 text-[clamp(1.05rem,1.4vw,1.25rem)]">
            <span className="fc-strike">“Tell me about this crop.”</span>
          </p>
        </div>
        <div>
          <p className="mono mono-sm text-ink-muted">This — the retrieval query</p>
          <p className="mono mt-3 text-[13px] normal-case leading-[2.9] tracking-normal text-ink">
            "{'{crop}'} {'{soil}'} {'{weather}'}{' '}
            <span className="detect qa-cat">
              <span className="detect-box" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
              <span className="detect-tag">from prediction</span>
              <span className="text-measure">{'{yield_category}'}</span>
            </span>{' '}
            yield"
          </p>
        </div>
      </div>
      <p className="mt-8 max-w-[52ch] leading-relaxed text-ink-muted">
        {a.detail[1]} {a.detail[2]}
      </p>
    </div>
  )
}

/** Level 3: the compiled StateGraph with what each node writes, the trace, resilience. */
function Deep() {
  return (
    <div className="grid gap-14">
      <figure aria-labelledby="agrimind-graph-cap">
        <figcaption id="agrimind-graph-cap" className="mono flex flex-wrap items-center gap-3 text-ink">
          <span>
            StateGraph(<span className="text-measure">FarmState</span>) · START → predict → retrieve → reason → report → END
          </span>
          <Citation k="agriGraph" />
        </figcaption>

        <div className="relative mt-6 hidden lg:block">
          <div className="grid grid-cols-4 gap-3">
            {a.graph.map((node) => (
              <p key={node.id} className="ag-slot is-on mono mono-sm border border-dashed px-2 py-2 text-center normal-case tracking-normal">
                {node.writes}
              </p>
            ))}
          </div>
          <svg className="h-[88px] w-full overflow-visible" viewBox="0 0 100 88" preserveAspectRatio="none" aria-hidden="true">
            {a.graph.map((node, i) => (
              <line key={node.id} className="ag-write" x1={x(i)} x2={x(i)} y1="88" y2="0" vectorEffect="non-scaling-stroke" />
            ))}
            <path className="ag-read is-on" d={`M ${x(0)} 0 C ${x(0)} 60, ${x(1)} 30, ${x(1)} 88`} vectorEffect="non-scaling-stroke" />
            <path className="ag-read is-on" d={`M ${x(0)} 0 C ${x(0)} 70, ${x(2)} 30, ${x(2)} 88`} vectorEffect="non-scaling-stroke" />
            <path className="ag-read is-on" d={`M ${x(1)} 0 C ${x(1)} 60, ${x(2)} 30, ${x(2)} 88`} vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="relative">
            <div className="absolute left-0 right-0 top-[15px] h-px bg-line-strong" aria-hidden="true" />
            <ol className="relative grid grid-cols-4 gap-3">
              {a.graph.map((node, i) => (
                <li key={node.id} className="ag-node is-on flex flex-col items-center text-center">
                  <span className={cx('h-[31px] w-[31px] border bg-bg', node.stream === 'merge' ? 'border-signal' : 'border-ink')} aria-hidden="true" />
                  <p className="mono mt-3 text-ink">
                    <span className="text-ink-muted">{String(i + 1).padStart(2, '0')} </span>
                    {node.label}
                  </p>
                  <p className="mt-1 max-w-[24ch] text-[14px] leading-snug text-ink-muted">{node.detail}</p>
                </li>
              ))}
            </ol>
          </div>
          <p className="mono mono-sm mt-4 text-ink-muted">Dashed reads: retrieve reads the predicted category; reason reads both.</p>
        </div>

        <ol className="mt-6 lg:hidden">
          {a.graph.map((node, i) => (
            <li key={node.id} className="grid grid-cols-[22px_1fr] gap-4 border-t border-line py-3">
              <span className={cx('mt-1 h-[15px] w-[15px] border', node.stream === 'merge' ? 'border-signal bg-signal' : 'border-ink bg-ink')} aria-hidden="true" />
              <div>
                <p className="mono text-ink">
                  <span className="text-ink-muted">{String(i + 1).padStart(2, '0')} </span>
                  {node.label}
                </p>
                <p className="mt-1 text-[15px] text-ink-muted">{node.detail}</p>
                <p className="mono mono-sm mt-1 normal-case tracking-normal text-measure">writes {node.writes}</p>
              </div>
            </li>
          ))}
        </ol>
      </figure>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="mono flex items-center gap-3 text-ink">
            Trace <span className="border border-line-strong px-1.5 py-0.5 text-ink-muted">Illustrative</span>
          </p>
          <ol className="ag-trace mono mono-sm mt-4 border border-line bg-bg p-4 normal-case tracking-normal">
            {a.trace.map((t) => (
              <li key={t.step} className="is-on py-1.5">
                <span className="ag-step">{t.step}</span>
                <span className="ag-line block">{t.line}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="mono text-ink">When something breaks</p>
          <ul className="mt-4">
            {a.resilience.map((line) => (
              <li key={line} className="grid grid-cols-[20px_1fr] gap-2 border-t border-line py-2 text-[15px]">
                <span aria-hidden="true" className="mono text-ink-muted">+</span>
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-6 leading-relaxed text-ink-muted">{a.challenge}</p>
          <p className="mt-4 leading-relaxed">{a.outcome}</p>
          <StackLine className="mt-6" items={a.stack} />
          <ProjectLinksRow className="mt-4" links={a.links} />
          {import.meta.env.DEV ? <TodoNote item={a.githubNote} label="Confirm AgriMind repo" className="mt-3" /> : null}
        </div>
      </div>
    </div>
  )
}

/** 03 · AgriMind — a prediction and retrieved knowledge, joined by LangGraph. */
export function ProjectAgentGraph() {
  return (
    <article id="agrimind" aria-labelledby="agrimind-title" data-field="furrows" className="relative mt-40 scroll-mt-16">
      <div className="shell">
        <ProjectHead id="agrimind" no={a.no} name={a.name} kicker={a.kicker} meta={[a.year, 'LangGraph']} oneLiner={a.story[0].v as string} />

        <div className="grid12 mt-16 gap-y-14">
          <div className="col-span-4 md:col-span-12 lg:col-span-7">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border-t-2 border-measure pt-4">
                <p className="mono text-measure">The prediction</p>
                <p className="mt-2 text-[clamp(1.4rem,2.4vw,2.1rem)] font-semibold leading-tight">“What might happen?”</p>
              </div>
              <div className="border-t-2 border-signal pt-4">
                <p className="mono signal-sm">The retrieval</p>
                <p className="mt-2 text-[clamp(1.4rem,2.4vw,2.1rem)] font-semibold leading-tight">“What does that mean?”</p>
              </div>
            </div>
            <p className="mt-6 text-[clamp(1.05rem,1.4vw,1.25rem)]">LangGraph connects the two.</p>
            <Story className="mt-12" rows={[{ k: 'The interesting problem', v: a.problem }]} />
            <div className="mt-12">
              <QueryAnatomy />
            </div>
          </div>
          <div className="col-span-4 md:col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="mono text-ink-muted">Architecture</p>
            <Flow className="mt-5" nodes={a.flow} label="AgriMind architecture, in order" />
          </div>
        </div>

        <DeepDive className="mt-16" summary="StateGraph & what each node writes · trace · failure handling · stack">
          <Deep />
        </DeepDive>
      </div>
    </article>
  )
}
