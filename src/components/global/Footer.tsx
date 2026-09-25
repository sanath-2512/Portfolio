import { build, profile } from '@/data/content'
import { scrollToTop } from '@/lib/smoothScroll'

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-bg">
      <div className="shell flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="mono text-ink-muted">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="mono text-ink-muted">
          Build <span className="text-ink">{build.sha}</span> · Updated <span className="text-ink">{build.date}</span>
        </p>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            scrollToTop()
          }}
          className="link mono -my-2"
        >
          <span className="link-rule">Back to top</span> ↑
        </a>
      </div>
    </footer>
  )
}
