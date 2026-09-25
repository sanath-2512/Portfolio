import { useEffect, useRef } from 'react'
import { dva as d } from '@/data/content'
import { ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion, cx } from '@/lib/utils'
import { DimensionLine } from '@/components/motion/DimensionLine'
import { Metric } from '@/components/motion/Metric'
import { ScanReveal } from '@/components/motion/ScanReveal'
import { StretchText } from '@/components/motion/StretchText'
import { ProjectHead, ProjectLinksRow, StackLine } from '@/components/work/ProjectParts'
import { Shot } from '@/components/work/Schematic'

type Dashboard = (typeof d.dashboards)[number]

/** Regions on the screenshot DETECT one after another once it's scanned in. */
function Regions({ board }: { board: Dashboard }) {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const boxes = Array.from(el.querySelectorAll<HTMLElement>('.detect'))
    if (prefersReducedMotion()) {
      boxes.forEach((b) => b.classList.add('is-on'))
      return
    }
    const timers: number[] = []
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 60%',
      once: true,
      onEnter: () => boxes.forEach((b, i) => timers.push(window.setTimeout(() => b.classList.add('is-on'), 900 + i * 220))),
    })
    return () => {
      st.kill()
      timers.forEach(clearTimeout)
    }
  }, [])
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0" aria-hidden="true">
      {board.regions.map((r) => (
        <div key={r.label} className="detect absolute block" style={{ left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` }}>
          <span className="detect-box" style={{ inset: 0 }}>
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="detect-tag bg-bg px-1 py-0.5 !text-[10px]" style={{ left: 0, bottom: 'calc(100% + 3px)' }}>
            {r.tag} · {r.label}
          </span>
        </div>
      ))}
    </div>
  )
}

function Spec({ board }: { board: Dashboard }) {
  return (
    <dl className="grid gap-4">
      <div className="border-t border-line pt-3">
        <dt className="mono text-ink-muted">Tool · team</dt>
        <dd className="mt-1">
          {board.tool} · {board.team}
        </dd>
      </div>
      <div className="border-t border-line pt-3">
        <dt className="mono text-ink-muted">My part — {board.role}</dt>
        <dd className="mt-1 leading-relaxed">{board.mine}</dd>
      </div>
      <div className="border-t border-line pt-3">
        <dt className="mono text-ink-muted">Question</dt>
        <dd className="mt-1 leading-relaxed">{board.question}</dd>
      </div>
      <div className="border-t border-line pt-3">
        <dt className="mono text-ink-muted">Data</dt>
        <dd className="mono mt-2 grid gap-1.5">
          {board.scale.map((s, i) => (
            <span key={s.label}>
              {i === 0 ? <Metric source={board.source}>{s.value}</Metric> : <span className="text-measure">{s.value}</span>}{' '}
              <span className="text-ink-muted">{s.label}</span>
            </span>
          ))}
        </dd>
      </div>
      <div className="border-t border-line pt-3">
        <dt className="mono text-ink-muted">Views</dt>
        <dd className="mt-1">
          <ol className="mono mono-sm grid gap-1">
            {board.views.map((view, i) => (
              <li key={view} className={cx(board.id === 'crop' && i === 3 ? 'text-ink' : 'text-ink-muted')}>
                {String(i + 1).padStart(2, '0')} {view}
                {board.id === 'crop' && i === 3 ? <span className="text-signal"> ← mine</span> : null}
              </li>
            ))}
          </ol>
        </dd>
      </div>
      <div className="flex flex-wrap gap-x-6 border-t border-line pt-2">
        {board.live ? (
          <a href={board.live} target="_blank" rel="noreferrer" className="link mono stretch-host">
            <StretchText reserve to={112}>
              <span className="link-rule">Live dashboard</span>
            </StretchText>{' '}
            ↗
          </a>
        ) : null}
        <a href={board.repo} target="_blank" rel="noreferrer" className="link mono stretch-host">
          <StretchText reserve to={112}>
            <span className="link-rule">Team repo</span>
          </StretchText>{' '}
          ↗
        </a>
      </div>
    </dl>
  )
}

/**
 * 05 · DVA Portfolio as a specimen sheet: the dashboard I built, large and
 * scanned in, its chart regions DETECTed; a narrow spec column beside it.
 * The second board runs mirrored and smaller.
 */
export function ProjectSpecimen() {
  const [crop, retail] = d.dashboards
  return (
    <article id="dva" aria-labelledby="dva-title" className="relative mt-40 scroll-mt-16">
      <div className="shell">
        <ProjectHead id="dva" no={d.no} name={d.name} oneLiner={d.oneLiner} meta={[d.domain, d.year, 'Team coursework']} />
        <p className="mono mt-6 text-ink-muted">{d.context}</p>

        {/* Specimen 1: large visual, narrow spec */}
        <section className="grid12 mt-14 gap-y-10" aria-labelledby="dva-crop-title">
          <div className="col-span-4 md:col-span-12 lg:col-span-8">
            <h4 id="dva-crop-title" className="text-[clamp(1.4rem,2.4vw,2rem)] font-semibold leading-tight">
              {crop.title}
            </h4>
            <DimensionLine className="mt-5" value={23} label="years · 1997–2019" />
            <ScanReveal className="mt-4" start="top 80%">
              <figure className="relative border border-line bg-bg p-2">
                <div className="relative">
                  <Shot
                    name={crop.image}
                    size={crop.imageSize}
                    alt="Crop Portfolio dashboard, 1997–2019: KPI tiles for fastest-growing crop by CAGR, top yield state and crop varieties; a production-share treemap; a state yield ranking in tonnes per hectare."
                    sizes="(min-width: 1024px) 60vw, 94vw"
                    className="specimen h-auto w-full"
                  />
                  <Regions board={crop} />
                </div>
                <figcaption className="mono mono-sm flex flex-wrap justify-between gap-x-4 px-1 pt-2 text-ink-muted">
                  <span>Dashboard 4 · Crop Portfolio</span>
                  <span>Tableau · shown in monochrome</span>
                </figcaption>
              </figure>
            </ScanReveal>
          </div>
          <aside className="col-span-4 md:col-span-12 lg:col-span-4 lg:pt-24">
            <Spec board={crop} />
          </aside>
        </section>

        {/* Specimen 2: mirrored, smaller */}
        <section className="grid12 mt-20 gap-y-10" aria-labelledby="dva-retail-title">
          <aside className="order-2 col-span-4 md:col-span-12 lg:order-1 lg:col-span-4">
            <h4 id="dva-retail-title" className="text-[clamp(1.4rem,2.4vw,2rem)] font-semibold leading-tight">
              {retail.title}
            </h4>
            <div className="mt-6">
              <Spec board={retail} />
            </div>
          </aside>
          <div className="order-1 col-span-4 md:col-span-12 lg:order-2 lg:col-span-6 lg:col-start-7">
            <ScanReveal start="top 85%" axis="y">
              <figure className="border border-line bg-bg p-2">
                <Shot
                  name={retail.image}
                  size={retail.imageSize}
                  alt="Retail Performance Intelligence dashboard in Google Sheets: gross-sales and average KPI tiles, sales by item type, sales by outlet type, revenue by location tier and by fat content."
                  sizes="(min-width: 1024px) 45vw, 94vw"
                  className="specimen h-auto w-full"
                />
                <figcaption className="mono mono-sm px-1 pt-2 text-ink-muted">Google Sheets · shown in monochrome</figcaption>
              </figure>
            </ScanReveal>
          </div>
        </section>

        <div className="mt-16 border-t border-line pt-5">
          <p className="max-w-[62ch] leading-relaxed">
            Both boards are presented in a small portfolio site I built for the course.
          </p>
          <StackLine className="mt-3" items={d.site.stack} />
          <ProjectLinksRow className="mt-3" links={{ github: d.site.github, demo: d.site.demo }} />
        </div>
      </div>
    </article>
  )
}
