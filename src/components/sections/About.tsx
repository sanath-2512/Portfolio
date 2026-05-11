export default function About() {
  const strengths = [
    { label: 'AI & ML Systems', detail: 'LangGraph · RAG · FastAPI agents' },
    { label: 'Full-Stack Development', detail: 'React · TypeScript · Node.js' },
    { label: 'Data Engineering', detail: 'Python · Pandas · SQL · Jupyter' },
  ]

  return (
    <section id="about" aria-label="About Sanath" className="section-shell bg-bg-primary">
      <div className="section-inner grid items-center gap-16 lg:grid-cols-[1fr_0.7fr]">
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.28em] text-brand-cyan">About</p>
          <h2 className="font-display text-4xl font-bold leading-tight md:text-6xl">
            AI engineer focused on useful, shipped products.
          </h2>
          <div className="mt-8 max-w-2xl space-y-5 text-lg leading-8 text-text-muted">
            <p>I build full-stack AI applications — React frontends, FastAPI backends, LangGraph agent pipelines, and RAG-powered retrieval systems.</p>
            <p>I care about clean product flows, fast interfaces, maintainable systems, and AI features that solve real problems.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <span style={{ fontSize:11, padding:'5px 14px', borderRadius:9999, border:'1px solid color-mix(in oklab, var(--color-brand-cyan), transparent 72%)', color:'var(--color-brand-cyan)', background:'color-mix(in oklab, var(--color-brand-cyan), transparent 94%)', letterSpacing:'0.1em', textTransform:'uppercase' }}>
              GSSoC Contributor · 2025
            </span>
            <span style={{ fontSize:11, padding:'5px 14px', borderRadius:9999, border:'1px solid rgba(139,92,246,0.25)', color:'#a78bfa', background:'rgba(139,92,246,0.06)', letterSpacing:'0.1em', textTransform:'uppercase' }}>
              AI Systems Engineer
            </span>
          </div>
        </div>
        <div className="grid gap-4">
          {strengths.map((item) => (
            <div
              key={item.label}
              className="premium-surface hover-depth rounded-xl p-5"
            >
              <div className="mb-1 text-sm font-semibold text-text-primary">{item.label}</div>
              <div className="text-xs text-text-muted">{item.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
