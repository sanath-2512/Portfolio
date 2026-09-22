import { useRef } from 'react'
import { profile } from '@/data/content'
import { useGsapContext } from '@/hooks/useGsapContext'
import { revealText, revealUp, DUR } from '@/lib/motion'
import { scrollToId } from '@/lib/smoothScroll'
import { ArrowDownIcon, FileIcon, GitHubIcon, LinkedInIcon } from '@/components/ui/Icons'
import { ActionLink } from '@/components/ui/ActionLink'

export default function Hero() {
  const root = useRef<HTMLElement | null>(null)

  useGsapContext(root, () => {
    // Timed with the scene's assemble tween so type and geometry land together.
    revealText('.hero-line > span', { delay: 0.1, stagger: 0.08 })
    revealUp('.hero-meta', { delay: 0.55, stagger: 0.1 })
    revealUp('.hero-cue', { delay: DUR.long, stagger: 0 })
  })

  return (
    <section
      ref={root}
      id="home"
      className="relative flex min-h-svh flex-col justify-end pb-14 pt-32 md:pb-20"
    >
      <div className="shell w-full">
        <p className="hero-line line-mask mono text-accent">
          <span>{profile.role}</span>
        </p>

        <h1 className="display-xl mt-6 text-fg">
          <span className="hero-line line-mask">
            <span>Sanath</span>
          </span>
          <span className="hero-line line-mask">
            <span>Waraikar</span>
          </span>
        </h1>

        <div className="grid12 mt-10 gap-y-10 md:mt-14">
          <p className="hero-meta body-lg col-span-4 max-w-[46ch] text-fg md:col-span-5 md:col-start-8">
            {profile.statement}
          </p>
        </div>

        <div className="hero-meta mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 md:mt-14">
          <button
            type="button"
            onClick={() => scrollToId('projects')}
            className="tap-target gap-2 bg-paper px-5 text-[13px] font-medium text-ink transition-colors duration-300 hover:bg-fg"
            style={{ transitionTimingFunction: 'var(--ease-out)' }}
          >
            View work
          </button>
          <ActionLink href={profile.links.github} label="GitHub" icon={<GitHubIcon size={15} />} />
          <ActionLink href={profile.links.linkedin} label="LinkedIn" icon={<LinkedInIcon size={15} />} />
          <ActionLink href={profile.links.resume} label="Résumé" icon={<FileIcon size={15} />} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => scrollToId('about')}
        className="hero-cue tap-target absolute bottom-5 right-5 gap-2 text-fg-faint transition-colors duration-300 hover:text-fg md:right-10"
        aria-label="Scroll to About"
      >
        <span className="mono">Scroll</span>
        <ArrowDownIcon size={14} />
      </button>
    </section>
  )
}
