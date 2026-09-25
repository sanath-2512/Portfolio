import { useEffect } from 'react'
import { about, agriMind, contact, experience, processTabs, signals, stack, worthyApply } from '@/data/content'
import { initSmoothScroll } from '@/lib/smoothScroll'
import { refreshOnLayoutSettled } from '@/lib/motion'
import { startInput } from '@/lib/input'
import { CalibrationField } from '@/components/field/CalibrationField'
import { SiteNav } from '@/components/global/SiteNav'
import { RulerProgress } from '@/components/global/RulerProgress'
import { Cursor } from '@/components/global/Cursor'
import { Footer } from '@/components/global/Footer'
import { Grain } from '@/components/global/Grain'
import Hero from '@/components/sections/Hero'
import { Pending } from '@/components/sections/Pending'

export default function App() {
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
        <Hero />
        <Pending id="about" title={about.title}>
          {about.statement.map((s) => (typeof s === 'string' ? s : s.map((p) => (typeof p === 'string' ? p : p.term)).join(''))).join(' ')}
        </Pending>
        <Pending id="experience" title="Field report" field="chunks">
          {experience.role}, {experience.org} · {experience.period} · {experience.location}
        </Pending>
        <Pending
          id="work"
          title="Work"
          field="dim"
          regions={[
            { field: 'lanes', label: `${worthyApply.no} · ${worthyApply.name} — five provider lanes` },
            { field: 'furrows', label: `${agriMind.no} · ${agriMind.name} — furrows` },
          ]}
        >
          {worthyApply.name} · {agriMind.name}
        </Pending>
        <Pending id="process" title="How I build">
          {processTabs.map((t) => t.label).join(' · ')}
        </Pending>
        <Pending id="stack" title="Stack">
          {stack.map((g) => g.label).join(' · ')}
        </Pending>
        <Pending id="signals" title="Signals">
          {signals.map((s) => s.what).join(' · ')}
        </Pending>
        <Pending id="contact" title={contact.headline} />
      </main>

      <Footer />
      <Cursor />
      <Grain />
    </>
  )
}
