import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/utils'

export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      infinite: false,
      overscroll: false,
      syncTouch: false,
    })
    const update = (time: number) => lenis.raf(time * 1000)
    const onScroll = () => {
      // Guard against momentum overshoot causing apparent endless scrolling.
      const maxScroll = lenis.limit
      const nextScroll = Math.max(0, Math.min(lenis.scroll, maxScroll))
      if (nextScroll !== lenis.scroll) {
        lenis.scrollTo(nextScroll, { immediate: true, force: true })
      }
      ScrollTrigger.update()
    }
    lenis.on('scroll', onScroll)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    ScrollTrigger.refresh()
    return () => {
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(update)
      lenis.destroy()
    }
  }, [])
}
