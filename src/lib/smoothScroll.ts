import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { isCoarsePointer, prefersReducedMotion } from '@/lib/utils'

let instance: Lenis | null = null

/** Compact nav height; anchored headings land just below it. */
const NAV_OFFSET = -48

export const getLenis = () => instance

/**
 * Starts Lenis and makes it ScrollTrigger's scroll source. Touch devices and
 * reduced motion keep native scrolling. Returns a teardown.
 */
export function initSmoothScroll(): () => void {
  if (prefersReducedMotion() || isCoarsePointer()) {
    ScrollTrigger.refresh()
    return () => {}
  }

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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

/** Every in-page anchor goes through here. */
export function scrollToId(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  if (instance) {
    instance.scrollTo(target, { offset: NAV_OFFSET })
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + NAV_OFFSET
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }
  // Move focus for keyboard and screen-reader users without a second jump.
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
}

export function scrollToTop() {
  if (instance) instance.scrollTo(0)
  else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

/** Used while the mobile menu owns the viewport. */
export const pauseSmoothScroll = () => instance?.stop()
export const resumeSmoothScroll = () => instance?.start()
