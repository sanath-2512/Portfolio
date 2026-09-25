# Sanath Waraikar — portfolio

"Calibrated": a portfolio that behaves like a measuring instrument. Vite · React 19 · TypeScript · Tailwind v4 · GSAP (ScrollTrigger, SplitText) · Lenis · three.js.

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build
npm run lint
npm run preview    # serve dist/ on :4173
```

- **Every fact on the site** lives in `src/data/content.ts`. Unknown values are `todo(...)`: dashed placeholders in dev, hidden in production.
- **Design tokens** (Darkroom / Paper) are in `src/styles/globals.css`, and motion timing is in `src/lib/motion.ts`.
- **The calibration field** is in `src/components/field/`.

QA, against `npm run preview`:

```bash
node scripts/qa/screenshots.mjs --out <dir> --themes dark,light --force-gpu   # 6 widths + overflow check
node scripts/qa/interactions.mjs                                              # keyboard, no-WebGL, routes, numbers
node scripts/qa/sections.mjs --width 1024 --out <dir> "work:#work:0.2"        # one section at a time
```

The redesign audit and final report are in `docs/redesign/`.
