import { motion, useMotionValue, useSpring } from 'framer-motion'
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BaseProps = {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'ghost' | 'terminal'
}

type Props =
  | (BaseProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'onDrag' | 'onMouseMove' | 'onMouseLeave'>)
  | (BaseProps & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onMouseMove' | 'onMouseLeave'>)

export function MagneticButton({ children, className, href, variant = 'primary', ...props }: Props) {
  const x = useSpring(useMotionValue(0), { stiffness: 150, damping: 15 })
  const y = useSpring(useMotionValue(0), { stiffness: 150, damping: 15 })
  const base = cn(
    'group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-3 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-brand-cyan/70',
    variant === 'primary' && 'border border-brand-cyan/30 bg-surface/75 text-text-primary shadow-[var(--shadow-premium)] backdrop-blur-xl hover:-translate-y-0.5 hover:border-brand-cyan/55 hover:shadow-[var(--shadow-premium-hover)]',
    variant === 'ghost' && 'px-2 text-text-primary after:absolute after:bottom-2 after:left-2 after:h-px after:w-0 after:bg-brand-cyan after:transition-all hover:after:w-[calc(100%-1rem)]',
    variant === 'terminal' && 'rounded-md border border-brand-cyan/30 bg-brand-cyan/10 px-5 py-2 font-mono text-brand-cyan hover:bg-brand-cyan/15',
    className,
  )

  const handleMove = (event: MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)
    const distance = Math.hypot(dx, dy)
    if (distance < 80) {
      x.set(dx * 0.3)
      y.set(dy * 0.3)
    }
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  if (href) {
    return (
      <motion.a href={href} className={base} style={{ x, y }} onMouseMove={handleMove} onMouseLeave={handleLeave} {...(props as any)}>
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button className={base} style={{ x, y }} onMouseMove={handleMove} onMouseLeave={handleLeave} {...(props as any)}>
      {children}
    </motion.button>
  )
}
