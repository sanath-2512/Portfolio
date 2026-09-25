import { useEffect, useLayoutEffect, useRef } from 'react'
import { build, profile } from '@/data/content'
import { gsap, SplitText } from '@/lib/gsap'
import { input } from '@/lib/input'
import { DUR, EASE, STAGGER, WDTH } from '@/lib/motion'
import { scrollToId } from '@/lib/smoothScroll'
import { clamp, damp, prefersReducedMotion } from '@/lib/utils'
import { SectionFrame } from '@/components/global/SectionFrame'
import { Magnetic } from '@/components/motion/MagneticButton'
import { StretchText } from '@/components/motion/StretchText'
import { Known } from '@/components/ui/Todo'

/**
 * §01. The name is set at the width that makes its longest line run almost
 * edge to edge, then breathes narrower with pointer X and scroll velocity.
 */
export default function Hero() {
  const root = useRef<HTMLElement | null>(null)
  const title = useRef<HTMLHeadingElement | null>(null)
  const cell = useRef<HTMLSpanElement | null>(null)
  const fitWdth = useRef<number>(WDTH.max)
  /** The pointer / velocity response waits until the entrance has settled. */
  const introDone = useRef(false)

  /* ---- fit the name: solve for the wdth that fills the measure ---- */
  useLayoutEffect(() => {
    const h1 = title.current
    if (!h1) return
    const lines = Array.from(h1.querySelectorAll<HTMLElement>('.hero-name'))

    const fit = () => {
      h1.style.removeProperty('font-size')
      const available = h1.clientWidth
      const goal = available * 0.995
      const widest = (w: number) => {
        h1.style.setProperty('--wdth', String(w))
        return Math.max(...lines.map((l) => l.offsetWidth))
      }
      // Size first: the largest display size (3.5–11rem) that fits at full width…
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
      const size = parseFloat(getComputedStyle(h1).fontSize)
      const fitted = clamp((size * goal) / widest(WDTH.max), 3.5 * rem, 11 * rem)
      h1.style.fontSize = `${fitted.toFixed(2)}px`
      // …then the width axis closes the remaining gap.
      const narrow = widest(WDTH.min)
      const wide = widest(WDTH.max)
      const w = WDTH.min + ((goal - narrow) / Math.max(1, wide - narrow)) * (WDTH.max - WDTH.min)
      fitWdth.current = clamp(w, WDTH.min, WDTH.max)
      h1.style.setProperty('--wdth', fitWdth.current.toFixed(2))
    }

    fit()
    document.fonts?.ready.then(fit).catch(() => {})
    // Width only: the fit itself changes the height.
    let lastWidth = h1.clientWidth
    const ro = new ResizeObserver(() => {
      if (h1.clientWidth === lastWidth) return
      lastWidth = h1.clientWidth
      fit()
    })
    ro.observe(h1)
    return () => ro.disconnect()
  }, [])

  /* ---- intro: the name stretches in, the other lines rise from masks, all within 1.2 s ---- */
  useLayoutEffect(() => {
    if (!root.current || prefersReducedMotion()) {
      introDone.current = true
      return
    }
    const splits: SplitText[] = []
    const ctx = gsap.context(() => {
      // The name is the LCP element, so it paints on the first frame and
      // enters by STRETCH — condensed to its fitted width — rather than a mask.
      gsap.fromTo(
        title.current,
        { '--wdth': WDTH.min },
        {
          '--wdth': () => fitWdth.current,
          duration: DUR.long,
          ease: EASE,
          onComplete: () => {
            introDone.current = true
          },
        },
      )
      gsap.fromTo('.hero-rise', { yPercent: 102 }, { yPercent: 0, duration: 0.8, ease: EASE, delay: 0.04 })
      gsap.utils.toArray<HTMLElement>('.hero-split').forEach((el, i) => {
        splits.push(
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            // Whole-word lines read naturally; aria-label on a <p> is invalid.
            aria: 'none',
            autoSplit: true,
            onSplit: (self) =>
              gsap.fromTo(
                self.lines,
                { yPercent: 102 },
                { yPercent: 0, duration: 0.82, ease: EASE, stagger: STAGGER * 0.8, delay: 0.16 + i * 0.06 },
              ),
          }),
        )
      })
      gsap.fromTo('.hero-cta', { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: EASE, delay: 0.3, stagger: 0.04 })
    }, root)
    return () => {
      ctx.revert()
      splits.forEach((s) => s.revert())
    }
  }, [])

  /* ---- width responds to pointer X and scroll velocity; board readout ---- */
  useEffect(() => {
    const h1 = title.current
    const el = root.current
    if (!h1 || !el || prefersReducedMotion()) return

    let inView = true
    const io = new IntersectionObserver(([entry]) => (inView = entry.isIntersecting))
    io.observe(el)

    let current = fitWdth.current
    let lastCell = ''
    const tick = (_t: number, deltaMs: number) => {
      if (!inView || !introDone.current) return
      const dt = Math.min(deltaMs, 50) / 1000
      const base = fitWdth.current
      // Never wider than the fit, so the name can't overflow its measure.
      const pointer = input.active ? 0.955 + 0.045 * ((input.nx + 1) / 2) : 1
      const speed = clamp(Math.abs(input.velocity) / 2400, 0, 1) * 16
      const goal = clamp(base * pointer - speed, WDTH.min, base)
      const next = current + (goal - current) * damp(5, dt)
      if (Math.abs(next - current) > 0.02) {
        current = next
        h1.style.setProperty('--wdth', current.toFixed(2))
      }

      const text =
        input.cellC >= 0
          ? `Cell C${String(input.cellC).padStart(3, '0')} · R${String(input.cellR).padStart(3, '0')}`
          : profile.hint
      if (text !== lastCell && cell.current) {
        lastCell = text
        cell.current.textContent = text
      }
    }

    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      io.disconnect()
    }
  }, [])

  return (
    <SectionFrame ref={root} id="top" className="flex min-h-svh flex-col pb-5 pt-[calc(var(--nav-h)+20px)]">
      <div className="shell flex flex-1 flex-col justify-end pt-10">
        <p className="mono overflow-hidden text-ink-muted">
          <span className="hero-rise block">{profile.eyebrow}</span>
        </p>

        <h1 ref={title} id="top-title" aria-label={profile.name} className="display wdth mt-4 md:mt-6">
          <span className="block overflow-hidden pb-[0.02em]" aria-hidden="true">
            <span className="hero-name inline-block whitespace-nowrap">{profile.first}</span>
          </span>
          <span className="block overflow-hidden pb-[0.02em]" aria-hidden="true">
            <span className="hero-name inline-block whitespace-nowrap">{profile.last}</span>
          </span>
        </h1>

        <div className="grid12 mt-8 gap-y-5 border-t border-line pt-6 md:mt-12">
          <p className="hero-split h3 col-span-4 max-w-[22ch] md:col-span-6">
            {profile.positioning.lead}
            <span className="text-signal">{profile.positioning.emphasis}</span>
            {profile.positioning.tail}
          </p>
          <div className="col-span-4 grid max-w-[50ch] gap-3 text-[16px] leading-relaxed md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
            <p className="hero-split">{profile.supporting[0]}</p>
            <p className="hero-split text-ink-muted">{profile.supporting[1]}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-3 md:mt-10">
          <span className="overflow-hidden p-3 -m-3">
            <span className="hero-cta block">
              <Magnetic>
                <a
                  href="#work"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToId('work')
                  }}
                  className="btn btn-primary stretch-host"
                >
                  <StretchText reserve>Explore the work</StretchText>
                  <span aria-hidden="true">→</span>
                </a>
              </Magnetic>
            </span>
          </span>
          <span className="overflow-hidden">
            <span className="hero-cta flex gap-x-3">
              <a href={profile.links.github} target="_blank" rel="noreferrer" className="btn btn-ghost stretch-host">
                <StretchText reserve>GitHub</StretchText>
                <span aria-hidden="true">↗</span>
              </a>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="btn btn-ghost stretch-host">
                <StretchText reserve>LinkedIn</StretchText>
                <span aria-hidden="true">↗</span>
              </a>
            </span>
          </span>
          <Known value={profile.availability} label="Availability">
            {(label) => (
              <span className="mono inline-flex items-center gap-2 text-ink-muted">
                <span className="avail-dot h-2 w-2 rounded-full bg-measure" aria-hidden="true" />
                {label}
              </span>
            )}
          </Known>
        </div>
      </div>

      <div className="shell mt-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-1 md:mt-14">
        <span ref={cell} className="mono mono-sm hidden text-measure [@media(pointer:fine)]:inline" aria-hidden="true">
          {profile.hint}
        </span>
        <Known value={profile.location} label="Location / local time">{(loc) => <span className="mono mono-sm text-ink-muted">{loc.label}</span>}</Known>
        <span className="mono mono-sm text-ink-muted">
          Build <span className="text-ink">{build.sha}</span> · Updated <span className="text-ink">{build.date}</span>
        </span>
      </div>
    </SectionFrame>
  )
}
