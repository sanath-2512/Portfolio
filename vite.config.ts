import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from 'node:child_process'
import path from 'path'

/** Short SHA and last-commit date, printed in the hero and footer. */
function buildInfo() {
  const run = (cmd: string) => {
    try {
      return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
    } catch {
      return ''
    }
  }
  const sha = run('git rev-parse --short HEAD') || (process.env.VERCEL_GIT_COMMIT_SHA ?? '').slice(0, 7) || 'dev'
  const date = run('git log -1 --format=%cs') || new Date().toISOString().slice(0, 10)
  return { sha, date }
}

/**
 * Preloads the Latin Archivo and Martian Mono (wdth + wght) files. Fontsource
 * hashes them into /assets at build time, so the tags are written after bundling.
 */
function preloadFonts(): Plugin {
  return {
    name: 'preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const files = Object.keys(ctx.bundle ?? {}).filter((name) =>
          /(archivo|martian-mono)-latin-wdth-normal.*\.woff2$/.test(name),
        )
        return files.map((file) => ({
          tag: 'link',
          attrs: { rel: 'preload', href: `/${file}`, as: 'font', type: 'font/woff2', crossorigin: '' },
          injectTo: 'head' as const,
        }))
      },
    },
  }
}

/**
 * Link previews need absolute URLs. On Vercel the production domain is known
 * at build time; locally the tags fall back to relative paths.
 */
function socialMeta(): Plugin {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.SITE_HOST || ''
  const origin = host ? `https://${host.replace(/^https?:\/\//, '')}` : ''
  return {
    name: 'social-meta',
    transformIndexHtml() {
      const image = `${origin}/og.png`
      const tags: Array<{ attrs: Record<string, string> }> = [
        { attrs: { property: 'og:image', content: image } },
        { attrs: { property: 'og:image:width', content: '1200' } },
        { attrs: { property: 'og:image:height', content: '630' } },
        { attrs: { property: 'og:image:alt', content: 'Sanath Waraikar — Backend × Applied AI' } },
        { attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { attrs: { name: 'twitter:image', content: image } },
      ]
      if (origin) tags.push({ attrs: { property: 'og:url', content: `${origin}/` } })
      const out = tags.map((t) => ({ tag: 'meta', attrs: t.attrs, injectTo: 'head' as const }))
      if (origin) out.push({ tag: 'link', attrs: { rel: 'canonical', href: `${origin}/` }, injectTo: 'head' as const } as never)
      return out
    },
  }
}

const info = buildInfo()

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadFonts(), socialMeta()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  define: {
    __BUILD_SHA__: JSON.stringify(info.sha),
    __BUILD_DATE__: JSON.stringify(info.date),
  },
})
