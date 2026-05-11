function GitHubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function LinkedInIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  )
}

const repos = [
  { name: 'AgriMind', desc: 'LangGraph + RAG agentic AI for agriculture', url: 'https://github.com/sanath-2512/cropyeild_ml', lang: 'Python', color: '#3b82f6' },
  { name: 'EduAI', desc: 'Adaptive AI learning and quiz platform', url: 'https://github.com/sanath-2512/EduAI.', lang: 'JavaScript', color: '#f59e0b' },
  { name: 'Data Viz Portfolio', desc: 'Retail & agricultural performance dashboards', url: 'https://github.com/sanath-2512/Dva-Portofolio', lang: 'Python', color: '#e9682a' },
]

export default function OpenSource() {
  return (
    <section id="open-source" aria-label="Connect" className="section-shell bg-bg-secondary">
      <div className="section-inner">
        <div className="two-col-grid">

          {/* Left — social links */}
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.28em] text-brand-cyan">Connect</p>
            <h2 className="font-display text-4xl font-bold md:text-5xl">Find me online.</h2>
            <p className="mt-5 text-lg leading-8 text-text-muted">
              All my code is public. Reach out on LinkedIn for collaborations, internships, or just a good engineering conversation.
            </p>

            <div style={{ display:'flex', flexDirection:'column', gap:12, marginTop:32 }}>
              <a
                href="https://github.com/sanath-2512"
                target="_blank"
                rel="noreferrer"
                style={{
                  display:'flex', alignItems:'center', gap:14, padding:'16px 20px',
                  borderRadius:12, background:'var(--color-surface)',
                  border:'1px solid var(--color-border)',
                  textDecoration:'none', color:'var(--color-text-primary)',
                  transition:'border-color 0.28s var(--ease-premium), background 0.28s var(--ease-premium), transform 0.28s var(--ease-premium), box-shadow 0.28s var(--ease-premium)',
                  boxShadow:'var(--shadow-premium)',
                  backdropFilter:'blur(12px)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor='color-mix(in oklab, var(--color-brand-cyan), var(--color-border) 48%)'
                  e.currentTarget.style.background='color-mix(in oklab, var(--color-surface), var(--color-brand-cyan) 6%)'
                  e.currentTarget.style.transform='translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor='var(--color-border)'
                  e.currentTarget.style.background='var(--color-surface)'
                  e.currentTarget.style.transform='translateY(0)'
                }}
              >
                <span style={{ color:'var(--color-text-muted)' }}><GitHubIcon size={22} /></span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize:14, fontWeight:600 }}>github.com/sanath-2512</div>
                  <div style={{ fontSize:12, color:'var(--color-text-muted)', marginTop:2 }}>Public repositories and active project work</div>
                </div>
                <span style={{ marginLeft:'auto', fontSize:12, color:'var(--color-text-muted)' }}>↗</span>
              </a>

              <a
                href="https://www.linkedin.com/in/sanath-waraikar-4ba35b308/"
                target="_blank"
                rel="noreferrer"
                style={{
                  display:'flex', alignItems:'center', gap:14, padding:'16px 20px',
                  borderRadius:12, background:'var(--color-surface)',
                  border:'1px solid var(--color-border)',
                  textDecoration:'none', color:'var(--color-text-primary)',
                  transition:'border-color 0.28s var(--ease-premium), background 0.28s var(--ease-premium), transform 0.28s var(--ease-premium), box-shadow 0.28s var(--ease-premium)',
                  boxShadow:'var(--shadow-premium)',
                  backdropFilter:'blur(12px)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor='color-mix(in oklab, #0a66c2, var(--color-border) 42%)'
                  e.currentTarget.style.background='color-mix(in oklab, var(--color-surface), #0a66c2 6%)'
                  e.currentTarget.style.transform='translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor='var(--color-border)'
                  e.currentTarget.style.background='var(--color-surface)'
                  e.currentTarget.style.transform='translateY(0)'
                }}
              >
                <span style={{ color:'#0a66c2' }}><LinkedInIcon size={22} /></span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize:14, fontWeight:600 }}>Sanath Waraikar</div>
                  <div style={{ fontSize:12, color:'var(--color-text-muted)', marginTop:2, overflowWrap: 'anywhere' }}>linkedin.com/in/sanath-waraikar-4ba35b308</div>
                </div>
                <span style={{ marginLeft:'auto', fontSize:12, color:'var(--color-text-muted)' }}>↗</span>
              </a>

              <div style={{
                display:'flex', alignItems:'center', gap:14, padding:'16px 20px',
                borderRadius:12, background:'var(--color-surface)',
                border:'1px solid var(--color-border)',
                boxShadow:'var(--shadow-premium)',
                backdropFilter:'blur(12px)',
              }}>
                <span style={{ color:'#00d9ff', fontSize:18 }}>✦</span>
                <div>
                  <div style={{ fontSize:14, fontWeight:600 }}>GSSoC Contributor · 2025</div>
                  <div style={{ fontSize:12, color:'var(--color-text-muted)', marginTop:2 }}>Open source — real codebases, focused PRs</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — pinned repos */}
          <div>
            <p style={{ fontSize:11, letterSpacing:'0.12em', color:'var(--color-text-muted)', textTransform:'uppercase', marginBottom:20 }}>Repositories</p>
            <div style={{ display:'grid', gap:12 }}>
              {repos.map(repo => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display:'flex', justifyContent:'space-between', alignItems:'center',
                    padding:'14px 18px', borderRadius:10,
                    background:'var(--color-surface)',
                    border:'1px solid var(--color-border)',
                    textDecoration:'none',
                    transition:'border-color 0.28s var(--ease-premium), background 0.28s var(--ease-premium), transform 0.28s var(--ease-premium), box-shadow 0.28s var(--ease-premium)',
                    boxShadow:'var(--shadow-premium)',
                    backdropFilter:'blur(12px)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor='color-mix(in oklab, var(--color-brand-cyan), var(--color-border) 58%)'
                    e.currentTarget.style.background='color-mix(in oklab, var(--color-surface), var(--color-brand-cyan) 4%)'
                    e.currentTarget.style.transform='translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor='var(--color-border)'
                    e.currentTarget.style.background='var(--color-surface)'
                    e.currentTarget.style.transform='translateY(0)'
                  }}
                >
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:'var(--color-text-primary)', marginBottom:3 }}>{repo.name}</div>
                    <div style={{ fontSize:12, color:'var(--color-text-muted)' }}>{repo.desc}</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginLeft:16, flexShrink:0 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:repo.color }} />
                    <span style={{ fontSize:11, color:'var(--color-text-muted)' }}>{repo.lang}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
