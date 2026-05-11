import type { MouseEvent } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/utils'

export function revealText(selector: string, delay = 0): gsap.core.Timeline {
  const tl = gsap.timeline({ delay })
  if (prefersReducedMotion()) return tl.set(selector, { opacity: 1, y: 0 })
  return tl.fromTo(selector, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.04, ease: 'expo.custom' })
}

export function fadeUp(selector: string, stagger = 0.1): gsap.core.Timeline {
  const tl = gsap.timeline()
  if (prefersReducedMotion()) return tl.set(selector, { opacity: 1, y: 0 })
  return tl.fromTo(selector, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, stagger, ease: 'expo.custom' })
}

export function scrollReveal(selector: string): void {
  if (prefersReducedMotion()) return
  gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 40 }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'expo.custom',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    })
  })
}

export function magneticEffect(strength = 0.3) {
  return {
    onMouseMove: (event: MouseEvent<HTMLElement>) => {
      const el = event.currentTarget
      const rect = el.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.35, ease: 'expo.custom' })
    },
    onMouseLeave: (event: MouseEvent<HTMLElement>) => {
      gsap.to(event.currentTarget, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' })
    },
  }
}

export function parallax(selector: string, speed = 0.5): void {
  if (prefersReducedMotion()) return
  gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
    gsap.to(el, {
      yPercent: -20 * speed,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    })
  })
}

export function refreshScroll() {
  requestAnimationFrame(() => ScrollTrigger.refresh())
}
