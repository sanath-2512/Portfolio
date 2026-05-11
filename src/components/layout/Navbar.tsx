import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const RESUME_URL = '/resume-sanath-waraikar.pdf'

const links: Array<[string, string]> = [
  ['About',   '#about'],
  ['Work',    '#work'],
  ['Connect', '#open-source'],
  ['Contact', '#contact'],
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <nav className={cn('fixed left-0 top-0 z-50 w-full transition-all duration-300 [transition-timing-function:var(--ease-premium)]', scrolled && 'border-b border-border bg-[var(--color-nav-bg)] shadow-[var(--shadow-premium)] backdrop-blur-xl')} aria-label="Primary navigation">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-4">
        <a href="#home" className="group flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border bg-surface/70 font-display font-black backdrop-blur-xl transition-all duration-300 [transition-timing-function:var(--ease-premium)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-premium)]">
          <span className="bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent">SW</span>
        </a>
        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="group relative text-sm text-text-muted transition hover:text-text-primary">
              {label}
              <span className="absolute -bottom-2 left-0 h-px w-0 bg-brand-cyan transition-all group-hover:w-full" />
            </a>
          ))}
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '6px 16px', borderRadius: 6,
              border: '1px solid color-mix(in oklab, var(--color-brand-cyan), var(--color-border) 55%)',
              color: 'var(--color-brand-cyan)', fontSize: 13, fontWeight: 500,
              textDecoration: 'none',
              background: 'color-mix(in oklab, var(--color-surface), var(--color-brand-cyan) 6%)',
              transition: 'background 0.28s var(--ease-premium), box-shadow 0.28s var(--ease-premium), transform 0.28s var(--ease-premium)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'color-mix(in oklab, var(--color-surface), var(--color-brand-cyan) 11%)'
              e.currentTarget.style.boxShadow = 'var(--shadow-premium)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'color-mix(in oklab, var(--color-surface), var(--color-brand-cyan) 6%)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Resume ↗
          </a>
        </div>
        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button type="button" className="rounded-full border border-border bg-surface/80 p-2 text-text-primary backdrop-blur-xl transition-all duration-300 [transition-timing-function:var(--ease-premium)] hover:border-brand-cyan/35" aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 top-[73px] z-40 flex flex-col bg-[var(--color-nav-bg)] p-8 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-6">
            {links.map(([label, href], index) => (
              <a key={label} href={href} onClick={() => setOpen(false)}
                className="font-display text-4xl font-bold"
                style={{ animation: `fadeIn 0.4s ease forwards`, animationDelay: `${index * 0.08}s` }}>
                {label}
              </a>
            ))}
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              style={{
                marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', borderRadius: 8,
                border: '1px solid rgba(0,217,255,0.35)',
                color: '#00d9ff', fontSize: 16, fontWeight: 500,
                textDecoration: 'none', background: 'rgba(0,217,255,0.06)',
                animation: `fadeIn 0.4s ease forwards`,
                animationDelay: `${links.length * 0.08}s`,
              }}>
              View Resume ↗
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
