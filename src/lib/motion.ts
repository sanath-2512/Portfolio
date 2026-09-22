import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Tokens — every tween on the site uses these                        */
/* ------------------------------------------------------------------ */

/** Primary easing for entrances. */
export const EASE = 'power3.out'
/** Scrubbed motion is linear — it is driven by scroll position, not time. */
export const SCRUB_EASE = 'none'

export const DUR = { short: 0.4, base: 0.8, long: 1.2 } as const
export const STAGGER = { tight: 0.06, loose: 0.1 } as const

/** Below this width, pinned sequences degrade to simple reveals. */
export const PIN_MIN_WIDTH = 768

export const isDesktopQuery = `(min-width: ${PIN_MIN_WIDTH}px)`

type Targets = gsap.TweenTarget

/* ------------------------------------------------------------------ */
/* Helpers — sections call these instead of writing one-off tweens     */
/* ------------------------------------------------------------------ */

interface RevealOptions {
  delay?: number
  stagger?: number
  trigger?: Element | string | null
  start?: string
  once?: boolean
}

/**
 * Line-mask reveal. Targets are `.line-mask > span` elements that slide up
 * from behind their overflow-hidden parent.
 */
export function revealText(targets: Targets, options: RevealOptions = {}): gsap.core.Tween {
  const { delay = 0, stagger = STAGGER.tight, trigger, start = 'top 82%' } = options

  if (prefersReducedMotion()) {
    return gsap.to(targets, { opacity: 1, duration: DUR.short, delay, stagger: 0 })
  }

  return gsap.fromTo(
    targets,
    { yPercent: 108, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration: DUR.long,
      ease: EASE,
      delay,
      stagger,
      ...(trigger ? { scrollTrigger: { trigger, start, once: true } } : {}),
    },
  )
}

/** Group-level reveal: one tween per section, not one per element. */
export function revealUp(targets: Targets, options: RevealOptions = {}): gsap.core.Tween {
  const { delay = 0, stagger = STAGGER.loose, trigger, start = 'top 82%' } = options

  if (prefersReducedMotion()) {
    return gsap.to(targets, { opacity: 1, duration: DUR.short, delay })
  }

  return gsap.fromTo(
    targets,
    { y: 28, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: DUR.base,
      ease: EASE,
      delay,
      stagger,
      ...(trigger ? { scrollTrigger: { trigger, start, once: true } } : {}),
    },
  )
}

interface CountUpOptions {
  /** Starting value — defaults to 0. */
  from?: number
  decimals?: number
  suffix?: string
  prefix?: string
  duration?: number
  scrub?: boolean
  trigger?: Element | string | null
  start?: string
  end?: string
}

/** Counts an element's text up to `value`, once on enter (or scrubbed). */
export function countUp(el: HTMLElement, value: number, options: CountUpOptions = {}): void {
  const {
    from = 0,
    decimals = 0,
    suffix = '',
    prefix = '',
    duration = DUR.long,
    scrub = false,
    trigger = el,
    start = 'top 85%',
    end = 'bottom 60%',
  } = options

  const write = (n: number) => {
    el.textContent = `${prefix}${n.toFixed(decimals)}${suffix}`
  }

  if (prefersReducedMotion()) {
    write(value)
    return
  }

  const state = { n: from }
  write(from)

  gsap.to(state, {
    n: value,
    duration: scrub ? 1 : duration,
    ease: scrub ? SCRUB_EASE : EASE,
    onUpdate: () => write(state.n),
    scrollTrigger: scrub
      ? { trigger, start, end, scrub: true }
      : { trigger, start, once: true },
  })
}

interface PinSequenceOptions {
  /** Extra scroll distance, as a multiple of viewport height. */
  distance?: number
  start?: string
}

/**
 * Builds a pinned, scrubbed timeline on desktop and hands back a plain
 * timeline on small screens, where the caller reveals content instead.
 */
export function pinSequence(
  trigger: Element,
  options: PinSequenceOptions = {},
): gsap.core.Timeline {
  const { distance = 1.6, start = 'top top' } = options

  return gsap.timeline({
    scrollTrigger: {
      trigger,
      start,
      end: () => `+=${window.innerHeight * distance}`,
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  })
}

/** Subtle scroll parallax. Transform only. */
export function parallax(targets: Targets, strength = 8): void {
  if (prefersReducedMotion()) return

  gsap.utils.toArray<HTMLElement>(targets as string).forEach((el) => {
    gsap.fromTo(
      el,
      { yPercent: strength },
      {
        yPercent: -strength,
        ease: SCRUB_EASE,
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    )
  })
}

/**
 * Re-measures every trigger once webfonts have settled and again on
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
