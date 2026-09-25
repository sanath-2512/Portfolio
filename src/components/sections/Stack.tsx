import { useId, useLayoutEffect, useRef, useState } from 'react'
import { projectTags, stack, type ProjectTag } from '@/data/content'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { DUR, EASE } from '@/lib/motion'
import { useDesktop } from '@/hooks/useMediaQuery'
import { cx, prefersReducedMotion } from '@/lib/utils'
import { SectionFrame } from '@/components/global/SectionFrame'
import { StretchHeading } from '@/components/motion/StretchHeading'

/**
 * §06 Stack as a spec sheet: what each tool was for and which projects used
 * it. No logos, no bars, no stars. A project chip dims everything that
 * project didn't use.
 */
export default function Stack() {
  const [filter, setFilter] = useState<ProjectTag | null>(null)
  const [open, setOpen] = useState<string>(stack[0].id)
  const desktop = useDesktop()
  const root = useRef<HTMLElement | null>(null)
  const uid = useId()

  // Rows register: each hairline measures out, left to right, as its category enters.
  useLayoutEffect(() => {
    const scope = root.current
    if (!scope || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.stack-group', scope).forEach((group) => {
        const rules = group.querySelectorAll('.stack-rule')
        gsap.set(rules, { scaleX: 0 })
        ScrollTrigger.create({
          trigger: group,
          start: 'top 82%',
          once: true,
          onEnter: () => gsap.to(rules, { scaleX: 1, duration: DUR.in, ease: EASE, stagger: 0.04 }),
        })
      })
    }, scope)
    return () => ctx.revert()
  }, [desktop])

  return (
    <SectionFrame ref={root} id="stack" className="section-pad relative z-10">
      <div className="shell mt-12 lg:mt-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <StretchHeading id="stack-title">
            Stack, <span style={{ fontVariationSettings: "'wdth' 125" }}>as used</span>
          </StretchHeading>
          <p className="mono max-w-[46ch] text-ink-muted">
            From my résumé, mapped to a project only where that project’s code shows it.
          </p>
        </div>

        <div role="group" aria-label="Filter by project" className="mt-10 flex flex-wrap gap-2">
          {[null, ...projectTags].map((tag) => {
            const on = filter === tag
            return (
              <button
                key={tag ?? 'all'}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(tag)}
                className={cx(
                  'mono min-h-[44px] border px-3 transition-colors duration-300',
                  on ? 'border-ink bg-ink text-bg' : 'border-line-strong text-ink-muted hover:border-ink hover:text-ink',
                )}
              >
                {tag ?? 'All'}
              </button>
            )
          })}
        </div>

        <div className="mt-12 grid gap-y-2">
          {stack.map((group) => {
            const used = group.tools.filter((t) => t.projects.length > 0)
            const also = group.tools.filter((t) => t.projects.length === 0)
            const expanded = desktop || open === group.id
            const panelId = `${uid}-${group.id}`
            return (
              <section key={group.id} className="stack-group grid12 border-t border-line pt-4 lg:pt-6" aria-labelledby={`${panelId}-h`}>
                <h3 id={`${panelId}-h`} className="col-span-4 md:col-span-12 lg:col-span-3">
                  {desktop ? (
                    <span className="mono text-ink">{group.label}</span>
                  ) : (
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => setOpen(expanded ? '' : group.id)}
                      className="mono flex min-h-[44px] w-full items-center justify-between text-left text-ink"
                    >
                      {group.label}
                      <span aria-hidden="true" className="text-ink-muted">
                        {expanded ? '−' : '+'} {group.tools.length}
                      </span>
                    </button>
                  )}
                </h3>

                <div id={panelId} hidden={!expanded} className="col-span-4 pb-6 md:col-span-12 lg:col-span-9">
                  <ul>
                    {used.map((tool) => {
                      const dim = filter !== null && !tool.projects.includes(filter)
                      return (
                        <li
                          key={tool.name}
                          className={cx(
                            'stack-row stretch-host detect group relative grid gap-x-6 gap-y-1 py-3 transition-opacity duration-300 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)_minmax(0,1.6fr)]',
                            dim && 'opacity-25',
                          )}
                        >
                          <span className="detect-box" aria-hidden="true">
                            <i />
                            <i />
                            <i />
                            <i />
                          </span>
                          <span className="stack-rule absolute bottom-0 left-0 right-0 h-px origin-left bg-line" aria-hidden="true" />
                          <span className="stretch text-[clamp(1.2rem,1.8vw,1.55rem)] font-semibold leading-tight" style={{ '--wdth-to': 122 } as React.CSSProperties}>
                            {tool.name}
                          </span>
                          <span className="text-[15px] text-ink-muted md:pt-1">{tool.use}</span>
                          <span className="mono mono-sm flex flex-wrap gap-x-3 gap-y-1 md:justify-end md:pt-1.5">
                            {tool.projects.map((p) => (
                              <span
                                key={p}
                                className={cx('stack-tag transition-colors duration-300', filter === p ? 'signal-sm' : 'text-ink-muted')}
                              >
                                {p}
                              </span>
                            ))}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                  {also.length > 0 ? (
                    <p className={cx('mono mono-sm mt-3 text-ink-muted transition-opacity duration-300', filter && 'opacity-25')}>
                      Also worked with — <span className="text-ink">{also.map((t) => t.name).join(' · ')}</span>
                    </p>
                  ) : null}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </SectionFrame>
  )
}
