import { useEffect, useState } from 'react'
import { getTheme, switchTheme, THEME_EVENT, type Theme } from '@/lib/theme'
import { cx } from '@/lib/utils'

/** DARKROOM / PAPER. The switch is a SCAN wipe (View Transitions), instant elsewhere. */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>(() => (typeof document === 'undefined' ? 'darkroom' : getTheme()))

  useEffect(() => {
    const sync = () => setTheme(getTheme())
    window.addEventListener(THEME_EVENT, sync)
    return () => window.removeEventListener(THEME_EVENT, sync)
  }, [])

  const next: Theme = theme === 'darkroom' ? 'paper' : 'darkroom'

  return (
    <button
      type="button"
      onClick={() => switchTheme(next)}
      className={cx('mono tap inline-flex items-center gap-2 whitespace-nowrap', className)}
    >
      <Option label="Darkroom" on={theme === 'darkroom'} />{' '}
      <span className="text-ink-muted">/</span>{' '}
      <Option label="Paper" on={theme === 'paper'} />
      <span className="sr-only">
        {' '}
        theme, {theme === 'darkroom' ? 'Darkroom (dark)' : 'Paper (light)'} active
      </span>
    </button>
  )
}

function Option({ label, on }: { label: string; on: boolean }) {
  return (
    <span className={cx('relative transition-colors duration-300', on ? 'text-ink' : 'text-ink-muted')}>
      {label}
      <span
        aria-hidden="true"
        className={cx(
          'absolute -bottom-1 left-0 h-px w-full origin-left bg-signal transition-transform duration-300',
          on ? 'scale-x-100' : 'scale-x-0',
        )}
      />
    </span>
  )
}
