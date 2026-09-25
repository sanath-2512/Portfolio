import { lazy, Suspense, useEffect } from 'react'
import { contact, signals, stack } from '@/data/content'
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
import About from '@/components/sections/About'
import Experience from '@/components/sections/Experience'
import Work from '@/components/sections/Work'
import HowIBuild from '@/components/sections/HowIBuild'

const CaseStudy = lazy(() => import('@/components/case/CaseStudy'))
const CASE_PATH = '/work/worthyapply'
import { Pending } from '@/components/sections/Pending'

export default function App() {
  const path = usePath()
  const isCase = path === CASE_PATH

  // New route: start at the top (or jump to the #hash), then re-measure.
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo(0, 0)
    let raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      raf = requestAnimationFrame(() => hash && scrollToId(hash, { immediate: true }))
    })
    // Pins and fonts can still shift layout on the first frames; settle once more.
    const settle = window.setTimeout(() => {
      ScrollTrigger.refresh()
      if (hash) scrollToId(hash, { immediate: true })
    }, 450)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(settle)
    }
  }, [path])

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
            <About />
            <Experience />
            <Work />
            <HowIBuild />
            <Pending id="stack" title="Stack">
              {stack.map((g) => g.label).join(' · ')}
            </Pending>
            <Pending id="signals" title="Signals">
              {signals.map((s) => s.what).join(' · ')}
            </Pending>
            <Pending id="contact" title={contact.headline} />
          </>
        )}
      </main>

      <Footer />
      <Cursor />
      <Grain />
    </>
  )
}
