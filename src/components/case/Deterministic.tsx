import { useRef } from 'react'
import { worthyApply, whyNotes } from '@/data/content'
import { useGsapContext } from '@/hooks/useGsapContext'
import { revealUp } from '@/lib/motion'
import { WhyNote } from '@/components/ui/WhyNote'

/** LLM → structured evidence → deterministic score. */
export function Deterministic() {
  const root = useRef<HTMLDivElement | null>(null)
  const { title, body, steps } = worthyApply.deterministic

  useGsapContext(root, () => {
    revealUp('.det-step', { trigger: root.current, start: 'top 75%' })
  })

  return (
    <div ref={root}>
      <h3 className="mono text-fg-faint">{title}</h3>

      <div className="grid12 mt-8 gap-y-10">
        <p className="body-lg col-span-4 max-w-[48ch] text-fg md:col-span-5">{body}</p>

        <ol className="col-span-4 md:col-span-6 md:col-start-7">
          {steps.map((step, index) => (
            <li key={step.id} className="det-step flex gap-5 border-t border-line py-6">
              <span className="mono pt-1 text-accent">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <p className="display-sm text-fg">{step.label}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-fg-dim">{step.note}</p>
              </div>
              {index < steps.length - 1 ? (
                <span className="ml-auto self-center text-fg-faint" aria-hidden="true">
                  ↓
                </span>
              ) : null}
            </li>
          ))}
          <li className="border-t border-line" aria-hidden="true" />
        </ol>
      </div>

      <WhyNote note={whyNotes.deterministic} className="det-step mt-12" />
    </div>
  )
}
