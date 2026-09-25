# Calibrated — final report

Branch `claude/funny-lamport-gz9v9f`, fast-forwarded to `main` after every phase.
Phase 0 audit: [`AUDIT.md`](./AUDIT.md). Screenshots: [`screenshots/before/`](./screenshots/before) and [`screenshots/after/`](./screenshots/after).

## 1. What changed

The site now works like a measuring instrument. A calibration board behind the page starts tilted and drifting, and becomes a flat grid by the contact section. Every number carries a citation to the file or document it came from, and every diagram follows the real code.

- **Scope.** Five projects instead of three, in the order you asked for: WorthyApply, EduAI, AgriMind, Viewly, DVA Portfolio. EduAI, Viewly and DVA come from their repos, since they aren't on the Sept 2026 résumé.
- **Visual system.** The palette, fonts, 3D scene, motion and every section were replaced. The build setup (Vite, React, TypeScript, Tailwind, GSAP, Lenis, three.js) stays.

## 2. Structure

`Nav` · §01 Overview (hero) · §02 About · §03 Experience · §04 Work · §05 How I build · §06 Stack · §07 Signals · §08 Contact · `Footer`
Route: `/work/worthyapply` (case study, lazy chunk).

| § | What's there | Entrance |
|---|---|---|
| 01 | Name fitted edge to edge on the width axis, positioning line, CTAs, cell readout, build SHA/date | Name STRETCHes in; other lines rise from masks; field SCAN |
| 02 | Statement with DETECTed terms, spec list, tags | Pinned word-by-word read (desktop), line scrub (mobile) |
| 03 | Tenure MEASURE, field report, SIMPLIFIED retrieval strip, education | SCAN panel, packet travels the strip |
| 04 | Index table + five projects, each in its own layout (below) | Per project |
| 05 | 7-stage line, 4 project tabs | Line MEASUREs in; captions STRETCH-crossfade |
| 06 | Spec sheet with project filters | Row hairlines measure in |
| 07 | Activity log | Lines flush in, each DETECTed |
| 08 | Headline, copyable email, links | Headline scrubbed condensed → full width |

**The five projects**

| No. | Project | Layout | Taken from |
|---|---|---|---|
| 01 | WorthyApply | Pinned horizontal pipeline (vertical stepper on mobile); fact-check panel from `test_claim_checks`; illustrative five-lane failover | `pipeline.py`, `resume_tailor.py`, `grounding.py`, `llm_router/config.py`, `backend/tests` |
| 02 | EduAI | API spec sheet (19 routes) + sequence diagram of `POST /api/courses` | `backend/routes`, `courseController.js`, `utils/ai.js` |
| 03 | AgriMind | Pinned LangGraph graph with FarmState slots, reads, trace | `src/reference_agent/graph.py` |
| 04 | Viewly | Draggable rail of every route and its TMDB endpoint | `src/App.jsx`, components |
| 05 | DVA Portfolio | Specimen sheet: your Crop Portfolio dashboard with regions DETECTed; the retail board mirrored | G17 and SecA-G10 READMEs, screenshots |

## 3. Animation systems

`src/lib/motion.ts` holds all timing: `expo.out` / `cubic-bezier(0.16,1,0.3,1)`, entrances 0.9–1.2 s, micro-interactions 0.28 s, wipes 0.56 s, stagger 0.06 s. The four signatures, used throughout:

- **SCAN:** `scan()` + `<ScanReveal>`. Used for the field intro, the contact scan, the Experience panel, the mobile menu, the index previews, the Viewly rail, the DVA images, the theme switch (View Transitions) and the route change.
- **DETECT:** `<DetectBox>` and `<Metric>`. Numbers carry a citation that opens its source on hover, focus or tap.
- **MEASURE:** `measure()` + `<DimensionLine>`. Used for the tenure, results, test counts, the 1997–2019 span and the process line.
- **STRETCH:** `.stretch`, `<StretchText>`, `<StretchHeading>`, the hero name and the contact headline.

Other motion:
- Lenis runs on fine pointers only, driven by `gsap.ticker` with `lagSmoothing(0)`.
- The ruler writes straight to the DOM.
- A shared input state (`lib/input.ts`) keeps pointer and scroll velocity out of React.

## 4. Three.js

The node-graph scene (octahedra, lines, CPU-updated motes) is replaced by `components/field/`:
- **Geometry.** One `InstancedBufferGeometry` of quads, with 8.4k cells on desktop, 4.2k on tablet and 2.5k on mobile. The only per-instance data is a static `aCell` attribute.
- **Shader.** A `RawShaderMaterial` does all the motion from uniforms: `uCal`, chunks, lanes, furrows, dim, the lens, the scan and the reveal. The drift is a coherent simplex warp plus small per-cell misregistration, and a few cells are fiducial markers.
- **Scroll mapping.** `data-cal` stops on each section map scroll to calibration, and `data-field` regions trigger the per-section nudges.
- **Pointer.** A raycast onto the board drives the measuring lens and the hero's cell readout. The camera parallax is lerped.
- **Themes.** Colours are uniforms: additive blending in Darkroom, normal in Paper.
- **Loading.** three.js is imported after first paint and idle. The pixel ratio is capped at 1.5 (1 on mobile), with no antialias on mobile. Rendering pauses when the tab is hidden, and everything is disposed on unmount (StrictMode-safe).
- **Fallback.** A static SVG grid with registration marks shows when WebGL is missing, on low-end touch devices, under reduced motion, and on **software GL** (SwiftShader, llvmpipe). The last one is new: it blocked the main thread for 26 s in testing.

## 5. Performance (Lighthouse 12, local `vite preview`, headless)

| | Performance | LCP | TBT | CLS | A11y | BP | SEO |
|---|---|---|---|---|---|---|---|
| Before · mobile | 75 | 2.6 s | 930 ms | 0 | 100 | – | – |
| Before · desktop | 100 | 0.6 s | 10 ms | 0 | 100 | – | – |
| **After · mobile** (3 runs) | **96–97** | 2.4–2.5 s | 110–130 ms | 0 | 100 | 100 | 100 |
| **After · desktop** | **100** | 0.6 s | 0 ms | 0 | 100 | 100 | 100 |

Max potential FID is 120 ms on mobile. Observed (unthrottled) LCP equals FCP at about 0.17 s, because the hero name paints on the first frame.

What got it there:
- The hero commits alone. Sections §02–§08 are a separate chunk requested after first paint, and they mount one per idle slice in page order.
- Both fonts are preloaded, and the first render waits at most 250 ms for them, which gives CLS 0.
- Redundant `ScrollTrigger.refresh()` calls are gone.

Caveats:
- Headless Chrome uses software GL, so the lab numbers measure the static-field path. The WebGL path was checked visually with a forced renderer string (`--force-gpu`).
- Bundles, gzipped: main 135 KB, below-fold 16 KB, case study 4 KB, three.js scene 122 KB (lazy).

## 6. Mobile

- **Distinct mobile layouts:**
  - WorthyApply becomes a vertical stepper with a sticky rail.
  - AgriMind's graph and the Experience strip run top to bottom.
  - EduAI shows its sequence as a list.
  - Stack becomes an accordion.
  - The Contact headline goes to three lines.
- **Menu:** a full-screen overlay with a SCAN reveal, a focus trap, Esc to close, and `lenis.stop()` while open.
- **Scrolling:** native on touch devices, and a top tick ruler instead of the side ruler.
- **Checks:** no overflow at 1440, 1280, 1024, 768, 430 or 390 in either theme (asserted by `scripts/qa/screenshots.mjs`). Touch targets are at least 44 px.

## 7. Accessibility

- **Structure:** a skip link, landmarks, and one `h1` per route.
- **Focus:** a 2 px signal outline at a 3 px offset. The keyboard walk covers 78 stops, all with a visible outline (`scripts/qa/interactions.mjs`).
- **Controls:** tabs use roving tabindex and arrow keys; the filter chips use `aria-pressed`. Citations are buttons with popovers that open on tap and focus, with source links inside; Escape closes a popover and returns focus to its button.
- **Diagrams:** each has a text alternative: ordered lists, `<desc>`, or `sr-only` order.
- **Reduced motion:** no Lenis, no pins, no cursor, a static field, text fully visible and counters at their final values. The reset uses a `0s` duration: `0.01ms` had turned every style change into a transition and broke layout measurement.
- **Contrast:** Paper's vermillion is used for text only at 24 px and up. Smaller "signal" text becomes ink with a vermillion underline (`.signal-sm`). Dimmed states change colour rather than opacity where text must stay legible. Unread About words start at 50% opacity, which keeps 3:1 for large text.

## 8. Files

**Added**
- `src/data/content.ts` (rewritten)
- `src/lib/`: `motion.ts` (rewritten), `input.ts`, `theme.ts`, `router.ts`
- `src/hooks/useMediaQuery.ts`
- `src/components/field/`: `CalibrationField.tsx`, `FieldFallback.tsx`, `scene.ts`, `shaders.ts`
- `src/components/global/`: `SiteNav`, `ArucoMark`, `RulerProgress`, `Cursor`, `ThemeToggle`, `SectionFrame`, `Footer`, `Grain`
- `src/components/motion/`: `ScanReveal`, `DetectBox`, `Citation`, `DimensionLine`, `StretchText`, `StretchHeading`, `Metric`, `MagneticButton`
- `src/components/sections/`: `Hero`, `About`, `Experience`, `ArchitectureStrip`, `Work`, `HowIBuild`, `Stack`, `Signals`, `Contact`, `BelowFold`
- `src/components/work/`: `WorkIndex`, `ProjectParts`, `Schematic`, `ProjectPipeline`, `ProjectApi`, `ProjectAgentGraph`, `ProjectRoutes`, `ProjectSpecimen`
- `src/components/case/CaseStudy.tsx`
- `public/work/*.avif|webp` (dashboard screenshots at 720, 1280 and 1920 px)
- `vercel.json` (SPA rewrite)
- `eslint.config.js`, `.prettierrc.json`
- `scripts/qa/`: `screenshots.mjs`, `sections.mjs`, `interactions.mjs`
- `docs/redesign/`

**Removed**
- the old sections (About, Achievements, CaseStudy, Contact, Experience, HowIBuild, Metrics, OtherProjects, Stack)
- `components/case/*`, `components/layout/*`, `components/three/*`
- the old UI atoms (ActionLink, Counter, GrainOverlay, Icons, SectionHeader, WhyNote)
- `useGsapContext`, `useGsapMatchMedia`
- Cabinet Grotesk and Satoshi, `REVAMP_PLAN.md`
- `public/resume-sanath-waraikar.pdf`, which printed your phone number and Class X/XII scores

**Dependencies**
- **Added:** `@fontsource-variable/archivo`, `@fontsource-variable/martian-mono`
- **Bumped:** `gsap` to ^3.15, for the free SplitText
- **Added (dev):** `playwright@1.56.1`, `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `globals`
- **Removed:** none (everything else is still used)

## 9. Open items

### `TODO(user)` (dev shows dashed placeholders; production hides them)
1. The Sept 2026 résumé PDF without the phone number. Put it in `/public` and set `profile.links.resume`. Until then there is no Résumé link anywhere.
2. Availability for roles or internships (hero dot).
3. Location. It enables local time and the `BASED` row. Your DVA site lists *Kalyan, Thane*; say if you want that shown.
4. The Buildspace hackathon year.
5. The Fusion Cards pipeline stage order. The strip is labelled `SIMPLIFIED`.
6. The canonical AgriMind repo. I'm linking `Agrim-2007/AgriMind`, the repo that contains the graph code.
7. WorthyApply latency. Your note says 16.07 s → 5.89 s (−63.3%); the repo benchmark says 12.5 s → 6.2 s (−50.4%, n = 30). Neither is shown.
8. Three case-study lessons. Drafts are in `content.ts` and the chapter is hidden in production.
9. GSSoC 2025 and 2026 contribution links.
10. Viewly's live URL (Netlify).
11. The DVA portfolio's live URL.

### Appendix B verdicts
See AUDIT §5.
- **Confirmed and used:** provider names; deterministic scoring, benchmark harness, adversarial benchmark and resume builder (in the case study); competitive-programming profile URLs; LinkedIn and GitHub URLs; demo URLs.
- **Not shown:** MetroLens (it doesn't exist in any repo), ATS optimisation, the latency figures, the Fusion Cards pipeline internals, location, and availability.

### Résumé-vs-repo conflicts
- The AUDIT §4 list: role, period, CGPA 8.286→8.283, stack, the "Present" end date, the achievements split, the old PDF.
- **EduAI "role-based access control".** The code has JWT auth and per-owner checks (which return 401), but no roles, so the site doesn't claim RBAC.
- **"49 tests validate the fact-check".** The repo has 49 tests across five files, 26 of them in `test_grounding.py`. The site says exactly that.
- **AgriMind's shape.** It's a linear graph, not a router with parallel branches.

### Dropped
- **MetroLens:** no code or content exists.
- **EduAI's twin repo `sanath-2512/EduAI`:** it only holds a README. The site links `EduAI.` (with the dot).
- **Coffee-shop EDA:** you didn't list it.

### Outside this repo (security, not changed)
- Viewly hardcodes a TMDB API key in eight places in a public repo. Rotate it and move it to an env var.
- The DVA portfolio site publicly shows a phone number and your home location.
- The old résumé PDF, with the phone number, is still in this repo's git history.

## 10. Remaining issues

- **Lab vs real WebGL:** Lighthouse can't exercise the WebGL field (software GL). On a real GPU it's 8.4k instanced quads with vertex-shader noise, which should be light, but I couldn't profile it on real hardware here.
- **Mobile LCP:** 2.4–2.5 s simulated, right at the 2.5 s target. The next step would be subsetting Archivo; its Latin `wdth` file is 88 KB.
- **Deep links:** they land 0–64 px below the exact nav offset while late layout (pins, images) settles. The heading is always in view.
- **Stack filter:** rows filtered out dim to 25% opacity. It's a deliberate de-emphasis state that falls below text contrast while a filter is active.

## Refinement pass

- The field steps back to half strength behind the reading sections (About → Signals) and returns at full strength for the hero and the contact grid. Fiducial markers are fewer and softer, so they no longer sit on top of text.
- About: the heading is in full ink, and more line spacing on mobile keeps the DETECT tags clear of the line above.
- Hero: the idle readout now says "Move the pointer to measure" instead of a placeholder-looking `Cell — · —`.
- **Link previews:** `public/og.png` (1200×630, rendered by `scripts/og/render.mjs` in the site's own fonts), Open Graph and Twitter card tags, a canonical URL and `Person` JSON-LD. The URLs are absolute on Vercel, using `VERCEL_PROJECT_PRODUCTION_URL`.
- `scripts/qa/sections.mjs` waits for the staged sections before capturing.
- Re-verified: lint clean; 78 keyboard stops; the no-WebGL fallback; routes; no overflow at 6 widths × 2 themes. Lighthouse: mobile 96, desktop 100; accessibility, best practices and SEO all 100.
