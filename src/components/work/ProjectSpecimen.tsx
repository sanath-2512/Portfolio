import { useEffect, useRef } from 'react'
import { dva as d } from '@/data/content'
import { ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion, cx } from '@/lib/utils'
import { DimensionLine } from '@/components/motion/DimensionLine'
import { Metric } from '@/components/motion/Metric'
import { ScanReveal } from '@/components/motion/ScanReveal'
import { StretchText } from '@/components/motion/StretchText'
import { DeepDive } from '@/components/motion/DeepDive'
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
      onEnter: () =>
        boxes.forEach((b, i) => timers.push(window.setTimeout(() => b.classList.add('is-on'), 900 + i * 220))),
    })
    return () => {
      st.kill()
      timers.forEach(clearTimeout)
    }
  }, [])
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0" aria-hidden="true">
      {board.regions.map((r) => (
        <div
          key={r.label}
          className="detect absolute block"
          style={{
            left: `${r.x}%`,
            top: `${r.y}%`,
            width: `${r.w}%`,
            height: `${r.h}%`,
          }}
        >
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
    <>
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
                {i === 0 ? (
                  <Metric source={board.source}>{s.value}</Metric>
                ) : (
                  <span className="text-measure">{s.value}</span>
                )}{' '}
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
                  {board.id === 'crop' && i === 3 ? <span className="signal-sm ml-1">← mine</span> : null}
                </li>
              ))}
            </ol>
          </dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-x-6 border-t border-line pt-2">
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
    </>
  )
}

/**
 * 05 · DVA — data before the AI. The dashboards lead, shown as specimens;
 * the dataset scale, roles and views sit in the deep dive.
 */
export function ProjectSpecimen() {
  const [crop, retail] = d.dashboards
  return (
    <article id="dva" aria-labelledby="dva-title" className="relative mt-40 scroll-mt-16">
      <div className="shell">
        <ProjectHead id="dva" no={d.no} name={d.name} kicker={d.kicker} meta={[d.year, 'Team coursework']} oneLiner={d.story[0].v as string} />

        <div className="grid12 mt-12 gap-y-8">
          <p className="col-span-4 max-w-[56ch] text-[clamp(1.05rem,1.4vw,1.25rem)] leading-relaxed md:col-span-7">{d.story[1].v as string}</p>
          <p className="col-span-4 text-[clamp(1.2rem,1.9vw,1.6rem)] font-semibold leading-snug md:col-span-5">{d.story[2].v as string}</p>
        </div>

        <div className="grid12 mt-14 items-start gap-y-10">
          <figure className="col-span-4 md:col-span-12 lg:col-span-8">
            <DimensionLine value={23} label="years of crop data · 1997–2019" />
            <ScanReveal className="mt-4" start="top 80%">
              <div className="relative border border-line bg-bg p-2">
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
              </div>
            </ScanReveal>
            <figcaption className="mono mono-sm mt-3 flex flex-wrap justify-between gap-x-4 text-ink-muted">
              <span>
                <span className="text-ink">{crop.title}</span> · Dashboard 4, which I built
              </span>
              <span>Tableau · shown in monochrome</span>
            </figcaption>
          </figure>
          <figure className="col-span-4 md:col-span-8 lg:col-span-4 lg:mt-24">
            <ScanReveal start="top 85%" axis="y">
              <div className="border border-line bg-bg p-2">
                <Shot
                  name={retail.image}
                  size={retail.imageSize}
                  alt="Retail Performance Intelligence dashboard in Google Sheets: gross-sales and average KPI tiles, sales by item type, sales by outlet type, revenue by location tier and by fat content."
                  sizes="(min-width: 1024px) 30vw, 94vw"
                  className="specimen h-auto w-full"
                />
              </div>
            </ScanReveal>
            <figcaption className="mono mono-sm mt-3 text-ink-muted">
              <span className="text-ink">{retail.title}</span> · Google Sheets
            </figcaption>
          </figure>
        </div>

        <DeepDive className="mt-16" summary="Datasets, team roles, my part, the dashboard views · the course site">
          <p className="mono text-ink-muted">{d.context}</p>
          <div className="mt-8 grid gap-12 lg:grid-cols-2">
            {[crop, retail].map((board) => (
              <section key={board.id} aria-labelledby={`dva-${board.id}-title`}>
                <h4 id={`dva-${board.id}-title`} className="text-[clamp(1.25rem,2vw,1.6rem)] font-semibold leading-tight">
                  {board.title}
                </h4>
                <div className="mt-6">
                  <Spec board={board} />
                </div>
              </section>
            ))}
          </div>
          <div className="mt-12 border-t border-line pt-5">
            <p className="max-w-[62ch] leading-relaxed">Both boards are presented in a small portfolio site I built for the course.</p>
            <StackLine className="mt-3" items={d.site.stack} />
            <ProjectLinksRow className="mt-3" links={{ github: d.site.github, demo: d.site.demo }} />
          </div>
        </DeepDive>
      </div>
    </article>
  )
}
