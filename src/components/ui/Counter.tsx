import { useEffect, useRef } from 'react'
import { countUp } from '@/lib/motion'
import { cx } from '@/lib/utils'

interface CounterProps {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  scrub?: boolean
  className?: string
  /** Element the count is triggered from — defaults to the counter itself. */
  triggerRef?: React.RefObject<HTMLElement | null>
}

/** Number that animates once when it enters, or scrubs with scroll. */
export function Counter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  scrub = false,
  className,
  triggerRef,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    countUp(el, value, {
      decimals,
      prefix,
      suffix,
      scrub,
      trigger: triggerRef?.current ?? el,
    })
  }, [value, decimals, prefix, suffix, scrub, triggerRef])

  return (
    <span ref={ref} className={cx('numeric', className)}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  )
}
