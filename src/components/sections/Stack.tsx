import { useLayoutEffect, useRef, useState } from 'react'
import { projectTags, toolkit, toolkitAlso, type ProjectTag, type Tool } from '@/data/content'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { DUR, EASE } from '@/lib/motion'
import { useDesktop } from '@/hooks/useMediaQuery'
import { cx, prefersReducedMotion } from '@/lib/utils'
import { SectionFrame } from '@/components/global/SectionFrame'
import { StretchHeading } from '@/components/motion/StretchHeading'

/** Where a tool was actually used: the answer to "why is this on the list?" */
function Inspector({ tool, filter }: { tool: Tool; filter: ProjectTag | null }) {
  return (
    <div className="detect is-on relative block border border-line bg-bg p-5 lg:p-6" aria-live="polite">
      <span className="detect-box" aria-hidden="true" style={{ inset: -1 }}>
        <i />
        <i />
        <i />
        <i />
      </span>
      <p className="text-[clamp(1.6rem,2.6vw,2.4rem)] font-extrabold uppercase leading-none" style={{ fontVariationSettings: "'wdth' 120" }}>
        {tool.name}
      </p>
      <p className="mt-3 text-[16px] leading-snug">{tool.use}</p>
      <p className="mono mono-sm mt-5 flex flex-wrap gap-x-3 gap-y-1">
        {tool.projects.map((p) => (
          <span key={p} className={filter === p ? 'signal-sm' : 'text-ink'}>
            {p}
          </span>
        ))}
      </p>
      <ul className="mt-4 grid gap-1 border-t border-line pt-4">
        {tool.details.map((d) => (
          <li key={d} className="mono mono-sm normal-case tracking-[0.02em] text-ink-muted">
            {d.startsWith('→') ? d : `→ ${d}`}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * §06 Tools I actually use. Not a logo wall: four groups, each tool a button.
 * Pointing at, focusing or tapping one shows where it was actually used.
 * A project chip dims everything that project didn't touch.
 */
export default function Stack() {
  const [filter, setFilter] = useState<ProjectTag | null>(null)
  const [active, setActive] = useState<string>('Pytest')
  const desktop = useDesktop()
  const root = useRef<HTMLElement | null>(null)
  const all = toolkit.flatMap((g) => g.tools)
  const current = all.find((t) => t.name === active) ?? all[0]

  // Groups register: each hairline measures out as its group enters.
  useLayoutEffect(() => {
    const scope = root.current
    if (!scope || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.tk-group', scope).forEach((group) => {
        const rule = group.querySelector('.tk-rule')
        gsap.set(rule, { scaleX: 0 })
        ScrollTrigger.create({
          trigger: group,
          start: 'top 85%',
          once: true,
          onEnter: () => gsap.to(rule, { scaleX: 1, duration: DUR.in, ease: EASE }),
        })
      })
    }, scope)
    return () => ctx.revert()
  }, [desktop])

  return (
    <SectionFrame ref={root} id="stack" className="section-pad relative z-10">
      <div className="shell mt-12 lg:mt-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <StretchHeading id="stack-title" className="max-w-[14ch]">
            Tools I <span style={{ fontVariationSettings: "'wdth' 125" }}>actually</span> use
          </StretchHeading>
          <p className="max-w-[36ch] text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed text-ink-muted">
            I don’t collect technologies. I use them when the problem calls for them.
          </p>
        </div>

        <div role="group" aria-label="Show tools used by a project" className="mt-10 flex flex-wrap gap-2">
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

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] lg:gap-14">
          <div className="grid gap-10 md:grid-cols-2">
            {toolkit.map((group) => {
              const hasActive = group.tools.some((t) => t.name === current.name)
              return (
                <section key={group.id} className="tk-group" aria-labelledby={`tk-${group.id}`}>
                  <h3 id={`tk-${group.id}`} className="mono text-ink">
                    {group.label}
                  </h3>
                  <span className="tk-rule mt-2 block h-px origin-left bg-line-strong" aria-hidden="true" />
                  <ul className="mt-3">
                    {group.tools.map((tool) => {
                      const dim = filter !== null && !tool.projects.includes(filter)
                      const on = tool.name === current.name
                      return (
                        <li key={tool.name}>
                          <button
                            type="button"
                            aria-pressed={on}
                            onClick={() => setActive(tool.name)}
                            onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(tool.name)}
                            onFocus={() => setActive(tool.name)}
                            className={cx(
                              'stretch-host group flex min-h-[44px] w-full items-baseline justify-between gap-4 border-b border-line py-2 text-left transition-opacity duration-300',
                              dim && 'opacity-30',
                            )}
                          >
                            <span
                              className={cx(
                                'stretch text-[clamp(1.2rem,1.7vw,1.5rem)] font-semibold leading-tight transition-colors duration-300',
                                on ? 'text-ink' : 'text-ink-muted group-hover:text-ink',
                              )}
                              style={{ '--wdth-to': 122 } as React.CSSProperties}
                            >
                              {tool.name}
                            </span>
                            <span className={cx('mono mono-sm shrink-0', on ? 'text-measure' : 'text-ink-muted')}>
                              {tool.projects.length} {tool.projects.length === 1 ? 'project' : 'projects'}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                  {!desktop && hasActive ? (
                    <div className="mt-4">
                      <Inspector tool={current} filter={filter} />
                    </div>
                  ) : null}
                </section>
              )
            })}
          </div>

          {desktop ? (
            <aside className="self-start lg:sticky lg:top-24" aria-label="Where this tool was used">
              <p className="mono mb-3 text-ink-muted">Where it was used</p>
              <Inspector tool={current} filter={filter} />
            </aside>
          ) : null}
        </div>

        <p className="mono mono-sm mt-10 leading-relaxed text-ink-muted">
          Also — <span className="text-ink">{toolkitAlso.join(' · ')}</span>
        </p>
      </div>
    </SectionFrame>
  )
}
