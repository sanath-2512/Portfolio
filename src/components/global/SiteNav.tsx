import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { navItems, profile, sections } from '@/data/content'
import { useActiveSection } from '@/hooks/useActiveSection'
import { gsap } from '@/lib/gsap'
import { DUR, EASE, STAGGER, scan } from '@/lib/motion'
import { pauseSmoothScroll, resumeSmoothScroll, scrollToId, scrollToTop } from '@/lib/smoothScroll'
import { cx, prefersReducedMotion } from '@/lib/utils'
import { ArucoMark } from '@/components/global/ArucoMark'
import { ThemeToggle } from '@/components/global/ThemeToggle'
import { StretchText } from '@/components/motion/StretchText'
import { Known } from '@/components/ui/Todo'

const SECTION_IDS = navItems.map((item) => item.id)
const FOCUSABLE = 'a[href], button:not([disabled])'
const COMPACT_AT = 80

export function SiteNav() {
  const [compact, setCompact] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(SECTION_IDS)
  const toggleRef = useRef<HTMLButtonElement | null>(null)

  /* Compact after 80px; hide on scroll down, return on scroll up. */
  useEffect(() => {
    let last = window.scrollY
    let queued = false
    const evaluate = () => {
      queued = false
      const y = window.scrollY
      setCompact(y > COMPACT_AT)
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 240)
        last = y
      }
    }
    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(evaluate)
    }
    evaluate()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = useCallback((id: string) => {
    setOpen(false)
    // Let the menu release the scroll lock before handing off to Lenis.
    requestAnimationFrame(() => scrollToId(id))
  }, [])

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50"
        style={{
          transform: hidden && !open ? 'translate3d(0,-100%,0)' : 'none',
          transition: `transform 0.5s var(--ease-out)`,
        }}
      >
        <div
          className={cx(
            'border-b transition-[height,background-color,border-color] duration-500',
            compact || open ? 'border-line bg-bg' : 'border-transparent',
          )}
          style={{ height: compact ? 'var(--nav-h-compact)' : 'var(--nav-h)', transitionTimingFunction: 'var(--ease-out)' }}
        >
          <nav aria-label="Primary" className="shell flex h-full items-center justify-between gap-6">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault()
                setOpen(false)
                scrollToTop()
              }}
              className="stretch-host tap -ml-1 inline-flex items-center gap-3 pl-1"
              aria-label={`${profile.name}, back to top`}
            >
              <ArucoMark size={compact ? 20 : 24} className="transition-[width,height] duration-500" />
              <StretchText to={112} reserve className="text-[15px] font-semibold tracking-[0.005em]">
                {profile.name}
              </StretchText>
            </a>

            <div className="hidden items-center gap-1 lg:flex">
              <ul className="flex items-center">
                {navItems.map((item) => {
                  const current = active === item.id
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault()
                          go(item.id)
                        }}
                        aria-current={current ? 'true' : undefined}
                        className={cx(
                          'stretch-host group relative inline-flex min-h-[44px] items-center px-3 text-[15px] font-medium transition-colors duration-300',
                          current ? 'text-ink' : 'text-ink-muted hover:text-ink',
                        )}
                      >
                        <StretchText reserve to={116}>{item.label}</StretchText>
                        <span
                          aria-hidden="true"
                          className={cx(
                            'absolute bottom-2 left-1/2 h-[2px] w-3 -translate-x-1/2 bg-signal transition-transform duration-300',
                            current ? 'scale-x-100' : 'scale-x-0',
                          )}
                        />
                      </a>
                    </li>
                  )
                })}
                <li>
                  <Known value={profile.links.resume} label="Resume" className="mx-3">
                    {(href) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="stretch-host inline-flex min-h-[44px] items-center px-3 text-[15px] font-medium text-ink-muted hover:text-ink"
                      >
                        <StretchText reserve>Resume ↗</StretchText>
                      </a>
                    )}
                  </Known>
                </li>
              </ul>
              <span className="mx-3 h-4 w-px bg-line-strong" aria-hidden="true" />
              <ThemeToggle />
            </div>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="mono tap -mr-2 inline-flex items-center justify-center px-2 text-ink lg:hidden"
            >
              {open ? 'Close' : 'Menu'}
            </button>
          </nav>
        </div>
      </header>

      {/* Outside the header: its transform would otherwise contain this fixed panel. */}
      {open ? <MobileMenu active={active} onGo={go} onClose={() => setOpen(false)} toggleRef={toggleRef} /> : null}
    </>
  )
}

function MobileMenu({
  active,
  onGo,
  onClose,
  toggleRef,
}: {
  active: string
  onGo: (id: string) => void
  onClose: () => void
  toggleRef: React.RefObject<HTMLButtonElement | null>
}) {
  const panel = useRef<HTMLDivElement | null>(null)
  const content = useRef<HTMLDivElement | null>(null)
  const beam = useRef<HTMLSpanElement | null>(null)

  /* SCAN the panel open, top to bottom, and stagger the links up. */
  useLayoutEffect(() => {
    if (!content.current) return
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return
      scan(content.current!, beam.current, { axis: 'y', duration: DUR.wipe })
      gsap.fromTo(
        '.menu-line > span',
        { yPercent: 100 },
        { yPercent: 0, duration: DUR.in, ease: EASE, stagger: STAGGER, delay: 0.12 },
      )
    }, panel)
    return () => ctx.revert()
  }, [])

  /* Lock scroll, trap focus, close on Escape; hand focus back on close. */
  useEffect(() => {
    pauseSmoothScroll()
    const { style } = document.body
    const previous = style.overflow
    style.overflow = 'hidden'

    const items = () => [
      ...(toggleRef.current ? [toggleRef.current] : []),
      ...Array.from(panel.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
    ]
    items()[1]?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const list = items()
      const first = list[0]
      const last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    const toggle = toggleRef.current
    return () => {
      document.removeEventListener('keydown', onKey)
      style.overflow = previous
      resumeSmoothScroll()
      toggle?.focus()
    }
  }, [onClose, toggleRef])

  return (
    <div
      id="site-menu"
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-40 lg:hidden"
    >
      <div ref={content} className="flex h-full flex-col justify-between bg-bg px-[var(--gutter)] pb-8 pt-[calc(var(--nav-h)+24px)]">
        <ol className="flex flex-col">
          {navItems.map((item) => (
            <li key={item.id} className="border-b border-line">
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  onGo(item.id)
                }}
                aria-current={active === item.id ? 'true' : undefined}
                className="flex min-h-[44px] items-baseline gap-4 py-3"
              >
                <span className="mono mono-sm w-6 text-ink-muted">{sections.find((s) => s.id === item.id)?.index}</span>
                <span className="menu-line block overflow-hidden">
                  <span
                    className={cx(
                      'block text-[clamp(2.5rem,12vw,4.5rem)] font-bold uppercase leading-[0.95]',
                      active === item.id ? 'text-signal' : 'text-ink',
                    )}
                    style={{ fontVariationSettings: "'wdth' 125" }}
                  >
                    {item.label}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <div className="flex flex-wrap gap-x-5">
            <a href={profile.links.github} target="_blank" rel="noreferrer" className="link mono">
              GitHub ↗
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="link mono">
              LinkedIn ↗
            </a>
            <Known value={profile.links.resume} label="Resume">
              {(href) => (
                <a href={href} target="_blank" rel="noreferrer" className="link mono">
                  Resume ↗
                </a>
              )}
            </Known>
          </div>
          <ThemeToggle />
        </div>
      </div>
      <span
        ref={beam}
        aria-hidden="true"
        className="scan-beam"
        style={{ width: 'auto', right: 0, bottom: 'auto', height: 1 }}
      />
    </div>
  )
}
