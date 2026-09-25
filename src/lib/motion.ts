import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/utils'

/* ================================================================== */
/* Timing — every tween on the site reads from here                    */
/* ================================================================== */

/** Entrances. Same curve as the CSS `--ease-out` token. */
export const EASE = 'expo.out'
export const EASE_CSS = 'cubic-bezier(0.16, 1, 0.3, 1)'
/** Scrubbed motion follows the scroll position, not a clock. */
export const SCRUB_EASE = 'none'
export const SCRUB_EASE_SOFT = 'power2.inOut'

export const DUR = {
  /** Micro-interactions: 0.2–0.35 s. */
  micro: 0.28,
  /** Entrances: 0.6–1.2 s. */
  in: 0.9,
  long: 1.2,
  /** Route and theme wipes stay under 0.6 s. */
  wipe: 0.56,
} as const

export const STAGGER = 0.06

/** Width axis limits of Archivo. */
export const WDTH = { min: 62, rest: 100, max: 125 } as const

export const MQ = {
  desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
  motion: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
} as const

/* ================================================================== */
/* SCAN — a 1px measure beam sweeps across and reveals what's behind   */
/* ================================================================== */

interface ScanOptions {
  axis?: 'x' | 'y'
  duration?: number
  delay?: number
}

/**
 * Reveals `content` with clip-path while `beam` rides the leading edge.
 * The beam must sit outside the clipped element (see <ScanReveal>).
 */
export function scan(content: Element, beam: Element | null, options: ScanOptions = {}): gsap.core.Timeline {
  const { axis = 'x', duration = DUR.in, delay = 0 } = options
  const tl = gsap.timeline({ delay })

  if (prefersReducedMotion()) {
    tl.set(content, { clipPath: 'inset(0 0% 0% 0)' })
    return tl
  }

  const from = axis === 'x' ? 'inset(0 100% 0 0)' : 'inset(0 0 100% 0)'
  const to = 'inset(0 0% 0% 0)'
  tl.fromTo(content, { clipPath: from }, { clipPath: to, duration, ease: EASE })

  if (beam) {
    const host = beam.parentElement as HTMLElement
    const size = () => (axis === 'x' ? host.offsetWidth : host.offsetHeight)
    tl.set(beam, { opacity: 1 }, 0)
    tl.fromTo(
      beam,
      axis === 'x' ? { x: 0, y: 0 } : { x: 0, y: 0 },
      { ...(axis === 'x' ? { x: size } : { y: size }), duration, ease: EASE },
      0,
    )
    tl.to(beam, { opacity: 0, duration: DUR.micro }, duration * 0.72)
  }
  return tl
}

/* ================================================================== */
/* MEASURE — a dimension line draws while a counter runs               */
/* ================================================================== */

interface MeasureOptions {
  value?: number
  decimals?: number
  suffix?: string
  duration?: number
}

/** `rules` are the two half-lines either side of the label; they grow outward. */
export function measure(
  rules: Element[],
  counter: HTMLElement | null,
  options: MeasureOptions = {},
): gsap.core.Timeline {
  const { value, decimals = 0, suffix = '', duration = DUR.in } = options
  const tl = gsap.timeline()
  const write = (n: number) => {
    if (counter && value !== undefined) counter.textContent = `${n.toFixed(decimals)}${suffix}`
  }

  if (prefersReducedMotion()) {
    tl.set(rules, { scaleX: 1 })
    write(value ?? 0)
    return tl
  }

  tl.fromTo(rules, { scaleX: 0 }, { scaleX: 1, duration, ease: EASE })
  if (counter && value !== undefined) {
    const state = { n: 0 }
    write(0)
    tl.to(state, { n: value, duration, ease: EASE, onUpdate: () => write(state.n) }, 0)
  }
  return tl
}

/* ================================================================== */
/* STRETCH — headings enter condensed and settle to their rest width   */
/* ================================================================== */

export function stretchIn(targets: gsap.TweenTarget, rest: number = WDTH.rest, options: { delay?: number } = {}) {
  if (prefersReducedMotion()) return gsap.set(targets, { '--wdth': rest })
  return gsap.fromTo(
    targets,
    { '--wdth': WDTH.min },
    { '--wdth': rest, duration: DUR.long, ease: EASE, delay: options.delay ?? 0, stagger: STAGGER },
  )
}

/* ================================================================== */
/* DETECT — corner brackets draw in around a term                      */
/* ================================================================== */

export function detectOn(el: Element | null, on = true) {
  el?.classList.toggle('is-on', on)
}

/* ================================================================== */
/* Layout settling                                                     */
/* ================================================================== */

/**
 * Re-measures every trigger once webfonts and images have settled and on
 * orientation change, so pinned sections stay aligned.
 */
export function refreshOnLayoutSettled(): () => void {
  let raf = 0
  const refresh = () => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => ScrollTrigger.refresh())
  }

  if (typeof document !== 'undefined' && 'fonts' in document) {
    document.fonts.ready.then(refresh).catch(() => {})
  }
  window.addEventListener('load', refresh)
  window.addEventListener('orientationchange', refresh)

  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('load', refresh)
    window.removeEventListener('orientationchange', refresh)
  }
}
