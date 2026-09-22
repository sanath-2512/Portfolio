import { useRef } from 'react'
import { metrics } from '@/data/content'
import { Counter } from '@/components/ui/Counter'

/** Three measured numbers. Nothing else belongs here. */
export default function Metrics() {
  const root = useRef<HTMLElement | null>(null)

  return (
    <section ref={root} className="border-y border-line py-14 md:py-20" aria-label="Key numbers">
      <div className="shell">
        <ul className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {metrics.map((metric) => (
            <li key={metric.id}>
              <p className="font-display text-[clamp(3rem,7vw,5.5rem)] font-bold leading-none tracking-tighter text-accent">
                <Counter
                  value={metric.value}
                  decimals={metric.decimals}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  triggerRef={root}
                />
              </p>
              <p className="mt-4 max-w-[28ch] text-[14px] leading-relaxed text-fg-dim">{metric.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
