import { lazy, startTransition, Suspense, useCallback, useEffect, useState } from 'react'
import { initSmoothScroll } from '@/lib/smoothScroll'
import { refreshOnLayoutSettled } from '@/lib/motion'
import { startInput } from '@/lib/input'
import { usePath } from '@/lib/router'
import { getLenis, scrollToId } from '@/lib/smoothScroll'
import { ScrollTrigger } from '@/lib/gsap'
import { CalibrationField } from '@/components/field/CalibrationField'
import { SiteNav } from '@/components/global/SiteNav'
import { RulerProgress } from '@/components/global/RulerProgress'
import { Cursor } from '@/components/global/Cursor'
import { Footer } from '@/components/global/Footer'
import { Grain } from '@/components/global/Grain'
import Hero from '@/components/sections/Hero'

// Below the fold is its own chunk, requested only after the hero has painted,
// so nothing competes with the LCP element.
const BelowFold = lazy(() => import('@/components/sections/BelowFold'))
const CaseStudy = lazy(() => import('@/components/case/CaseStudy'))
const CASE_PATH = '/work/worthyapply'

export default function App() {
  const path = usePath()
  const isCase = path === CASE_PATH

  // The hero commits alone; the rest mounts in a transition right after.
  const [rest, setRest] = useState(false)
  const [restMounted, setRestMounted] = useState(false)
  useEffect(() => {
    let timer = 0
    // Two frames: the first paints the hero, the second is safely after it.
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        timer = window.setTimeout(() => startTransition(() => setRest(true)), 0)
      })
    })
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
  }, [])
  const onRestReady = useCallback(() => setRestMounted(true), [])
  // Leaving home unmounts the sections; a #hash on the way back waits for them again.
  useEffect(() => {
    if (isCase) setRestMounted(false)
  }, [isCase])

  // New route: start at the top, or jump to the #hash once its section exists.
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo(0, 0)
    if (!hash || (!isCase && !restMounted)) return
    const raf = requestAnimationFrame(() => scrollToId(hash, { immediate: true }))
    // Pins and fonts can still shift layout on the first frames; settle once more.
    const settle = window.setTimeout(() => {
      ScrollTrigger.refresh()
      scrollToId(hash, { immediate: true })
    }, 450)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(settle)
    }
  }, [path, isCase, restMounted])

  useEffect(() => {
    const stopInput = startInput()
    const stopScroll = initSmoothScroll()
    const stopRefresh = refreshOnLayoutSettled()
    return () => {
      stopRefresh()
      stopScroll()
      stopInput()
    }
  }, [])

  return (
    <>
      <a href="#main" className="skip-link mono">
        Skip to content
      </a>

      <CalibrationField />
      <SiteNav />
      <RulerProgress />

      <main id="main" tabIndex={-1} className="relative z-10 outline-none">
        {isCase ? (
          <Suspense fallback={<div className="min-h-svh" />}>
            <CaseStudy />
          </Suspense>
        ) : (
          <>
            <Hero />
            {rest ? (
              <Suspense fallback={null}>
                <BelowFold onReady={onRestReady} />
              </Suspense>
            ) : null}
          </>
        )}
      </main>

      <Footer />
      <Cursor />
      <Grain />
    </>
  )
}
