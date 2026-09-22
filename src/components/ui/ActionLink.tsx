import type { ReactNode } from 'react'
import { ArrowIcon } from '@/components/ui/Icons'
import { cx } from '@/lib/utils'

interface ActionLinkProps {
  /** A missing URL renders nothing — links are never guessed. */
  href: string | null | undefined
  label: string
  icon?: ReactNode
  variant?: 'solid' | 'outline' | 'bare'
  className?: string
}

const variants = {
  solid: 'bg-paper text-ink hover:bg-fg',
  outline: 'border border-line-strong text-fg hover:border-fg hover:bg-fg/5',
  bare: 'text-fg-dim hover:text-fg',
} as const

export function ActionLink({ href, label, icon, variant = 'outline', className }: ActionLinkProps) {
  if (!href) return null

  const external = href.startsWith('http') || href.endsWith('.pdf')

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={cx(
        'tap-target group gap-2 px-5 text-[13px] font-medium transition-colors duration-300',
        variant !== 'bare' && 'rounded-none',
        variants[variant],
        className,
      )}
      style={{ transitionTimingFunction: 'var(--ease-out)' }}
    >
      {icon}
      <span>{label}</span>
      <ArrowIcon size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  )
}
