/**
 * Viewport shots of named places on the page, for reviewing one section at a
 * time at a given width:
 *   node scripts/qa/sections.mjs --width 1024 --theme dark --out <dir> "name:#selector:0.5" ...
 * The number is how many viewport heights past the element's top to scroll.
 * WebGL is reported as a hardware renderer so the field is captured.
 */
import { chromium } from 'playwright'

const argv = process.argv.slice(2)
const opt = (n, d) => (argv.includes(`--${n}`) ? argv[argv.indexOf(`--${n}`) + 1] : d)
const width = Number(opt('width', 1440))
const theme = opt('theme', 'dark')
const out = opt('out', '.')
const url = opt('url', 'http://localhost:4173')
const specs = argv.filter((a, i) => !a.startsWith('--') && !argv[i - 1]?.startsWith('--'))
const mobile = width < 768

const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] })
const ctx = await browser.newContext({ viewport: { width, height: mobile ? 844 : 900 }, colorScheme: theme === 'light' ? 'light' : 'dark', isMobile: mobile, hasTouch: mobile })
await ctx.addInitScript(() => {
  for (const C of [WebGLRenderingContext, WebGL2RenderingContext]) {
    const get = C.prototype.getParameter
    C.prototype.getParameter = function (p) {
      return p === 0x9246 || p === 0x1f01 ? 'Test GPU (forced)' : get.call(this, p)
    }
  }
  Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 })
})
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
await page.goto(url, { waitUntil: 'networkidle' })
// Sections below the hero mount in idle slices; wait for the last one.
await page.waitForSelector('#contact', { timeout: 15000 })
await page.waitForTimeout(800)
for (const spec of specs) {
  const [name, sel, k = '0'] = spec.split(':')
  await page.evaluate(([sel, k]) => {
    const el = document.querySelector(sel)
    window.scrollTo(0, el.getBoundingClientRect().top + scrollY + innerHeight * Number(k))
  }, [sel, k])
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `${out}/${width}-${theme}-${name}.png` })
}
console.log(width, theme, 'overflow', await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]), 'errors', errors)
await browser.close()
