import { useRef } from 'react'
import { worthyApply } from '@/data/content'
import { useGsapContext } from '@/hooks/useGsapContext'
import { gsap } from '@/lib/gsap'
import { EASE, STAGGER, DUR } from '@/lib/motion'
import { prefersReducedMotion } from '@/lib/utils'

/** Resume/JD → … → Tailored Resume, revealed one stage at a time. */
export function Pipeline() {
  const root = useRef<HTMLDivElement | null>(null)

  useGsapContext(root, () => {
    const reduced = prefersReducedMotion()
    const trigger = root.current

    if (reduced) {
      gsap.set('.pipe-chip, .pipe-row', { opacity: 1 })
      gsap.set('.pipe-connector', { scaleX: 1 })
      return
    }

    gsap
      .timeline({ scrollTrigger: { trigger, start: 'top 72%', once: true } })
      .fromTo('.pipe-chip', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: DUR.short, ease: EASE, stagger: STAGGER.tight })
      .fromTo('.pipe-connector', { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: EASE, stagger: STAGGER.tight }, 0.1)

    gsap.fromTo(
      '.pipe-row',
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: DUR.base,
        ease: EASE,
        stagger: STAGGER.loose,
        scrollTrigger: { trigger, start: 'top 60%', once: true },
      },
    )
  })

  return (
    <div ref={root}>
      <h3 className="mono text-fg-faint">Pipeline</h3>

      {/* Compact chain — the shape of the thing */}
      <ol className="mt-8 flex flex-wrap items-center gap-y-3">
        {worthyApply.pipeline.map((stage, index) => (
          <li key={stage.id} className="flex items-center">
            {index > 0 ? (
              <span className="pipe-connector mx-2 h-px w-4 origin-left bg-line-strong md:w-7" aria-hidden="true" />
            ) : null}
            <span className="pipe-chip mono whitespace-nowrap text-fg">{stage.label}</span>
          </li>
        ))}
      </ol>

      {/* The detail, stage by stage */}
      <div className="mt-12">
        {worthyApply.pipeline.map((stage, index) => (
          <div key={stage.id} className="pipe-row grid12 gap-y-2 border-t border-line py-6">
            <span className="mono col-span-4 text-accent md:col-span-1">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h4 className="display-sm col-span-4 text-fg md:col-span-4">{stage.label}</h4>
            <p className="col-span-4 max-w-[52ch] text-[15px] leading-relaxed text-fg-dim md:col-span-6 md:col-start-7">
              {stage.note}
            </p>
          </div>
        ))}
        <div className="border-t border-line" />
      </div>
    </div>
  )
}
