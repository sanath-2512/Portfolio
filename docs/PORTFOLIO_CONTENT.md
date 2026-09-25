# Portfolio content — every word on the site

This is all the text on sanath-2512's portfolio, in the order it appears. Updated for the "systems around models" revamp.

**How to edit:** change the text after any `→` arrow, then send the file back.
- You can rewrite, shorten, delete, or add lines.
- Lines marked **[FILL IN]** are empty today and hidden on the live site until you give them a value.
- Lines marked **[FACT FROM CODE]** were checked against your repos. Change them only if they're wrong.
- Leave the labels on the left as they are, so I know where each piece goes.
- Anything behind a **Deep dive** button is Level 3 detail: collapsed by default, not deleted.

The code that holds this text is `src/data/content.ts`. A few short labels live in the components themselves.

---

## 0. Site-wide

- Browser tab title → Sanath Waraikar — Backend × Applied AI
- Search / link-preview description → Sanath Waraikar builds systems around models — not just calls to them: retrieval, agentic workflows, failover and evaluation.
- Link-preview image → Backend × Applied AI × Systems · I build **systems** around models — not just calls to them. · Grounding · Reliability · Evaluation
- Nav links → How I think · Experience · Builds · Toolkit · Contact · Resume ↗ (hidden until the PDF exists) · DARKROOM / PAPER (theme switch)
- Section index → 01 Intro · 02 How I think · 03 Experience · 04 Builds · 05 How I build · 06 Toolkit · 07 Outside the code · 08 Contact
- Email → sanath.waraikar2024@nst.rishihood.edu.in
- GitHub → https://github.com/sanath-2512
- LinkedIn → https://www.linkedin.com/in/sanath-waraikar-4ba35b308/
- Resume PDF → **[FILL IN]** send the current PDF, without your phone number
- Available for roles / internships? → **[FILL IN]** (or leave blank to hide)
- Location → **[FILL IN]** e.g. "Mumbai, India · IST" (or leave blank to hide)
- Footer → SANATH WARAIKAR · Backend × applied AI · © year · build SHA · Back to top

---

## 01 Intro

- Small line above the name → Backend × Applied AI × Systems
- Big name → SANATH / WARAIKAR
- Main line → I build **systems** around models — not just calls to them.
- Supporting 1 → I work at the intersection of backend engineering and applied AI: building APIs, retrieval systems, agentic workflows and evaluation layers that have to behave predictably outside a notebook.
- Supporting 2 → Recently: document RAG across 18+ banks, multi-provider LLM failover, deterministic resume evaluation, and LangGraph pipelines.
- Buttons → Explore the work · GitHub ↗ · LinkedIn ↗
- Bottom hint (desktop) → Move to explore

---

## 02 How I think

- Heading → How I think
- Opening line → I'm interested in the part of AI that starts after the demo works.
- Q1 → How does the system handle bad input?
- Q2 → What happens when a model times out?
- Q3 → Can an answer be traced back to evidence?
- Q4 → What happens when the model is simply wrong?
- Closing → That's where most of my recent work has taken me: backend systems, **retrieval**, **structured outputs**, agentic workflows and **evaluation**. (bold words get a detection box)

**Currently exploring** (select one to see where it shows up in the work)
- 01 Backend → APIs · services · system design → In the work: EduAI · WorthyApply · AgriMind
- 02 Applied AI → LLMs · RAG · agents · evaluation → In the work: Fusion Cards · WorthyApply · AgriMind
- 03 Machine learning → Deep learning · model behaviour · prediction → In the work: AgriMind · coursework
- 04 System reliability → Validation · failover · testing · observability → In the work: WorthyApply

- Off the screen → Badminton · Cricket · Building things that probably started as "this should be simple."

---

## 03 Experience

- Heading → Where I learned to ship
- Company → Fusion Cards
- Role → AI Software Engineer Intern · Jun — Aug 2026 · Remote
- Intro 1 → I worked on enterprise document intelligence where the interesting problems weren't "how do I call an LLM?"
- Intro 2 → They were retrieval quality, document structure, chunking strategy — and making information usable across credit-card documents from 18+ banks.
- Tenure line → 3 months on the team

**Three cards** (pointing at one lights its stages in the pipeline below)
- 01 Retrieval → Worked on a RAG knowledge-retrieval system spanning credit-card documents from 18+ banks. The corpus included MITCs, terms & conditions, and fee schedules.
- 02 Document pipeline → Improved chunking strategies for shared bank-wide documents, where document structure mattered as much as the retrieval model.
- 03 System design → Analysed the production scraper → extractor → chunking pipeline and proposed architectural changes to improve how documents moved through the system.
- Stack → Python · AWS Bedrock · Amazon S3 · OpenSearch · RAG · LLMs · Prompt Engineering

**Pipeline strip**
- Header → DOCUMENT → RETRIEVAL → REASONING
- Caption → A simplified view of the pipeline I worked around.
- Stages → Bank documents (18+ banks) · Scraper (proposed) · Extractor (proposed) · Chunking (improved) · S3 · OpenSearch index · Retrieval · AWS Bedrock LLM · Answer
- Stage order → **[FILL IN]** confirm the real order

**Education** → B.Tech (Artificial Intelligence) · Newton School of Technology, Rishihood University · 2024–2028 · CGPA 8.283/10

---

## 04 Builds

- Heading → Things I *actually* built
- Subline → Some started as experiments. Some became systems. All of them taught me something I couldn't learn by watching another tutorial.
- Project index → 01 WorthyApply · 02 EduAI · 03 AgriMind · 04 Viewly · 05 DVA

### 01 WorthyApply — AI resume engineering (hero project)

- Title → When the model lies
- What it is → A resume–job matching system designed around one rule:
- The rule → Never make the candidate more impressive than their **evidence**.
- The interesting problem → Most AI resume tools optimise for matching keywords. That creates a dangerous failure mode: the model sees what a job wants and quietly invents the experience needed to match it.
- How it works → WorthyApply treats the resume as evidence. Requirements are classified against that evidence. The score is calculated in Python. Generated bullets are treated as patches, not replacements. Claims are checked before they reach the user. And if an LLM provider fails, the system moves on.

**"When the model lies" demo** [FACT FROM CODE: `test_grounding.py::test_claim_checks`]
- Source → Assisted in building an AI document Q&A system using AWS Bedrock.
- Model output → Led a production RAG platform for 1M+ documents that reduced latency by 40%. (each invented claim is flagged: ownership, scale, unlicensed term, number, outcome)
- System response → each flag is struck → Original wording restored →

**Provider lanes** (illustrative: provider 1 times out, the request reroutes) → Groq 25 s · Cohere 45 s · Mistral 35 s · OpenRouter 35 s · Gemini 30 s

**Numbers**
- 5 → LLM providers [FACT FROM CODE]
- 49 → pytest tests [FACT FROM CODE]
- SSE → Streaming
- Deterministic → Scoring

**Architecture** → Resume + job description → Structured analysis (one typed call) → Requirement match (verdict per requirement) → Python score engine (the model never writes the number) → Tailor patch (edits, not a rewrite) → Claim check (hard claims removed) → Result (streamed over SSE)

- The interesting part → The model doesn't decide the final score. It provides structured evidence. Python makes the decision. The fact-check layer decides what is allowed to reach the user.

**Deep dive** → stages & decisions · provider router · circuit breaker · the 49 tests by file · benchmarks · deployment (FastAPI + REST + SSE on Render · Next.js + TypeScript on Vercel) · links · Full case study →
- Latency figure → **[FILL IN]** 16.07 s → 5.89 s, or the repo's 12.5 s → 6.2 s? Hidden until you pick.

### 02 EduAI — What if an LLM had to build the whole course?

- What it is → EduAI takes a topic and generates a complete learning path — modules, lessons, quizzes and a final assessment.
- The interesting problem → The interesting part wasn't generating text. It was making **unreliable JSON** behave like an API contract.
- How it works → Type a topic. The backend asks Llama 3.3 70B (through Groq) for the whole course as JSON, checks its shape, stores it, and assembles a quiz from the questions inside it.
- When it breaks → A response that fails to parse, or arrives without modules, falls back to a default course template instead of surfacing an error.
- Behind the API → JWT authentication · bcrypt password hashing · Protected routes · Resource ownership checks · 19 REST endpoints
- Flow → LLM (Llama 3.3 70B via Groq) → JSON mode (max_tokens 8000) → Validation (parse + modules check) → Fallback (default course if it fails) → Database (Prisma → MongoDB) → Quiz (assembled from the course)
- **Deep dive** → the 19 endpoints · the POST /api/courses sequence · security details · stack · links

### 03 AgriMind — Numbers + knowledge

- One-liner → A farm advisory system that combines a machine-learning prediction with retrieved agronomy knowledge.
- The prediction → "What might happen?"
- The retrieval → "What does that mean?"
- Then → LangGraph connects the two.
- The interesting problem → Farm advice needs both numbers and knowledge: a yield estimate for this farm, and the agronomy that explains what to do about it.
- The detail that matters → The retrieval query includes the predicted yield category. So the system isn't simply asking: "Tell me about this crop." It retrieves information relevant to the situation the model actually predicted.
- Query shown → "{crop} {soil} {weather} {yield_category} yield" — {yield_category} tagged "from prediction"
- Architecture → Farm inputs → Yield model (scikit-learn) → Prediction (yield + category) → Retrieval (query carries the category) → Agronomy knowledge (ChromaDB, top 4) → Reasoning (LLM over both) → Structured report (fixed schema)
- **Deep dive** → StateGraph & what each node writes · trace · failure handling · stack
- Repo → **[FILL IN]** Agrim-2007/AgriMind or sanath-2512/cropyeild_ml?

### 04 Viewly — The non-AI project

- What it is → A movie discovery app built around the TMDB API.
- Line → Search. Discover. Watch trailers. Save a watchlist.
- Why I built it → No LLM. No agents. No vector database. Just a clean frontend, API integration, state management and persistence.
- Tech → React · TMDB API · Local storage · Routing · Netlify
- Routes rail → / Home · /search · /movie/:id · /movie/:id/:key · /watchlist · /about
- **Deep dive** → what each screen loads · persistence · deployment
- Live URL → **[FILL IN]**

### 05 DVA — Data, before the AI

- What it is → Two team dashboards exploring agricultural productivity and retail performance.
- My role → My role covered dashboard construction, presentation and quality review — plus the pivot calculations on the retail board.
- What I learned → The project was a reminder that good systems start with understanding the data.
- Crop dashboard → 23 years of crop data · 1997–2019 (with labelled regions)
- **Deep dive** → datasets, team roles, my part, the dashboard views · the course site
- Course site live URL → **[FILL IN]**

---

## 05 How I build

- Heading → I build **systems** around models, not just calls to them.
- Understand → What problem are we actually solving?
- Structure → What should be deterministic? What actually needs a model?
- Build → APIs · retrieval · agents · interfaces
- Break → Bad inputs. Timeouts. Malformed output. Hallucinations.
- Measure → Tests. Benchmarks. Grounding. Latency.
- Ship → Deploy it. Observe it. Improve it.

**Through a real project** (tabs)
- WorthyApply → Understand: AI resume tailoring quietly invents experience to match a job. · Structure: The model classifies requirements; Python owns the score; tailoring is a patch, not a rewrite. · Build: FastAPI + SSE backend, a five-provider router, Next.js frontend. · Break: Provider timeouts, invalid structured output, fixed adversarial model outputs. · Measure: 49 pytest tests and an offline grounding benchmark. · Ship: FastAPI on Render, Next.js on Vercel.
- EduAI → Understand: A topic, but no structured path through it. · Structure: The model writes the course; the API validates its shape and owns auth and ownership. · Build: Express REST API (19 endpoints), Prisma on MongoDB, React. · Break: Malformed or module-less JSON falls back to a default course. · Ship: React on Vercel, Express on Render.
- AgriMind → Understand: Advice needs numbers and knowledge. · Structure: A model predicts; retrieval is conditioned on that prediction; an LLM reasons over both. · Build: A four-node LangGraph, ChromaDB, FastAPI, React. · Break: Node errors are written to state; the report is normalised even when the JSON is incomplete. · Measure: Consistency across structured and unstructured sources; relevance and reliability. · Ship: FastAPI on Render, React frontend.
- Fusion Cards → Understand: Retrieval across shared documents from 18+ banks. · Structure: Analysed the production scraper → extractor → chunking pipeline and proposed changes. · Build: Improved chunking for MITCs, T&Cs and fee schedules.

---

## 06 Toolkit

- Heading → Tools I *actually* use
- Subline → I don't collect technologies. I use them when the problem calls for them.
- Filter chips → All · WorthyApply · EduAI · AgriMind · Viewly · DVA · Fusion Cards · This site
- Groups → Build (Python, TypeScript, JavaScript, FastAPI, Next.js, React, Node.js, Express) · Intelligence (LLMs, RAG, LangChain, LangGraph, Machine Learning, scikit-learn, Embeddings, Prompt Engineering) · Infrastructure (AWS Bedrock, S3, OpenSearch, MongoDB, ChromaDB, Render, Vercel) · Quality (Pydantic, Pytest, Structured outputs, Deterministic validation, SSE)
- Each tool shows → what it did · which projects used it · where exactly. Example — Pytest: 49 tests → grounding → provider failover → scoring → structured output
- Also → SQL · HTML/CSS · Prisma ORM · MySQL · Git & GitHub · Hugging Face · Tailwind CSS · Three.js · GSAP · Vite

---

## 07 Outside the code

- Heading → Outside the *code*
- Subline → A few things that happened along the way.
- 2025 → GirlScript Summer of Code · Open-source contribution → links **[FILL IN]**
- 2026 → GirlScript Summer of Code · Open-source contribution → links **[FILL IN]**
- 2026 → Thapar Institute Tech Fest · Built two working projects under time constraints
- Ongoing → Competitive programming · LeetCode · CodeChef · Codeforces

---

## 08 Contact

- Headline → GOT A PROBLEM / WORTH **BUILDING?**
- Body 1 → I'm interested in backend, applied AI and ML systems — especially problems where the engineering is as interesting as the model.
- Body 2 → If there's something worth building, send it over.
- Buttons → Email → · GitHub → · LinkedIn → · Resume → (hidden until the PDF exists)
