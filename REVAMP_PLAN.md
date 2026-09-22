# Portfolio Revamp — Plan

## Current architecture
- Vite 5 + React 19 + TypeScript (strict) + Tailwind v4 (`@tailwindcss/vite`, `@theme` block in `globals.css`).
- GSAP 3 + ScrollTrigger + CustomEase (`src/lib/gsap.ts`); Lenis smooth scroll (`src/hooks/useLenis.ts`) already driving `ScrollTrigger.update()` off `gsap.ticker`.
- Three.js: one raw-WebGL `SceneCanvas` (node cloud + 900 points) used only by Hero, and **disabled entirely on mobile**. `NeuralNet`/`ParticleField` (R3F + drei) are dead code.
- Sections: Hero, About, TechStack, Projects, OpenSource, Contact + Navbar/Footer. Content is hardcoded inline in each component; heavy inline-style blocks; no data layer.
- Dead code: `NeuralNet`, `ParticleField`, `GlowCard`, `AnimatedCounter`, `MagneticButton`, `useGSAP`, `useScrollProgress`.

## Keep
Vite/React/TS/Tailwind v4 setup, GSAP + ScrollTrigger + CustomEase, Lenis, raw-Three.js approach, Satoshi + Cabinet Grotesk local fonts, the resume PDF, all verified URLs.

## Change
- One design system: near-black base, off-white inverse, single amber accent. Delete the light theme, the cyan/purple gradient tokens, the fake intro loader, the custom cursor and the animated grain.
- Single typed content file `src/data/content.ts`; every section reads from it.
- Motion tokens + shared helpers in `src/lib/motion.ts`; Lenis becomes a singleton with `scrollToId/start/stop` so nav anchors and the mobile menu use the smooth-scroll API.
- One fixed WebGL layer (node-and-edge retrieval graph) shared by Hero and Contact — instanced nodes, `LineSegments` edges, `Points` motes, single `gsap.ticker` loop, IntersectionObserver + visibility pausing, full disposal, SVG poster fallback.
- Three.js runs on mobile too (reduced counts, pixel-ratio cap 1.5).

## File-level plan
- **Add**: `src/data/content.ts`, `src/lib/motion.ts`, `src/lib/smoothScroll.ts`, `src/hooks/useActiveSection.ts`, `src/components/three/GraphScene.tsx`, `src/components/three/ScenePoster.tsx`, `src/components/ui/{SectionHeader,WhyNote,Counter,LinkRow,MonoLabel}.tsx`, sections `Experience`, `CaseStudy`, `OtherProjects`, `HowIBuild`, `Metrics`, `Achievements`.
- **Rewrite**: `globals.css`, `App.tsx`, `index.html`, `Navbar`, `Footer`, `Hero`, `About`, `TechStack` (→ Stack), `Contact`, `lib/animations.ts` (→ motion.ts), `hooks/useLenis.ts`, `tsconfig.json` (`moduleResolution: bundler`).
- **Delete**: `Projects.tsx`, `OpenSource.tsx`, `NeuralNet`, `ParticleField`, `SceneCanvas`, `GlowCard`, `AnimatedCounter`, `MagneticButton`, `CustomCursor`, `useGSAP`, `useScrollProgress`, `useMousePosition`, `types/three-jsx.d.ts`, and the now-unused deps (`@react-three/*`, `postprocessing`, `framer-motion`, `@gsap/react`, `lucide-react`, `tailwind-merge`/`clsx` if unused).

## Conflicts with Section 3 (Section 3 wins)
- Codebase claims AgriMind metrics "87% query accuracy · 3s avg response · 10K+ vectors" — unsupported, **removed**.
- Codebase/resume name ChromaDB, Groq Llama, Scikit-Learn, Prisma, Next.js, PostgreSQL, Tableau, Power BI, Zod, Render, Vercel, Pandas, Jupyter, Seaborn, Matplotlib, Scikit-learn, "GSSoC Contributor 2025", "Viewly", "Data Visualization Portfolio" — none are in Section 3's stack/project list, so they are **dropped**.
- Resume lists AgriMind's repo as `github.com/Agrim-2007/GENAI-capstone`; the codebase uses `github.com/sanath-2512/cropyeild_ml`. Rule 0.5 says codebase → using `cropyeild_ml`, flagged as a TODO to verify.
- Role changes from "AI Systems Engineer / Open Source Contributor" to "AI Engineer & Full-Stack Developer".
- WorthyApply has no URL anywhere in the repo → links rendered disabled with `// TODO` in the data file.
