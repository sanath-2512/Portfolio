# Phase 0 — Audit

Repo: `sanath-2512/Portfolio` @ `d18d661` · audited 2026-09-25
Sources read besides this repo (read-only clones):
`sanath-2512/Worthyapply` @ `7a28d98` and `Agrim-2007/AgriMind` @ `9404976`.

> **Branch note.** The brief asks for `redesign/calibrated`. This session is required to develop on
> `claude/funny-lamport-gz9v9f`, so all phases are committed there instead.

---

## 1. What the repo is

| Area | Finding |
|---|---|
| Framework | Vite 5 + React 19 + TypeScript (strict). No router. SPA, one `index.html`. |
| Styling | Tailwind v4 via `@tailwindcss/vite`; tokens in an `@theme` block in `src/styles/globals.css` plus hand-written component classes (`.shell`, `.section`, `.grid12`, `.display-*`, `.mono`). |
| Animation | GSAP 3 + ScrollTrigger (`src/lib/gsap.ts`), shared helpers in `src/lib/motion.ts` (`revealText`, `revealUp`, `countUp`, `pinSequence`, `parallax`). |
| Smooth scroll | Lenis singleton (`src/lib/smoothScroll.ts`), driven from `gsap.ticker`, `lenis.on('scroll', ScrollTrigger.update)`, `lagSmoothing(0)`. Works. |
| 3D | Vanilla three.js, lazy-loaded (`Backdrop.tsx` → `GraphScene.tsx`). A node-and-edge "retrieval graph": instanced octahedra + `LineSegments` + CPU-updated motes. Visibility/IO pausing and full disposal are already correct. SVG poster fallback. |
| Content | `src/data/content.ts` — one typed module, every section reads from it. Good architecture, wrong/unverified facts (see §4). |
| Fonts | Self-hosted Cabinet Grotesk + Satoshi (`public/fonts`). |
| Assets | `public/resume-sanath-waraikar.pdf` (dated 2026-05-07), `robots.txt`. No images. |
| Deploy | Vercel (per commit history, `.npmrc legacy-peer-deps`). No `vercel.json`. |
| Tooling | No lint config, no tests. `npm run build` = `tsc -b && vite build` — passes. |

## 2. Baseline

- Screenshots: `docs/redesign/screenshots/before/` (6 widths, dark only — the site has no light theme).
- Overflow: none at any width.
- Lighthouse (headless, no GPU, local `vite preview`): **mobile 75** (LCP 2.6 s, TBT 930 ms, CLS 0), **desktop 100** (LCP 0.6 s). Accessibility 100 / 100.

## 3. Keep / go

**Keep (working plumbing)**
- Vite + React + TS + Tailwind v4 build.
- `content.ts` pattern (rewritten against Appendix A).
- Lenis singleton + ScrollTrigger sync (extended: touch → native, `scrollTo` with nav offset).
- `supportsWebGL`, `clamp`, `lerp`, `cx` utils.
- Lazy three.js import, IntersectionObserver/visibility pausing, disposal pattern.
- Mobile-menu focus trap + `lenis.stop()` logic from `Navbar.tsx` (ported into the new nav).

**Goes (generic, replaced)**
- Near-black `#08080a` + single amber accent palette → Darkroom / Paper tokens.
- Cabinet Grotesk + Satoshi → Archivo (variable, `wdth` + `wght`) + Martian Mono.
- Node-and-edge graph scene with floating motes (reads as a plexus network) → Calibration Field.
- `revealUp` fade-up on every section → SCAN / DETECT / MEASURE / STRETCH primitives.
- `backdrop-blur-md` nav background.
- Rounded "pill" tech chips, "Why?" callout boxes, Metrics strip (it only restated unconfirmed numbers).
- Old section components (`About`, `Stack`, `Experience`, `CaseStudy`, `OtherProjects`, `HowIBuild`, `Metrics`, `Achievements`, `Contact`, `components/case/*`) — rebuilt in Phases 3–5.

## 4. Content vs Appendix A (Appendix A wins)

| # | Repo says | Appendix A | Action |
|---|---|---|---|
| C1 | Role "AI Engineer & Full-Stack Developer" | "Backend and AI engineer, B.Tech (AI) student" | Appendix A |
| C2 | Fusion Cards period "June 2026 — Present" | "June 2026 – August 2026" | Appendix A |
| C3 | CGPA 8.286 (old resume PDF) | 8.283 | Appendix A |
| C4 | WorthyApply = "AI-Powered Job Application & Resume Optimization Platform"; stack FastAPI/Python/LLMs/Structured Output | "AI Resume–Job Fit Analyzer"; Python, FastAPI, Pydantic, LangChain, Pytest, Next.js, TypeScript, Render, Vercel | Appendix A |
| C5 | WorthyApply latency 16.07 s → 5.89 s, −63.3 % shown in Hero-adjacent Metrics, How I Build, Why notes | Not in Appendix A (Appendix B) | **Removed** — see B-3 |
| C6 | "Vector Embeddings — Retrieval index for the internship document pipeline" | Embeddings in the Fusion pipeline is Appendix B (unconfirmed) | Removed |
| C7 | "Top 7 · Buildspace Hackathon · Thapar Institute Tech Fest · 2026" as one item | Two separate items: Buildspace Top 7 (year unknown) and Thapar Tech Fest 2026 (two projects) | Split per Appendix A |
| C8 | No GSSoC entries | GSSoC 2025 and 2026 | Added |
| C9 | Stack: "Generative AI"; missing TypeScript, SQL, Pydantic, Prisma, Pytest, SSE, MongoDB, LangChain, Hugging Face, Next.js, Vercel, Render, Prompt Engineering | Appendix A skill table | Appendix A table + "This site" tools |
| C10 | AgriMind stack "LangGraph, RAG, Machine Learning, FastAPI, React, Python" | Python, LangGraph, FastAPI, ChromaDB, scikit-learn, React, Render | Appendix A |
| C11 | `public/resume-sanath-waraikar.pdf` (May 2026) contains the **phone number**, **Class X/XII scores**, "Seeking … internships", HackerRank cert | Never publish phone or Class X/XII | **PDF removed from `public/`** (still in git history). Resume link → `TODO(user)` until a Sept 2026 PDF without the phone number is added. |
| C12 | AgriMind GitHub `sanath-2512/cropyeild_ml` (site) vs `Agrim-2007/GENAI-capstone` (old resume) | Not given | Using `github.com/Agrim-2007/AgriMind` — the repo that actually contains the LangGraph graph. `TODO(user)` to confirm. |
| C13 | EduAI (project, Nov 2025) | Not on the Sept 2026 resume | Kept as one archive row (real, public repo + demo). Not mapped to any Stack tool. |
| C14 | HackerRank Python certification (old resume) | Not in Appendix A | Not shown |

## 5. Appendix B — what the source repos confirm

| Item | Verdict | Evidence |
|---|---|---|
| MetroLens (whole project) | **Not found** — dropped | No MetroLens code or content in this repo or any other repository visible to this session. |
| WorthyApply · ATS optimization | Not confirmed — left out | Only the landing-page copy "ATS-readable" on PDF export (`frontend/components/landing/ProofStrip.tsx`). No ATS scoring/optimisation logic. |
| WorthyApply · deterministic scoring | **Confirmed** | `backend/pipeline.py::compute_match_score`; README "Deterministic scoring"; `test_postprocess_recomputes_score_over_llm_value`. |
| WorthyApply · benchmark harness | **Confirmed** | `backend/tests/benchmark_analyze.py`, `benchmark_grounding.py`, `benchmark_report.json`, `grounding_report.json`. |
| WorthyApply · adversarial testing | **Confirmed** | `benchmark_grounding.py` runs "fixed adversarial model outputs" (README, `grounding_report.json`). |
| WorthyApply · resume builder | **Confirmed** | `frontend/app/builder/page.tsx`, README "Resume builder & PDF importer". |
| WorthyApply · latency 16.07 s → 5.89 s (−63.3 %) | **Not confirmed — conflicts** | `benchmark_report.json` summary: n = 30, old avg **12.5 s** → new avg **6.2 s**, **−50.4 %**, calls 2.9 → 0.93. Neither number set is on the resume. Left out entirely; `TODO(user)` to choose. |
| Fusion Cards · "OpenSearch Serverless" | Not confirmable (private) | — |
| Fusion Cards · embeddings in pipeline | Not confirmable | — |
| Fusion Cards · exact stage order | Not confirmable | Strip labelled `SIMPLIFIED`, order `TODO(user)`. |
| WorthyApply provider names | **Confirmed** | `backend/llm_router/config.py`: Groq → Cohere → Mistral → OpenRouter → Gemini (priority 1–5). |
| Buildspace hackathon year | Not confirmed | Old resume line is ambiguous. `TODO(user)`. |
| Competitive-programming profile URLs | **Confirmed** | Hyperlinks inside the repo's own resume PDF + old `content.ts`: LeetCode `u/LvqtSP4dgr`, CodeChef `colony_dice_69`, Codeforces `sanath25`. |
| LinkedIn / GitHub URLs | **Confirmed** | `content.ts` + resume PDF: `linkedin.com/in/sanath-waraikar-4ba35b308`, `github.com/sanath-2512`. |
| Live demos | **Confirmed** | WorthyApply `worthyapply-sigma.vercel.app` (its README); AgriMind `agrimind-five.vercel.app` (resume PDF + `content.ts`). WorthyApply repo `github.com/sanath-2512/Worthyapply`. |
| Location | Not provided | `TODO(user)` — local-time readout and `BASED` row hidden. |
| Availability | Not provided | `TODO(user)` — availability dot hidden. |

## 6. Facts the brief assumed that the code contradicts

- **AgriMind graph shape.** The brief sketches a router that forks into parallel predictor/retriever branches and merges at a consistency check. The real graph (`src/reference_agent/graph.py`, `genai_capstone.py`) is linear:
  `START → predict → retrieve → reason → report → END`. The prediction (scikit-learn `LinearRegression`) and the retrieved passages (ChromaDB, `all-MiniLM-L6-v2`) meet in `reason`. The site draws the real graph and shows the two evidence streams converging in shared state, labelled `ILLUSTRATIVE` for the token animation.
- **WorthyApply stage names.** Real pipeline: PDF → text extraction → **one combined structured call** (job analysis · match analysis · optimisation) → evidence verification (`skills.py`, `requirement_checks.py`) → deterministic score → tailoring patch → fact-check (`grounding.py`) → SSE stream (`/api/analyze/stream`, `/api/tailor-resume/stream`). The site uses these names.
- **"49 tests validate the fact-check layer."** The repo has exactly 49 `def test_` functions, but across five files: `test_grounding.py` 26, `test_llm_router.py` 10, `test_analysis_quality.py` 8, `test_combined_analysis.py` 4, `test_timeout_no_wait.py` 1. The site says "49 pytest tests" and cites which file covers which layer, rather than implying all 49 test the fact-check.

## 7. Plan per section

| Section | Plan |
|---|---|
| Nav | ArUco "SW" marker SVG + name; STRETCH links; compacts 64 → 48 px after 80 px; hide on down / show on up; `aria-current`; mobile SCAN overlay with focus trap + `lenis.stop()`. |
| §01 Hero | Two-line extreme-width Archivo name; SplitText line masks; field SCAN intro; build SHA/date + coordinate readout; `See the work` magnetic; Resume `TODO(user)`. |
| §02 About | Pinned word scrub (desktop), DETECT boxes on key terms, mono spec list. |
| §03 Experience | Field-report panel, tenure MEASURE, `18+ banks` citation, `SIMPLIFIED` architecture strip with travelling query packet. |
| §04 Work | Mono index table with SCAN previews; WorthyApply horizontal pinned pipeline (fact-check + failover panels); AgriMind real graph + trace log; EduAI archive row. MetroLens dropped. |
| Case study | `/work/worthyapply` via a tiny History-API router (no new dependency) + `vercel.json` SPA rewrite; lazy chunk. |
| §05 How I Build | 7-node process line + tabs with roving tabindex. |
| §06 Stack | Appendix A table + "This site" tools, filter chips, DETECT on row focus. |
| §07 Signals | Mono log with citations. No GitHub integration exists → none added. |
| §08 Contact | Scrubbed STRETCH headline, copy-to-clipboard email, footer with SHA. |

## 8. Risks

- **Variable-font width animation** is a paint cost on big display text. Mitigation: animate `font-variation-settings` only on the hero name / contact headline, lerped on the ticker, never on body text.
- **Headless Lighthouse** has no GPU; the field renders through SwiftShader, so mobile TBT is pessimistic. The hero `h1` is the LCP element and paints before three.js is requested.
- **Pinned horizontal section + Lenis + fonts** can misalign if triggers are measured before fonts load → `ScrollTrigger.refresh()` after `document.fonts.ready` and `load`.
- **Removing the PDF** means no resume link in production until a new one is added (safer than publishing the phone number).

## 9. `TODO(user)` gaps

1. Current (Sept 2026) resume PDF **without phone number** → `public/` (then set `profile.links.resume`).
2. Availability for roles/internships (enables the hero dot).
3. Location (enables local time + `BASED`).
4. Buildspace hackathon year.
5. Fusion Cards stage order for the architecture strip.
6. AgriMind canonical GitHub URL (`Agrim-2007/AgriMind` used).
7. WorthyApply latency figure: resume note (16.07 → 5.89 s) vs repo benchmark (12.5 → 6.2 s, n = 30).
8. Three first-person lessons for the case study (drafts will be marked).
9. GSSoC contribution links.

---

## Addendum (after the checkpoint): five-project scope

You asked for WorthyApply, EduAI, AgriMind, Viewly and the DVA portfolio. The three that aren't on the Sept 2026 résumé were read from their repos:

| Project | Repo read | Findings |
|---|---|---|
| EduAI | `sanath-2512/EduAI.` @ `6fb838c` | React + Vite (Vercel). Express 5 + Prisma + MongoDB Atlas (Render). 4 models, 19 routes, 13 behind JWT. bcrypt (10 rounds), 7-day JWT, per-owner checks that return **401**. Groq `llama-3.3-70b-versatile` in JSON mode with a default-course fallback. **No role-based access control**: the old résumé and site claimed it. `sanath-2512/EduAI` (no dot) holds only a README. |
| Viewly | `sanath-2512/Viewly` @ `913b468` | React 19 + Vite + React Router. TMDB trending, popular, top-rated, now-playing, search, details and videos. YouTube trailer embeds. Watchlist mirrored to localStorage. Netlify SPA redirect. Live URL not recorded (`TODO(user)`). **TMDB API key hardcoded in source.** |
| DVA Portfolio | `sanath-2512/Dva-Portofolio` @ `5f2d5a5` + `r0hansng/SectionA_G17_IndiaAgriProductivity` + `sanath-2512/SecA-G10` | Both dashboards are 6-person team projects. **G-17:** you were PPT & Quality Lead and built Dashboard 4 (Crop Portfolio); the dataset has 345,336 rows covering 1997–2019, 707 districts and 37 states & UTs. **G10:** you did the pivot calculations; the dataset has 8,522 records. The DVA site **publicly shows a phone number and a home location**, and neither was copied here. |
| AgriMind (detail) | `Agrim-2007/AgriMind` | The retrieval query includes the predicted `yield_category`, so retrieval is conditioned on the prediction. The report is JSON-mode, normalised to a fixed schema. An error in state short-circuits the later nodes. |
