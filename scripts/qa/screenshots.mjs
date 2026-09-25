/**
 * Screenshot + overflow harness.
 *
 *   node scripts/qa/screenshots.mjs --url http://localhost:4173 --out docs/redesign/screenshots/after \
 *     [--widths 1440,390] [--themes dark,light] [--reduced] [--viewport-only] [--no-webgl]
 *
 * For every width × theme it scrolls the page top to bottom (so scroll-triggered
 * reveals fire), returns to the top, saves a full-page PNG and a viewport PNG,
 * and asserts `scrollWidth <= innerWidth`. Exits non-zero if any width overflows.
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const args = process.argv.slice(2)
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}
const flag = (name) => args.includes(`--${name}`)

const url = opt('url', 'http://localhost:4173')
const out = opt('out', 'docs/redesign/screenshots/after')
const widths = opt('widths', '1440,1280,1024,768,430,390').split(',').map(Number)
const themes = opt('themes', 'dark').split(',')
const reduced = flag('reduced')
const viewportOnly = flag('viewport-only')
const noWebgl = flag('no-webgl')
const heights = { 1440: 900, 1280: 800, 1024: 768, 768: 1024, 430: 932, 390: 844 }

await mkdir(out, { recursive: true })

const browser = await chromium.launch({
  args: noWebgl ? ['--disable-webgl', '--disable-webgl2', '--disable-3d-apis'] : ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
})

const failures = []
const consoleErrors = []

for (const theme of themes) {
  for (const width of widths) {
    const height = heights[width] ?? 900
    const mobile = width < 768
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
      colorScheme: theme === 'light' ? 'light' : 'dark',
      reducedMotion: reduced ? 'reduce' : 'no-preference',
      hasTouch: mobile,
      isMobile: mobile,
    })
    // Pin the theme explicitly so a stored preference can't override the run.
    await context.addInitScript((t) => {
      try {
        localStorage.setItem('theme', t === 'light' ? 'paper' : 'darkroom')
      } catch {}
    }, theme)

    const page = await context.newPage()
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(`[${width} ${theme}] ${m.text()}`)
    })
    page.on('pageerror', (e) => consoleErrors.push(`[${width} ${theme}] pageerror ${e.message}`))

    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)

    const tag = `${String(width).padStart(4, '0')}-${theme}${reduced ? '-reduced' : ''}${noWebgl ? '-nowebgl' : ''}`

    await page.screenshot({ path: path.join(out, `${tag}-viewport.png`) })

    if (!viewportOnly) {
      // Walk the page so once-only scroll reveals fire before the full capture.
      const total = await page.evaluate(() => document.documentElement.scrollHeight)
      for (let y = 0; y <= total; y += Math.round(height * 0.6)) {
        await page.mouse.wheel(0, Math.round(height * 0.6))
        await page.waitForTimeout(120)
      }
      await page.waitForTimeout(800)
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.waitForTimeout(600)
      await page.screenshot({ path: path.join(out, `${tag}-full.jpg`), fullPage: true, type: 'jpeg', quality: 72 })
    }

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }))
    if (overflow.scrollWidth > overflow.innerWidth) {
      failures.push(`${tag}: scrollWidth ${overflow.scrollWidth} > innerWidth ${overflow.innerWidth}`)
    }
    console.log(`${tag}  scrollWidth=${overflow.scrollWidth} innerWidth=${overflow.innerWidth}`)

    await context.close()
  }
}

await browser.close()

if (consoleErrors.length) {
  console.log('\nConsole errors:')
  for (const e of consoleErrors) console.log('  ' + e)
}
if (failures.length) {
  console.error('\nOverflow failures:')
  for (const f of failures) console.error('  ' + f)
  process.exit(1)
}
