# Portfolio content — every word on the site

This is all the text currently on sanath-2512's portfolio, in the order it appears.

**How to edit:** change the text after any `→` arrow, then send the file back.
- You can rewrite, shorten, delete, or add lines.
- Lines marked **[FILL IN]** are empty today and hidden on the live site until you give them a value.
- Lines marked **[FACT FROM CODE]** were checked against your repos. Change them only if they're wrong.
- Leave the labels on the left (`Title`, `Problem`, …) as they are, so I know where each piece goes.

---

## 0. Site-wide

- Browser tab title → Sanath Waraikar — Backend + AI engineer
- Search / link-preview description → Sanath Waraikar builds LLM systems that stay grounded: RAG over real documents, agentic pipelines, and resilient FastAPI backends.
- Link-preview image line → I build AI systems that stay grounded. · 18+ banks · 5 providers · 49 tests
- Nav links → About · Experience · Work · Stack · Contact · Resume ↗ · DARKROOM / PAPER (theme switch)
- Email → sanath.waraikar2024@nst.rishihood.edu.in
- GitHub → https://github.com/sanath-2512
- LinkedIn → https://www.linkedin.com/in/sanath-waraikar-4ba35b308/
- Resume PDF → **[FILL IN]** send the current PDF, without your phone number
- Available for roles / internships? → **[FILL IN]** e.g. "Open to AI/backend internships, 2027" (or leave blank to hide)
- Location → **[FILL IN]** e.g. "Mumbai, India · IST" (or leave blank to hide)

---

## §01 Overview (opening screen)

- Small line above the name → Backend + AI engineer · B.Tech (AI) 2024–28
- Big name → SANATH / WARAIKAR
- Main line → I build AI systems that stay **grounded**, stay up, and get tested.
  - The word in bold shows in orange. Pick one word to emphasise.
- Supporting sentence → RAG over documents from 18+ banks, agentic pipelines with LangGraph, and FastAPI backends that fail over across five LLM providers.
- Main button → See the work
- Small links → GitHub ↗ · LinkedIn ↗
- Bottom-left hint (desktop only) → Move the pointer to measure

---

## §02 About — "Reading me"

- Heading → Reading me
- Statement (four sentences; the words in [brackets] get a small box and label) →
  1. I'm a B.Tech (Artificial Intelligence) student at Newton School of Technology, Rishihood University.
  2. I build Python backends and applied ML: [FastAPI] services and REST APIs that put [LLMs] to work.
  3. That has meant [RAG] on [AWS Bedrock] during my internship, and [LangGraph] agents in my projects.
  4. Right now I'm going deeper into deep learning and advanced ML.

Spec list:
- Focus → Backend + applied AI
- Core → Python · FastAPI · LLMs · RAG
- Now → B.Tech (AI), 2024–28 · deep learning & advanced ML
- Off-screen → Inter-college badminton & cricket
- Based → **[FILL IN]** location, or leave blank

Tags → Backend · AI/ML · LLMs · RAG · Agents · AWS

---

## §03 Experience — "Field report"

- Heading → Field report
- Tenure line → 3 months on the team (Jun 2026 → Aug 2026)
- Org → Fusion Cards
- Role → AI Software Engineer Intern
- Period → Jun 2026 – Aug 2026
- Location → Remote
- Stack → Python · AWS Bedrock · Amazon S3 · OpenSearch · RAG · LLMs · Prompt Engineering

What I did:
1. → Contributed to enterprise AI document-processing pipelines on AWS Bedrock, Amazon S3, and OpenSearch.
2. → Worked on a RAG knowledge-retrieval system for credit-card documents across 18+ banks.
3. → Improved chunking strategies for shared bank-wide documents: MITC, T&Cs, and fee schedules.
4. → Analyzed production data pipelines and proposed architecture changes for the scraper, extractor, and chunking workflows.

Retrieval pipeline diagram (labelled "Simplified · system level · no client detail"):
- Stage order → Bank documents (18+ banks) → Scraper* → Extractor* → Chunking** → S3 → OpenSearch index → Retrieval → AWS Bedrock LLM → Answer
  - `*` = "Proposed changes"; `**` = "Improved".
- **[FILL IN]** Is this the right order? Fix it if not.
- Footnote → Stages I worked on: chunking (improved) · scraper, extractor, chunking (architecture proposals)

Education:
- Degree → B.Tech (Artificial Intelligence)
- School → Newton School of Technology, Rishihood University
- Years → 2024–2028
- CGPA → 8.283/10

---

## §04 Work — "Work, checked"

- Heading → Work, checked
- Subline → Five projects. Every number cites its source; every diagram is drawn from the code.

Index table:

| No. | Project | Domain | Year |
|---|---|---|---|
| 01 | WorthyApply | Resume–job fit | Sept 2026 |
| 02 | EduAI | AI learning platform | Nov 2025 |
| 03 | AgriMind | Farm advisory | Mar 2026 |
| 04 | Viewly | Movie discovery | Jul 2025 |
| 05 | DVA Portfolio | Data visualisation | 2026 |

### 01 · WorthyApply

- Tag line → Resume–job fit · Sept 2026 · Solo build
- One-liner → An AI resume–job fit analyzer that tailors your resume to a job description using only your verified experience.
- Intro panel title → Invented **experience**
- Problem → AI resume tailoring invents experience. A model asked to "fit" a resume to a job adds the skills, numbers and seniority the posting wants, whether or not the candidate has them.
- For whom → Candidates tailoring one resume to many postings.
- Solution → Score fit per requirement against evidence in the resume, compute the score in Python, and rewrite bullets as a small patch that a deterministic fact-check audits before anything is shown.
- Hard part → Keeping every generated claim traceable to the source resume, while five LLM providers fail, rate-limit or time out underneath.

Pipeline stages. Each has "what it does", then "the decision"; the code names are **[FACT FROM CODE]**.
1. Resume + JD → A resume PDF and a pasted job description enter the pipeline. / Decision: The PDF is reduced to plain text first. That text, not the model, is what every later check reads.
2. Combined analysis → One structured call runs job analysis, match analysis and optimisation, and returns one typed object. / Decision: One generation keeps the three phases consistent and drops the latency and fragility of chaining three calls.
3. Fit scoring → The model labels each requirement matched, partial, missing or cannot_verify. Python weights them into a 0–100 score. / Decision: The model never writes the number. A claimed match on a tool the resume never names is overruled to missing.
4. Tailoring → Rewrites existing bullets in the job's language as a small patch, never a regenerated document. / Decision: Every original bullet must survive with its facts, or it is put back.
5. Fact-check → Each rewritten bullet, the summary and the title are split into claims and checked against the entry they rewrite. / Decision: Hard claims (numbers, scale, outcomes, ownership, seniority) are removed and the original restored. Soft ones stay, flagged for review.
6. Streamed result → Progress and tokens stream to the browser as server-sent events. / Decision: A long structured call shows its work instead of a blank spinner.

Fact-check example **[FACT FROM CODE — the real test case]**:
- Source entry: "Assisted in building an AI document Q&A system using AWS Bedrock."
- Generated rewrite: "Led a production RAG platform for 1M+ documents that reduced latency by 40%."
- Flagged claims, each "Unverified → removed": Led (ownership) · production (scale) · RAG (unlicensed term) · 1M+ (number) · reduced latency by 40% (outcome)
- What ships: "Hard claims removed; the original wording is restored."

Failover panel ("Five lanes", labelled Illustrative):
- Text → Every agent calls through one router. Providers are tried in priority order with a hard timeout each; a circuit breaker skips a provider after repeated failures, and cooldowns depend on the error.
- Providers **[FACT FROM CODE]**: 1 Groq (25 s) · 2 Cohere (45 s) · 3 Mistral (35 s) · 4 OpenRouter (35 s) · 5 Gemini (30 s)

Result panel:
- Result → A fact-check layer that removes fabricated claims and restores the original wording, automatic failover across 5 providers, and results streamed over SSE.
- Numbers → 5 LLM providers · 49 pytest tests
- Deploy → FastAPI + REST + SSE on Render · Next.js + TypeScript on Vercel
- Stack → Python · FastAPI · Pydantic · LangChain · Pytest · Next.js · TypeScript · Render · Vercel
- Links → GitHub · Live demo (worthyapply-sigma.vercel.app) · Read the case study →

**[FILL IN]** Speed-up figure. It's hidden until you choose one:
- (a) your note: 16.07 s → 5.89 s (−63.3%)
- (b) the repo benchmark: 12.5 s → 6.2 s (−50.4%, 30 cases)
- (c) neither

### 02 · EduAI

- Tag line → AI learning platform · Nov 2025 · Solo build
- One-liner → A learning platform that turns a topic into a structured course, with quizzes and progress tracking, behind JWT-protected REST APIs.
- Problem → Self-learners can find material on any topic, but not a structured path through it: modules in order, practice, and a way to check what stuck.
- Solution → Type a topic. The backend asks Llama 3.3 70B (through Groq) for the whole course as JSON — modules, lessons, chapter quizzes, a final assessment — checks its shape, stores it, and assembles a quiz from the questions inside it.
- Hard part → LLM output that is almost JSON. The call runs in JSON mode; a response that fails to parse, or arrives without modules, falls back to a default course template instead of surfacing an error.
- Outcome → A deployed full-stack app: React + Vite on Vercel, Express 5 + Prisma + MongoDB Atlas on Render.
- Security points →
  - Passwords hashed with bcrypt (10 salt rounds).
  - JWT signed at login with a 7-day expiry.
  - Protected routes on both client (ProtectedRoute) and server (authMiddleware).
  - Updates and deletes check the course belongs to the caller, else 401.
- API table **[FACT FROM CODE]** → 19 endpoints, 13 behind JWT, across /api/auth, /api/courses, /api/quizzes, /api/progress. Models: User · Course · Quiz · Progress.
- Request diagram **[FACT FROM CODE]** → POST /api/courses → jwt.verify → generateCourseContent(topic) → course JSON → course.create → quiz.create → 201 Created
- Stack → React · Vite · React Router · Node.js · Express.js · Prisma ORM · MongoDB · JWT · Groq · Llama 3.3 70B
- Links → GitHub (sanath-2512/EduAI.) · Live demo (edu-ai-rho-hazel.vercel.app)

### 03 · AgriMind

- Tag line → Farm advisory · Mar 2026 · LangGraph
- One-liner → An agentic farm-advisory system that combines crop-yield prediction with LLM retrieval.
- Problem → Farm advice needs both numbers and knowledge: a yield estimate for this farm, and the agronomy that explains what to do about it.
- Solution → A LangGraph agent carries one shared state through four steps: predict yield from structured farm data, retrieve agronomy passages for that prediction, reason over both, and write a structured report.
- Hard part → Keeping the answer consistent across a structured model and unstructured retrieval, and checking outputs for relevance and reliability.
- Outcome → A full pipeline: FastAPI backend on Render, React frontend.
- Graph steps **[FACT FROM CODE]** →
  1. predict: scikit-learn regression on the farm inputs
  2. retrieve: ChromaDB, all-MiniLM-L6-v2 embeddings, top 4 passages
  3. reason: LLM over the prediction and the passages together
  4. report: JSON-mode report, normalised to a fixed schema
- Highlighted note → The retrieval query includes the yield category the model just predicted, so the knowledge pulled in is about this farm's situation, not the crop in general.
- Resilience points →
  - An error in any node is written to state; later nodes short-circuit instead of failing.
  - The report is forced into one schema, even when the model's JSON is incomplete.
- Stack → Python · LangGraph · FastAPI · ChromaDB · scikit-learn · React · Render
- Links → GitHub (Agrim-2007/AgriMind) · Live demo (agrimind-five.vercel.app)
- **[FILL IN]** Is Agrim-2007/AgriMind the right repo to link, or sanath-2512/cropyeild_ml? Was this a team project, and should the site say so?

### 04 · Viewly

- Tag line → Movie discovery · Jul 2025 · Solo build
- One-liner → A movie discovery app on the TMDB API: trending and top-rated lists, search, official trailers, and a watchlist that survives a reload.
- Problem → Finding something to watch means hopping between lists, search results and trailers on different sites.
- Solution → One React app: four TMDB lists on the home page, title search, a detail page with the official trailer, and a watchlist kept in localStorage.
- Hard part → State and persistence without a backend. The watchlist lives in React state and is mirrored to localStorage on every change, so it is there after a reload.
- Outcome → Deployed on Netlify with an SPA redirect rule, so deep links such as /movie/:id resolve. Built to practise real-world API integration and state management.
- Screens **[FACT FROM CODE]** → Home (/) · Search (/search) · Details (/movie/:id) · Trailer (/movie/:id/:key) · Watchlist (/watchlist) · About (/about)
- Stack → React · Vite · React Router · TMDB API · YouTube embeds · localStorage · Netlify
- Links → GitHub (sanath-2512/Viewly) · Live demo **[FILL IN]** Netlify URL

### 05 · DVA Portfolio

- Tag line → Data visualisation · 2026 · Team coursework
- One-liner → My Data Visualization & Analytics coursework: two team dashboards, and a React site that presents them.
- Context line → Data Visualization & Analytics (DVA), Newton School of Technology — Section A group projects.

Dashboard 1: India Agricultural Productivity Intelligence
- Tool · team → Tableau · Group G-17 · 6 members
- My part (PPT & Quality Lead) → Built Dashboard 4, Crop Portfolio: the production-share treemap, the state yield ranking, and the fastest-growing crop by CAGR. Also the presentation deck and the quality review.
- Question → Which states, districts and crops underperform on yield, and how did productivity move from 1997 to 2019?
- Data → 345,336 rows × 8 columns · 1997–2019 (23 years) · 707 districts · 37 states & UTs
- Views → Executive Summary · Underperformance Analysis · Productivity Trends · Crop Portfolio (← mine)
- Links → Live dashboard (Tableau Public) · Team repo

Dashboard 2: Retail Performance Intelligence
- Tool · team → Google Sheets · Group G10 · 6 members
- My part → Pivot calculations behind the sales and outlet views.
- Question → Where do Big Mart sales concentrate, by item type, outlet type and location tier?
- Data → 8,522 sales records
- Views → Sales by item type · Sales by outlet type · Revenue by location tier · Revenue by fat content
- Links → Team repo

Closing line → Both boards are presented in a small portfolio site I built for the course.
- Stack → React · Vite · Tailwind CSS · Framer Motion
- Links → GitHub (sanath-2512/Dva-Portofolio) · Live demo **[FILL IN]** URL

---

## WorthyApply case study page (/work/worthyapply)

- Top line → Case study · 01 · Resume–job fit · Sept 2026
- Chapter 1 · Problem → (uses the WorthyApply problem and "for whom" from above)
- Chapter 2 · Constraints →
  1. Only verified experience: Nothing may appear on the tailored resume that the source resume does not support.
  2. Providers fail or time out: 5 providers, each with its own hard timeout, rate limits and outages.
  3. Results must stream: A long structured generation cannot sit behind a blank spinner.
- Chapter 3 · Architecture → FastAPI + REST + SSE on Render · Next.js + TypeScript on Vercel. A single structured call does the analysis; Python computes the score; tailoring is a patch that a deterministic fact-check audits; every model call goes through one router that fails over across providers. (A diagram follows.)
- Chapter 4 · Implementation → the six pipeline stages table, plus:
  - Scoring — Python owns the arithmetic:
    - Each requirement is weighted by priority: required › conditional › preferred › nice-to-have.
    - Credit per verdict: matched full, partial half, cannot_verify limited, missing none.
    - Score = weighted credit ÷ weighted maximum, with a readable account of how it was derived.
  - Evidence — the verdict is checked against the resume:
    - A specific technology proves its family, never the reverse: "AWS Bedrock" satisfies AWS; "AWS" alone does not satisfy AWS Lambda.
    - A claimed match on a tool the resume never names is overruled to missing.
    - Years are summed from dated roles, overlaps merged, education excluded.
- Chapter 5 · Evaluation → 49 pytest tests, no network. The table **[FACT FROM CODE]**:
  - test_grounding.py (26): skill evidence, claim fact-check, tailoring finalisation, OR-groups / years / degree checks, import fidelity
  - test_llm_router.py (10): failover, cooldowns, circuit breaker, recovery, invalid structured output
  - test_analysis_quality.py (8): deterministic, priority-weighted scoring and recommendation logic
  - test_combined_analysis.py (4): the one-call analysis path under provider timeout and invalid output
  - test_timeout_no_wait.py (1): a hung provider does not block the request
  - Closing → Beyond the unit tests: benchmark_analyze.py · benchmark_grounding.py. The grounding benchmark replays fixed adversarial model outputs offline, so the fact-check is measured without calling a model.
- Chapter 6 · Optimization → The analysis used to be three chained calls — job analysis, match analysis, optimisation. It now runs as one structured generation that returns one typed object, which keeps the three phases consistent and removes two round-trips. The old three-call path is kept as run_full_pipeline_legacy for regression comparison, and benchmark_analyze.py compares the two.
- Chapter 7 · Results →
  - Fabricated numbers, scale, outcomes, ownership and seniority are removed before a tailored resume is shown.
  - The match score is computed in Python from per-requirement verdicts, not produced by the model.
  - A request survives a provider timing out: the router moves to the next provider.
  - Results stream over server-sent events.
  - A resume builder with PDF import and export sits on top of the analysis.
- Chapter 8 · Lessons → **[FILL IN]** Hidden until you approve. Drafts to edit or replace:
  1. The fact-check had to be deterministic — a second model asked "is this true?" fails the same way the first one did.
  2. Failover is a product feature, not plumbing; the slowest reliable provider still beats an error page.
  3. The score only became trustworthy once the model stopped producing it.

---

## §05 How I build

- Heading → I build **systems** around models, not just calls to them.
- Stages → Problem · Research · Architecture · Implementation · Evaluation · Optimization · Deployment
  - Stages left empty for a project show dimmed.

WorthyApply tab:
- Problem → Tailoring models fabricate claims.
- Architecture → One structured analysis call, SSE streaming, failover across 5 providers.
- Implementation → Deterministic scoring in Python; tailoring as a patch; claim-level fact-check.
- Evaluation → 49 pytest tests, plus an offline adversarial benchmark for the fact-check.
- Deployment → FastAPI on Render, Next.js on Vercel.

EduAI tab:
- Problem → A topic, but no structured path through it.
- Architecture → React SPA → Express REST API → Groq in JSON mode → Prisma on MongoDB.
- Implementation → bcrypt + JWT auth, per-owner checks, a default-course fallback for malformed output.
- Deployment → React on Vercel, Express on Render.

AgriMind tab:
- Problem → Advice needs numbers and knowledge.
- Architecture → LangGraph state carries a yield prediction and retrieved passages into one reasoning step.
- Evaluation → Response consistency across structured and unstructured sources; relevance and reliability.
- Deployment → FastAPI on Render, React frontend.

Fusion Cards tab:
- Problem → Retrieval across shared documents from 18+ banks.
- Research → Analyzed the production data pipelines.
- Architecture → Proposed changes to the scraper, extractor and chunking workflows.
- Implementation → Improved chunking for MITC, T&Cs and fee schedules.

---

## §06 Stack — "Stack, as used"

- Heading → Stack, as used
- Subline → From my résumé, mapped to a project only where that project's code shows it.
- Filter chips → All · WorthyApply · EduAI · AgriMind · Viewly · DVA · Fusion Cards · This site

Each tool is shown as: tool → what I used it for → projects.

Languages
- Python → Backends, pipelines, the fact-check → WorthyApply, AgriMind, Fusion Cards
- TypeScript → Typed frontends → WorthyApply, This site
- JavaScript → Express APIs and React apps → EduAI, Viewly, DVA
- HTML/CSS → Hand-written styles and tokens → EduAI, Viewly, This site
- Also worked with → SQL

Backend & APIs
- FastAPI → Analysis and advisory services → WorthyApply, AgriMind
- REST APIs → Designed in two apps, consumed in a third → WorthyApply, EduAI, Viewly
- Server-Sent Events → Streaming progress and tokens → WorthyApply
- Pydantic → Typed structured output → WorthyApply
- Pytest → 49 tests → WorthyApply
- Node.js → API runtime → EduAI
- Express.js → 19-endpoint REST API → EduAI
- Prisma ORM → Four models on MongoDB → EduAI

Cloud & DevOps
- AWS Bedrock → Model access in document pipelines → Fusion Cards
- Amazon S3 → Document storage → Fusion Cards
- Render → Python and Node backends → WorthyApply, AgriMind, EduAI
- Vercel → Frontends → WorthyApply, AgriMind, EduAI
- Also worked with → Git & GitHub

Databases
- OpenSearch → Retrieval index → Fusion Cards
- ChromaDB → Agronomy knowledge store → AgriMind
- MongoDB → Courses, quizzes, progress → EduAI
- Also worked with → MySQL

AI / ML
- LLMs → Structured analysis, reasoning, course generation → WorthyApply, EduAI, AgriMind, Fusion Cards
- RAG → Retrieval over bank documents and agronomy → AgriMind, Fusion Cards
- LangChain → Provider adapters under the router → WorthyApply
- LangGraph → Multi-step agent state → AgriMind
- Prompt Engineering → Structured-output and pipeline prompts → WorthyApply, EduAI, Fusion Cards
- Vector Embeddings → all-MiniLM-L6-v2 in ChromaDB → AgriMind
- Machine Learning → Crop-yield regression → AgriMind
- scikit-learn → Yield model → AgriMind
- Also worked with → Hugging Face

Frontend
- React → Every interface here → EduAI, AgriMind, Viewly, DVA, This site
- Next.js → App frontend → WorthyApply
- Tailwind CSS → Utility layer over tokens → DVA, This site
- Three.js → The calibration field → This site
- GSAP → Scroll choreography → This site
- Lenis → Smooth scroll → This site
- Vite → Build → EduAI, Viewly, DVA, This site

---

## §07 Signals

- Heading → Signals
- Subline → Outside the day job, logged with sources.
- 2025 → GirlScript Summer of Code — Open-source contributor → **[FILL IN]** links to your contributions
- 2026 → GirlScript Summer of Code — Open-source contributor → **[FILL IN]** links
- 2026 → Thapar Institute Tech Fest — Built two working projects under time constraints
- **[FILL IN]** year → Buildspace hackathon — Top 7 finish
- ongoing → Competitive programming — LeetCode · CodeChef · Codeforces
  - Links: leetcode.com/u/LvqtSP4dgr · codechef.com/users/colony_dice_69 · codeforces.com/profile/sanath25
- Anything to add? → **[FILL IN]** e.g. certifications, talks, other hackathons

---

## §08 Contact

- Headline → LET'S BUILD SOMETHING **USEFUL**.
- Email label → Email
- Buttons → Write to me → · Copy address (shows "Copied ✓")
- Links → LinkedIn ↗ · GitHub ↗ · Résumé ↗ (Résumé hidden until you send the PDF)
- Footer → © 2026 Sanath Waraikar · Build [code version] · Updated [date] · Back to top ↑
