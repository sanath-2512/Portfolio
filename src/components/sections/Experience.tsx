import { education, experience } from '@/data/content'
import { SectionFrame } from '@/components/global/SectionFrame'
import { DimensionLine } from '@/components/motion/DimensionLine'
import { Metric } from '@/components/motion/Metric'
import { ScanReveal } from '@/components/motion/ScanReveal'
import { StretchHeading } from '@/components/motion/StretchHeading'
import { ArchitectureStrip } from '@/components/sections/ArchitectureStrip'

/**
 * §03 Field report. One role, reported plainly: a metadata block, four
 * statements, the tenure measured across the top, then the system it sat in.
 */
export default function Experience() {
  const meta = [
    { k: 'Org', v: experience.org },
    { k: 'Role', v: experience.role },
    { k: 'Period', v: experience.period },
    { k: 'Location', v: experience.location },
  ]

  return (
    <SectionFrame id="experience" field="chunks" className="section-pad relative z-10">
      <div className="shell mt-12 lg:mt-16">
        <StretchHeading id="experience-title">
          Field <span style={{ fontVariationSettings: "'wdth' 125" }}>report</span>
        </StretchHeading>

        {/* Tenure: Jun → Aug 2026, measured. */}
        <div className="mt-12">
          <DimensionLine value={experience.months} label="months on the team" />
          <div className="mono mono-sm mt-2 flex justify-between text-ink-muted" aria-hidden="true">
            <span>Jun 2026</span>
            <span>Jul</span>
            <span>Aug 2026</span>
          </div>
        </div>

        <ScanReveal className="mt-10" contentClassName="border border-line bg-bg">
          <article className="grid12 gap-y-8 p-5 md:p-8 lg:p-10" aria-labelledby="experience-title">
            <div className="col-span-4 md:col-span-4">
              <dl className="mono">
                {meta.map((row) => (
                  <div key={row.k} className="grid grid-cols-[88px_1fr] gap-3 border-b border-line py-2.5 first:border-t">
                    <dt className="text-ink-muted">{row.k}</dt>
                    <dd className="text-ink">{row.v}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-[88px_1fr] gap-3 border-b border-line py-2.5">
                  <dt className="text-ink-muted">Stack</dt>
                  <dd className="leading-relaxed text-ink">{experience.stack.join(' · ')}</dd>
                </div>
              </dl>
            </div>

            <ol className="col-span-4 md:col-span-8">
              {experience.statements.map((parts, i) => (
                <li key={i} className="grid grid-cols-[40px_1fr] gap-3 border-b border-line py-5 first:border-t first:pt-5">
                  <span className="mono text-ink-muted">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-[clamp(1.05rem,1.4vw,1.25rem)] leading-snug">
                    {parts.map((p, j) =>
                      typeof p === 'string' ? (
                        p
                      ) : (
                        <Metric key={j} source={p.source}>
                          {p.metric}
                        </Metric>
                      ),
                    )}
                  </p>
                </li>
              ))}
            </ol>
          </article>
        </ScanReveal>
      </div>

      <ArchitectureStrip />

      <div className="shell mt-16">
        <p className="mono text-ink-muted">Education</p>
        <div className="mt-4 grid12 gap-y-2 border-t border-line pt-5">
          <p className="col-span-4 text-[clamp(1.15rem,1.8vw,1.5rem)] font-semibold md:col-span-5">{education.degree}</p>
          <p className="col-span-4 text-ink-muted md:col-span-4">{education.school}</p>
          <p className="mono col-span-4 md:col-span-3 md:text-right">
            {education.period} · CGPA{' '}
            <Metric source="resume">{education.cgpa}</Metric>
          </p>
        </div>
      </div>
    </SectionFrame>
  )
}
