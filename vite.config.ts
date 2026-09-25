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

const info = buildInfo()

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadFonts()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  define: {
    __BUILD_SHA__: JSON.stringify(info.sha),
    __BUILD_DATE__: JSON.stringify(info.date),
  },
})
