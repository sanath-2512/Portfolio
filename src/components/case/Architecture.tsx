import { useRef, useState } from 'react'
import { worthyApply } from '@/data/content'
import { useGsapContext } from '@/hooks/useGsapContext'
import { revealUp } from '@/lib/motion'
import { cx } from '@/lib/utils'

const nodes = worthyApply.architecture

/**
 * Interactive architecture diagram, built from HTML + SVG connectors so it
 * stays crisp, selectable and keyboard-operable. Hover previews a node;
 * click, tap or focus selects it. The description is read out in one place
 * rather than a floating tooltip, so touch behaves like pointer.
 */
export function Architecture() {
  const root = useRef<HTMLDivElement | null>(null)
  const [selected, setSelected] = useState(nodes[0].id)
  const [hovered, setHovered] = useState<string | null>(null)

  const activeId = hovered ?? selected
  const active = nodes.find((node) => node.id === activeId) ?? nodes[0]

  useGsapContext(root, () => {
    revealUp('.arch-node', { trigger: root.current, start: 'top 78%', stagger: 0.06 })
  })

  return (
    <div ref={root}>
      <h3 className="mono text-fg-faint">Architecture</h3>

      <div
        role="group"
        aria-label="WorthyApply architecture — select a stage to read what it does"
        className="relative mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-7 lg:gap-x-2"
      >
        {/* Single rule behind the row; the gaps between nodes reveal it. */}
        <span
          className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-px bg-line-strong lg:block"
          aria-hidden="true"
        />

        {nodes.map((node, index) => {
          const isActive = activeId === node.id
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setSelected(node.id)}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(node.id)}
              onBlur={() => setHovered(null)}
              aria-pressed={selected === node.id}
              className={cx(
                'arch-node relative flex min-h-[44px] flex-col justify-center gap-1 border px-3 py-3 text-left transition-colors duration-300 lg:min-h-[104px]',
                isActive
                  ? 'border-accent-line bg-accent-fill text-accent'
                  : 'border-line-strong bg-ink text-fg hover:border-accent-line',
              )}
              style={{ transitionTimingFunction: 'var(--ease-out)' }}
            >
              <span className="mono opacity-70">{String(index + 1).padStart(2, '0')}</span>
              <span className="hyphens-auto break-words text-[13px] font-medium leading-snug">{node.label}</span>
            </button>
          )
        })}
      </div>

      <p
        aria-live="polite"
        className="mt-6 min-h-[64px] max-w-[62ch] border-t border-line pt-4 text-[15px] leading-relaxed"
      >
        <span className="mono mr-3 text-accent">{active.label}</span>
        <span className="text-fg-dim">{active.description}</span>
      </p>
    </div>
  )
}
