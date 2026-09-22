import { useCallback, useEffect, useRef, useState } from 'react'
import { navItems, profile } from '@/data/content'
import { useActiveSection } from '@/hooks/useActiveSection'
import { pauseSmoothScroll, resumeSmoothScroll, scrollToId, scrollToTop } from '@/lib/smoothScroll'
import { cx } from '@/lib/utils'
import { CloseIcon, GitHubIcon, LinkedInIcon, MenuIcon } from '@/components/ui/Icons'

const SECTION_IDS = navItems.map((item) => item.id)
const FOCUSABLE = 'a[href], button:not([disabled])'

export function Navbar() {
  const [hidden, setHidden] = useState(false)
  const [condensed, setCondensed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(SECTION_IDS)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const toggleRef = useRef<HTMLButtonElement | null>(null)

  /* Hide on scroll down, return on scroll up. */
  useEffect(() => {
    let last = window.scrollY
    let ticking = false

    const evaluate = () => {
      const y = window.scrollY
      setCondensed(y > 24)
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 160)
        last = y
      }
      ticking = false
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(evaluate)
    }

    evaluate()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Full-screen menu: lock the page, trap focus, close on Escape. */
  useEffect(() => {
    if (!menuOpen) return

    pauseSmoothScroll()
    const { style } = document.body
    const previousOverflow = style.overflow
    const previousTouch = style.touchAction
    style.overflow = 'hidden'
    style.touchAction = 'none'

    const panel = menuRef.current
    const items = panel ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)) : []
    items[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setMenuOpen(false)
        return
      }
      if (event.key !== 'Tab' || items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      style.overflow = previousOverflow
      style.touchAction = previousTouch
      resumeSmoothScroll()
      toggleRef.current?.focus()
    }
  }, [menuOpen])

  const go = useCallback((id: string) => {
    setMenuOpen(false)
    // Wait for the scroll lock to lift before handing off to Lenis.
    requestAnimationFrame(() => scrollToId(id))
  }, [])

  return (
    <>
      <header
        className={cx(
          'fixed inset-x-0 top-0 z-50 transition-transform duration-500',
          hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0',
        )}
        style={{ transitionTimingFunction: 'var(--ease-out)' }}
      >
        <div
          className={cx(
            'transition-colors duration-500',
            condensed && !menuOpen ? 'border-b border-line bg-ink/92 backdrop-blur-md' : 'border-b border-transparent',
          )}
          style={{ transitionTimingFunction: 'var(--ease-out)' }}
        >
          <nav
            aria-label="Primary"
            className={cx(
              'shell flex items-center justify-between transition-[padding] duration-500',
              condensed ? 'py-3' : 'py-5',
            )}
            style={{ transitionTimingFunction: 'var(--ease-out)' }}
          >
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                scrollToTop()
              }}
              className="tap-target font-display text-[15px] font-bold tracking-tight text-fg"
            >
              {profile.shortName}
              <span className="text-accent">.</span>
            </button>

            <ul className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => go(item.id)}
                    aria-current={active === item.id ? 'true' : undefined}
                    className={cx(
                      'group relative px-3 py-2 text-[13px] transition-colors duration-300',
                      active === item.id ? 'text-fg' : 'text-fg-dim hover:text-fg',
                    )}
                  >
                    {item.label}
                    <span
                      className={cx(
                        'absolute inset-x-3 bottom-1 h-px origin-left bg-accent transition-transform duration-300',
                        active === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                      )}
                      style={{ transitionTimingFunction: 'var(--ease-out)' }}
                    />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-1">
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile"
                className="tap-target justify-center px-3 text-fg-dim transition-colors duration-300 hover:text-fg"
              >
                <GitHubIcon size={17} />
              </a>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
                className="tap-target justify-center px-3 text-fg-dim transition-colors duration-300 hover:text-fg"
              >
                <LinkedInIcon size={17} />
              </a>
              <button
                ref={toggleRef}
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                className="tap-target justify-center px-3 text-fg md:hidden"
              >
                {menuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Rendered outside the header: the header carries a transform, which
          would otherwise make this fixed panel resolve against the nav bar. */}
      {menuOpen ? (
        <div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-5 pb-10 pt-28 md:hidden"
        >
          <ul className="flex flex-col">
            {navItems.map((item, index) => (
              <li key={item.id} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => go(item.id)}
                  className="flex w-full items-baseline gap-4 py-5 text-left"
                >
                  <span className="mono text-fg-faint">{String(index + 1).padStart(2, '0')}</span>
                  <span className="display-sm text-fg">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href={profile.links.github} target="_blank" rel="noreferrer" className="tap-target mono text-fg-dim">
              GitHub
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="tap-target mono text-fg-dim">
              LinkedIn
            </a>
            <a href={profile.links.resume} target="_blank" rel="noreferrer" className="tap-target mono text-fg-dim">
              Résumé
            </a>
          </div>
        </div>
      ) : null}
    </>
  )
}
