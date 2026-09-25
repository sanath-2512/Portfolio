import { useEffect, useRef, useState } from 'react'
import { sections } from '@/data/content'
import { ScrollTrigger } from '@/lib/gsap'
import { useDesktop } from '@/hooks/useMediaQuery'

interface Major {
  index: string
  p: number
}

const MINOR = Array.from({ length: 101 }, (_, i) => i)

/**
 * Page progress as a measuring instrument. Desktop: a vertical tick ruler on
 * the right edge with a major tick per section and a `§04 · 62.4%` readout.
 * Mobile: a thin tick ruler across the top. All writes go straight to the
 * DOM from one ScrollTrigger; React only re-renders when sections re-measure.
 */
export function RulerProgress() {
  const desktop = useDesktop()
  const indicator = useRef<HTMLDivElement | null>(null)
  const readout = useRef<HTMLSpanElement | null>(null)
  const section = useRef<HTMLSpanElement | null>(null)
  const [majors, setMajors] = useState<Major[]>([])
  const majorsRef = useRef<Major[]>([])

  useEffect(() => {
    const measure = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const next = sections
        .map((s) => {
          const el = document.getElementById(s.id)
          if (!el) return null
          const top = el.getBoundingClientRect().top + window.scrollY
          return { index: s.index, p: Math.min(1, Math.max(0, top / max)) }
        })
        .filter(Boolean) as Major[]
      majorsRef.current = next
      setMajors(next)
    }

    let lastText = ''
    const write = (p: number) => {
      if (indicator.current) indicator.current.style.transform = `translate3d(0, ${p * 100}%, 0)`
      if (!desktop && indicator.current) indicator.current.style.transform = `scaleX(${p})`
      let current = majorsRef.current[0]?.index ?? '01'
      for (const m of majorsRef.current) if (p + 0.0005 >= m.p) current = m.index
      const text = `${(p * 100).toFixed(1)}%`
      if (text !== lastText) {
        lastText = text
        if (readout.current) readout.current.textContent = text
        if (section.current) section.current.textContent = `§${current}`
      }
    }

    measure()
    ScrollTrigger.addEventListener('refresh', measure)
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => write(self.progress),
      onRefresh: (self) => write(self.progress),
    })
    write(st.progress)
    return () => {
      ScrollTrigger.removeEventListener('refresh', measure)
      st.kill()
    }
  }, [desktop])

  if (!desktop) {
    return (
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[5px]" aria-hidden="true">
        <div
          className="absolute inset-x-0 top-0 h-[4px]"
          style={{ background: 'repeating-linear-gradient(to right, var(--line-strong) 0 1px, transparent 1px 12px)' }}
        />
        <div ref={indicator} className="absolute inset-x-0 top-0 h-[2px] origin-left bg-signal" style={{ transform: 'scaleX(0)' }} />
      </div>
    )
  }

  return (
    <div
      className="pointer-events-none fixed bottom-0 right-0 top-0 z-40 w-[var(--ruler-w)] border-l border-line"
      aria-hidden="true"
    >
      <div className="absolute inset-x-0 bottom-[76px] top-[84px]">
        <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 40 100" preserveAspectRatio="none">
          {MINOR.map((i) => (
            <line
              key={i}
              x1="40"
              x2={i % 10 === 0 ? 30 : 35}
              y1={i}
              y2={i}
              stroke="var(--line-strong)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        {majors.map((m) => (
          <div key={m.index} className="absolute right-0 flex items-center gap-1" style={{ top: `${m.p * 100}%` }}>
            <span className="mono text-[9px] leading-none tracking-normal text-ink-muted">{m.index}</span>
            <span className="h-px w-4 bg-ink-muted" />
          </div>
        ))}
        <div ref={indicator} className="absolute inset-x-0 top-0 h-full will-change-transform">
          <div className="absolute -left-px right-0 top-0 h-[2px] -translate-y-1/2 bg-signal" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-0.5 text-center">
        <span ref={section} className="mono text-[10px] leading-none tracking-normal text-ink">
          §01
        </span>
        <span ref={readout} className="mono text-[9px] leading-none tracking-normal text-ink-muted tabular-nums">
          0.0%
        </span>
      </div>
    </div>
  )
}
