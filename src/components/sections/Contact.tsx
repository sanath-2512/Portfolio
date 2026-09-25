import { useLayoutEffect, useRef, useState } from 'react'
import { contact, profile } from '@/data/content'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { DUR, WDTH } from '@/lib/motion'
import { clamp, prefersReducedMotion } from '@/lib/utils'
import { SectionFrame } from '@/components/global/SectionFrame'
import { Magnetic } from '@/components/motion/MagneticButton'
import { StretchText } from '@/components/motion/StretchText'
import { Known } from '@/components/ui/Todo'

// "Let's build something useful." → LET'S BUILD / SOMETHING USEFUL.
const words = contact.headline.replace(/\.$/, '').split(' ')
const lineOne = words.slice(0, 2).join(' ')
const lineTwo = words.slice(2, -1).join(' ')
const lastWord = words[words.length - 1]

/**
 * §08 Calibrated. The field has settled into its grid; the headline enters
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
        <h2 ref={head} id="contact-title" className="wdth font-extrabold uppercase leading-[0.86] tracking-[-0.01em]" aria-label={contact.headline}>
          <span className="ct-block block whitespace-nowrap" aria-hidden="true">
            {lineOne}
          </span>
          <span className="ct-block block whitespace-nowrap" aria-hidden="true">
            {lineTwo}
            <br className="md:hidden" />
            <span className="hidden md:inline"> </span>
            <span className="text-signal">{lastWord}</span>.
          </span>
        </h2>

        <div className="grid12 gap-y-10">
          <div className="col-span-4 md:col-span-12 lg:col-span-8">
            <p className="mono text-ink-muted">Email</p>
            <a
              href={mailto}
              className="mt-3 block text-[clamp(1.35rem,3.6vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.01em] [overflow-wrap:anywhere] hover:text-signal"
            >
              {profile.email.split('@')[0]}@
              <wbr />
              {profile.email.split('@')[1]}
            </a>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
              <Magnetic>
                <a href={mailto} className="btn btn-primary stretch-host">
                  <StretchText reserve>Write to me</StretchText>
                  <span aria-hidden="true">→</span>
                </a>
              </Magnetic>
              <button
                type="button"
                onClick={copy}
                className="mono inline-flex min-h-[48px] items-center border border-line-strong px-4 text-ink transition-colors duration-300 hover:border-ink"
              >
                <span className={copied ? 'text-measure' : undefined}>{copied ? 'Copied ✓' : 'Copy address'}</span>
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? 'Email address copied to clipboard' : ''}
              </span>
            </div>
          </div>

          <ul className="col-span-4 self-end md:col-span-12 lg:col-span-4">
            {[
              { label: 'LinkedIn', href: profile.links.linkedin },
              { label: 'GitHub', href: profile.links.github },
            ].map((l) => (
              <li key={l.label} className="border-t border-line">
                <a href={l.href} target="_blank" rel="noreferrer" className="stretch-host group flex min-h-[52px] items-center justify-between text-[1.15rem]">
                  <StretchText reserve to={125}>
                    {l.label}
                  </StretchText>
                  <span aria-hidden="true" className="mono text-ink-muted transition-colors group-hover:text-signal">↗</span>
                </a>
              </li>
            ))}
            <li className="border-y border-line">
              <Known value={profile.links.resume} label="Résumé PDF" className="my-3">
                {(href) => (
                  <a href={href} target="_blank" rel="noreferrer" className="stretch-host group flex min-h-[52px] items-center justify-between text-[1.15rem]">
                    <StretchText reserve to={125}>
                      Résumé
                    </StretchText>
                    <span aria-hidden="true" className="mono text-ink-muted group-hover:text-signal">↗</span>
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
