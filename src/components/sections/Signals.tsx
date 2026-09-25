import { useLayoutEffect, useRef } from 'react'
import { signals } from '@/data/content'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/utils'
import { SectionFrame } from '@/components/global/SectionFrame'
import { Citation } from '@/components/motion/Citation'
import { DetectBox } from '@/components/motion/DetectBox'
import { StretchHeading } from '@/components/motion/StretchHeading'
import { Known, TodoNote } from '@/components/ui/Todo'

/** §07 Outside the code: a log, one entry a line, each detected and cited. It flushes in, line by line. */
export default function Signals() {
  const log = useRef<HTMLOListElement | null>(null)

  useLayoutEffect(() => {
    const el = log.current
    if (!el) return
    const lines = Array.from(el.querySelectorAll<HTMLElement>('.sig-line'))
    const on = () => lines.forEach((l) => l.querySelector('.detect')?.classList.add('is-on'))
    if (prefersReducedMotion()) {
      on()
      return
    }
    gsap.set(lines, { opacity: 0 })
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        lines.forEach((line, i) =>
          gsap.to(line, {
            opacity: 1,
            duration: 0.01,
            delay: i * 0.12,
            onComplete: () => line.querySelector('.detect')?.classList.add('is-on'),
          }),
        )
      },
    })
    return () => {
      st.kill()
      gsap.set(lines, { clearProps: 'opacity' })
    }
  }, [])

  return (
    <SectionFrame id="signals" className="section-pad relative z-10">
      <div className="shell mt-12 lg:mt-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <StretchHeading id="signals-title">
            Outside the <span style={{ fontVariationSettings: "'wdth' 125" }}>code</span>
          </StretchHeading>
          <p className="max-w-[36ch] text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed text-ink-muted">A few things that happened along the way.</p>
        </div>

        <ol ref={log} className="mono mt-12 border border-line bg-bg" aria-label="Activity log">
          <li aria-hidden="true" className="grid grid-cols-[84px_minmax(0,1fr)_40px] gap-4 border-b border-line px-4 py-2 text-ink-muted md:grid-cols-[120px_minmax(0,1fr)_48px]">
            <span>Year</span>
            <span>Entry</span>
            <span className="text-right">Src</span>
          </li>
          {signals.map((s, i) => (
            <li
              key={i}
              className="sig-line grid grid-cols-[84px_minmax(0,1fr)_40px] items-baseline gap-4 border-b border-line px-4 py-4 last:border-b-0 md:grid-cols-[120px_minmax(0,1fr)_48px]"
            >
              <span className="text-ink-muted">
                <Known value={s.year} label="Year">
                  {(y) => y}
                </Known>
                {!import.meta.env.DEV && typeof s.year !== 'string' ? '—' : null}
              </span>
              <span className="leading-[2] normal-case tracking-normal">
                <DetectBox tag={s.tag} className="text-[15px] font-semibold text-ink">
                  {s.what}
                </DetectBox>
                <span className="text-ink-muted"> — {s.detail}</span>
                {s.links ? (
                  <span className="mt-1 flex flex-wrap gap-x-5">
                    {s.links.map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="link mono">
                        <span className="link-rule">{l.label}</span> ↗
                      </a>
                    ))}
                  </span>
                ) : null}
                {s.note && import.meta.env.DEV ? <TodoNote item={s.note} label="GSSoC links" className="ml-2" /> : null}
              </span>
              <span className="text-right">
                <Citation k="resume" />
              </span>
            </li>
          ))}
        </ol>
      </div>
    </SectionFrame>
  )
}
