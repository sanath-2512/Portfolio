import { useLayoutEffect, useRef } from 'react'
import { agriMind as a } from '@/data/content'
import { gsap } from '@/lib/gsap'
import { MQ } from '@/lib/motion'
import { cx } from '@/lib/utils'
import { Citation } from '@/components/motion/Citation'
import { Facts, ProjectHead, ProjectLinksRow, StackLine } from '@/components/work/ProjectParts'
import { TodoNote } from '@/components/ui/Todo'

const n = a.graph.length
const x = (i: number) => ((i + 0.5) / n) * 100

/**
 * 03 · AgriMind as its real LangGraph: START → predict → retrieve → reason →
 * report → END. The state bar shows what each node writes, and the dashed
 * reads show why the two sources agree: retrieval is conditioned on the
 * prediction, and reasoning reads both. The trace prints as the token moves.
 */
export function ProjectAgentGraph() {
  const root = useRef<HTMLElement | null>(null)
  const stage = useRef<HTMLDivElement | null>(null)
  const token = useRef<HTMLSpanElement | null>(null)

  useLayoutEffect(() => {
    const scope = root.current
    if (!scope || !stage.current) return
    const lines = gsap.utils.toArray<HTMLElement>('.ag-trace li', scope)

    const lighter = (container: Element) => {
      const nodes = gsap.utils.toArray<HTMLElement>('.ag-node', container)
      const slots = gsap.utils.toArray<HTMLElement>('.ag-slot', container)
      const reads = gsap.utils.toArray<SVGElement>('.ag-read', container)
      return (p: number) => {
        nodes.forEach((node, i) => {
          const on = p >= (i / (n - 1)) * 0.94
          node.classList.toggle('is-on', on)
          slots[i]?.classList.toggle('is-on', on)
          lines[i]?.classList.toggle('is-on', on)
        })
        // retrieve reads the predicted category; reason reads both slots.
        reads.forEach((r) => r.classList.toggle('is-on', p >= Number(r.dataset.at) * 0.94))
      }
    }

    const desk = scope.querySelector('.ag-desk')!
    const mob = scope.querySelector('.ag-mob')!
    const mm = gsap.matchMedia(scope)
    mm.add(MQ.desktop, () => {
      const light = lighter(desk)
      const track = token.current!.parentElement!
      gsap.fromTo(
        token.current,
        { x: 0 },
        {
          x: () => track.offsetWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: stage.current,
            start: 'top top+=64',
            end: () => `+=${window.innerHeight * 1.3}`,
            pin: true,
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => light(self.progress),
          },
        },
      )
    })
    mm.add(MQ.mobile, () => {
      const light = lighter(mob)
      const mobileToken = mob.querySelector<HTMLElement>('.ag-token-m')!
      const track = mobileToken.parentElement!
      gsap.fromTo(
        mobileToken,
        { y: 0 },
        {
          y: () => track.offsetHeight,
          ease: 'none',
          scrollTrigger: {
            trigger: mob,
            start: 'top 70%',
            end: 'bottom 50%',
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => light(self.progress),
          },
        },
      )
    })
    mm.add(MQ.reduced, () => {
      lighter(desk)(1)
      lighter(mob)(1)
    })
    return () => mm.revert()
  }, [])

  return (
    <article ref={root} id="agrimind" aria-labelledby="agrimind-title" data-field="furrows" className="relative mt-40 scroll-mt-16">
      <div className="shell">
        <ProjectHead id="agrimind" no={a.no} name={a.name} oneLiner={a.oneLiner} meta={[a.domain, a.year, 'LangGraph']} />
      </div>

      <div ref={stage} className="shell mt-14 lg:flex lg:min-h-[calc(100svh-96px)] lg:flex-col lg:justify-center">
        <div className="grid12 gap-y-10">
          {/* The graph */}
          <figure className="col-span-4 md:col-span-12 lg:col-span-8" aria-labelledby="agrimind-graph-cap">
            <figcaption id="agrimind-graph-cap" className="mono flex flex-wrap items-center gap-3 text-ink-muted">
              <span>
                StateGraph(<span className="text-ink">FarmState</span>)
              </span>
              <Citation k="agriGraph" />
            </figcaption>

            {/* Desktop: state bar, reads, and the node row */}
            <div className="ag-desk relative mt-6 hidden lg:block">
              <div className="grid grid-cols-4 gap-3">
                {a.graph.map((node) => (
                  <p key={node.id} className="ag-slot mono mono-sm border border-dashed border-line-strong px-2 py-2 text-center normal-case tracking-normal text-ink-muted">
                    {node.writes}
                  </p>
                ))}
              </div>
              <svg className="h-[88px] w-full overflow-visible" viewBox="0 0 100 88" preserveAspectRatio="none" aria-hidden="true">
                {a.graph.map((node, i) => (
                  <line key={node.id} className="ag-write" x1={x(i)} x2={x(i)} y1="88" y2="0" vectorEffect="non-scaling-stroke" />
                ))}
                {/* retrieve reads yield_category */}
                <path className="ag-read" data-at={1 / 3} d={`M ${x(0)} 0 C ${x(0)} 60, ${x(1)} 30, ${x(1)} 88`} vectorEffect="non-scaling-stroke" />
                {/* reason reads both */}
                <path className="ag-read" data-at={2 / 3} d={`M ${x(0)} 0 C ${x(0)} 70, ${x(2)} 30, ${x(2)} 88`} vectorEffect="non-scaling-stroke" />
                <path className="ag-read" data-at={2 / 3} d={`M ${x(1)} 0 C ${x(1)} 60, ${x(2)} 30, ${x(2)} 88`} vectorEffect="non-scaling-stroke" />
              </svg>
              <div className="relative">
                <div className="absolute left-0 right-0 top-[15px] h-px bg-line-strong" aria-hidden="true">
                  <span ref={token} className="absolute -left-[5px] -top-[5px] h-[11px] w-[11px] bg-signal" />
                </div>
                <ol className="relative grid grid-cols-4 gap-3">
                  {a.graph.map((node, i) => (
                    <li key={node.id} className="ag-node detect-host flex flex-col items-center text-center">
                      <span className={cx('h-[31px] w-[31px] border bg-bg', node.stream === 'merge' ? 'border-signal' : 'border-ink')} aria-hidden="true" />
                      <p className="mono mt-3 text-ink">
                        <span className="text-ink-muted">{String(i + 1).padStart(2, '0')} </span>
                        {node.label}
                      </p>
                      <p className="mt-1 max-w-[24ch] text-[14px] leading-snug text-ink-muted">{node.detail}</p>
                    </li>
                  ))}
                </ol>
                <p className="mono mono-sm mt-4 flex justify-between text-ink-muted" aria-hidden="true">
                  <span>START</span>
                  <span>END</span>
                </p>
              </div>
            </div>

            {/* Mobile: the same graph, top to bottom */}
            <div className="ag-mob relative mt-6 lg:hidden">
              <div className="absolute bottom-2 left-[10px] top-2 w-px bg-line-strong" aria-hidden="true">
                <span className="ag-token-m absolute -left-[5px] -top-[5px] h-[11px] w-[11px] bg-signal" />
              </div>
              <ol className="relative">
                {a.graph.map((node, i) => (
                  <li key={node.id} className="ag-node grid grid-cols-[22px_1fr] gap-4 py-3">
                    <span className="mt-1 h-[21px] w-[21px] border border-ink bg-bg" aria-hidden="true" />
                    <div>
                      <p className="mono text-ink">
                        <span className="text-ink-muted">{String(i + 1).padStart(2, '0')} </span>
                        {node.label}
                      </p>
                      <p className="mt-1 text-[15px] text-ink-muted">{node.detail}</p>
                      <p className="ag-slot mono mono-sm mt-1 normal-case tracking-normal text-ink-muted">writes {node.writes}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </figure>

          {/* Trace */}
          <div className="col-span-4 md:col-span-12 lg:col-span-4">
            <p className="mono flex items-center gap-3 text-ink-muted">
              Trace <span className="border border-line-strong px-1.5 py-0.5 text-ink">Illustrative</span>
            </p>
            <ol className="ag-trace mono mono-sm mt-4 border border-line bg-bg p-4 normal-case tracking-normal">
              {a.trace.map((t) => (
                <li key={t.step} className="py-1.5">
                  <span className="ag-step">{t.step}</span>
                  <span className="ag-line block">{t.line}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 border-l-2 border-signal pl-4 leading-relaxed">{a.linkNote}</p>
          </div>
        </div>
      </div>

      <div className="shell mt-14">
        <Facts
          columns={4}
          items={[
            { k: 'Problem', v: a.problem },
            { k: 'Solution', v: a.solution },
            { k: 'Hard part', v: a.challenge },
            { k: 'Outcome', v: a.outcome },
          ]}
        />
        <ul className="mt-8">
          {a.resilience.map((line) => (
            <li key={line} className="grid grid-cols-[20px_1fr] gap-2 border-t border-line py-2 text-[15px]">
              <span aria-hidden="true" className="mono text-ink-muted">+</span>
              {line}
            </li>
          ))}
        </ul>
        <StackLine className="mt-8" items={a.stack} />
        <ProjectLinksRow className="mt-4" links={a.links} />
        {import.meta.env.DEV ? <TodoNote item={a.githubNote} label="Confirm AgriMind repo" className="mt-3" /> : null}
      </div>
    </article>
  )
}
