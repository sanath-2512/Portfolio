import { useRef } from 'react'
import { worthyApply } from '@/data/content'
import { useGsapContext } from '@/hooks/useGsapContext'
import { revealUp } from '@/lib/motion'
import { Pipeline } from '@/components/case/Pipeline'
import { Performance } from '@/components/case/Performance'
import { Deterministic } from '@/components/case/Deterministic'
import { Architecture } from '@/components/case/Architecture'
import { ActionLink } from '@/components/ui/ActionLink'
import { GitHubIcon } from '@/components/ui/Icons'

export default function CaseStudy() {
  const root = useRef<HTMLElement | null>(null)
  const hasLinks = Boolean(worthyApply.github || worthyApply.demo)

  useGsapContext(root, () => {
    revealUp('.case-head', { trigger: root.current, stagger: 0.1 })
    revealUp('.case-block', { trigger: root.current, start: 'top 72%' })
    revealUp('.case-feature', { trigger: '.case-features', start: 'top 80%', stagger: 0.04 })
  })

  return (
    <section ref={root} id="projects" className="section" aria-labelledby="case-title">
      <div className="shell">
        {/* Masthead */}
        <div className="case-head flex items-center gap-4 border-t border-line pt-4">
          <span className="mono text-accent">04</span>
          <span className="mono text-fg-faint">Flagship</span>
          <span className="mono ml-auto text-fg-faint">{worthyApply.status}</span>
        </div>

        <h2 id="case-title" className="case-head display-xl mt-8 text-fg">
          {worthyApply.name}
        </h2>
        <p className="case-head mono mt-6 text-fg-faint">{worthyApply.kind}</p>
        <p className="case-head body-lg mt-8 max-w-[58ch] text-fg">{worthyApply.summary}</p>

        <ul className="case-head mt-8 flex flex-wrap gap-2">
          {worthyApply.stack.map((item) => (
            <li
              key={item}
              className="inline-flex min-h-[34px] items-center border border-line px-3 text-[13px] text-fg-dim"
            >
              {item}
            </li>
          ))}
        </ul>

        {/* Problem / Solution */}
        <div className="grid12 mt-24 gap-y-12 md:mt-32">
          <div className="case-block col-span-4 md:col-span-5">
            <h3 className="mono text-fg-faint">{worthyApply.problem.title}</h3>
            <p className="mt-5 max-w-[46ch] text-[16px] leading-relaxed text-fg-dim">
              {worthyApply.problem.body}
            </p>
          </div>
          <div className="case-block col-span-4 md:col-span-6 md:col-start-7">
            <h3 className="mono text-accent">{worthyApply.solution.title}</h3>
            <p className="mt-5 max-w-[46ch] text-[16px] leading-relaxed text-fg">
              {worthyApply.solution.body}
            </p>
          </div>
        </div>

        <div className="mt-28 md:mt-40">
          <Pipeline />
        </div>

        <div className="mt-28 md:mt-40">
          <Performance />
        </div>

        <div className="mt-28 md:mt-40">
          <Deterministic />
        </div>

        <div className="mt-28 md:mt-40">
          <Architecture />
        </div>

        {/* Features */}
        <div className="case-features mt-28 md:mt-40">
          <h3 className="mono text-fg-faint">Features</h3>
          <ul className="mt-8 grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {worthyApply.features.map((feature, index) => (
              <li key={feature} className="case-feature flex gap-4 border-t border-line py-4">
                <span className="mono pt-1 text-fg-faint">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-[15px] leading-snug text-fg">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {hasLinks ? (
          <div className="case-block mt-16 flex flex-wrap gap-3">
            <ActionLink href={worthyApply.github} label="Source" icon={<GitHubIcon size={15} />} />
            <ActionLink href={worthyApply.demo} label="Live demo" variant="solid" />
          </div>
        ) : null}
      </div>
    </section>
  )
}
