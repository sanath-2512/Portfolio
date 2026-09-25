/**
 * Single source of truth for every fact on this site.
 *
 * Priority of sources:
 *   1. Résumé, September 2026 (the brief's Appendix A)
 *   2. The source repos, where they clearly confirm something:
 *        github.com/sanath-2512/Worthyapply   @ 7a28d98
 *        github.com/Agrim-2007/AgriMind        @ 9404976
 *   3. This repo
 *
 * Anything unknown is a `todo(...)`. In development it renders as a dashed
 * placeholder; in production the field is hidden. Nothing here is guessed.
 * See docs/redesign/AUDIT.md for every conflict and omission.
 */

/* ------------------------------------------------------------------ */
/* TODO(user) markers                                                  */
/* ------------------------------------------------------------------ */

export interface Todo {
  readonly todo: string
}
export type Maybe<T> = T | Todo

/** TODO(user): a value only Sanath can supply. */
export const todo = (note: string): Todo => ({ todo: note })
export const isTodo = (value: unknown): value is Todo =>
  typeof value === 'object' && value !== null && 'todo' in value

/* ------------------------------------------------------------------ */
/* Citations — every number on the page points at one of these         */
/* ------------------------------------------------------------------ */

export interface Source {
  /** Printed in brackets, e.g. [1]. Fixed so numbering is stable page-wide. */
  n: number
  label: string
  detail: string
  href?: string
}

const WA_REPO = 'https://github.com/sanath-2512/Worthyapply'
const AGRI_REPO = 'https://github.com/Agrim-2007/AgriMind'

export const sources = {
  fusion: {
    n: 1,
    label: 'Fusion Cards internship',
    detail: 'AI Software Engineer Intern, Jun–Aug 2026. Résumé, Sept 2026.',
  },
  waTests: {
    n: 2,
    label: 'WorthyApply /backend/tests',
    detail: '49 test functions across five pytest files.',
    href: `${WA_REPO}/tree/main/backend/tests`,
  },
  waRouter: {
    n: 3,
    label: 'WorthyApply llm_router/config.py',
    detail: 'Five providers, priority order and per-provider timeouts.',
    href: `${WA_REPO}/blob/main/backend/llm_router/config.py`,
  },
  waGrounding: {
    n: 4,
    label: 'WorthyApply test_grounding.py',
    detail: '26 tests covering evidence checks and the tailoring fact-check.',
    href: `${WA_REPO}/blob/main/backend/tests/test_grounding.py`,
  },
  agriGraph: {
    n: 5,
    label: 'AgriMind reference_agent/graph.py',
    detail: 'The compiled LangGraph StateGraph.',
    href: `${AGRI_REPO}/blob/main/src/reference_agent/graph.py`,
  },
  resume: {
    n: 6,
    label: 'Résumé, Sept 2026',
    detail: 'Education and activities.',
  },
  eduaiRoutes: {
    n: 7,
    label: 'EduAI backend/routes',
    detail: 'Four route groups, 19 endpoints, JWT middleware on 13 of them.',
    href: 'https://github.com/sanath-2512/EduAI./tree/main/backend/routes',
  },
  viewlyApp: {
    n: 8,
    label: 'Viewly src/App.jsx',
    detail: 'Routes and the localStorage-backed watchlist.',
    href: 'https://github.com/sanath-2512/Viewly/blob/main/src/App.jsx',
  },
  g17: {
    n: 9,
    label: 'G17 India Agri Productivity README',
    detail: 'Dataset scale, the four dashboards, and team roles.',
    href: 'https://github.com/r0hansng/SectionA_G17_IndiaAgriProductivity',
  },
  g10: {
    n: 10,
    label: 'SecA-G10 Retail Sales README',
    detail: 'Record count and team contributions.',
    href: 'https://github.com/sanath-2512/SecA-G10',
  },
} satisfies Record<string, Source>

export type SourceKey = keyof typeof sources

/* ------------------------------------------------------------------ */
/* Profile                                                            */
/* ------------------------------------------------------------------ */

export const profile = {
  name: 'Sanath Waraikar',
  first: 'Sanath',
  last: 'Waraikar',
  role: 'Backend × applied AI',
  eyebrow: 'Backend × Applied AI × Systems',
  /** One word per heading carries the emphasis. */
  positioning: {
    lead: 'I build ',
    emphasis: 'systems',
    tail: ' around models — not just calls to them.',
  },
  supporting: [
    'I work at the intersection of backend engineering and applied AI: building APIs, retrieval systems, agentic workflows and evaluation layers that have to behave predictably outside a notebook.',
    'Recently: document RAG across 18+ banks, multi-provider LLM failover, deterministic resume evaluation, and LangGraph pipelines.',
  ],
  hint: 'Move to explore',
  email: 'sanath.waraikar2024@nst.rishihood.edu.in',
  links: {
    github: 'https://github.com/sanath-2512',
    linkedin: 'https://www.linkedin.com/in/sanath-waraikar-4ba35b308/',
    // The PDF that was in /public dates from May 2026 and printed the phone
    // number and Class X/XII scores, so it was removed. See AUDIT.md C11.
    resume: todo('Add the Sept 2026 résumé PDF (without phone number) to /public and set this path') as Maybe<string>,
  },
  availability: todo('Availability for roles or internships — not on the résumé') as Maybe<string>,
  location: todo('Location / time zone — enables local time in the hero and BASED in About') as Maybe<{
    label: string
    timeZone: string
  }>,
}

/* ------------------------------------------------------------------ */
/* Navigation                                                         */
/* ------------------------------------------------------------------ */

export interface SectionMeta {
  id: string
  index: string
  label: string
  /** Target uCalibration for the field when this section is centred. */
  cal: number
  calEnd?: number
}

/** Page order. Indices are printed as §0N and [0N/08]. */
export const sections: SectionMeta[] = [
  { id: 'top', index: '01', label: 'Intro', cal: 0 },
  { id: 'about', index: '02', label: 'How I think', cal: 0.2 },
  { id: 'experience', index: '03', label: 'Experience', cal: 0.35 },
  { id: 'work', index: '04', label: 'Builds', cal: 0.55, calEnd: 0.8 },
  { id: 'process', index: '05', label: 'How I build', cal: 0.84 },
  { id: 'stack', index: '06', label: 'Toolkit', cal: 0.9 },
  { id: 'signals', index: '07', label: 'Outside the code', cal: 0.95 },
  { id: 'contact', index: '08', label: 'Contact', cal: 1 },
]

export const navItems = [
  { id: 'about', label: 'How I think' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Builds' },
  { id: 'stack', label: 'Toolkit' },
  { id: 'contact', label: 'Contact' },
]

/* ------------------------------------------------------------------ */
/* §02 About                                                          */
/* ------------------------------------------------------------------ */

export type Segment = string | { term: string; tag: 'TOOL' | 'SYSTEM' | 'ORG' | 'METRIC' }

export const about = {
  title: 'How I think',
  /** Read word by word; [terms] get a DETECT box as they are read. */
  statement: [
    "I'm interested in the part of AI that starts after the demo works.",
  ] as Array<string | Segment[]>,
  questions: [
    'How does the system handle bad input?',
    'What happens when a model times out?',
    'Can an answer be traced back to evidence?',
    'What happens when the model is simply wrong?',
  ],
  closing: [
    "That's where most of my recent work has taken me: backend systems, ",
    { term: 'retrieval', tag: 'SYSTEM' },
    ', ',
    { term: 'structured outputs', tag: 'TOOL' },
    ', agentic workflows and ',
    { term: 'evaluation', tag: 'METRIC' },
    '.',
  ] as Segment[],
  exploring: [
    { no: '01', title: 'Backend', items: 'APIs · services · system design', where: 'EduAI · WorthyApply · AgriMind' },
    { no: '02', title: 'Applied AI', items: 'LLMs · RAG · agents · evaluation', where: 'Fusion Cards · WorthyApply · AgriMind' },
    { no: '03', title: 'Machine learning', items: 'Deep learning · model behaviour · prediction', where: 'AgriMind · coursework' },
    { no: '04', title: 'System reliability', items: 'Validation · failover · testing · observability', where: 'WorthyApply' },
  ],
  offScreen: 'Badminton · Cricket · Building things that probably started as “this should be simple.”',
  /** Kept for the dev-only TODO; not rendered in production until filled. */
  based: todo('Location — not on the résumé') as Maybe<string>,
}

/* ------------------------------------------------------------------ */
/* §03 Experience                                                     */
/* ------------------------------------------------------------------ */

export const experience = {
  title: 'Where I learned to ship',
  intro: [
    'I worked on enterprise document intelligence where the interesting problems weren’t “how do I call an LLM?”',
    'They were retrieval quality, document structure, chunking strategy — and making information usable across credit-card documents from 18+ banks.',
  ],
  /** Three cards; `stages` highlight the matching steps of the pipeline strip. */
  cards: [
    {
      no: '01',
      title: 'Retrieval',
      body: [
        'Worked on a RAG knowledge-retrieval system spanning credit-card documents from ',
        { metric: '18+ banks', source: 'fusion' as SourceKey },
        '. The corpus included MITCs, terms & conditions, and fee schedules.',
      ],
      stages: ['index', 'retrieval', 'llm'],
    },
    {
      no: '02',
      title: 'Document pipeline',
      body: ['Improved chunking strategies for shared bank-wide documents, where document structure mattered as much as the retrieval model.'],
      stages: ['chunking'],
    },
    {
      no: '03',
      title: 'System design',
      body: ['Analysed the production scraper → extractor → chunking pipeline and proposed architectural changes to improve how documents moved through the system.'],
      stages: ['scraper', 'extractor', 'chunking'],
    },
  ] as Array<{ no: string; title: string; body: Array<string | { metric: string; source: SourceKey }>; stages: string[] }>,
  org: 'Fusion Cards',
  role: 'AI Software Engineer Intern',
  period: 'Jun 2026 – Aug 2026',
  start: { month: 'Jun', year: 2026 },
  end: { month: 'Aug', year: 2026 },
  /** June, July, August — used by the tenure dimension line. */
  months: 3,
  location: 'Remote',
  stack: ['Python', 'AWS Bedrock', 'Amazon S3', 'OpenSearch', 'RAG', 'LLMs', 'Prompt Engineering'],
  /** Team system: "contributed to" / "worked on", never "built". */
  statements: [
    ['Contributed to enterprise AI document-processing pipelines on AWS Bedrock, Amazon S3, and OpenSearch.'],
    [
      'Worked on a RAG knowledge-retrieval system for credit-card documents across ',
      { metric: '18+ banks', source: 'fusion' as SourceKey },
      '.',
    ],
    ['Improved chunking strategies for shared bank-wide documents: MITC, T&Cs, and fee schedules.'],
    ['Analyzed production data pipelines and proposed architecture changes for the scraper, extractor, and chunking workflows.'],
  ] as Array<Array<string | { metric: string; source: SourceKey }>>,
  /** System-level only. Stage order is unconfirmed. */
  pipeline: {
    label: 'Simplified',
    caption: 'A simplified view of the pipeline I worked around.',
    phases: [
      { id: 'document', label: 'Document', from: 0, to: 4 },
      { id: 'retrieval', label: 'Retrieval', from: 4, to: 7 },
      { id: 'reasoning', label: 'Reasoning', from: 7, to: 9 },
    ],
    orderNote: todo('Confirm the exact stage order of the Fusion Cards pipeline'),
    stages: [
      { id: 'docs', label: 'Bank documents', note: '18+ banks' },
      { id: 'scraper', label: 'Scraper', touched: 'proposed' },
      { id: 'extractor', label: 'Extractor', touched: 'proposed' },
      { id: 'chunking', label: 'Chunking', touched: 'improved' },
      { id: 's3', label: 'S3' },
      { id: 'index', label: 'OpenSearch index' },
      { id: 'retrieval', label: 'Retrieval' },
      { id: 'llm', label: 'AWS Bedrock LLM' },
      { id: 'answer', label: 'Answer' },
    ] as Array<{ id: string; label: string; note?: string; touched?: 'improved' | 'proposed' }>,
  },
}

export const education = {
  degree: 'B.Tech (Artificial Intelligence)',
  school: 'Newton School of Technology, Rishihood University',
  period: '2024–2028',
  cgpa: '8.283/10',
}

/* ------------------------------------------------------------------ */
/* §04 Work                                                           */
/* ------------------------------------------------------------------ */

export interface ProjectLinks {
  github: Maybe<string>
  demo: Maybe<string>
}

/** One step in a project's flow diagram. `tone` marks the step the story is about. */
export interface FlowNode {
  label: string
  note?: string
  tone?: 'signal' | 'measure'
}

/** Level 1 of every project: the short story, in this order. */
export interface StoryRow {
  /** Usually: What it is · Why I built it · The interesting problem · How it works · What I learned. */
  k: string
  v: string | string[]
}

export const worthyApply = {
  id: 'worthyapply',
  no: '01',
  name: 'WorthyApply',
  kicker: 'AI resume engineering',
  rule: 'Never make the candidate more impressive than their evidence.',
  story: [
    { k: 'What it is', v: 'A resume–job matching system designed around one rule.' },
    {
      k: 'The interesting problem',
      v: [
        'Most AI resume tools optimise for matching keywords.',
        'That creates a dangerous failure mode: the model sees what a job wants and quietly invents the experience needed to match it.',
      ],
    },
    {
      k: 'How it works',
      v: [
        'WorthyApply treats the resume as evidence.',
        'Requirements are classified against that evidence. The score is calculated in Python. Generated bullets are treated as patches, not replacements. Claims are checked before they reach the user. And if an LLM provider fails, the system moves on.',
      ],
    },
  ] as StoryRow[],
  flow: [
    { label: 'Resume + job description' },
    { label: 'Structured analysis', note: 'one typed call' },
    { label: 'Requirement match', note: 'verdict per requirement' },
    { label: 'Python score engine', note: 'the model never writes the number', tone: 'measure' },
    { label: 'Tailor patch', note: 'edits, not a rewrite' },
    { label: 'Claim check', note: 'hard claims removed', tone: 'signal' },
    { label: 'Result', note: 'streamed over SSE' },
  ] as FlowNode[],
  interesting: [
    'The model doesn’t decide the final score.',
    'It provides structured evidence. Python makes the decision. The fact-check layer decides what is allowed to reach the user.',
  ],
  domain: 'Resume–job fit',
  year: 'Sept 2026',
  oneLiner:
    'An AI resume–job fit analyzer that tailors your resume to a job description using only your verified experience.',
  problem:
    'AI resume tailoring invents experience. A model asked to "fit" a resume to a job adds the skills, numbers and seniority the posting wants, whether or not the candidate has them.',
  forWhom: 'Candidates tailoring one resume to many postings.',
  solution:
    'Score fit per requirement against evidence in the resume, compute the score in Python, and rewrite bullets as a small patch that a deterministic fact-check audits before anything is shown.',
  challenge:
    'Keeping every generated claim traceable to the source resume, while five LLM providers fail, rate-limit or time out underneath.',
  outcome:
    'A fact-check layer that removes fabricated claims and restores the original wording, automatic failover across 5 providers, and results streamed over SSE.',
  stack: ['Python', 'FastAPI', 'Pydantic', 'LangChain', 'Pytest', 'Next.js', 'TypeScript', 'Render', 'Vercel'],
  deployLine: 'FastAPI + REST + SSE on Render · Next.js + TypeScript on Vercel',
  links: {
    github: WA_REPO,
    demo: 'https://worthyapply-sigma.vercel.app/',
  } as ProjectLinks,
  metrics: {
    providers: { value: 5, label: 'LLM providers', source: 'waRouter' as SourceKey },
    tests: { value: 49, label: 'pytest tests', source: 'waTests' as SourceKey },
  },
  /** Names follow backend/pipeline.py, resume_tailor.py, grounding.py, app.py. */
  pipeline: [
    {
      id: 'input',
      label: 'Resume + JD',
      does: 'A resume PDF and a pasted job description enter the pipeline.',
      decision: 'The PDF is reduced to plain text first. That text, not the model, is what every later check reads.',
      code: 'pipeline.extract_resume_text_from_bytes',
    },
    {
      id: 'analysis',
      label: 'Combined analysis',
      does: 'One structured call runs job analysis, match analysis and optimisation, and returns one typed object.',
      decision: 'One generation keeps the three phases consistent and drops the latency and fragility of chaining three calls.',
      code: 'pipeline.run_combined_analysis',
    },
    {
      id: 'scoring',
      label: 'Fit scoring',
      does: 'The model labels each requirement matched, partial, missing or cannot_verify. Python weights them into a 0–100 score.',
      decision: 'The model never writes the number. A claimed match on a tool the resume never names is overruled to missing.',
      code: 'pipeline.compute_match_score · skills.py',
    },
    {
      id: 'tailoring',
      label: 'Tailoring',
      does: 'Rewrites existing bullets in the job’s language as a small patch, never a regenerated document.',
      decision: 'Every original bullet must survive with its facts, or it is put back.',
      code: 'resume_tailor.finalize_tailoring',
    },
    {
      id: 'factcheck',
      label: 'Fact-check',
      does: 'Each rewritten bullet, the summary and the title are split into claims and checked against the entry they rewrite.',
      decision: 'Hard claims (numbers, scale, outcomes, ownership, seniority) are removed and the original restored. Soft ones stay, flagged for review.',
      code: 'grounding.unsupported_claims',
    },
    {
      id: 'stream',
      label: 'Streamed result',
      does: 'Progress and tokens stream to the browser as server-sent events.',
      decision: 'A long structured call shows its work instead of a blank spinner.',
      code: 'POST /api/analyze/stream',
    },
  ],
  /** Real case from backend/tests/test_grounding.py::test_claim_checks. */
  factCheck: {
    source: 'Assisted in building an AI document Q&A system using AWS Bedrock.',
    generated: [
      { text: 'Led', flag: 'ownership' },
      { text: ' a ' },
      { text: 'production', flag: 'scale' },
      { text: ' ' },
      { text: 'RAG', flag: 'unlicensed term' },
      { text: ' platform for ' },
      { text: '1M+', flag: 'number' },
      { text: ' documents that ' },
      { text: 'reduced latency by 40%', flag: 'outcome' },
      { text: '.' },
    ] as Array<{ text: string; flag?: string }>,
    test: 'test_grounding.py::test_claim_checks',
    source_key: 'waGrounding' as SourceKey,
  },
  /** backend/llm_router/config.py — priority 1 is tried first. */
  providers: [
    { name: 'Groq', timeout: 25 },
    { name: 'Cohere', timeout: 45 },
    { name: 'Mistral', timeout: 35 },
    { name: 'OpenRouter', timeout: 35 },
    { name: 'Gemini', timeout: 30 },
  ],
  /** What the 49 tests cover, grouped by file. Names are from the repo. */
  tests: [
    {
      file: 'test_grounding.py',
      count: 26,
      covers: 'Skill evidence, the claim fact-check, tailoring finalisation, OR-groups / years / degree checks, import fidelity',
      examples: ['test_child_proves_parent_not_reverse', 'test_claim_checks', 'test_finalize_keeps_soft_claims_with_alert_and_removes_hard_ones'],
    },
    {
      file: 'test_llm_router.py',
      count: 10,
      covers: 'Failover, cooldowns, circuit breaker, recovery, invalid structured output',
      examples: ['test_2_groq_timeout_then_gemini', 'test_4_repeated_failures_open_circuit_then_skip', 'test_7_all_providers_fail_controlled_error'],
    },
    {
      file: 'test_analysis_quality.py',
      count: 8,
      covers: 'Deterministic, priority-weighted scoring and recommendation logic',
      examples: ['test_postprocess_recomputes_score_over_llm_value', 'test_cannot_verify_never_full_credit'],
    },
    {
      file: 'test_combined_analysis.py',
      count: 4,
      covers: 'The one-call analysis path under provider timeout and invalid output',
      examples: ['test_provider_timeout_triggers_fallback', 'test_invalid_output_triggers_fallback'],
    },
    {
      file: 'test_timeout_no_wait.py',
      count: 1,
      covers: 'A hung provider does not block the request',
      examples: ['test_hung_provider_does_not_block_request'],
    },
  ],
  /** Confirmed by the repo, not on the résumé. Shown only in the case study. */
  confirmedExtras: {
    deterministicScoring: true,
    benchmarkHarness: 'backend/tests/benchmark_analyze.py · benchmark_grounding.py',
    adversarialTesting: 'benchmark_grounding.py runs fixed adversarial model outputs',
    resumeBuilder: '/builder',
  },
  latency: todo(
    'Latency: your note says 16.07 s → 5.89 s (−63.3%); the repo benchmark says 12.5 s → 6.2 s (−50.4%, n = 30). Pick one before it is shown.',
  ),
  lessons: [
    todo('Lesson 1 (draft): the fact-check had to be deterministic — a second model asked "is this true?" fails the same way the first one did.'),
    todo('Lesson 2 (draft): failover is a product feature, not plumbing; the slowest reliable provider still beats an error page.'),
    todo('Lesson 3 (draft): the score only became trustworthy once the model stopped producing it.'),
  ],
}

export const agriMind = {
  id: 'agrimind',
  no: '03',
  name: 'AgriMind',
  kicker: 'Numbers + knowledge',
  story: [
    { k: 'What it is', v: 'A farm advisory system that combines a machine-learning prediction with retrieved agronomy knowledge.' },
    {
      k: 'How it works',
      v: ['The prediction answers: “What might happen?”', 'The retrieval answers: “What does that mean?”', 'LangGraph connects the two.'],
    },
  ] as StoryRow[],
  flow: [
    { label: 'Farm inputs' },
    { label: 'Yield model', note: 'scikit-learn' },
    { label: 'Prediction', note: 'yield + category', tone: 'measure' },
    { label: 'Retrieval', note: 'query carries the category', tone: 'signal' },
    { label: 'Agronomy knowledge', note: 'ChromaDB, top 4' },
    { label: 'Reasoning', note: 'LLM over both' },
    { label: 'Structured report', note: 'fixed schema' },
  ] as FlowNode[],
  detail: [
    'The retrieval query includes the predicted yield category.',
    'So the system isn’t simply asking: “Tell me about this crop.”',
    'It retrieves information relevant to the situation the model actually predicted.',
  ],
  domain: 'Farm advisory',
  year: 'Mar 2026',
  oneLiner: 'An agentic farm-advisory system that combines crop-yield prediction with LLM retrieval.',
  problem:
    'Farm advice needs both numbers and knowledge: a yield estimate for this farm, and the agronomy that explains what to do about it.',
  solution:
    'A LangGraph agent carries one shared state through four steps: predict yield from structured farm data, retrieve agronomy passages for that prediction, reason over both, and write a structured report.',
  challenge:
    'Keeping the answer consistent across a structured model and unstructured retrieval, and checking outputs for relevance and reliability.',
  outcome: 'A full pipeline: FastAPI backend on Render, React frontend.',
  stack: ['Python', 'LangGraph', 'FastAPI', 'ChromaDB', 'scikit-learn', 'React', 'Render'],
  links: {
    github: AGRI_REPO,
    demo: 'https://agrimind-five.vercel.app/',
  } as ProjectLinks,
  githubNote: todo('Confirm the canonical AgriMind repo (Agrim-2007/AgriMind vs sanath-2512/cropyeild_ml)'),
  /** Real graph (src/reference_agent/graph.py): START → predict → retrieve → reason → report → END. */
  graph: [
    {
      id: 'predict',
      label: 'predict',
      stream: 'structured',
      detail: 'scikit-learn regression on the farm inputs',
      writes: 'yield_prediction · yield_category',
    },
    {
      id: 'retrieve',
      label: 'retrieve',
      stream: 'unstructured',
      detail: 'ChromaDB, all-MiniLM-L6-v2 embeddings, top 4 passages',
      writes: 'retrieved_docs',
    },
    {
      id: 'reason',
      label: 'reason',
      stream: 'merge',
      detail: 'LLM over the prediction and the passages together',
      writes: 'llm_reasoning',
    },
    {
      id: 'report',
      label: 'report',
      stream: 'out',
      detail: 'JSON-mode report, normalised to a fixed schema',
      writes: 'advisory_report',
    },
  ] as Array<{ id: string; label: string; stream: 'structured' | 'unstructured' | 'merge' | 'out'; detail: string; writes: string }>,
  /** What each step does, as the token passes. Paraphrased from the node code. */
  trace: [
    { step: '01 PREDICT', line: 'model.predict(farm_data) → yield_prediction, yield_category' },
    { step: '02 RETRIEVE', line: 'query("{crop} {soil} {weather} {yield_category} yield", n=4) → retrieved_docs' },
    { step: '03 REASON', line: 'llm(prediction + retrieved_docs) → llm_reasoning' },
    { step: '04 REPORT', line: 'json_mode → normalize_report() → advisory_report' },
  ],
  linkNote:
    'The retrieval query includes the yield category the model just predicted, so the knowledge pulled in is about this farm’s situation, not the crop in general.',
  resilience: [
    'An error in any node is written to state; later nodes short-circuit instead of failing.',
    'The report is forced into one schema, even when the model’s JSON is incomplete.',
  ],
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export const eduAI = {
  id: 'eduai',
  no: '02',
  name: 'EduAI',
  kicker: 'What if an LLM had to build the whole course?',
  story: [
    { k: 'What it is', v: 'EduAI takes a topic and generates a complete learning path — modules, lessons, quizzes and a final assessment.' },
    {
      k: 'The interesting problem',
      v: ['The interesting part wasn’t generating text.', 'It was making unreliable JSON behave like an API contract.'],
    },
  ] as StoryRow[],
  flow: [
    { label: 'LLM', note: 'Llama 3.3 70B via Groq' },
    { label: 'JSON mode', note: 'max_tokens 8000' },
    { label: 'Validation', note: 'parse + modules check', tone: 'measure' },
    { label: 'Fallback', note: 'default course if it fails', tone: 'signal' },
    { label: 'Database', note: 'Prisma → MongoDB' },
    { label: 'Quiz', note: 'assembled from the course' },
  ] as FlowNode[],
  securityBlock: ['JWT authentication', 'bcrypt password hashing', 'Protected routes', 'Resource ownership checks', '19 REST endpoints'],
  domain: 'AI learning platform',
  year: 'Nov 2025',
  oneLiner:
    'A learning platform that turns a topic into a structured course, with quizzes and progress tracking, behind JWT-protected REST APIs.',
  problem:
    'Self-learners can find material on any topic, but not a structured path through it: modules in order, practice, and a way to check what stuck.',
  forWhom: 'Self-directed learners picking up a new topic.',
  solution:
    'Type a topic. The backend asks Llama 3.3 70B (through Groq) for the whole course as JSON — modules, lessons, chapter quizzes, a final assessment — checks its shape, stores it, and assembles a quiz from the questions inside it.',
  challenge:
    'LLM output that is almost JSON. The call runs in JSON mode; a response that fails to parse, or arrives without modules, falls back to a default course template instead of surfacing an error.',
  outcome: 'A deployed full-stack app: React + Vite on Vercel, Express 5 + Prisma + MongoDB Atlas on Render.',
  stack: ['React', 'Vite', 'React Router', 'Node.js', 'Express.js', 'Prisma ORM', 'MongoDB', 'JWT', 'Groq · Llama 3.3 70B'],
  links: {
    github: 'https://github.com/sanath-2512/EduAI.',
    demo: 'https://edu-ai-rho-hazel.vercel.app/',
  } as ProjectLinks,
  models: ['User', 'Course', 'Quiz', 'Progress'],
  /** backend/routes/*.js — `true` means authMiddleware guards the route. */
  api: [
    {
      base: '/api/auth',
      routes: [
        ['POST', '/register', false],
        ['POST', '/login', false],
        ['GET', '/me', true],
        ['PUT', '/update-profile', true],
        ['PUT', '/change-password', true],
      ],
    },
    {
      base: '/api/courses',
      routes: [
        ['POST', '/', true],
        ['GET', '/', true],
        ['GET', '/all', false],
        ['GET', '/:id', false],
        ['PUT', '/:id', true],
        ['DELETE', '/:id', true],
      ],
    },
    {
      base: '/api/quizzes',
      routes: [
        ['POST', '/', true],
        ['GET', '/', true],
        ['GET', '/course/:courseId', false],
        ['GET', '/:id', false],
        ['DELETE', '/:id', true],
      ],
    },
    {
      base: '/api/progress',
      routes: [
        ['POST', '/', true],
        ['GET', '/', true],
        ['GET', '/stats', true],
      ],
    },
  ] as Array<{ base: string; routes: Array<[HttpMethod, string, boolean]> }>,
  /** POST /api/courses with useAI — courseController.createCourse + utils/ai.js. */
  actors: ['Client', 'authMiddleware', 'courseController', 'Groq · Llama 3.3', 'Prisma → MongoDB'],
  sequence: [
    { from: 0, to: 1, label: 'POST /api/courses { topic, useAI }', note: 'Bearer token from login' },
    { from: 1, to: 2, label: 'jwt.verify → req.user.userId', note: '401 if missing or invalid' },
    { from: 2, to: 3, label: 'generateCourseContent(topic)', note: 'JSON mode · max_tokens 8000 · temperature 0.5' },
    { from: 3, to: 2, label: 'course JSON', note: 'parse + modules check; else a default course' },
    { from: 2, to: 4, label: 'course.create', note: 'content stored as JSON' },
    { from: 2, to: 4, label: 'quiz.create', note: 'chapter + final-assessment questions' },
    { from: 2, to: 0, label: '201 Created', note: 'the course, its quiz ready' },
  ],
  security: [
    'Passwords hashed with bcrypt (10 salt rounds).',
    'JWT signed at login with a 7-day expiry.',
    'Protected routes on both client (ProtectedRoute) and server (authMiddleware).',
    'Updates and deletes check the course belongs to the caller, else 401.',
  ],
  roleNote:
    'An earlier résumé said "role-based access control". The code has JWT auth and per-owner checks, but no roles, so this site says only what the code does.',
}

export const viewly = {
  id: 'viewly',
  no: '04',
  name: 'Viewly',
  kicker: 'The non-AI project',
  story: [
    { k: 'What it is', v: 'A movie discovery app built around the TMDB API.' },
    { k: 'How it works', v: ['Search. Discover. Watch trailers. Save a watchlist.'] },
    {
      k: 'Why I built it',
      v: [
        'No LLM. No agents. No vector database.',
        'Just a clean frontend, API integration, state management and persistence.',
      ],
    },
  ] as StoryRow[],
  techLine: ['React', 'TMDB API', 'Local storage', 'Routing', 'Netlify'],
  domain: 'Movie discovery',
  year: 'Jul 2025',
  oneLiner:
    'A movie discovery app on the TMDB API: trending and top-rated lists, search, official trailers, and a watchlist that survives a reload.',
  problem: 'Finding something to watch means hopping between lists, search results and trailers on different sites.',
  solution:
    'One React app: four TMDB lists on the home page, title search, a detail page with the official trailer, and a watchlist kept in localStorage.',
  challenge:
    'State and persistence without a backend. The watchlist lives in React state and is mirrored to localStorage on every change, so it is there after a reload.',
  outcome:
    'Deployed on Netlify with an SPA redirect rule, so deep links such as /movie/:id resolve. Built to practise real-world API integration and state management.',
  stack: ['React', 'Vite', 'React Router', 'TMDB API', 'YouTube embeds', 'localStorage', 'Netlify'],
  links: {
    github: 'https://github.com/sanath-2512/Viewly',
    demo: todo('Viewly Netlify URL'),
  } as ProjectLinks,
  /** src/App.jsx routes and the TMDB endpoints each view calls. */
  routes: [
    { path: '/', view: 'Home', data: 'trending/movie/day · movie/popular · movie/top_rated · movie/now_playing' },
    { path: '/search', view: 'Search', data: 'search/movie?query=' },
    { path: '/movie/:id', view: 'Details', data: 'movie/{id} · movie/{id}/videos' },
    { path: '/movie/:id/:key', view: 'Trailer', data: 'youtube.com/embed/{key}' },
    { path: '/watchlist', view: 'Watchlist', data: 'localStorage["watchlist"]' },
    { path: '/about', view: 'About', data: 'static' },
  ],
}

export const dva = {
  id: 'dva',
  no: '05',
  name: 'DVA',
  kicker: 'Data, before the AI',
  story: [
    { k: 'What it is', v: 'Two team dashboards exploring agricultural productivity and retail performance.' },
    { k: 'How it works', v: 'My role covered dashboard construction, presentation and quality review — plus the pivot calculations on the retail board.' },
    { k: 'What I learned', v: 'The project was a reminder that good systems start with understanding the data.' },
  ] as StoryRow[],
  domain: 'Data visualisation',
  year: '2026',
  oneLiner:
    'My Data Visualization & Analytics coursework: two team dashboards, and a React site that presents them.',
  context: 'Data Visualization & Analytics (DVA), Newton School of Technology — Section A group projects.',
  site: {
    stack: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    github: 'https://github.com/sanath-2512/Dva-Portofolio',
    demo: todo('DVA portfolio live URL') as Maybe<string>,
  },
  dashboards: [
    {
      id: 'crop',
      title: 'India Agricultural Productivity Intelligence',
      tool: 'Tableau',
      team: 'Group G-17 · 6 members',
      role: 'PPT & Quality Lead',
      mine: 'Built Dashboard 4, Crop Portfolio: the production-share treemap, the state yield ranking, and the fastest-growing crop by CAGR. Also the presentation deck and the quality review.',
      question:
        'Which states, districts and crops underperform on yield, and how did productivity move from 1997 to 2019?',
      scale: [
        { value: '345,336', label: 'rows × 8 columns' },
        { value: '1997–2019', label: '23 years' },
        { value: '707', label: 'districts' },
        { value: '37', label: 'states & UTs' },
      ],
      views: ['Executive Summary', 'Underperformance Analysis', 'Productivity Trends', 'Crop Portfolio'],
      image: 'dva-crop-portfolio',
      imageSize: [2122, 1568] as [number, number],
      /** Regions of the Crop Portfolio screenshot, as % of the image. */
      regions: [
        { label: 'Fastest-growing crop (CAGR)', tag: 'METRIC', x: 3, y: 9.8, w: 24.8, h: 16.4 },
        { label: 'Top yield state', tag: 'METRIC', x: 28.7, y: 9.8, w: 26, h: 16.4 },
        { label: 'Production-share treemap', tag: 'CHART', x: 3.6, y: 35, w: 46.3, h: 60 },
        { label: 'State yield rank (T/Ha)', tag: 'CHART', x: 51.4, y: 29.7, w: 42.5, h: 65.3 },
      ],
      live: 'https://public.tableau.com/app/profile/pushpendra.parihar/viz/Group17_SectionA_Dashboard_Final/1ExecutiveSummary',
      repo: 'https://github.com/r0hansng/SectionA_G17_IndiaAgriProductivity',
      source: 'g17' as SourceKey,
    },
    {
      id: 'retail',
      title: 'Retail Performance Intelligence',
      tool: 'Google Sheets',
      team: 'Group G10 · 6 members',
      role: 'Pivot calculations',
      mine: 'Pivot calculations behind the sales and outlet views.',
      question: 'Where do Big Mart sales concentrate, by item type, outlet type and location tier?',
      scale: [{ value: '8,522', label: 'sales records' }],
      views: ['Sales by item type', 'Sales by outlet type', 'Revenue by location tier', 'Revenue by fat content'],
      image: 'dva-retail',
      imageSize: [2022, 1832] as [number, number],
      regions: [],
      live: null,
      repo: 'https://github.com/sanath-2512/SecA-G10',
      source: 'g10' as SourceKey,
    },
  ],
}

/** Work order, as listed in the index. */
export const projectOrder = [worthyApply, eduAI, agriMind, viewly, dva] as const

/* ------------------------------------------------------------------ */
/* §05 How I build                                                    */
/* ------------------------------------------------------------------ */

export const processStages = [
  { id: 'Understand', prompt: ['What problem are we actually solving?'] },
  { id: 'Structure', prompt: ['What should be deterministic?', 'What actually needs a model?'] },
  { id: 'Build', prompt: ['APIs · retrieval · agents · interfaces'] },
  { id: 'Break', prompt: ['Bad inputs.', 'Timeouts.', 'Malformed output.', 'Hallucinations.'] },
  { id: 'Measure', prompt: ['Tests.', 'Benchmarks.', 'Grounding.', 'Latency.'] },
  { id: 'Ship', prompt: ['Deploy it.', 'Observe it.', 'Improve it.'] },
] as const
export type ProcessStage = (typeof processStages)[number]['id']

/** How each project moved through the process. Stages a project didn't have stay empty. */
export const processTabs: Array<{ id: string; label: string; steps: Partial<Record<ProcessStage, string>> }> = [
  {
    id: 'worthyapply',
    label: 'WorthyApply',
    steps: {
      Understand: 'AI resume tailoring quietly invents experience to match a job.',
      Structure: 'The model classifies requirements; Python owns the score; tailoring is a patch, not a rewrite.',
      Build: 'FastAPI + SSE backend, a five-provider router, Next.js frontend.',
      Break: 'Provider timeouts, invalid structured output, fixed adversarial model outputs.',
      Measure: '49 pytest tests and an offline grounding benchmark.',
      Ship: 'FastAPI on Render, Next.js on Vercel.',
    },
  },
  {
    id: 'eduai',
    label: 'EduAI',
    steps: {
      Understand: 'A topic, but no structured path through it.',
      Structure: 'The model writes the course; the API validates its shape and owns auth and ownership.',
      Build: 'Express REST API (19 endpoints), Prisma on MongoDB, React.',
      Break: 'Malformed or module-less JSON falls back to a default course.',
      Ship: 'React on Vercel, Express on Render.',
    },
  },
  {
    id: 'agrimind',
    label: 'AgriMind',
    steps: {
      Understand: 'Advice needs numbers and knowledge.',
      Structure: 'A model predicts; retrieval is conditioned on that prediction; an LLM reasons over both.',
      Build: 'A four-node LangGraph, ChromaDB, FastAPI, React.',
      Break: 'Node errors are written to state; the report is normalised even when the JSON is incomplete.',
      Measure: 'Consistency across structured and unstructured sources; relevance and reliability.',
      Ship: 'FastAPI on Render, React frontend.',
    },
  },
  {
    id: 'fusion',
    label: 'Fusion Cards',
    steps: {
      Understand: 'Retrieval across shared documents from 18+ banks.',
      Structure: 'Analysed the production scraper → extractor → chunking pipeline and proposed changes.',
      Build: 'Improved chunking for MITCs, T&Cs and fee schedules.',
    },
  },
]

/* ------------------------------------------------------------------ */
/* §06 Stack                                                          */
/* ------------------------------------------------------------------ */

export type ProjectTag = 'WorthyApply' | 'EduAI' | 'AgriMind' | 'Viewly' | 'DVA' | 'Fusion Cards' | 'This site'
export const projectTags: ProjectTag[] = ['WorthyApply', 'EduAI', 'AgriMind', 'Viewly', 'DVA', 'Fusion Cards', 'This site']

export interface Tool {
  name: string
  /** One line: what it did in the work. */
  use: string
  projects: ProjectTag[]
  /** Revealed on hover / focus / tap: where exactly, in the real code. */
  details: string[]
}

/** Four groups, not a logo wall. Every tool points at the projects that used it. */
export const toolkit: Array<{ id: string; label: string; tools: Tool[] }> = [
  {
    id: 'build',
    label: 'Build',
    tools: [
      { name: 'Python', use: 'Backends, pipelines, the fact-check', projects: ['WorthyApply', 'AgriMind', 'Fusion Cards'], details: ['FastAPI services', 'Deterministic scoring and claim checks', 'The LangGraph agent', 'Document pipelines'] },
      { name: 'TypeScript', use: 'Typed frontends', projects: ['WorthyApply', 'This site'], details: ['WorthyApply’s Next.js app', 'This site'] },
      { name: 'JavaScript', use: 'Express APIs and React apps', projects: ['EduAI', 'Viewly', 'DVA'], details: ['EduAI’s Express backend', 'Viewly and the DVA site'] },
      { name: 'FastAPI', use: 'Analysis and advisory services', projects: ['WorthyApply', 'AgriMind'], details: ['REST + SSE endpoints for analyze, extract, tailor', 'AgriMind’s /predict backend'] },
      { name: 'Next.js', use: 'App frontend', projects: ['WorthyApply'], details: ['Workspace, results and the resume builder'] },
      { name: 'React', use: 'Every interface here', projects: ['EduAI', 'AgriMind', 'Viewly', 'DVA', 'This site'], details: ['Five apps, including this one'] },
      { name: 'Node.js', use: 'API runtime', projects: ['EduAI'], details: ['EduAI’s backend on Render'] },
      { name: 'Express', use: '19-endpoint REST API', projects: ['EduAI'], details: ['Auth, courses, quizzes, progress', 'JWT middleware on 13 routes'] },
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    tools: [
      { name: 'LLMs', use: 'Analysis, reasoning, course generation', projects: ['WorthyApply', 'EduAI', 'AgriMind', 'Fusion Cards'], details: ['Structured analysis and tailoring', 'Whole-course JSON (Llama 3.3 70B)', 'Reasoning over prediction + passages', 'Retrieval answers on Bedrock'] },
      { name: 'RAG', use: 'Retrieval over real documents', projects: ['Fusion Cards', 'AgriMind'], details: ['Credit-card documents from 18+ banks', 'Agronomy passages, top 4'] },
      { name: 'LangChain', use: 'Provider adapters', projects: ['WorthyApply'], details: ['Adapters under the custom five-provider router'] },
      { name: 'LangGraph', use: 'Multi-step agent state', projects: ['AgriMind'], details: ['predict → retrieve → reason → report'] },
      { name: 'Machine Learning', use: 'Prediction', projects: ['AgriMind'], details: ['Crop-yield regression on farm inputs'] },
      { name: 'scikit-learn', use: 'Yield model', projects: ['AgriMind'], details: ['LinearRegression + StandardScaler'] },
      { name: 'Embeddings', use: 'Semantic search', projects: ['AgriMind'], details: ['all-MiniLM-L6-v2 in ChromaDB'] },
      { name: 'Prompt Engineering', use: 'Structured-output prompts', projects: ['WorthyApply', 'EduAI', 'Fusion Cards'], details: ['One combined analysis prompt', 'A course schema the API can check', 'Document-pipeline prompts'] },
    ],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    tools: [
      { name: 'AWS Bedrock', use: 'Model access', projects: ['Fusion Cards'], details: ['Enterprise document pipelines'] },
      { name: 'S3', use: 'Document storage', projects: ['Fusion Cards'], details: ['Bank documents for the retrieval system'] },
      { name: 'OpenSearch', use: 'Retrieval index', projects: ['Fusion Cards'], details: ['The index the RAG system retrieves from'] },
      { name: 'MongoDB', use: 'App data', projects: ['EduAI'], details: ['User, Course, Quiz, Progress via Prisma'] },
      { name: 'ChromaDB', use: 'Knowledge store', projects: ['AgriMind'], details: ['Agronomy collection for retrieval'] },
      { name: 'Render', use: 'Backends', projects: ['WorthyApply', 'AgriMind', 'EduAI'], details: ['Three production backends'] },
      { name: 'Vercel', use: 'Frontends', projects: ['WorthyApply', 'AgriMind', 'EduAI'], details: ['Three production frontends'] },
    ],
  },
  {
    id: 'quality',
    label: 'Quality',
    tools: [
      { name: 'Pydantic', use: 'Typed structured output', projects: ['WorthyApply'], details: ['JobAnalysis · MatchAnalysis · ResumeOptimization'] },
      { name: 'Pytest', use: '49 tests', projects: ['WorthyApply'], details: ['→ grounding', '→ provider failover', '→ scoring', '→ structured output'] },
      { name: 'Structured outputs', use: 'Contracts, not prose', projects: ['WorthyApply', 'EduAI', 'AgriMind'], details: ['One typed analysis object', 'Course JSON in JSON mode', 'JSON-mode advisory report'] },
      { name: 'Deterministic validation', use: 'Code decides, not the model', projects: ['WorthyApply', 'AgriMind'], details: ['Score computed in Python', 'Claim-level fact-check', 'Report normalised to one schema'] },
      { name: 'SSE', use: 'Streaming', projects: ['WorthyApply'], details: ['/api/analyze/stream · /api/tailor-resume/stream'] },
    ],
  },
]

/** Also on the résumé or in this site's build, without a story of their own here. */
export const toolkitAlso = ['SQL', 'HTML/CSS', 'Prisma ORM', 'MySQL', 'Git & GitHub', 'Hugging Face', 'Tailwind CSS', 'Three.js', 'GSAP', 'Vite']

/* ------------------------------------------------------------------ */
/* §07 Signals                                                        */
/* ------------------------------------------------------------------ */

export const signals: Array<{
  year: Maybe<string>
  what: string
  detail: string
  tag: 'ORG' | 'METRIC' | 'SYSTEM'
  links?: Array<{ label: string; href: string }>
  note?: Todo
}> = [
  { year: '2025', what: 'GirlScript Summer of Code', detail: 'Open-source contribution', tag: 'ORG', note: todo('Links to GSSoC 2025 contributions') },
  { year: '2026', what: 'GirlScript Summer of Code', detail: 'Open-source contribution', tag: 'ORG', note: todo('Links to GSSoC 2026 contributions') },
  { year: '2026', what: 'Thapar Institute Tech Fest', detail: 'Built two working projects under time constraints', tag: 'ORG' },
  {
    year: 'ongoing',
    what: 'Competitive programming',
    detail: 'LeetCode · CodeChef · Codeforces',
    tag: 'SYSTEM',
    // Confirmed by the hyperlinks in the repo's own résumé PDF (AUDIT.md §5).
    links: [
      { label: 'LeetCode', href: 'https://leetcode.com/u/LvqtSP4dgr/' },
      { label: 'CodeChef', href: 'https://www.codechef.com/users/colony_dice_69' },
      { label: 'Codeforces', href: 'https://codeforces.com/profile/sanath25' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* §08 Contact                                                        */
/* ------------------------------------------------------------------ */

export const contact = {
  /** Two lines; the last word carries the emphasis. */
  headline: ['Got a problem', 'worth building?'],
  body: [
    "I'm interested in backend, applied AI and ML systems — especially problems where the engineering is as interesting as the model.",
    "If there's something worth building, send it over.",
  ],
}

/* ------------------------------------------------------------------ */
/* Build metadata (injected by vite.config.ts)                         */
/* ------------------------------------------------------------------ */

export const build = {
  sha: __BUILD_SHA__,
  date: __BUILD_DATE__,
}

export const siteMeta = {
  title: `${profile.name} — Backend × Applied AI`,
  description:
    'Sanath Waraikar builds systems around models — not just calls to them: retrieval, agentic workflows, failover and evaluation.',
}
