import { useRef } from 'react'
import { experience, whyNotes } from '@/data/content'
import { useGsapMatchMedia } from '@/hooks/useGsapMatchMedia'
import { gsap } from '@/lib/gsap'
import { isDesktopQuery, pinSequence, revealUp } from '@/lib/motion'
import { prefersReducedMotion } from '@/lib/utils'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { WhyNote } from '@/components/ui/WhyNote'

const CHAPTER_LABELS = ['Company', 'Role', 'The work', 'Technologies', 'Impact']

export default function Experience() {
  const root = useRef<HTMLElement | null>(null)
  const stage = useRef<HTMLDivElement | null>(null)

  useGsapMatchMedia(root, (mm) => {
    mm.add(isDesktopQuery, () => {
      if (prefersReducedMotion()) return
      const chapters = gsap.utils.toArray<HTMLElement>('.exp-chapter')
      const dots = gsap.utils.toArray<HTMLElement>('.exp-dot')
      if (!stage.current || chapters.length === 0) return

      gsap.set(chapters.slice(1), { autoAlpha: 0, y: 28 })
      gsap.set(dots.slice(1), { opacity: 0.25 })

      const tl = pinSequence(stage.current, { distance: 3.2 })

      chapters.forEach((chapter, index) => {
        if (index === 0) return
        tl.to(chapters[index - 1], { autoAlpha: 0, y: -28, duration: 0.45, ease: 'none' })
          .to(dots[index - 1], { opacity: 0.25, duration: 0.2, ease: 'none' }, '<')
          .to(chapter, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'none' }, '<0.2')
          .to(dots[index], { opacity: 1, duration: 0.2, ease: 'none' }, '<')
          .to({}, { duration: 0.35 })
      })
    })

    mm.add(`(max-width: 767px)`, () => {
      revealUp('.exp-chapter', { trigger: root.current, start: 'top 80%' })
    })

    if (prefersReducedMotion()) {
      mm.add(isDesktopQuery, () => {
        revealUp('.exp-chapter', { trigger: root.current })
      })
    }

    mm.add('all', () => {
      revealUp('.reveal-group', { trigger: root.current, stagger: 0 })
    })
  })

  return (
    <section ref={root} id="experience" className="section" aria-labelledby="experience-title">
      <div className="shell">
        <SectionHeader
          index="03"
          label="Experience"
          title={<span id="experience-title">Enterprise documents, made answerable.</span>}
        />
      </div>

      <div
        ref={stage}
        className="shell mt-16 md:mt-24 md:flex md:min-h-svh md:items-center md:py-20"
      >
        <div className="grid12 w-full gap-y-12">
          {/* Persistent context and progress; on mobile the chapters carry
              this themselves, so the column collapses away entirely. */}
          <div className="hidden md:col-span-4 md:block">
            <p className="mono text-accent">{experience.period}</p>

            <ol className="mt-8" aria-hidden="true">
              {CHAPTER_LABELS.map((label) => (
                <li key={label} className="exp-dot flex items-center gap-4 py-2" style={{ opacity: 1 }}>
                  <span className="h-px w-8 bg-accent" />
                  <span className="mono text-fg">{label}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="chapter-stack col-span-4 md:col-span-7 md:col-start-6">
            <article className="exp-chapter chapter">
              <p className="mono text-fg-faint">{CHAPTER_LABELS[0]}</p>
              <h3 className="display-md mt-5 text-fg">{experience.company}</h3>
              <p className="body-lg mt-6 max-w-[46ch]">{experience.summary}</p>
            </article>

            <article className="exp-chapter chapter">
              <p className="mono text-fg-faint">{CHAPTER_LABELS[1]}</p>
              <h3 className="display-md mt-5 text-fg">{experience.role}</h3>
              <p className="mono mt-6 text-accent">{experience.period}</p>
            </article>

            <article className="exp-chapter chapter">
              <p className="mono text-fg-faint">{CHAPTER_LABELS[2]}</p>
              <ul className="mt-5 max-w-[56ch]">
                {experience.work.map((line) => (
                  <li key={line} className="border-t border-line py-4 text-[15px] leading-relaxed text-fg-dim">
                    {line}
                  </li>
                ))}
              </ul>
            </article>

            <article className="exp-chapter chapter">
              <p className="mono text-fg-faint">{CHAPTER_LABELS[3]}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {experience.tech.map((item) => (
                  <li
                    key={item}
                    className="inline-flex min-h-[38px] items-center border border-line-strong px-3 text-[13px] text-fg"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="exp-chapter chapter">
              <p className="mono text-fg-faint">{CHAPTER_LABELS[4]}</p>
              <p className="numeric mt-5 font-display text-[clamp(4rem,10vw,7rem)] font-bold leading-none tracking-tight text-accent">
                {experience.impact.value}
              </p>
              <p className="mt-4 max-w-[36ch] text-[15px] text-fg-dim">{experience.impact.label}</p>
              <WhyNote note={whyNotes.rag} className="mt-10" />
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
