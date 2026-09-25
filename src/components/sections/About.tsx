import { Fragment, useLayoutEffect, useRef, useState } from 'react'
import { about, type Segment } from '@/data/content'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { MQ } from '@/lib/motion'
import { cx } from '@/lib/utils'
import { SectionFrame } from '@/components/global/SectionFrame'
import { DetectBox } from '@/components/motion/DetectBox'
import { StretchHeading } from '@/components/motion/StretchHeading'

/** Splits a string into word spans, keeping the spaces between them. */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\s+)/).map((part, i) =>
        /^\s+$/.test(part) || part === '' ? (
          <Fragment key={i}>{part}</Fragment>
        ) : (
          <span key={i} className="about-word">
            {part}
          </span>
        ),
      )}
    </>
  )
}

function Segments({ parts }: { parts: string | Segment[] }) {
  const list = typeof parts === 'string' ? [parts] : parts
  return (
    <>
      {list.map((seg, i) =>
        typeof seg === 'string' ? (
          <Words key={i} text={seg} />
        ) : (
          <DetectBox key={i} tag={seg.tag} className="about-term">
            <Words text={seg.term} />
          </DetectBox>
        ),
      )}
    </>
  )
}

/** What I'm exploring. Selecting an area shows where it already shows up in the work. */
function Exploring() {
  const [active, setActive] = useState(0)
  return (
    <div>
      <p className="mono text-ink-muted">Currently exploring</p>
      <ul className="mt-4 border-t border-line">
        {about.exploring.map((row, i) => {
          const on = i === active
          return (
            <li key={row.no} className="border-b border-line">
              <button
                type="button"
                aria-expanded={on}
                onClick={() => setActive(i)}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
                onFocus={() => setActive(i)}
                className="stretch-host group grid w-full grid-cols-[40px_minmax(0,1fr)] gap-x-3 py-4 text-left"
              >
                <span className={cx('mono transition-colors duration-300', on ? 'signal-sm' : 'text-ink-muted')}>{row.no}</span>
                <span>
                  <span className="stretch block text-[clamp(1.15rem,1.6vw,1.4rem)] font-semibold uppercase leading-tight" style={{ '--wdth-to': 120 } as React.CSSProperties}>
                    {row.title}
                  </span>
                  <span className="mono mono-sm mt-1 block normal-case tracking-[0.02em] text-ink-muted">{row.items}</span>
                  <span
                    className={cx(
                      'mono mono-sm grid transition-[grid-template-rows,opacity] duration-300',
                      on ? 'mt-2 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <span className="overflow-hidden text-measure">In the work → {row.where}</span>
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/**
 * §02 How I think. Desktop: the block pins and is read word by word — the
 * questions come into full ink one at a time (unread words hold 4.5:1), and the kinds of work they led
 * to are DETECTed as they're read. Mobile: lines settle in; boxes still draw.
 */
export default function About() {
  const root = useRef<HTMLElement | null>(null)
  const pinned = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const scope = root.current
    if (!scope) return
    const mm = gsap.matchMedia(scope)

    mm.add(MQ.desktop, () => {
      const words = gsap.utils.toArray<HTMLElement>('.about-word', scope)
      const terms = gsap.utils.toArray<HTMLElement>('.about-term', scope)
      const marks = terms.map((term) => {
        const last = term.querySelectorAll('.about-word')
        return (words.indexOf(last[last.length - 1] as HTMLElement) + 1) / words.length
      })
      gsap.set(words, { opacity: 0.65 })
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinned.current,
          start: 'top top+=72',
          end: () => `+=${window.innerHeight * 1.2}`,
          pin: true,
          scrub: 0.4,
          invalidateOnRefresh: true,
          onUpdate: (self) => terms.forEach((t, i) => t.classList.toggle('is-on', self.progress >= marks[i] * 0.95)),
        },
      })
      tl.to(words, { opacity: 1, ease: 'none', stagger: { each: 1 }, duration: 1 })
    })

    mm.add(MQ.mobile, () => {
      gsap.utils.toArray<HTMLElement>('.about-sentence', scope).forEach((line) => {
        gsap.fromTo(
          line,
          { opacity: 0.65 },
          { opacity: 1, ease: 'none', scrollTrigger: { trigger: line, start: 'top 85%', end: 'top 55%', scrub: true } },
        )
      })
      gsap.utils.toArray<HTMLElement>('.about-term', scope).forEach((term) => {
        ScrollTrigger.create({ trigger: term, start: 'top 70%', once: true, onEnter: () => term.classList.add('is-on') })
      })
    })

    mm.add(MQ.reduced, () => {
      scope.querySelectorAll('.about-term').forEach((t) => t.classList.add('is-on'))
    })

    return () => mm.revert()
  }, [])

  return (
    <SectionFrame ref={root} id="about" className="section-pad relative z-10">
      <div ref={pinned} className="shell mt-12 lg:mt-16">
        <div className="grid12 gap-y-14">
          <div className="col-span-4 md:col-span-12 lg:col-span-8">
            <StretchHeading id="about-title">How I think</StretchHeading>
            <p className="about-sentence mt-10 max-w-[24ch] text-[clamp(1.6rem,3.1vw,3rem)] font-medium leading-[1.2] tracking-[-0.01em]">
              <Segments parts={about.statement[0]} />
            </p>
            <ul className="mt-8 grid gap-1">
              {about.questions.map((q, i) => (
                <li key={q} className="grid grid-cols-[40px_minmax(0,1fr)] items-baseline text-[clamp(1.2rem,2vw,1.8rem)] leading-snug">
                  <span className="mono text-ink-muted" aria-hidden="true">
                    Q{i + 1}
                  </span>
                  <span className="about-sentence">
                    <Segments parts={q} />
                  </span>
                </li>
              ))}
            </ul>
            <p className="about-sentence mt-8 max-w-[46ch] text-[clamp(1.1rem,1.6vw,1.4rem)] leading-[2.1] lg:leading-[1.9]">
              <Segments parts={about.closing} />
            </p>
          </div>

          <aside className="col-span-4 md:col-span-8 lg:col-span-4 lg:pt-3" aria-label="Currently exploring">
            <Exploring />
            <div className="mt-10 border-l-2 border-signal pl-4">
              <p className="mono text-ink-muted">Off the screen</p>
              <p className="mt-2 leading-relaxed">{about.offScreen}</p>
            </div>
          </aside>
        </div>
      </div>
    </SectionFrame>
  )
}
