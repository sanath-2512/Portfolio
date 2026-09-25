import { Fragment, useLayoutEffect, useRef } from 'react'
import { about, isTodo, type Segment } from '@/data/content'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { MQ } from '@/lib/motion'
import { SectionFrame } from '@/components/global/SectionFrame'
import { DetectBox } from '@/components/motion/DetectBox'
import { StretchHeading } from '@/components/motion/StretchHeading'
import { Known } from '@/components/ui/Todo'

/** Splits a string into word spans, keeping the spaces between them. */
function Words({ text }: { text: string }) {
  const parts = text.split(/(\s+)/)
  return (
    <>
      {parts.map((part, i) =>
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

function Sentence({ parts }: { parts: string | Segment[] }) {
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
      )}{' '}
    </>
  )
}

/**
 * §02 Reading me. Desktop: the block pins and the statement is read word by
 * word — each word scrubs from half to full ink (half keeps 3:1 contrast), and key terms get a DETECT
 * box as they're read. Mobile: no pin; lines settle in and the boxes draw.
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
      // Where in the read each term finishes: its last word's position.
      const marks = terms.map((term) => {
        const last = term.querySelectorAll('.about-word')
        const index = words.indexOf(last[last.length - 1] as HTMLElement)
        return (index + 1) / words.length
      })

      gsap.set(words, { opacity: 0.5 })
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinned.current,
          start: 'top top+=72',
          end: () => `+=${window.innerHeight * 1.4}`,
          pin: true,
          scrub: 0.4,
          invalidateOnRefresh: true,
          onUpdate: (self) => terms.forEach((t, i) => t.classList.toggle('is-on', self.progress >= marks[i] * 0.92)),
        },
      })
      tl.to(words, { opacity: 1, ease: 'none', stagger: { each: 1 }, duration: 1 })
    })

    mm.add(MQ.mobile, () => {
      gsap.utils.toArray<HTMLElement>('.about-sentence', scope).forEach((line) => {
        gsap.fromTo(
          line,
          { opacity: 0.5 },
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
        <div className="grid12 gap-y-12">
          <div className="col-span-4 md:col-span-12 lg:col-span-8">
            <StretchHeading id="about-title" className="text-ink-muted">
              {about.title}
            </StretchHeading>
            <p className="mt-10 text-[clamp(1.6rem,3.1vw,3rem)] font-medium leading-[1.32] tracking-[-0.01em] lg:leading-[1.22]">
              {about.statement.map((parts, i) => (
                <span key={i} className="about-sentence">
                  <Sentence parts={parts} />
                </span>
              ))}
            </p>
          </div>

          <aside className="col-span-4 md:col-span-8 lg:col-span-4 lg:pt-3" aria-label="Spec">
            <dl className="border-t border-line">
              {about.spec
                .filter((row) => import.meta.env.DEV || !isTodo(row.value))
                .map((row) => (
                <div key={row.key} className="grid grid-cols-[112px_1fr] gap-4 border-b border-line py-3">
                  <dt className="mono text-ink-muted">{row.key}</dt>
                  <dd className="text-[15px] leading-snug">
                    <Known value={row.value} label="Location">
                      {(v) => v}
                    </Known>
                  </dd>
                </div>
                ))}
            </dl>
            <ul className="mono mt-6 flex flex-wrap gap-x-3 gap-y-2 text-ink-muted" aria-label="Tags">
              {about.tags.map((tag, i) => (
                <li key={tag} className="flex items-center gap-3">
                  {i > 0 ? <span aria-hidden="true">·</span> : null}
                  <span className="text-ink">{tag}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </SectionFrame>
  )
}
