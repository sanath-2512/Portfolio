import { useRef } from 'react'
import { about } from '@/data/content'
import { useGsapContext } from '@/hooks/useGsapContext'
import { revealUp } from '@/lib/motion'
import { SectionHeader } from '@/components/ui/SectionHeader'

export default function About() {
  const root = useRef<HTMLElement | null>(null)

  useGsapContext(root, () => {
    revealUp('.reveal-group', { trigger: root.current, stagger: 0 })
    revealUp('.about-row', { trigger: root.current, start: 'top 70%' })
  })

  return (
    <section ref={root} id="about" className="section" aria-labelledby="about-title">
      <div className="shell">
        <SectionHeader
          index="01"
          label="About"
          title={<span id="about-title">Four things worth knowing.</span>}
        />

        <div className="mt-16 md:mt-24">
          {about.map((item) => (
            <div key={item.index} className="about-row grid12 gap-y-3 border-t border-line py-8 md:py-10">
              <span className="mono col-span-4 text-accent md:col-span-1">{item.index}</span>
              <h3 className="display-sm col-span-4 text-fg md:col-span-6">{item.headline}</h3>
              <p className="col-span-4 text-[15px] leading-relaxed text-fg-dim md:col-span-4 md:col-start-9">
                {item.detail}
              </p>
            </div>
          ))}
          <div className="border-t border-line" />
        </div>
      </div>
    </section>
  )
}
