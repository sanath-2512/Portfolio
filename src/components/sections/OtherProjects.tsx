import { useRef } from 'react'
import { agentFlow, projects, whyNotes } from '@/data/content'
import { useGsapContext } from '@/hooks/useGsapContext'
import { revealUp } from '@/lib/motion'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { WhyNote } from '@/components/ui/WhyNote'
import { ActionLink } from '@/components/ui/ActionLink'
import { GitHubIcon } from '@/components/ui/Icons'

const [agriMind, eduAI] = projects

/** A linear read of the AgriMind agent: retrieve, check, then answer. */
function AgentFlow() {
  return (
    <svg
      viewBox="0 0 240 132"
      className="w-full"
      role="img"
      aria-label="AgriMind agent flow: retrieve, then evaluate relevance, then answer or predict."
    >
      <g fill="none" stroke="var(--color-line-strong)" strokeWidth="1">
        <path d="M120 34v14M120 82v14" />
      </g>
      {agentFlow.map((step, index) => (
        <g key={step.id}>
          <rect
            x="34"
            y={index * 48 + 10}
            width="172"
            height="24"
            fill="none"
            stroke={index === agentFlow.length - 1 ? 'var(--color-accent-line)' : 'var(--color-line-strong)'}
          />
          <text
            x="120"
            y={index * 48 + 26}
            textAnchor="middle"
            fontSize="9"
            letterSpacing="1.4"
            fill={index === agentFlow.length - 1 ? 'var(--color-accent)' : 'var(--color-fg-dim)'}
            style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}
          >
            {step.label.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function OtherProjects() {
  const root = useRef<HTMLElement | null>(null)

  useGsapContext(root, () => {
    revealUp('.reveal-group', { trigger: root.current, stagger: 0 })
    revealUp('.proj-block', { trigger: root.current, start: 'top 75%' })
  })

  return (
    <section ref={root} id="other-projects" className="section" aria-labelledby="other-projects-title">
      <div className="shell">
        <SectionHeader
          index="05"
          label="Other projects"
          title={<span id="other-projects-title">Two more, built end to end.</span>}
          titleClassName="display-md"
        />

        {/* AgriMind — the fuller of the two */}
        <article className="proj-block mt-20 border-t border-line pt-10">
          <div className="grid12 gap-y-10">
            <div className="col-span-4 md:col-span-7">
              <div className="flex items-baseline gap-4">
                <h3 className="display-md text-fg">{agriMind.name}</h3>
                <p className="mono text-fg-faint">{agriMind.kind}</p>
              </div>
              <p className="body-lg mt-6 max-w-[48ch] text-fg">{agriMind.description}</p>

              <ul className="mt-8 max-w-[52ch]">
                {agriMind.highlights.map((highlight) => (
                  <li key={highlight} className="border-t border-line py-4 text-[15px] leading-relaxed text-fg-dim">
                    {highlight}
                  </li>
                ))}
              </ul>

              <ul className="mt-8 flex flex-wrap gap-2">
                {agriMind.stack.map((item) => (
                  <li
                    key={item}
                    className="inline-flex min-h-[32px] items-center border border-line px-3 text-[12px] text-fg-dim"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <ActionLink href={agriMind.github} label="Source" icon={<GitHubIcon size={15} />} />
                <ActionLink href={agriMind.demo} label="Live demo" />
              </div>
            </div>

            <div className="col-span-4 md:col-span-4 md:col-start-9">
              <p className="mono text-fg-faint">Agent flow</p>
              <div className="mt-5 max-w-[280px]">
                <AgentFlow />
              </div>
              <WhyNote note={whyNotes.langgraph} className="mt-10" />
            </div>
          </div>
        </article>

        {/* EduAI — compact */}
        <article className="proj-block mt-16 border-t border-line pt-10">
          <div className="grid12 gap-y-6">
            <div className="col-span-4 md:col-span-3">
              <h3 className="display-sm text-fg">{eduAI.name}</h3>
              <p className="mono mt-2 text-fg-faint">{eduAI.kind}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ActionLink href={eduAI.github} label="Source" variant="bare" />
                <ActionLink href={eduAI.demo} label="Demo" variant="bare" />
              </div>
            </div>

            <div className="col-span-4 md:col-span-5">
              <p className="text-[16px] leading-relaxed text-fg">{eduAI.description}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {eduAI.stack.map((item) => (
                  <li
                    key={item}
                    className="inline-flex min-h-[32px] items-center border border-line px-3 text-[12px] text-fg-dim"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <ul className="col-span-4 md:col-span-4">
              {eduAI.highlights.map((highlight) => (
                <li key={highlight} className="border-t border-line py-3 text-[14px] leading-relaxed text-fg-dim">
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  )
}
