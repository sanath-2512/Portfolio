import { useMemo, useRef, useState } from 'react'
import { stack } from '@/data/content'
import { useGsapContext } from '@/hooks/useGsapContext'
import { revealUp } from '@/lib/motion'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cx } from '@/lib/utils'

const DEFAULT_HINT = 'Hover, tap or focus a technology to see where it was used.'

export default function Stack() {
  const root = useRef<HTMLElement | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)

  const lookup = useMemo(() => {
    const map = new Map<string, string>()
    stack.forEach((group) => {
      group.items.forEach((item) => {
        if (item.usage) map.set(item.name, item.usage)
      })
    })
    return map
  }, [])

  const shown = hovered ?? pinned
  const usage = shown ? lookup.get(shown) : undefined

  useGsapContext(root, () => {
    revealUp('.reveal-group', { trigger: root.current, stagger: 0 })
    revealUp('.stack-row', { trigger: root.current, start: 'top 72%' })
  })

  return (
    <section ref={root} id="stack" className="section" aria-labelledby="stack-title">
      <div className="shell">
        <SectionHeader
          index="02"
          label="Stack"
          title={<span id="stack-title">What I reach for, and where it went.</span>}
        />

        {/* Readout — one place, so touch and keyboard behave like hover. */}
        <div className="mt-12 min-h-[92px] border-t border-line pt-5 md:min-h-[76px]">
          <p aria-live="polite" className="max-w-[62ch] text-[15px] leading-relaxed">
            {usage ? (
              <>
                <span className="mono mr-3 text-accent">{shown}</span>
                <span className="text-fg">{usage}</span>
              </>
            ) : (
              <span className="text-fg-faint">{DEFAULT_HINT}</span>
            )}
          </p>
        </div>

        <div className="mt-6">
          {stack.map((group) => (
            <div key={group.id} className="stack-row grid12 gap-y-4 border-t border-line py-7">
              <h3 className="mono col-span-4 self-start pt-1 text-fg-faint md:col-span-3">{group.label}</h3>
              <ul className="col-span-4 flex flex-wrap gap-x-2 gap-y-2 md:col-span-9">
                {group.items.map((item) => {
                  const interactive = Boolean(item.usage)
                  const isShown = shown === item.name

                  if (!interactive) {
                    return (
                      <li key={item.name}>
                        <span className="inline-flex min-h-[38px] items-center border border-line px-3 text-[13px] text-fg-faint">
                          {item.name}
                        </span>
                      </li>
                    )
                  }

                  return (
                    <li key={item.name}>
                      <button
                        type="button"
                        onMouseEnter={() => setHovered(item.name)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered(item.name)}
                        onBlur={() => setHovered(null)}
                        onClick={() => setPinned((current) => (current === item.name ? null : item.name))}
                        aria-pressed={pinned === item.name}
                        className={cx(
                          'inline-flex min-h-[38px] items-center border px-3 text-[13px] transition-colors duration-300',
                          isShown
                            ? 'border-accent-line bg-accent-fill text-accent'
                            : 'border-line-strong text-fg hover:border-accent-line hover:text-accent',
                        )}
                        style={{ transitionTimingFunction: 'var(--ease-out)' }}
                      >
                        {item.name}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
          <div className="border-t border-line" />
        </div>
      </div>
    </section>
  )
}
