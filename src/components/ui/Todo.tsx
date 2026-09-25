import type { ReactNode } from 'react'
import { isTodo, type Maybe, type Todo } from '@/data/content'
import { cx } from '@/lib/utils'

/**
 * Dashed placeholder in development; renders nothing in production.
 * `label` keeps it short where space is tight; the full note is the tooltip.
 */
export function TodoNote({ item, label, className }: { item: Todo; label?: string; className?: string }) {
  if (!import.meta.env.DEV) return null
  return (
    <span className={cx('todo', className)} title={item.todo}>
      TODO(user): {label ?? item.todo}
    </span>
  )
}

/** Renders `children(value)` for a real value, or the TODO placeholder. */
export function Known<T>({
  value,
  children,
  label,
  className,
}: {
  value: Maybe<T>
  children: (value: T) => ReactNode
  label?: string
  className?: string
}) {
  if (isTodo(value)) return <TodoNote item={value} label={label} className={className} />
  return <>{children(value)}</>
}
