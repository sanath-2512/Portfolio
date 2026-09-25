import { useEffect, useRef } from 'react'
import { viewly as v } from '@/data/content'
import { useFinePointer } from '@/hooks/useMediaQuery'
import { Citation } from '@/components/motion/Citation'
import { ScanReveal } from '@/components/motion/ScanReveal'
import { Facts, ProjectHead, ProjectLinksRow, StackLine } from '@/components/work/ProjectParts'

/** A wireframe of what each view lays out — drawn, not screenshotted. */
function Wire({ view }: { view: string }) {
  const box = 'border border-line-strong'
  if (view === 'Home')
    return (
      <div className="grid gap-1.5">
        {[0, 1, 2, 3].map((r) => (
          <div key={r} className="flex gap-1.5">
            {[0, 1, 2, 3, 4].map((c) => (
              <span key={c} className={`${box} h-7 flex-1`} />
            ))}
          </div>
        ))}
      </div>
    )
  if (view === 'Search')
    return (
      <div className="grid gap-2">
        <span className={`${box} h-6`} />
        <div className="flex gap-1.5">
          {[0, 1, 2].map((c) => (
            <span key={c} className={`${box} h-16 flex-1`} />
          ))}
        </div>
      </div>
    )
  if (view === 'Details')
    return (
      <div className="flex gap-2">
        <span className={`${box} h-24 w-16`} />
        <div className="grid flex-1 content-start gap-1.5">
          <span className="h-2 w-3/4 bg-line-strong" />
          <span className="h-2 w-1/2 bg-line-strong" />
          <span className="h-2 w-2/3 bg-line-strong" />
          <span className="mt-2 h-5 w-20 border border-signal" />
        </div>
      </div>
    )
  if (view === 'Trailer')
    return (
      <span className={`${box} flex aspect-video items-center justify-center`}>
        <span className="h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-ink-muted" />
      </span>
    )
  if (view === 'Watchlist')
    return (
      <div className="grid gap-1.5">
        {[0, 1, 2].map((r) => (
          <div key={r} className="flex items-center gap-2">
            <span className={`${box} h-8 w-6`} />
            <span className="h-2 flex-1 bg-line-strong" />
            <span className="mono text-[9px] text-ink-muted">×</span>
          </div>
        ))}
      </div>
    )
  return (
    <div className="grid gap-1.5">
      {[0.9, 0.7, 0.8, 0.5].map((w, i) => (
        <span key={i} className="h-2 bg-line-strong" style={{ width: `${w * 100}%` }} />
      ))}
    </div>
  )
}

/**
 * 04 · Viewly as its route map: a rail of every view, what it renders and
 * which TMDB endpoint feeds it. Drag it (mouse), swipe it (touch), or focus
 * it and use the arrow keys.
 */
export function ProjectRoutes() {
  const rail = useRef<HTMLDivElement | null>(null)
  const fine = useFinePointer()

  // Mouse drag-to-scroll; touch and keyboard scroll natively.
  useEffect(() => {
    const el = rail.current
    if (!el || !fine) return
    let startX = 0
    let startLeft = 0
    let dragging = false
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      dragging = true
      startX = e.clientX
      startLeft = el.scrollLeft
      el.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!dragging) return
      el.scrollLeft = startLeft - (e.clientX - startX)
    }
    const up = (e: PointerEvent) => {
      dragging = false
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
    }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
  }, [fine])

  return (
    <article id="viewly" aria-labelledby="viewly-title" className="relative mt-40 scroll-mt-16">
      <div className="shell">
        <ProjectHead id="viewly" no={v.no} name={v.name} oneLiner={v.oneLiner} meta={[v.domain, v.year, 'Solo build']} />
        <p className="mono mt-10 flex flex-wrap items-center gap-3 text-ink-muted">
          <span>
            Routes · <span className="text-ink">{v.routes.length}</span>
          </span>
          <Citation k="viewlyApp" />
          <span className="hidden md:inline">· drag or scroll the rail</span>
        </p>
      </div>

      <ScanReveal className="mt-5" start="top 85%">
        <div
          ref={rail}
          data-cursor="drag"
          tabIndex={0}
          role="region"
          aria-label="Viewly routes. Scroll horizontally to see each view."
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-4 pl-[var(--gutter)] pr-[calc(var(--gutter)+var(--ruler-w))] select-none [scrollbar-width:thin]"
        >
          {v.routes.map((r, i) => (
            <div key={r.path} className="flex w-[280px] shrink-0 snap-start flex-col border border-line bg-bg p-4 md:w-[320px]">
              <p className="mono mono-sm text-ink-muted">{String(i + 1).padStart(2, '0')}</p>
              <p className="mono mt-2 text-[15px] normal-case tracking-normal text-ink">{r.path}</p>
              <p className="mt-1 text-[1.35rem] font-bold uppercase" style={{ fontVariationSettings: "'wdth' 112" }}>
                {r.view}
              </p>
              <div className="mt-5 flex-1">
                <Wire view={r.view} />
              </div>
              <p className="mono mono-sm mt-5 border-t border-line pt-3 text-ink-muted">Data</p>
              <p className="mono mono-sm mt-1 normal-case leading-relaxed tracking-normal text-measure">{r.data}</p>
            </div>
          ))}
        </div>
      </ScanReveal>

      <div className="shell mt-12">
        <div className="grid12 gap-y-10">
          <Facts
            className="col-span-4 md:col-span-12 lg:col-span-8"
            items={[
              { k: 'Problem', v: v.problem },
              { k: 'Solution', v: v.solution },
              { k: 'Hard part', v: v.challenge },
              { k: 'Outcome', v: v.outcome },
            ]}
          />
          <div className="col-span-4 md:col-span-12 lg:col-span-4">
            <p className="mono text-ink-muted">Persistence · src/App.jsx</p>
            <pre className="mono mt-3 overflow-x-auto border border-line bg-bg p-4 text-[11px] normal-case leading-relaxed tracking-normal text-ink">
              <code>{`useEffect(() => {
  localStorage.setItem(
    "watchlist",
    JSON.stringify(watchlist)
  );
}, [watchlist]);`}</code>
            </pre>
            <StackLine className="mt-6" items={v.stack} />
            <ProjectLinksRow className="mt-4" links={v.links} />
          </div>
        </div>
      </div>
    </article>
  )
}
