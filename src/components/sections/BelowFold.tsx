import { useEffect, useState, type ComponentType } from 'react'
import { ScrollTrigger } from '@/lib/gsap'
import About from '@/components/sections/About'
import Experience from '@/components/sections/Experience'
import Work from '@/components/sections/Work'
import HowIBuild from '@/components/sections/HowIBuild'
import Stack from '@/components/sections/Stack'
import Signals from '@/components/sections/Signals'
import Contact from '@/components/sections/Contact'

const SECTIONS: ComponentType[] = [About, Experience, Work, HowIBuild, Stack, Signals, Contact]

/**
 * §02–§08, in their own chunk, mounted one section per idle slice — top to
 * bottom, so ScrollTriggers are still created in page order — instead of one
 * long task. Once the last is in, everything that measures the page (field
 * stops, ruler, nav, pins) re-measures once.
 */
export default function BelowFold({ onReady }: { onReady?: () => void }) {
  const [count, setCount] = useState(1)

  useEffect(() => {
    if (count < SECTIONS.length) {
      const next = () => setCount((c) => c + 1)
      if (typeof window.requestIdleCallback === 'function') {
        const id = window.requestIdleCallback(next, { timeout: 120 })
        return () => window.cancelIdleCallback(id)
      }
      const id = window.setTimeout(next, 16)
      return () => window.clearTimeout(id)
    }
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      onReady?.()
    })
    return () => cancelAnimationFrame(raf)
  }, [count, onReady])

  return (
    <>
      {SECTIONS.slice(0, count).map((Section, i) => (
        <Section key={i} />
      ))}
    </>
  )
}
