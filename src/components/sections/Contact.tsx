import { useLayoutEffect, useRef, useState } from 'react'
import { contact, profile } from '@/data/content'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { DUR, WDTH } from '@/lib/motion'
import { clamp, prefersReducedMotion } from '@/lib/utils'
import { SectionFrame } from '@/components/global/SectionFrame'
import { Magnetic } from '@/components/motion/MagneticButton'
import { StretchText } from '@/components/motion/StretchText'
import { Known } from '@/components/ui/Todo'

// GOT A PROBLEM / WORTH BUILDING? — the last word carries the emphasis.
const [lineOne, second] = contact.headline
const lineTwo = second.split(' ').slice(0, -1).join(' ')
const lastWord = second.split(' ').slice(-1)[0].replace(/\?$/, '')
const label = contact.headline.join(' ')

/**
 * §08 Contact. The field has settled into its grid; the question enters
 * ultra-condensed and stretches, with the scroll, until it spans the page.
 */
export default function Contact() {
  const head = useRef<HTMLHeadingElement | null>(null)
  const [copied, setCopied] = useState(false)
  const mailto = `mailto:${profile.email}`

  // Size the headline so its widest line fills the measure at full width…
  useLayoutEffect(() => {
    const h = head.current
    if (!h) return
    const blocks = Array.from(h.querySelectorAll<HTMLElement>('.ct-block'))
    // Width of what each visual line actually holds, not its block box.
    const lineWidth = (el: HTMLElement) => {
      const range = document.createRange()
      range.selectNodeContents(el)
      return range.getBoundingClientRect().width
    }
    const fit = () => {
      h.style.removeProperty('font-size')
      const previous = h.style.getPropertyValue('--wdth')
      h.style.setProperty('--wdth', String(WDTH.max))
      const size = parseFloat(getComputedStyle(h).fontSize)
      const widest = Math.max(...blocks.map(lineWidth))
      h.style.fontSize = `${clamp((size * h.clientWidth * 0.995) / widest, 20, 260).toFixed(2)}px`
      h.style.setProperty('--wdth', previous || String(WDTH.max))
    }
    fit()
    document.fonts?.ready.then(fit).catch(() => {})
    let last = h.clientWidth
    const ro = new ResizeObserver(() => {
      if (h.clientWidth === last) return
      last = h.clientWidth
      fit()
      ScrollTrigger.refresh()
    })
    ro.observe(h)
    return () => ro.disconnect()
  }, [])

  // …then scrub it from ultra-condensed to that full width.
  useLayoutEffect(() => {
    const h = head.current
    if (!h) return
    if (prefersReducedMotion()) {
      h.style.setProperty('--wdth', String(WDTH.max))
      return
    }
    const tween = gsap.fromTo(
      h,
      { '--wdth': WDTH.min },
      { '--wdth': WDTH.max, ease: 'none', scrollTrigger: { trigger: h, start: 'top 92%', end: 'top 30%', scrub: 0.4 } },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), DUR.long * 2000)
    } catch {
      window.location.href = mailto
    }
  }

  return (
    <SectionFrame id="contact" className="relative z-10 flex min-h-svh flex-col pb-16 pt-[var(--section-pad)]">
      <div className="shell mt-12 flex flex-1 flex-col justify-between gap-16">
        <h2 ref={head} id="contact-title" className="wdth font-extrabold uppercase leading-[0.86] tracking-[-0.01em]" aria-label={label}>
          <span className="ct-block block whitespace-nowrap" aria-hidden="true">
            {lineOne}
          </span>
          <span className="ct-block block whitespace-nowrap" aria-hidden="true">
            {lineTwo}
            <br className="md:hidden" />
            <span className="hidden md:inline"> </span>
            <span className="text-signal">{lastWord}</span>?
          </span>
        </h2>

        <div className="grid12 gap-y-12">
          <div className="col-span-4 md:col-span-12 lg:col-span-7">
            <div className="grid max-w-[52ch] gap-3 text-[clamp(1.1rem,1.6vw,1.4rem)] leading-relaxed">
              <p>{contact.body[0]}</p>
              <p className="text-ink-muted">{contact.body[1]}</p>
            </div>
            <a
              href={mailto}
              className="mt-10 block text-[clamp(1.35rem,3.2vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.01em] [overflow-wrap:anywhere] hover:text-signal"
            >
              {profile.email.split('@')[0]}@
              <wbr />
              {profile.email.split('@')[1]}
            </a>
            <button
              type="button"
              onClick={copy}
              className="mono mt-4 inline-flex min-h-[44px] items-center border border-line-strong px-4 text-ink transition-colors duration-300 hover:border-ink"
            >
              <span className={copied ? 'text-measure' : undefined}>{copied ? 'Copied ✓' : 'Copy address'}</span>
            </button>
            <span className="sr-only" aria-live="polite">
              {copied ? 'Email address copied to clipboard' : ''}
            </span>
          </div>

          <ul className="col-span-4 self-end md:col-span-12 lg:col-span-4 lg:col-start-9">
            <li className="border-t border-line py-3">
              <Magnetic>
                <a href={mailto} className="btn btn-primary stretch-host">
                  <StretchText reserve>Email</StretchText>
                  <span aria-hidden="true">→</span>
                </a>
              </Magnetic>
            </li>
            {[
              { label: 'GitHub', href: profile.links.github },
              { label: 'LinkedIn', href: profile.links.linkedin },
            ].map((l) => (
              <li key={l.label} className="border-t border-line">
                <a href={l.href} target="_blank" rel="noreferrer" className="stretch-host group flex min-h-[56px] items-center justify-between text-[1.2rem] font-semibold uppercase">
                  <StretchText reserve to={125}>
                    {l.label}
                  </StretchText>
                  <span aria-hidden="true" className="mono text-ink-muted transition-colors group-hover:text-ink">→</span>
                </a>
              </li>
            ))}
            <li className="border-y border-line">
              <Known value={profile.links.resume} label="Résumé PDF" className="my-3">
                {(href) => (
                  <a href={href} target="_blank" rel="noreferrer" className="stretch-host group flex min-h-[56px] items-center justify-between text-[1.2rem] font-semibold uppercase">
                    <StretchText reserve to={125}>
                      Resume
                    </StretchText>
                    <span aria-hidden="true" className="mono text-ink-muted group-hover:text-ink">→</span>
                  </a>
                )}
              </Known>
            </li>
          </ul>
        </div>
      </div>
    </SectionFrame>
  )
}
