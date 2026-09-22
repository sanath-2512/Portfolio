import { useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { Backdrop } from '@/components/three/Backdrop'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Stack from '@/components/sections/Stack'
import Experience from '@/components/sections/Experience'
import CaseStudy from '@/components/sections/CaseStudy'
import OtherProjects from '@/components/sections/OtherProjects'
import HowIBuild from '@/components/sections/HowIBuild'
import Metrics from '@/components/sections/Metrics'
import Achievements from '@/components/sections/Achievements'
import Contact from '@/components/sections/Contact'
import { initSmoothScroll } from '@/lib/smoothScroll'
import { refreshOnLayoutSettled } from '@/lib/motion'

export default function App() {
  useEffect(() => {
    const stopScroll = initSmoothScroll()
    const stopRefresh = refreshOnLayoutSettled()
    return () => {
      stopRefresh()
      stopScroll()
    }
  }, [])

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <Backdrop />
      <Navbar />

      <main id="main">
        <Hero />

        {/* Opaque from About onwards, so the backdrop recedes behind the
            content and returns for the contact bookend. */}
        <div className="relative z-10 bg-ink">
          <About />
          <Stack />
          <Experience />
          <CaseStudy />
          <OtherProjects />
          <HowIBuild />
          <Metrics />
          <Achievements />
        </div>

        <Contact />
      </main>

      <Footer />
      <GrainOverlay />
    </>
  )
}
