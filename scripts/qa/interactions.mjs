/**
 * Interaction checks against a running build:
 *   node scripts/qa/interactions.mjs [--url http://localhost:4173]
 *
 * 1. Keyboard-only walk: Tab through the whole page; the skip link comes
 *    first, every stop shows a visible outline, and focus never gets stuck.
 * 2. WebGL disabled: the static fallback renders and nothing throws.
 * 3. Deep link to /work/worthyapply renders one h1; "All work" returns home.
 * 4. Every number visible on the page, for checking against the sources.
 */
import { chromium } from 'playwright'

const args = process.argv.slice(2)
const url = args.includes('--url') ? args[args.indexOf('--url') + 1] : 'http://localhost:4173'
let failed = false
const fail = (msg) => {
  failed = true
  console.log('FAIL', msg)
}

const browser = await chromium.launch()

/* 1. keyboard walk */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(url, { waitUntil: 'networkidle' })
  const stops = []
  for (let i = 0; i < 400; i += 1) {
    await page.keyboard.press('Tab')
    await page.waitForTimeout(40) // a human-speed tab: popovers open on focus
    const info = await page.evaluate(() => {
      const el = document.activeElement
      if (!el || el === document.body) return null
      const cs = getComputedStyle(el)
      const name = (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 48)
      return { tag: el.tagName.toLowerCase(), name, outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2 }
    })
    if (!info) break
    const key = `${info.tag}:${info.name}`
    if (stops.length && stops[0].key === key && i > 5) break // wrapped around
    stops.push({ ...info, key })
  }
  if (!/skip to content/i.test(stops[0]?.name ?? '')) fail(`first tab stop is "${stops[0]?.name}", expected the skip link`)
  const noOutline = stops.filter((s) => !s.outline)
  if (noOutline.length) fail(`${noOutline.length} stops without a visible outline: ${noOutline.slice(0, 6).map((s) => s.key).join(' | ')}`)
  console.log(`keyboard: ${stops.length} tab stops, first "${stops[0]?.name}", last "${stops.at(-1)?.name}"`)
  if (errors.length) fail(`page errors: ${errors.join('; ')}`)
  await page.close()
}

/* 2. WebGL disabled */
{
  const b = await chromium.launch({ args: ['--disable-webgl', '--disable-webgl2', '--disable-3d-apis'] })
  const page = await b.newPage({ viewport: { width: 1280, height: 800 } })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  const state = await page.evaluate(() => ({ canvas: !!document.querySelector('canvas'), fallback: !!document.querySelector('#field-cells') }))
  if (state.canvas || !state.fallback) fail(`no-WebGL: canvas=${state.canvas} fallback=${state.fallback}`)
  if (errors.length) fail(`no-WebGL page errors: ${errors.join('; ')}`)
  console.log(`no-webgl: fallback=${state.fallback} canvas=${state.canvas}`)
  await b.close()
}

/* 3. case-study route */
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  await page.goto(`${url}/work/worthyapply`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  const h1 = await page.evaluate(() => [...document.querySelectorAll('h1')].map((h) => h.textContent))
  if (h1.length !== 1) fail(`case study has ${h1.length} h1`)
  await page.click('a[href="/#work"]')
  await page.waitForTimeout(1200)
  const back = await page.evaluate(() => ({ path: location.pathname, work: !!document.getElementById('work') }))
  if (back.path !== '/' || !back.work) fail(`All work did not return home: ${JSON.stringify(back)}`)
  console.log(`route: case h1=${JSON.stringify(h1)}, back=${back.path}`)
  await page.close()
}

/* 4. numbers on the page */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(url, { waitUntil: 'networkidle' })
  const numbers = await page.evaluate(() => {
    const out = new Map()
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    while (walker.nextNode()) {
      const node = walker.currentNode
      const el = node.parentElement
      if (!el || el.closest('[aria-hidden="true"], script, style, svg')) continue
      const text = node.textContent
      for (const m of text.matchAll(/\d[\d,.]*\+?%?/g)) {
        const ctx = text.slice(Math.max(0, m.index - 24), m.index + m[0].length + 24).replace(/\s+/g, ' ').trim()
        if (!out.has(m[0])) out.set(m[0], ctx)
      }
    }
    return [...out.entries()]
  })
  console.log(`numbers (${numbers.length}):`)
  for (const [n, ctx] of numbers) console.log(`  ${n.padEnd(12)} ${ctx}`)
  await page.close()
}

await browser.close()
process.exit(failed ? 1 : 0)
