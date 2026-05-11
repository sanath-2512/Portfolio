import { useEffect, useState } from 'react'

const contactEmail = 'sanath.waraikar2024@nst.rishihood.edu.in'
const lines = [
  '> contact --status',
  '  Available for AI and full-stack projects',
  '> response_time --fast',
  '  Ready to connect',
]

const socials = [
  { label: 'GitHub',   href: 'https://github.com/sanath-2512',                        icon: '⌥' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sanath-waraikar-4ba35b308/', icon: '◈' },
  { label: 'Email',    href: `mailto:${contactEmail}`,                                  icon: '✉' },
]

export default function Contact() {
  const [visible, setVisible] = useState(0)
  const [focused, setFocused] = useState<string | null>(null)

  useEffect(() => {
    const timers = lines.map((_, index) => window.setTimeout(() => setVisible(index + 1), 450 + index * 520))
    return () => timers.forEach(window.clearTimeout)
  }, [])

  const inputBase: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--color-border)',
    color: 'var(--color-text-primary)',
    fontFamily: 'monospace',
    fontSize: 14,
    padding: '10px 0',
    outline: 'none',
    transition: 'border-color 0.28s var(--ease-premium)',
    caretColor: '#00d9ff',
  }

  return (
    <section id="contact" aria-label="Contact" className="section-shell bg-bg-primary">
      <div className="section-inner">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.28em] text-brand-cyan">Contact</p>
          <h2 className="font-display text-4xl font-bold md:text-6xl">Let’s build something useful.</h2>
          <p className="mt-4 text-sm text-text-muted md:text-base">Email: {contactEmail}</p>
        </div>
        <form
          className="premium-surface relative mx-auto mt-12 max-w-3xl rounded-2xl border border-brand-cyan/20 bg-bg-glass p-5 font-mono text-sm text-text-primary sm:p-8"
          onSubmit={(event) => {
            event.preventDefault()
            const data = new FormData(event.currentTarget)
            const name = encodeURIComponent(String(data.get('name') || ''))
            const message = encodeURIComponent(String(data.get('message') || ''))
            if (!contactEmail) {
              window.alert('Contact email is not configured yet.')
              return
            }
            window.location.href = `mailto:${contactEmail}?subject=Portfolio%20message%20from%20${name}&body=${message}`
          }}
        >
          <span className="absolute left-0 top-0 h-10 w-10 border-l border-t border-brand-cyan" />
          <span className="absolute bottom-0 right-0 h-10 w-10 border-b border-r border-brand-cyan" />
          <p className="text-brand-cyan">sanath@portfolio:~$ <span className="terminal-cursor">▋</span></p>
          <div className="mt-6 min-h-28 space-y-2 text-text-muted mb-8">
            {lines.slice(0, visible).map((line) => <p key={line}>{line}</p>)}
          </div>
          
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize:10, letterSpacing:'0.1em', color:'var(--color-text-muted)', display:'block', marginBottom:6 }}>NAME</label>
            <input type="text" name="name" autoComplete="name" style={{ ...inputBase, borderBottomColor: focused === 'name' ? '#00d9ff' : 'var(--color-border)' }}
              onFocus={()=>setFocused('name')} onBlur={()=>setFocused(null)} />
          </div>

          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:10, letterSpacing:'0.1em', color:'var(--color-text-muted)', display:'block', marginBottom:6 }}>EMAIL</label>
            <input type="email" name="email" autoComplete="email" style={{ ...inputBase, borderBottomColor: focused === 'email' ? '#00d9ff' : 'var(--color-border)' }}
              onFocus={()=>setFocused('email')} onBlur={()=>setFocused(null)} />
          </div>

          <div style={{ marginBottom:32 }}>
            <label style={{ fontSize:10, letterSpacing:'0.1em', color:'var(--color-text-muted)', display:'block', marginBottom:6 }}>MSG</label>
            <textarea rows={4} name="message" style={{ ...inputBase, resize:'none', borderBottomColor: focused === 'msg' ? '#00d9ff' : 'var(--color-border)' }}
              onFocus={()=>setFocused('msg')} onBlur={()=>setFocused(null)} />
          </div>

          <button type="submit" style={{
            background: 'transparent',
            border: '1px solid rgba(0,217,255,0.4)',
            borderRadius: 6,
            padding: '10px 24px',
            color: '#00d9ff',
            fontFamily: 'monospace',
            fontSize: 14,
            cursor: 'pointer',
            letterSpacing: '0.05em',
            transition: 'background 0.28s var(--ease-premium), box-shadow 0.28s var(--ease-premium), transform 0.28s var(--ease-premium)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'color-mix(in oklab, var(--color-brand-cyan), transparent 88%)'
            e.currentTarget.style.boxShadow = 'var(--shadow-premium)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'translateY(0)'
          }}>
            <span style={{ opacity:0.6 }}>→</span> execute_send()
          </button>
        </form>

        <div style={{ display:'flex', justifyContent:'center', gap:20, marginTop:40, flexWrap: 'wrap' }}>
          {socials.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
              style={{ color:'var(--color-text-muted)', textDecoration:'none', fontSize:14,
                display:'flex', alignItems:'center', gap:8,
                transition:'color 0.28s var(--ease-premium)', borderBottom:'1px solid transparent',
                paddingBottom:2 }}
              onMouseEnter={e => { e.currentTarget.style.color='#00d9ff'; e.currentTarget.style.borderBottomColor='rgba(0,217,255,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.color='var(--color-text-muted)'; e.currentTarget.style.borderBottomColor='transparent' }}>
              <span style={{ fontFamily:'monospace' }}>{s.icon}</span>
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
