import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/utils'

let instance: Lenis | null = null

/** Height of the fixed nav, so anchored sections don't land under it. */
const NAV_OFFSET = -12

/**
 * Starts Lenis and makes it the single source of scroll truth for
 * ScrollTrigger. Returns a teardown. No-op under reduced motion, where the
 * browser's own scrolling is used instead.
 */
export function initSmoothScroll(): () => void {
  if (prefersReducedMotion()) {
    ScrollTrigger.refresh()
    return () => {}
  }

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    syncTouch: false,
    overscroll: false,
  })
  instance = lenis

  const onScroll = () => ScrollTrigger.update()
  const raf = (time: number) => lenis.raf(time * 1000)

  lenis.on('scroll', onScroll)
  gsap.ticker.add(raf)

  ScrollTrigger.refresh()

  return () => {
    lenis.off('scroll', onScroll)
    gsap.ticker.remove(raf)
    lenis.destroy()
    if (instance === lenis) instance = null
  }
}

/** Scrolls to a section id through the smooth-scroll API. */
export function scrollToId(id: string) {
  const target = document.getElementById(id)
  if (!target) return

  if (instance) {
    instance.scrollTo(target, { offset: NAV_OFFSET })
    return
  }
  const top = target.getBoundingClientRect().top + window.scrollY + NAV_OFFSET
  window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

export function scrollToTop() {
  if (instance) {
    instance.scrollTo(0)
    return
  }
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

/** Pauses smooth scroll (used while the mobile menu owns the viewport). */
export function pauseSmoothScroll() {
  instance?.stop()
}

export function resumeSmoothScroll() {
  instance?.start()
}
