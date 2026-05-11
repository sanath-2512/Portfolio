export function TechStack() {
  const coreStack = [
    { name: 'Python', color: '#3b82f6' },
    { name: 'React', color: '#06b6d4' },
    { name: 'FastAPI', color: '#10b981' },
    { name: 'Node.js', color: '#84cc16' },
    { name: 'TypeScript', color: '#3178c6' },
    { name: 'Pandas', color: '#e9682a' },
    { name: 'SQL', color: '#0ea5e9' },
    { name: 'JavaScript', color: '#eab308' },
    { name: 'Tailwind CSS', color: '#22d3ee' },
    { name: 'MySQL', color: '#1d4ed8' },
    { name: 'Express.js', color: '#64748b' },
    { name: 'Prisma ORM', color: '#8b5cf6' },
  ]

  const ecosystem = [
    { name: 'LangGraph', color: '#8b5cf6' },
    { name: 'ChromaDB', color: '#f59e0b' },
    { name: 'Three.js', color: '#6b7280' },
    { name: 'PostgreSQL', color: '#336791' },
    { name: 'TailwindCSS', color: '#06b6d4' },
    { name: 'Matplotlib', color: '#11557c' },
    { name: 'Seaborn', color: '#4da8da' },
    { name: 'Jupyter', color: '#f37726' },
    { name: 'Git', color: '#f05032' },
    { name: 'Next.js', color: '#64748b' },
    { name: 'Scikit-learn', color: '#f97316' },
    { name: 'JWT Auth', color: '#22c55e' },
    { name: 'REST APIs', color: '#0ea5e9' },
    { name: 'Zod Validation', color: '#a855f7' },
    { name: 'Render', color: '#06b6d4' },
    { name: 'Vercel', color: '#334155' },
    { name: 'Tableau', color: '#2563eb' },
    { name: 'Google Sheets', color: '#16a34a' },
  ]

  return (
    <section id="stack" className="section-shell text-center">
      <div className="section-inner">
        <span style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--color-brand-cyan)', textTransform: 'uppercase' }}>STACK</span>
        <h2 style={{ fontSize: 'clamp(28px,5vw,56px)', fontWeight: 800, margin: '12px 0 12px' }}>
          Technologies I work with.
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-text-muted">
          A reliable toolkit for shipping production-ready AI apps, scalable APIs, and modern frontend experiences.
        </p>

        <div className="premium-surface rounded-2xl p-6 md:p-8">
          <p className="mb-4 text-left text-xs uppercase tracking-[0.16em] text-brand-cyan">Core Stack</p>
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {coreStack.map((tech) => (
              <div
                key={tech.name}
                className="hover-depth rounded-xl border px-3 py-2 text-sm font-medium"
                style={{
                  borderColor: `${tech.color}55`,
                  background: `${tech.color}12`,
                  color: tech.color,
                }}
              >
                {tech.name}
              </div>
            ))}
          </div>

          <p className="mb-4 text-left text-xs uppercase tracking-[0.16em] text-text-muted">Ecosystem</p>
          <div className="flex flex-wrap gap-2">
            {ecosystem.map((tech) => (
              <span
                key={tech.name}
                className="hover-depth rounded-full border px-3 py-1.5 text-xs font-medium"
                style={{
                  borderColor: `${tech.color}50`,
                  background: `${tech.color}10`,
                  color: tech.color,
                }}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
export default TechStack
