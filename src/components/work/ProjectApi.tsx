import { useLayoutEffect, useRef } from 'react'
import { eduAI as e } from '@/data/content'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { MQ } from '@/lib/motion'
import { cx } from '@/lib/utils'
import { Metric } from '@/components/motion/Metric'
import { Facts, ProjectHead, ProjectLinksRow, StackLine } from '@/components/work/ProjectParts'

const endpoints = e.api.reduce((n, g) => n + g.routes.length, 0)
const guarded = e.api.reduce((n, g) => n + g.routes.filter((r) => r[2]).length, 0)
const col = (i: number) => ((i + 0.5) / e.actors.length) * 100

/**
 * 02 · EduAI as an API spec sheet: every route from backend/routes, and the
 * one request that matters — creating an AI course — as a sequence diagram
 * whose messages draw in as you read down.
 */
export function ProjectApi() {
  const root = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const scope = root.current
    if (!scope) return
    const mm = gsap.matchMedia(scope)
    mm.add(MQ.motion, () => {
      gsap.utils.toArray<HTMLElement>('.seq-msg', scope).forEach((row) => {
        ScrollTrigger.create({ trigger: row, start: 'top 78%', once: true, onEnter: () => row.classList.add('is-drawn') })
      })
    })
    mm.add(MQ.reduced, () => scope.querySelectorAll('.seq-msg').forEach((r) => r.classList.add('is-drawn')))
    return () => mm.revert()
  }, [])

  return (
    <article ref={root} id="eduai" aria-labelledby="eduai-title" className="relative mt-40 scroll-mt-16">
      <div className="shell">
        <ProjectHead id="eduai" no={e.no} name={e.name} oneLiner={e.oneLiner} meta={[e.domain, e.year, 'Solo build']} />

        <div className="grid12 mt-14 gap-y-12">
          {/* Endpoint sheet */}
          <section className="col-span-4 md:col-span-12 xl:col-span-5" aria-label="API routes">
            <p className="mono flex flex-wrap gap-x-3 text-ink-muted">
              <Metric source="eduaiRoutes">{endpoints} endpoints</Metric>
              <span>·</span>
              <span className="text-ink">{guarded} behind JWT</span>
            </p>
            <div className="mt-5 border border-line bg-bg">
              {e.api.map((group) => (
                <table key={group.base} className="mono mono-sm w-full border-collapse">
                  <caption className="border-b border-line bg-bg-raised px-3 py-2 text-left text-ink">{group.base}</caption>
                  <tbody>
                    {group.routes.map(([method, path, jwt]) => (
                      <tr key={method + path} className="border-b border-line last:border-b-0">
                        <td className="w-16 px-3 py-1.5 text-measure">{method}</td>
                        <td className="px-1 py-1.5 normal-case tracking-normal">{path}</td>
                        <td className={cx('w-12 px-3 py-1.5 text-right', jwt ? 'text-ink' : 'text-ink-muted')}>
                          {jwt ? 'JWT' : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}
            </div>
            <p className="mono mono-sm mt-3 text-ink-muted">Models · {e.models.join(' · ')}</p>
          </section>

          {/* Sequence diagram */}
          <section className="col-span-4 md:col-span-12 xl:col-span-7" aria-labelledby="eduai-seq">
            <p id="eduai-seq" className="mono text-ink-muted">
              <span className="text-ink">POST /api/courses</span> · useAI: true
            </p>

            <div className="relative mt-5 hidden md:block">
              <div className="grid grid-cols-5 gap-2">
                {e.actors.map((a) => (
                  <p key={a} className="mono border border-line-strong bg-bg px-1.5 py-2 text-center text-[10px] leading-tight text-ink [overflow-wrap:anywhere]">
                    {a}
                  </p>
                ))}
              </div>
              <div className="relative">
                {e.actors.map((a, i) => (
                  <span key={a} aria-hidden="true" className="absolute bottom-0 top-0 w-px bg-line" style={{ left: `${col(i)}%` }} />
                ))}
                <ol className="relative">
                  {e.sequence.map((m, i) => {
                    const left = Math.min(col(m.from), col(m.to))
                    const width = Math.abs(col(m.from) - col(m.to))
                    const forward = m.to > m.from
                    return (
                      <li key={i} className="seq-msg relative h-[74px]">
                        <p
                          className="mono mono-sm absolute top-3 whitespace-nowrap text-ink"
                          style={forward ? { left: `calc(${left}% + 8px)` } : { right: `calc(${100 - left - width}% + 8px)` }}
                        >
                          <span className="text-ink-muted">{String(i + 1).padStart(2, '0')} </span>
                          <span className="normal-case tracking-normal">{m.label}</span>
                        </p>
                        <span
                          aria-hidden="true"
                          className={cx('seq-arrow absolute top-[36px] h-px', i === e.sequence.length - 1 ? 'bg-signal' : 'bg-ink')}
                          style={{ left: `${left}%`, width: `${width}%`, transformOrigin: forward ? '0 50%' : '100% 50%' }}
                        >
                          <span className={cx('absolute -top-[4px] h-0 w-0 border-y-[4px] border-y-transparent', forward ? '-right-px border-l-[7px] border-l-current' : '-left-px border-r-[7px] border-r-current', i === e.sequence.length - 1 ? 'text-signal' : 'text-ink')} />
                        </span>
                        <p
                          className="mono absolute top-[44px] whitespace-nowrap text-[10px] text-ink-muted"
                          style={forward ? { left: `calc(${left}% + 8px)` } : { right: `calc(${100 - left - width}% + 8px)` }}
                        >
                          {m.note}
                        </p>
                      </li>
                    )
                  })}
                </ol>
              </div>
            </div>

            <ol className="mt-5 md:hidden">
              {e.sequence.map((m, i) => (
                <li key={i} className="grid grid-cols-[28px_1fr] gap-3 border-t border-line py-3">
                  <span className="mono mono-sm text-ink-muted">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="mono mono-sm text-ink-muted">
                      {e.actors[m.from]} → {e.actors[m.to]}
                    </p>
                    <p className="mt-1 font-medium">{m.label}</p>
                    <p className="mt-0.5 text-[14px] text-ink-muted">{m.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <Facts
          columns={4}
          className="mt-16"
          items={[
            { k: 'Problem', v: e.problem },
            { k: 'Solution', v: e.solution },
            { k: 'Hard part', v: e.challenge },
            { k: 'Outcome', v: e.outcome },
          ]}
        />
        <div className="grid12 mt-10 gap-y-6">
          <ul className="col-span-4 md:col-span-7">
            {e.security.map((line) => (
              <li key={line} className="grid grid-cols-[20px_1fr] gap-2 border-t border-line py-2 text-[15px]">
                <span aria-hidden="true" className="mono text-ink-muted">+</span>
                {line}
              </li>
            ))}
          </ul>
          <div className="col-span-4 md:col-span-5">
            <StackLine items={e.stack} />
            <ProjectLinksRow className="mt-4" links={e.links} />
          </div>
        </div>
      </div>
    </article>
  )
}
