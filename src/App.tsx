import { lazy, Suspense, useEffect, useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { useLenis } from '@/hooks/useLenis'
import { prefersReducedMotion } from '@/lib/utils'

const Hero = lazy(() => import('@/components/sections/Hero'))
const About = lazy(() => import('@/components/sections/About'))
const TechStack = lazy(() => import('@/components/sections/TechStack'))
const Projects = lazy(() => import('@/components/sections/Projects'))
const OpenSource = lazy(() => import('@/components/sections/OpenSource'))
const Contact = lazy(() => import('@/components/sections/Contact'))

function Loader() {
  return (
    <div className="intro-loader relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-primary px-6">
      <div className="intro-loader__glow intro-loader__glow--one" />
      <div className="intro-loader__glow intro-loader__glow--two" />
      <div className="intro-loader__center">
        <p className="intro-loader__eyebrow">Initializing Portfolio</p>
        <h1 className="intro-loader__title">
          SANATH <span>WARAIKAR</span>
        </h1>
        <div className="intro-loader__bar" aria-hidden="true">
          <span className="intro-loader__bar-fill" />
        </div>
        <p className="intro-loader__hint">Loading immersive experience...</p>
      </div>
    </div>
  )
}

function SectionFallback() {
  return <div className="min-h-[40vh] bg-bg-primary" aria-hidden="true" />
}

export default function App() {
  useLenis()

  const [showIntro, setShowIntro] = useState(true)
  const [theme] = useState<'dark' | 'light'>(() => {
    const saved = window.localStorage.getItem('portfolio-theme')
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    // Ensure no stale smooth-scroll runtime state can lock native scrolling.
    document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped')
    document.body.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped')
    document.documentElement.style.removeProperty('overflow')
    document.documentElement.style.removeProperty('height')
    document.body.style.removeProperty('overflow')
    document.body.style.removeProperty('height')
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => {
    const introDuration = prefersReducedMotion() ? 750 : 2200
    const timer = window.setTimeout(() => setShowIntro(false), introDuration)
    return () => window.clearTimeout(timer)
  }, [])

  if (showIntro) return <Loader />

  return (
    <div className="portfolio-shell portfolio-shell--ready">
      <Navbar />
      <main>
        <Suspense fallback={<SectionFallback />}>
          <Hero />
          <div className="glow-rule" />
          <About />
          <div className="glow-rule" />
          <TechStack />
          <Projects />
          <OpenSource />
          <Contact />
        </Suspense>
      </main>
      <Footer />
      <GrainOverlay />
      <CustomCursor />
    </div>
  )
}
