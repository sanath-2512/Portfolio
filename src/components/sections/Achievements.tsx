import { useRef } from 'react'
import { achievements } from '@/data/content'
import { useGsapContext } from '@/hooks/useGsapContext'
import { revealUp } from '@/lib/motion'
import { SectionHeader } from '@/components/ui/SectionHeader'

export default function Achievements() {
  const root = useRef<HTMLElement | null>(null)

  useGsapContext(root, () => {
    revealUp('.reveal-group', { trigger: root.current, stagger: 0 })
    revealUp('.ach-row', { trigger: root.current, start: 'top 80%' })
  })

  return (
    <section ref={root} id="achievements" className="section" aria-labelledby="achievements-title">
      <div className="shell">
        <SectionHeader
          index="07"
          label="Achievements"
          title={<span id="achievements-title">Outside the codebase.</span>}
          titleClassName="display-md"
        />

        <ul className="mt-16">
          {achievements.map((item) => (
            <li key={item.title} className="ach-row grid12 gap-y-2 border-t border-line py-7">
              <p className="display-sm col-span-4 text-fg md:col-span-4">{item.title}</p>
              <p className="col-span-4 text-[15px] text-fg-dim md:col-span-8 lg:col-span-4">{item.detail}</p>
              <div className="col-span-4 md:col-span-8 md:col-start-5 lg:col-span-4 lg:col-start-9">
                <p className="mono text-fg-faint">{item.meta}</p>
                {item.links ? (
                  <div className="mt-3 flex flex-wrap gap-x-5">
                    {item.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="tap-target link-underline text-[13px] text-fg-dim transition-colors duration-300 hover:text-accent"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </li>
          ))}
          <li className="border-t border-line" aria-hidden="true" />
        </ul>
      </div>
    </section>
  )
}
