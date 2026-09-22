import { useRef } from 'react'
import { contactPrompt, profile } from '@/data/content'
import { useGsapContext } from '@/hooks/useGsapContext'
import { revealText, revealUp } from '@/lib/motion'
import { FileIcon, GitHubIcon, LinkedInIcon, MailIcon } from '@/components/ui/Icons'

const channels = [
  { label: 'GitHub', href: profile.links.github, icon: <GitHubIcon size={16} />, external: true },
  { label: 'LinkedIn', href: profile.links.linkedin, icon: <LinkedInIcon size={16} />, external: true },
  { label: 'Email', href: `mailto:${profile.email}`, icon: <MailIcon size={16} />, external: false },
  { label: 'Résumé', href: profile.links.resume, icon: <FileIcon size={16} />, external: true },
]

export default function Contact() {
  const root = useRef<HTMLElement | null>(null)

  useGsapContext(root, () => {
    revealText('.contact-line > span', { trigger: root.current, start: 'top 75%', stagger: 0.08 })
    revealUp('.contact-item', { trigger: root.current, start: 'top 70%', stagger: 0.06 })
  })

  return (
    <section ref={root} id="contact" className="section" aria-labelledby="contact-title">
      <div className="shell">
        <div className="flex items-center gap-4 border-t border-line pt-4">
          <span className="mono text-accent">08</span>
          <span className="mono text-fg-faint">Contact</span>
        </div>

        <h2 id="contact-title" className="display-lg mt-10 max-w-[14ch] text-fg">
          <span className="contact-line line-mask">
            <span>{contactPrompt}</span>
          </span>
        </h2>

        <div className="grid12 mt-16 gap-y-10">
          <a
            href={`mailto:${profile.email}`}
            className="contact-item col-span-4 block md:col-span-7"
          >
            <span className="mono text-fg-faint">Email</span>
            <span className="link-underline mt-3 block break-words font-display text-[clamp(1.1rem,2.6vw,2rem)] font-semibold tracking-tight text-fg">
              {profile.email}
            </span>
          </a>

          <ul className="contact-item col-span-4 md:col-span-4 md:col-start-9">
            {channels.map((channel) => (
              <li key={channel.label} className="border-t border-line">
                <a
                  href={channel.href}
                  {...(channel.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="tap-target group w-full justify-between gap-4 py-4 text-fg-dim transition-colors duration-300 hover:text-fg"
                  style={{ transitionTimingFunction: 'var(--ease-out)' }}
                >
                  <span className="flex items-center gap-3 text-[15px]">
                    {channel.icon}
                    {channel.label}
                  </span>
                  <span className="mono transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
            ))}
            <li className="border-t border-line" aria-hidden="true" />
          </ul>
        </div>
      </div>
    </section>
  )
}
