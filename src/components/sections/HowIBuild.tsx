import { useRef } from 'react'
import { howIBuild } from '@/data/content'
import { useGsapMatchMedia } from '@/hooks/useGsapMatchMedia'
import { gsap } from '@/lib/gsap'
import { isDesktopQuery, revealUp, SCRUB_EASE } from '@/lib/motion'
import { prefersReducedMotion } from '@/lib/utils'
import { SectionHeader } from '@/components/ui/SectionHeader'

/**
 * Understand → Design → Build → Measure → Improve. The rail scrolls
 * sideways while pinned on desktop and stacks vertically below 768px.
 */
export default function HowIBuild() {
  const root = useRef<HTMLElement | null>(null)
  const viewport = useRef<HTMLDivElement | null>(null)
  const rail = useRef<HTMLDivElement | null>(null)

  useGsapMatchMedia(root, (mm) => {
    mm.add(isDesktopQuery, () => {
      if (prefersReducedMotion()) {
        revealUp('.build-step', { trigger: root.current })
        return
      }
      const track = rail.current
      const frame = viewport.current
      if (!track || !frame) return

      const distance = () => Math.max(0, track.scrollWidth - frame.clientWidth)

      gsap.to(track, {
        x: () => -distance(),
        ease: SCRUB_EASE,
        scrollTrigger: {
          trigger: frame,
          start: 'center center',
          end: () => `+=${distance() + window.innerHeight * 0.4}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    })

    mm.add('(max-width: 767px)', () => {
      revealUp('.build-step', { trigger: root.current, start: 'top 82%' })
    })

    mm.add('all', () => {
      revealUp('.reveal-group', { trigger: root.current, stagger: 0 })
    })
  })

  return (
    <section ref={root} id="how" className="section" aria-labelledby="how-title">
      <div className="shell">
        <SectionHeader
          index="06"
          label="How I build"
          title={<span id="how-title">Five steps, each with a receipt.</span>}
          titleClassName="display-md"
        />
      </div>

      <div ref={viewport} className="mt-16 overflow-hidden md:mt-24">
        <div className="shell">
          <div ref={rail} className="rail">
            {howIBuild.map((step) => (
              <article key={step.index} className="build-step border-t border-line pt-6">
                <div className="flex items-baseline gap-4">
                  <span className="mono text-accent">{step.index}</span>
                  <h3 className="display-sm text-fg">{step.title}</h3>
                </div>
                <p className="mt-5 max-w-[42ch] text-[16px] leading-relaxed text-fg">{step.body}</p>
                <p className="mono mt-8 text-fg-faint">In practice</p>
                <p className="mt-3 max-w-[42ch] text-[14px] leading-relaxed text-fg-dim">{step.example}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
