import { useEffect, useRef, useState } from 'react'
import { dva, projectOrder } from '@/data/content'
import { gsap } from '@/lib/gsap'
import { scan } from '@/lib/motion'
import { scrollToId } from '@/lib/smoothScroll'
import { useFinePointer, useReducedMotion } from '@/hooks/useMediaQuery'
import { Schematic, Shot } from '@/components/work/Schematic'

const rows = projectOrder.map((p) => ({
  id: p.id,
  no: p.no,
  name: p.name,
  domain: p.domain,
  year: p.year,
  stack: ('stack' in p ? p.stack : dva.site.stack).slice(0, 4).join(' · '),
}))

/**
 * The index: a mono table of every project. On a fine pointer, hovering a row
 * SCANs a preview in beside the cursor; clicking scrolls to the project.
 */
export function WorkIndex() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const preview = useRef<HTMLDivElement | null>(null)
  const content = useRef<HTMLDivElement | null>(null)
  const beam = useRef<HTMLSpanElement | null>(null)
  const [active, setActive] = useState<string | null>(null)
  const showPreview = fine && !reduced

  useEffect(() => {
    if (!showPreview || !preview.current) return
    const xTo = gsap.quickTo(preview.current, 'x', { duration: 0.45, ease: 'power3.out' })
    const yTo = gsap.quickTo(preview.current, 'y', { duration: 0.45, ease: 'power3.out' })
    const onMove = (e: PointerEvent) => {
      xTo(e.clientX + 28)
      yTo(e.clientY - 90)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [showPreview])

  useEffect(() => {
    if (!active || !content.current) return
    const tl = scan(content.current, beam.current, { duration: 0.5 })
    return () => {
      tl.kill()
    }
  }, [active])

  return (
    <div className="relative">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">Projects, in the order they appear below</caption>
        <thead>
          <tr className="mono mono-sm text-ink-muted">
            <th scope="col" className="w-14 py-3 font-normal">No.</th>
            <th scope="col" className="py-3 font-normal">Project</th>
            <th scope="col" className="hidden py-3 font-normal md:table-cell">Domain</th>
            <th scope="col" className="hidden py-3 font-normal lg:table-cell">Stack</th>
            <th scope="col" className="py-3 text-right font-normal">Year</th>
          </tr>
        </thead>
        <tbody onPointerLeave={() => setActive(null)}>
          {rows.map((r) => (
            <tr
              key={r.id}
              className="group relative border-t border-line transition-colors duration-300 last:border-b hover:bg-bg-raised"
              onPointerEnter={() => setActive(r.id)}
            >
              <td className="mono py-5 align-baseline text-ink-muted">{r.no}</td>
              <th scope="row" className="py-4 align-baseline font-normal">
                <a
                  href={`#${r.id}`}
                  data-cursor="project"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToId(r.id)
                  }}
                  className="stretch-host inline-flex min-h-[44px] items-center text-[clamp(1.5rem,3.2vw,2.75rem)] font-bold uppercase leading-none after:absolute after:inset-0 after:content-['']"
                >
                  <span className="stretch" style={{ '--wdth-to': 125 } as React.CSSProperties}>
                    {r.name}
                  </span>
                </a>
              </th>
              <td className="mono hidden py-5 align-baseline text-ink-muted md:table-cell">{r.domain}</td>
              <td className="mono hidden py-5 align-baseline text-ink-muted lg:table-cell">{r.stack}</td>
              <td className="mono py-5 text-right align-baseline text-ink-muted">{r.year}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPreview ? (
        <div
          ref={preview}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[80] h-[190px] w-[300px] transition-opacity duration-200"
          style={{ opacity: active ? 1 : 0 }}
        >
          <div ref={content} className="h-full w-full border border-line-strong bg-bg-raised p-3">
            <p className="mono mono-sm text-ink-muted">
              {rows.find((r) => r.id === active)?.no} · {rows.find((r) => r.id === active)?.name}
            </p>
            <div className="mt-2 h-[140px]">
              {active === 'dva' ? (
                <Shot
                  name={dva.dashboards[0].image}
                  size={dva.dashboards[0].imageSize}
                  alt=""
                  sizes="280px"
                  className="h-full w-full object-cover object-top grayscale"
                />
              ) : active ? (
                <Schematic id={active} />
              ) : null}
            </div>
          </div>
          <span ref={beam} className="scan-beam" />
        </div>
      ) : null}
    </div>
  )
}
