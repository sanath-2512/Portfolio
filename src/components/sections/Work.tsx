import { SectionFrame } from '@/components/global/SectionFrame'
import { StretchHeading } from '@/components/motion/StretchHeading'
import { ProjectAgentGraph } from '@/components/work/ProjectAgentGraph'
import { ProjectApi } from '@/components/work/ProjectApi'
import { ProjectPipeline } from '@/components/work/ProjectPipeline'
import { ProjectRoutes } from '@/components/work/ProjectRoutes'
import { ProjectSpecimen } from '@/components/work/ProjectSpecimen'
import { WorkIndex } from '@/components/work/WorkIndex'

/**
 * §04 Builds. An index, then five projects. Each tells its story first,
 * shows how it works second, and keeps the implementation behind a deep
 * dive. The field dims so the work leads.
 */
export default function Work() {
  return (
    <SectionFrame id="work" field="dim" className="section-pad relative z-10">
      <div className="shell mt-12 lg:mt-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <StretchHeading id="work-title" className="max-w-[16ch]">
            Things I <span style={{ fontVariationSettings: "'wdth' 125" }}>actually</span> built
          </StretchHeading>
          <p className="max-w-[40ch] text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed text-ink-muted">
            Some started as experiments. Some became systems. All of them taught me something I couldn’t learn by watching
            another tutorial.
          </p>
        </div>
        <div className="mt-12">
          <WorkIndex />
        </div>
      </div>

      <ProjectPipeline />
      <ProjectApi />
      <ProjectAgentGraph />
      <ProjectRoutes />
      <ProjectSpecimen />
    </SectionFrame>
  )
}
