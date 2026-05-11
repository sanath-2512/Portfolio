import { lazy, Suspense, useEffect, useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/utils'

const SceneCanvas = lazy(() => import('@/components/three/SceneCanvas'))

export default function Hero() {
  const root = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const context = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set('.hero-title,.hero-fade,.scroll-cue', { opacity: 1, y: 0 })
        return
      }
      const tl = gsap.timeline()
      tl.fromTo('.hero-scene', { opacity: 0 }, { opacity: 1, duration: 1.1 }, 0)
        .fromTo('.hero-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.custom' }, 0.25)
        .fromTo('.hero-fade', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.custom' }, 0.8)
        .fromTo('.scroll-cue', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.25)
    }, root)
    return () => context.revert()
  }, [])

  return (
    <section ref={root} id="home" aria-label="Hero" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-primary px-5 pt-24">
      <div className="hero-scene absolute inset-0 z-0 opacity-0">
        <Suspense fallback={<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,217,255,0.16),transparent_46%)]" />}>
          <SceneCanvas />
        </Suspense>
      </div>

      <div className="hero-fade hero-fade-overlay absolute inset-0 z-[1]" />
      <div className="relative z-10 mx-auto w-full max-w-[1180px] py-10 text-center">
        <h1 className="hero-title hero-title-text font-display text-[clamp(56px,14vw,180px)] font-black leading-[0.92] tracking-tight drop-shadow-[0_0_30px_rgba(0,217,255,0.2)]">
          SANATH
          <br />
          <span className="bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-cyan bg-[length:220%_100%] bg-clip-text text-transparent hero-shift-gradient">
            WARAIKAR
          </span>
        </h1>
      </div>

      <a href="#about" aria-label="Scroll to about section" className="scroll-cue absolute bottom-8 left-1/2 z-10 -translate-x-1/2 opacity-0">
        <ArrowDown className="animate-[pulseGlow_1.8s_ease-in-out_infinite] text-brand-cyan" size={24} />
      </a>
    </section>
  )
}
