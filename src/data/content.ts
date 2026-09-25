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
} satisfies Record<string, Source>

export type SourceKey = keyof typeof sources

/* ------------------------------------------------------------------ */
/* Profile                                                            */
/* ------------------------------------------------------------------ */

export const profile = {
  name: 'Sanath Waraikar',
  first: 'Sanath',
  last: 'Waraikar',
  role: 'Backend and AI engineer',
  eyebrow: 'Backend + AI engineer · B.Tech (AI) 2024–28',
  /** One word per heading carries the emphasis. */
  positioning: {
    lead: 'I build AI systems that stay ',
    emphasis: 'grounded',
    tail: ', stay up, and get tested.',
  },
  supporting:
    'RAG over documents from 18+ banks, agentic pipelines with LangGraph, and FastAPI backends that fail over across five LLM providers.',
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
  { id: 'top', index: '01', label: 'Overview', cal: 0 },
  { id: 'about', index: '02', label: 'About', cal: 0.2 },
  { id: 'experience', index: '03', label: 'Experience', cal: 0.35 },
  { id: 'work', index: '04', label: 'Work', cal: 0.55, calEnd: 0.8 },
  { id: 'process', index: '05', label: 'How I build', cal: 0.84 },
  { id: 'stack', index: '06', label: 'Stack', cal: 0.9 },
  { id: 'signals', index: '07', label: 'Signals', cal: 0.95 },
  { id: 'contact', index: '08', label: 'Contact', cal: 1 },
]

export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
]

/* ------------------------------------------------------------------ */
/* §02 About                                                          */
/* ------------------------------------------------------------------ */

export type Segment = string | { term: string; tag: 'TOOL' | 'SYSTEM' | 'ORG' | 'METRIC' }

export const about = {
  title: 'Reading me',
  /** Sentences are split into words for the scrub; terms get a DETECT box. */
  statement: [
    "I'm a B.Tech (Artificial Intelligence) student at Newton School of Technology, Rishihood University.",
    [
      'I build Python backends and applied ML: ',
      { term: 'FastAPI', tag: 'TOOL' },
      ' services and REST APIs that put ',
      { term: 'LLMs', tag: 'TOOL' },
      ' to work.',
    ],
    [
      'That has meant ',
      { term: 'RAG', tag: 'SYSTEM' },
      ' on ',
      { term: 'AWS Bedrock', tag: 'TOOL' },
      ' during my internship, and ',
      { term: 'LangGraph', tag: 'TOOL' },
      ' agents in my projects.',
    ],
    "Right now I'm going deeper into deep learning and advanced ML.",
  ] as Array<string | Segment[]>,
  spec: [
    { key: 'Focus', value: 'Backend + applied AI' as Maybe<string> },
    { key: 'Core', value: 'Python · FastAPI · LLMs · RAG' as Maybe<string> },
    { key: 'Now', value: 'B.Tech (AI), 2024–28 · deep learning & advanced ML' as Maybe<string> },
    { key: 'Off-screen', value: 'Inter-college badminton & cricket' as Maybe<string> },
    { key: 'Based', value: todo('Location — not on the résumé') as Maybe<string> },
  ],
  tags: ['Backend', 'AI/ML', 'LLMs', 'RAG', 'Agents', 'AWS'],
}

/* ------------------------------------------------------------------ */
/* §03 Experience                                                     */
/* ------------------------------------------------------------------ */

export const experience = {
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

export const worthyApply = {
  id: 'worthyapply',
  no: '01',
  name: 'WorthyApply',
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
  no: '02',
  name: 'AgriMind',
  domain: 'Farm advisory',
  year: 'Mar 2026',
  oneLiner: 'An agentic farm-advisory system that combines crop-yield prediction with LLM retrieval.',
  problem:
    'Farm advice needs both numbers and knowledge: a yield estimate for this farm, and the agronomy that explains what to do about it.',
  solution:
    'A LangGraph agent carries one shared state through four steps: predict yield from structured farm data, retrieve agronomy passages, reason over both, and write a structured report.',
  challenge:
    'Keeping the answer consistent across a structured model and unstructured retrieval, and checking outputs for relevance and reliability.',
  outcome: 'A full pipeline: FastAPI backend on Render, React frontend.',
  stack: ['Python', 'LangGraph', 'FastAPI', 'ChromaDB', 'scikit-learn', 'React', 'Render'],
  links: {
    github: AGRI_REPO,
    demo: 'https://agrimind-five.vercel.app/',
  } as ProjectLinks,
  githubNote: todo('Confirm the canonical AgriMind repo (Agrim-2007/AgriMind vs sanath-2512/cropyeild_ml)'),
  /** Real graph: START → predict → retrieve → reason → report → END. */
  graph: [
    { id: 'predict', label: 'predict', stream: 'structured', detail: 'scikit-learn yield model on the farm inputs' },
    { id: 'retrieve', label: 'retrieve', stream: 'unstructured', detail: 'ChromaDB agronomy passages' },
    { id: 'reason', label: 'reason', stream: 'merge', detail: 'LLM reasons over prediction + passages' },
    { id: 'report', label: 'report', stream: 'out', detail: 'Structured advisory report' },
  ] as Array<{ id: string; label: string; stream: 'structured' | 'unstructured' | 'merge' | 'out'; detail: string }>,
  trace: ['01 PREDICT', '02 RETRIEVE', '03 REASON', '04 REPORT'],
}

export const archive = [
  {
    id: 'eduai',
    no: '03',
    name: 'EduAI',
    domain: 'Learning platform',
    year: 'Nov 2025',
    oneLiner: 'A learning platform that generates explanations and quizzes behind a JWT-authenticated, role-based REST API.',
    stack: ['React', 'REST APIs', 'JWT', 'AI APIs'],
    links: {
      github: 'https://github.com/sanath-2512/EduAI.',
      demo: 'https://edu-ai-rho-hazel.vercel.app/',
    } as ProjectLinks,
  },
]

/* ------------------------------------------------------------------ */
/* §05 How I build                                                    */
/* ------------------------------------------------------------------ */

export const processStages = [
  'Problem',
  'Research',
  'Architecture',
  'Implementation',
  'Evaluation',
  'Optimization',
  'Deployment',
] as const
export type ProcessStage = (typeof processStages)[number]

/** Stages with no real content are omitted, not padded. */
export const processTabs: Array<{ id: string; label: string; steps: Partial<Record<ProcessStage, string>> }> = [
  {
    id: 'worthyapply',
    label: 'WorthyApply',
    steps: {
      Problem: 'Tailoring models fabricate claims.',
      Architecture: 'One structured analysis call, SSE streaming, failover across 5 providers.',
      Implementation: 'Deterministic scoring in Python; tailoring as a patch; claim-level fact-check.',
      Evaluation: '49 pytest tests, plus an offline adversarial benchmark for the fact-check.',
      Deployment: 'FastAPI on Render, Next.js on Vercel.',
    },
  },
  {
    id: 'agrimind',
    label: 'AgriMind',
    steps: {
      Problem: 'Advice needs numbers and knowledge.',
      Architecture: 'LangGraph state carries a yield prediction and retrieved passages into one reasoning step.',
      Evaluation: 'Response consistency across structured and unstructured sources; relevance and reliability.',
      Deployment: 'FastAPI on Render, React frontend.',
    },
  },
  {
    id: 'fusion',
    label: 'Fusion Cards',
    steps: {
      Problem: 'Retrieval across shared documents from 18+ banks.',
      Research: 'Analyzed the production data pipelines.',
      Architecture: 'Proposed changes to the scraper, extractor and chunking workflows.',
      Implementation: 'Improved chunking for MITC, T&Cs and fee schedules.',
    },
  },
]

/* ------------------------------------------------------------------ */
/* §06 Stack                                                          */
/* ------------------------------------------------------------------ */

export type ProjectTag = 'WorthyApply' | 'AgriMind' | 'Fusion Cards' | 'This site'
export const projectTags: ProjectTag[] = ['WorthyApply', 'AgriMind', 'Fusion Cards', 'This site']

export interface Tool {
  name: string
  use?: string
  projects: ProjectTag[]
}

/** Appendix A categories. Tools with no project go under "also worked with". */
export const stack: Array<{ id: string; label: string; tools: Tool[] }> = [
  {
    id: 'languages',
    label: 'Languages',
    tools: [
      { name: 'Python', use: 'Backends, pipelines, the fact-check', projects: ['WorthyApply', 'AgriMind', 'Fusion Cards'] },
      { name: 'TypeScript', use: 'Typed frontends', projects: ['WorthyApply', 'This site'] },
      { name: 'HTML/CSS', use: 'Tokens, layout, both themes', projects: ['This site'] },
      { name: 'JavaScript', projects: [] },
      { name: 'SQL', projects: [] },
    ],
  },
  {
    id: 'backend',
    label: 'Backend & APIs',
    tools: [
      { name: 'FastAPI', use: 'Analysis and advisory services', projects: ['WorthyApply', 'AgriMind'] },
      { name: 'REST APIs', use: 'Analyze, extract and tailor endpoints', projects: ['WorthyApply'] },
      { name: 'Server-Sent Events', use: 'Streaming progress and tokens', projects: ['WorthyApply'] },
      { name: 'Pydantic', use: 'Typed structured output', projects: ['WorthyApply'] },
      { name: 'Pytest', use: '49 tests', projects: ['WorthyApply'] },
      { name: 'Node.js', projects: [] },
      { name: 'Express.js', projects: [] },
      { name: 'Prisma ORM', projects: [] },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud & DevOps',
    tools: [
      { name: 'AWS Bedrock', use: 'Model access in document pipelines', projects: ['Fusion Cards'] },
      { name: 'Amazon S3', use: 'Document storage', projects: ['Fusion Cards'] },
      { name: 'Render', use: 'Python backends', projects: ['WorthyApply', 'AgriMind'] },
      { name: 'Vercel', use: 'Next.js frontend', projects: ['WorthyApply'] },
      { name: 'Git & GitHub', projects: [] },
    ],
  },
  {
    id: 'databases',
    label: 'Databases',
    tools: [
      { name: 'OpenSearch', use: 'Retrieval index', projects: ['Fusion Cards'] },
      { name: 'ChromaDB', use: 'Agronomy knowledge store', projects: ['AgriMind'] },
      { name: 'MySQL', projects: [] },
      { name: 'MongoDB', projects: [] },
    ],
  },
  {
    id: 'ai',
    label: 'AI / ML',
    tools: [
      { name: 'LLMs', use: 'Structured analysis, reasoning, answers', projects: ['WorthyApply', 'AgriMind', 'Fusion Cards'] },
      { name: 'RAG', use: 'Retrieval over bank documents and agronomy', projects: ['AgriMind', 'Fusion Cards'] },
      { name: 'LangChain', use: 'Provider adapters under the router', projects: ['WorthyApply'] },
      { name: 'LangGraph', use: 'Multi-step agent state', projects: ['AgriMind'] },
      { name: 'Prompt Engineering', use: 'Document-pipeline prompts', projects: ['Fusion Cards'] },
      { name: 'scikit-learn', use: 'Crop-yield model', projects: ['AgriMind'] },
      { name: 'Vector Embeddings', projects: [] },
      { name: 'Hugging Face', projects: [] },
      { name: 'Machine Learning', projects: [] },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    tools: [
      { name: 'React', use: 'Interfaces', projects: ['AgriMind', 'This site'] },
      { name: 'Next.js', use: 'App frontend', projects: ['WorthyApply'] },
      { name: 'Tailwind CSS', use: 'Utility layer over the tokens', projects: ['This site'] },
      { name: 'Three.js', use: 'The calibration field', projects: ['This site'] },
      { name: 'GSAP', use: 'Scroll choreography', projects: ['This site'] },
      { name: 'Lenis', use: 'Smooth scroll', projects: ['This site'] },
      { name: 'Vite', use: 'Build', projects: ['This site'] },
    ],
  },
]

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
  { year: '2025', what: 'GirlScript Summer of Code', detail: 'Open-source contributor', tag: 'ORG', note: todo('Links to GSSoC 2025 contributions') },
  { year: '2026', what: 'GirlScript Summer of Code', detail: 'Open-source contributor', tag: 'ORG', note: todo('Links to GSSoC 2026 contributions') },
  { year: '2026', what: 'Thapar Institute Tech Fest', detail: 'Built two working projects under time constraints', tag: 'ORG' },
  { year: todo('Buildspace hackathon year'), what: 'Buildspace hackathon', detail: 'Top 7 finish', tag: 'METRIC' },
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
  headline: "Let's build something useful.",
}

/* ------------------------------------------------------------------ */
/* Build metadata (injected by vite.config.ts)                         */
/* ------------------------------------------------------------------ */

export const build = {
  sha: __BUILD_SHA__,
  date: __BUILD_DATE__,
}

export const siteMeta = {
  title: `${profile.name} — Backend + AI engineer`,
  description:
    'Sanath Waraikar builds LLM systems that stay grounded: RAG over real documents, agentic pipelines, and resilient FastAPI backends.',
}
