import type { ReactNode } from 'react'

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function ArchitectureDiagram() {
  const nodes = [
    { label: 'User', x: 70, y: 90 },
    { label: 'React', x: 190, y: 90 },
    { label: 'FastAPI', x: 310, y: 90 },
    { label: 'LangGraph', x: 440, y: 60 },
    { label: 'Tools', x: 440, y: 122 },
    { label: 'LLM', x: 560, y: 60 },
    { label: 'RAG', x: 560, y: 122 },
    { label: 'Advice', x: 650, y: 90 },
  ]

  return (
    <svg viewBox="0 0 720 180" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', minHeight: 220 }} role="img" aria-label="AgriMind architecture diagram">
      <defs>
        <linearGradient id="flow" x1="0" x2="1"><stop stopColor="#00d9ff" /><stop offset="1" stopColor="#8b5cf6" /></linearGradient>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="url(#flow)" />
        </marker>
      </defs>
      <path d="M94 90 L166 90" fill="none" stroke="url(#flow)" strokeWidth="2" strokeDasharray="8 10" markerEnd="url(#arrow)" className="animate-[shimmer_2.8s_linear_infinite]" />
      <path d="M214 90 L286 90" fill="none" stroke="url(#flow)" strokeWidth="2" strokeDasharray="8 10" markerEnd="url(#arrow)" className="animate-[shimmer_2.8s_linear_infinite]" />
      <path d="M334 90 C370 90 378 60 416 60" fill="none" stroke="url(#flow)" strokeWidth="2" strokeDasharray="8 10" markerEnd="url(#arrow)" className="animate-[shimmer_2.8s_linear_infinite]" />
      <path d="M334 90 C370 90 378 122 416 122" fill="none" stroke="url(#flow)" strokeWidth="2" strokeDasharray="8 10" markerEnd="url(#arrow)" className="animate-[shimmer_2.8s_linear_infinite]" />
      <path d="M464 60 L536 60" fill="none" stroke="url(#flow)" strokeWidth="2" strokeDasharray="8 10" markerEnd="url(#arrow)" className="animate-[shimmer_2.8s_linear_infinite]" />
      <path d="M464 122 L536 122" fill="none" stroke="url(#flow)" strokeWidth="2" strokeDasharray="8 10" markerEnd="url(#arrow)" className="animate-[shimmer_2.8s_linear_infinite]" />
      <path d="M584 60 C612 60 618 90 628 90" fill="none" stroke="url(#flow)" strokeWidth="2" strokeDasharray="8 10" markerEnd="url(#arrow)" className="animate-[shimmer_2.8s_linear_infinite]" />
      <path d="M584 122 C612 122 618 90 628 90" fill="none" stroke="url(#flow)" strokeWidth="2" strokeDasharray="8 10" markerEnd="url(#arrow)" className="animate-[shimmer_2.8s_linear_infinite]" />

      {nodes.map((node) => (
        <g key={node.label}>
          <rect x={node.x - 24} y={node.y - 14} width="48" height="28" rx="8" className="diagram-node-rect" />
          <text x={node.x} y={node.y + 4} textAnchor="middle" className="diagram-node-text" fontSize="10.5" fontWeight="600">{node.label}</text>
        </g>
      ))}
    </svg>
  )
}

function LinkButton({ href, icon, label, accent = '#00d9ff' }: { href: string; icon: ReactNode; label: string; accent?: string }) {
  const accentBorder = accent.startsWith('var(')
    ? `color-mix(in oklab, ${accent}, transparent 70%)`
    : `${accent}30`
  const accentBg = accent.startsWith('var(')
    ? `color-mix(in oklab, ${accent}, transparent 92%)`
    : `${accent}08`
  const accentBgHover = accent.startsWith('var(')
    ? `color-mix(in oklab, ${accent}, transparent 86%)`
    : `${accent}15`
  const accentBorderHover = accent.startsWith('var(')
    ? `color-mix(in oklab, ${accent}, transparent 52%)`
    : `${accent}60`

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '5px 12px', borderRadius: 6,
        border: `1px solid ${accentBorder}`,
        color: accent, fontSize: 12, fontWeight: 500,
        textDecoration: 'none',
        background: accentBg,
        transition: 'background 0.2s, border-color 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = accentBgHover; e.currentTarget.style.borderColor = accentBorderHover }}
      onMouseLeave={e => { e.currentTarget.style.background = accentBg; e.currentTarget.style.borderColor = accentBorder }}
    >
      {icon} {label}
    </a>
  )
}

function Tag({ label }: { label: string }) {
  return (
    <span style={{
      fontSize: 11, padding: '3px 10px', borderRadius: 9999,
      border: '1px solid var(--color-border)',
      color: 'var(--color-text-muted)', background: 'var(--color-bg-glass)',
    }}>{label}</span>
  )
}

type Project = {
  name: string
  label: string
  description: string
  accent: string
  github: string
  live?: string
  tags: string[]
}

const projects: Project[] = [
  {
    name: 'EduAI',
    label: 'EDUAI',
    description: 'Adaptive AI learning platform that builds custom study paths, quizzes, and interactive feedback loops.',
    accent: '#8b5cf6',
    github: 'https://github.com/sanath-2512/EduAI.',
    live: 'https://edu-ai-rho-hazel.vercel.app',
    tags: ['Python', 'React', 'FastAPI', 'LLM'],
  },
  {
    name: 'Data Visualization Portfolio',
    label: 'DATA VISUALIZATION',
    description: 'Interactive data visualization projects for retail and agriculture using real datasets and dashboard storytelling.',
    accent: '#f59e0b',
    github: 'https://github.com/sanath-2512/Dva-Portofolio',
    live: 'https://dva-portofolio.vercel.app',
    tags: ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'Power BI'],
  },
  {
    name: 'Viewly',
    label: 'VIEWLY',
    description: 'Media-focused web experience with polished UI and smooth interactions, deployed live and actively maintained.',
    accent: '#10b981',
    github: 'https://github.com/sanath-2512/Viewly',
    live: 'https://viewlyy.netlify.app/',
    tags: ['React', 'UI/UX', 'Frontend', 'Netlify'],
  },
]

export default function Projects() {
  return (
    <section id="work" style={{ padding: '80px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <span style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--color-brand-cyan)', textTransform: 'uppercase' }}>WORK</span>
        <h2 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 800, margin: '12px 0 8px' }}>Selected projects.</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 56, maxWidth: 620 }}>
          AI systems, data platforms, and polished product builds with source code + live demos.
        </p>

        {/* AgriMind — FEATURED */}
        <div style={{
          background: 'color-mix(in oklab, var(--color-surface), transparent 2%)',
          border: '1px solid color-mix(in oklab, var(--color-brand-cyan), var(--color-border) 65%)',
          borderRadius: 20, padding: 'clamp(20px,4vw,40px)', marginBottom: 20,
          boxShadow: 'var(--shadow-premium)',
          backdropFilter: 'blur(12px)',
        }}>
          <div className="featured-inner-grid">
            <div>
              <span style={{ fontSize:10, letterSpacing:'0.1em', color:'var(--color-brand-cyan)', textTransform:'uppercase' }}>AGRIMIND · FEATURED</span>
              <h3 style={{ fontSize:28, fontWeight:700, margin:'8px 0 14px', lineHeight:1.2 }}>AI advisory platform for farmers</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 20, fontSize: 15 }}>
                LangGraph-based agentic advisory system with RAG, crop context, weather/tool routing, FastAPI backend, and React frontend.
              </p>
              <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
                {[['87%','Query accuracy'],['3s','Avg response'],['10K+','Vectors']].map(([v,l])=>(
                  <div key={l}>
                    <div style={{ fontSize:20, fontWeight:700, color:'var(--color-brand-cyan)' }}>{v}</div>
                    <div style={{ fontSize:11, color:'var(--color-text-muted)', marginTop:2 }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:20 }}>
                {['LangGraph','ChromaDB','FastAPI','React','Python'].map(t => <Tag key={t} label={t} />)}
              </div>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                <LinkButton href="https://github.com/sanath-2512/cropyeild_ml" icon={<GitHubIcon />} label="Source Code" accent="var(--color-brand-cyan)" />
                <LinkButton href="https://agrimind-five.vercel.app/" icon={<ExternalIcon />} label="Live Demo" accent="var(--color-brand-cyan)" />
              </div>
            </div>
            <div style={{ background: 'var(--color-surface-2)', borderRadius: 12, padding: 24, minHeight: 220, border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-premium)' }}>
              <ArchitectureDiagram />
            </div>
          </div>
        </div>

        {/* Secondary grid */}
        <div className="project-cards-grid">
          {projects.map((project) => (
            <div
              key={project.name}
              style={{
                background: 'var(--color-surface)',
                border: `1px solid color-mix(in oklab, ${project.accent}, var(--color-border) 72%)`,
                borderRadius: 16,
                padding: 28,
                transition: 'border-color 0.32s var(--ease-premium), box-shadow 0.32s var(--ease-premium), transform 0.32s var(--ease-premium), background 0.32s var(--ease-premium)',
                backdropFilter: 'blur(12px)',
                boxShadow: 'var(--shadow-premium)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `color-mix(in oklab, ${project.accent}, var(--color-border) 40%)`
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `color-mix(in oklab, ${project.accent}, var(--color-border) 72%)`
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'var(--shadow-premium)'
              }}
            >
              <span style={{ fontSize: 10, letterSpacing: '0.1em', color: project.accent, textTransform: 'uppercase' }}>{project.label}</span>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: '8px 0 10px' }}>{project.name}</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 16, fontSize: 14 }}>
                {project.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {project.tags.map((tag) => <Tag key={tag} label={tag} />)}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <LinkButton href={project.github} icon={<GitHubIcon />} label="Source Code" accent={project.accent} />
                {project.live ? <LinkButton href={project.live} icon={<ExternalIcon />} label="Live Demo" accent={project.accent} /> : null}
              </div>
            </div>
          ))}
        </div>

        {/* All projects CTA */}
        <div style={{ textAlign:'center', marginTop:40 }}>
          <a
            href="https://github.com/sanath-2512"
            target="_blank"
            rel="noreferrer"
            style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'10px 24px', borderRadius:8,
              border:'1px solid var(--color-border)',
              color:'var(--color-text-muted)', fontSize:13, textDecoration:'none',
              background:'var(--color-surface)',
              transition:'border-color 0.28s var(--ease-premium), color 0.28s var(--ease-premium), transform 0.28s var(--ease-premium), box-shadow 0.28s var(--ease-premium)',
              boxShadow:'var(--shadow-premium)',
              backdropFilter:'blur(12px)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor='color-mix(in oklab, var(--color-brand-cyan), var(--color-border) 45%)'
              e.currentTarget.style.color='var(--color-brand-cyan)'
              e.currentTarget.style.transform='translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor='var(--color-border)'
              e.currentTarget.style.color='var(--color-text-muted)'
              e.currentTarget.style.transform='translateY(0)'
            }}
          >
            <GitHubIcon /> View all projects on GitHub
          </a>
        </div>

      </div>
    </section>
  )
}

