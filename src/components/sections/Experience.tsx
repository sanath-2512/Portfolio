import { useState } from 'react'
import { education, experience } from '@/data/content'
import { cx } from '@/lib/utils'
import { SectionFrame } from '@/components/global/SectionFrame'
import { DimensionLine } from '@/components/motion/DimensionLine'
import { Metric } from '@/components/motion/Metric'
import { ScanReveal } from '@/components/motion/ScanReveal'
import { StretchHeading } from '@/components/motion/StretchHeading'
import { ArchitectureStrip } from '@/components/sections/ArchitectureStrip'

/**
 * §03 Where I learned to ship. One role: the problems it was actually about,
 * three pieces of the work, and the pipeline they sat in. Pointing at a card
 * (or focusing it) lights the stages it touched.
 */
export default function Experience() {
  const [focus, setFocus] = useState<string[]>([])

  return (
    <SectionFrame id="experience" field="chunks" className="section-pad relative z-10">
      <div className="shell mt-12 lg:mt-16">
        <StretchHeading id="experience-title" className="max-w-[16ch]">
          Where I learned to <span style={{ fontVariationSettings: "'wdth' 125" }}>ship</span>
        </StretchHeading>

        <div className="grid12 mt-14 gap-y-8">
          <div className="col-span-4 md:col-span-5">
            <p className="text-[clamp(2rem,4.4vw,3.75rem)] font-extrabold uppercase leading-[0.9]" style={{ fontVariationSettings: "'wdth' 118" }}>
              {experience.org}
            </p>
            <p className="mono mt-4 text-ink">{experience.role}</p>
            <p className="mono mt-1 text-ink-muted">Jun — Aug 2026 · {experience.location}</p>
          </div>
          <div className="col-span-4 grid max-w-[56ch] gap-4 text-[clamp(1.05rem,1.45vw,1.3rem)] leading-relaxed md:col-span-7">
            <p>{experience.intro[0]}</p>
            <p className="text-ink-muted">{experience.intro[1]}</p>
          </div>
        </div>

        <div className="mt-12">
          <DimensionLine value={experience.months} label="months on the team" />
          <div className="mono mono-sm mt-2 flex justify-between text-ink-muted" aria-hidden="true">
            <span>Jun 2026</span>
            <span>Jul</span>
            <span>Aug 2026</span>
          </div>
        </div>

        <ScanReveal className="mt-10">
          <ol className="grid gap-px border border-line bg-line lg:grid-cols-3" onPointerLeave={() => setFocus([])}>
            {experience.cards.map((card) => {
              const on = focus.join() === card.stages.join()
              return (
                <li
                  key={card.no}
                  tabIndex={0}
                  aria-label={`${card.title}. Highlights the related pipeline stages below.`}
                  onPointerEnter={() => setFocus(card.stages)}
                  onFocus={() => setFocus(card.stages)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocus([])
                  }}
                  className={cx(
                    'stretch-host group flex min-h-[280px] flex-col bg-bg p-6 transition-colors duration-300 lg:p-8',
                    on && 'bg-bg-raised',
                  )}
                >
                  <p className={cx('mono transition-colors duration-300', on ? 'signal-sm' : 'text-ink-muted')}>{card.no}</p>
                  <h3
                    className="stretch mt-3 text-[clamp(1.6rem,2.6vw,2.4rem)] font-extrabold uppercase leading-[0.95]"
                    style={{ '--wdth-to': 122 } as React.CSSProperties}
                  >
                    {card.title}
                  </h3>
                  <p className="mt-6 flex-1 text-[clamp(1rem,1.25vw,1.12rem)] leading-relaxed">
                    {card.body.map((p, j) =>
                      typeof p === 'string' ? (
                        p
                      ) : (
                        <Metric key={j} source={p.source}>
                          {p.metric}
                        </Metric>
                      ),
                    )}
                  </p>
                  <p className={cx('mono mono-sm mt-6 transition-colors duration-300', on ? 'text-measure' : 'text-ink-muted')}>
                    ↓ {card.stages.length === 1 ? '1 stage' : `${card.stages.length} stages`} in the pipeline below
                  </p>
                </li>
              )
            })}
          </ol>
        </ScanReveal>
        <p className="mono mono-sm mt-4 leading-relaxed text-ink-muted">
          <span className="text-ink">Stack</span> — {experience.stack.join(' · ')}
        </p>
      </div>

      <ArchitectureStrip focus={focus} />

      <div className="shell mt-16">
        <p className="mono text-ink-muted">Education</p>
        <div className="mt-4 grid12 gap-y-2 border-t border-line pt-5">
          <p className="col-span-4 text-[clamp(1.15rem,1.8vw,1.5rem)] font-semibold md:col-span-5">{education.degree}</p>
          <p className="col-span-4 text-ink-muted md:col-span-4">{education.school}</p>
          <p className="mono col-span-4 md:col-span-3 md:text-right">
            {education.period} · CGPA <Metric source="resume">{education.cgpa}</Metric>
          </p>
        </div>
      </div>
    </SectionFrame>
  )
}
