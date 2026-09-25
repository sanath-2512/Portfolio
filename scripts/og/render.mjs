/**
 * Renders public/og.png (1200×630), the link-preview image, in the site's
 * own type and palette. Run after changing the name or positioning line:
 *   node scripts/og/render.mjs
 */
import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const font = (p) => readFileSync(path.resolve('node_modules/@fontsource-variable', p)).toString('base64')
const archivo = font('archivo/files/archivo-latin-wdth-normal.woff2')
const mono = font('martian-mono/files/martian-mono-latin-wdth-normal.woff2')

// "SW" in ASCII, row-major: 0101 / 0011 / 0101 / 0111 (1 = light)
const bits = ['0101', '0011', '0101', '0111']
const marker = `<svg viewBox="0 0 8 8" width="56" height="56" shape-rendering="crispEdges"><rect width="8" height="8" fill="#ECE6D6"/><rect x="1" y="1" width="6" height="6" fill="#0E110F"/>${bits
  .flatMap((row, r) => row.split('').map((b, c) => (b === '1' ? `<rect x="${c + 2}" y="${r + 2}" width="1" height="1" fill="#ECE6D6"/>` : '')))
  .join('')}</svg>`

const html = `<!doctype html><html><head><style>
@font-face{font-family:A;src:url(data:font/woff2;base64,${archivo}) format('woff2');font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:M;src:url(data:font/woff2;base64,${mono}) format('woff2');font-weight:100 800}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#0E110F;color:#ECE6D6;font-family:A;position:relative;overflow:hidden}
.grid{position:absolute;inset:0;background-image:radial-gradient(#ECE6D6 1.2px,transparent 1.3px);background-size:18px 18px;opacity:.12}
.mono{font-family:M;font-size:17px;letter-spacing:.06em;text-transform:uppercase;color:#8C9189}
.top{position:absolute;left:64px;right:64px;top:56px;display:flex;justify-content:space-between;align-items:center}
.brand{display:flex;gap:18px;align-items:center}
h1{position:absolute;left:60px;top:170px;font-size:156px;line-height:.86;font-weight:800;font-variation-settings:'wdth' 125;text-transform:uppercase}
.line{position:absolute;left:64px;right:64px;bottom:128px;height:1px;background:rgba(236,230,214,.2)}
p{position:absolute;left:64px;bottom:62px;font-size:36px;font-weight:500}
p b{color:#FF5A1F;font-weight:500}
.dim{position:absolute;right:64px;bottom:70px;color:#D7F25C}
.reg{position:absolute;width:14px;height:14px}.reg:before,.reg:after{content:'';position:absolute;background:#8C9189}
.reg:before{left:6px;width:1px;height:14px}.reg:after{top:6px;height:1px;width:14px}
</style></head><body>
<div class="grid"></div>
<span class="reg" style="left:24px;top:24px"></span><span class="reg" style="right:24px;top:24px"></span>
<span class="reg" style="left:24px;bottom:24px"></span><span class="reg" style="right:24px;bottom:24px"></span>
<div class="top"><div class="brand">${marker}<span class="mono" style="color:#ECE6D6">Backend × Applied AI × Systems</span></div><span class="mono">Grounding · Reliability · Evaluation</span></div>
<h1>Sanath<br>Waraikar</h1>
<div class="line"></div>
<p>I build <b>systems</b> around models — not just calls to them.</p>

</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html)
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: 'public/og.png' })
await browser.close()
console.log('wrote public/og.png')
