import type { WhyNote as WhyNoteData } from '@/data/content'
import { cx } from '@/lib/utils'

/**
 * Small, consistent callout that answers one engineering decision.
 * Rendered inside the section it belongs to, never as a section of its own.
 */
export function WhyNote({ note, className }: { note: WhyNoteData; className?: string }) {
  return (
    <aside className={cx('reveal-item border-l border-accent-line pl-5', className)}>
      <p className="mono text-accent">{note.question}</p>
      <p className="mt-2 max-w-[42ch] text-[15px] leading-relaxed text-fg">{note.answer}</p>
      <p className="mono mt-2 text-fg-faint">{note.context}</p>
    </aside>
  )
}
