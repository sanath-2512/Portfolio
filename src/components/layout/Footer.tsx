import { profile, siteMeta } from '@/data/content'

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="shell flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="mono text-fg-faint">
          © {siteMeta.year} {profile.name}
        </p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-1">
          <a href={profile.links.github} target="_blank" rel="noreferrer" className="tap-target mono text-fg-dim transition-colors duration-300 hover:text-fg">
            GitHub
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="tap-target mono text-fg-dim transition-colors duration-300 hover:text-fg">
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`} className="tap-target mono text-fg-dim transition-colors duration-300 hover:text-fg">
            Email
          </a>
          <a href={profile.links.resume} target="_blank" rel="noreferrer" className="tap-target mono text-fg-dim transition-colors duration-300 hover:text-fg">
            Résumé
          </a>
        </nav>
      </div>
    </footer>
  )
}
