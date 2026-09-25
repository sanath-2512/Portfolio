import { SectionFrame } from '@/components/global/SectionFrame'
import { StretchHeading } from '@/components/motion/StretchHeading'
import { ProjectAgentGraph } from '@/components/work/ProjectAgentGraph'
import { ProjectApi } from '@/components/work/ProjectApi'
import { ProjectPipeline } from '@/components/work/ProjectPipeline'
import { ProjectRoutes } from '@/components/work/ProjectRoutes'
import { ProjectSpecimen } from '@/components/work/ProjectSpecimen'
import { WorkIndex } from '@/components/work/WorkIndex'

/**
 * §04 Work. An index, then five projects — each in the layout its own
 * system suggests: a pipeline, an API, an agent graph, a route map, a
 * specimen sheet. The field dims so the work leads.
 */
export default function Work() {
  return (
    <SectionFrame id="work" field="dim" className="section-pad relative z-10">
      <div className="shell mt-12 lg:mt-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <StretchHeading id="work-title">
            Work, <span style={{ fontVariationSettings: "'wdth' 125" }}>checked</span>
          </StretchHeading>
          <p className="mono max-w-[44ch] text-ink-muted">
            Five projects. Every number cites its source; every diagram is drawn from the code.
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
