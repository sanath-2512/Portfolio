/**
 * Single source of truth for every fact rendered on this site.
 * Components read from here — nothing is hardcoded in a section.
 *
 * Rule: a value only lives here if it can be traced to the resume in
 * /public, to shipped work, or to the brief. Unknown URLs are `null`
 * with a TODO, never guessed — `null` renders the link disabled.
 */

export type ExternalLink = string | null

export interface Profile {
  name: string
  shortName: string
  role: string
  statement: string
  email: string
  links: {
    github: string
    linkedin: string
    resume: string
  }
}

export const profile: Profile = {
  name: 'Sanath Waraikar',
  shortName: 'Sanath',
  role: 'AI Engineer & Full-Stack Developer',
  statement:
    'I build LLM and RAG systems, backend services, and the full-stack products they ship inside.',
  email: 'sanath.waraikar2024@nst.rishihood.edu.in',
  links: {
    github: 'https://github.com/sanath-2512',
    linkedin: 'https://www.linkedin.com/in/sanath-waraikar-4ba35b308/',
    resume: '/resume-sanath-waraikar.pdf',
  },
}

/* ------------------------------------------------------------------ */
/* About                                                              */
/* ------------------------------------------------------------------ */

export interface AboutStatement {
  index: string
  headline: string
  detail: string
}

export const about: AboutStatement[] = [
  {
    index: '01',
    headline: 'I turn ideas into working products.',
    detail: 'Shipped, deployed, and used — not demos that only run on my machine.',
  },
  {
    index: '02',
    headline: 'I work across AI, backend and full-stack.',
    detail: 'Retrieval pipelines, FastAPI services, and the React front ends on top of them.',
  },
  {
    index: '03',
    headline: 'I have built practical AI systems, and contributed to enterprise AI work in production.',
    detail: 'WorthyApply and AgriMind on my own; document-processing pipelines during my internship at Fusion Cards.',
  },
  {
    index: '04',
    headline: 'I care about engineering decisions, not just calling APIs.',
    detail: 'Where the model call sits, what it returns, and what the system does with it once it has.',
  },
]

/* ------------------------------------------------------------------ */
/* Stack                                                              */
/* ------------------------------------------------------------------ */

export interface Tech {
  name: string
  /** One line on where this was actually used. Omitted when nothing supports it. */
  usage?: string
}

export interface StackGroup {
  id: string
  label: string
  items: Tech[]
}

export const stack: StackGroup[] = [
  {
    id: 'ai',
    label: 'AI / ML',
    items: [
      { name: 'LLMs', usage: 'Structured analysis behind WorthyApply job–resume matching.' },
      { name: 'Generative AI' },
      { name: 'RAG', usage: 'Knowledge retrieval over credit-card documents across 18+ banks.' },
      { name: 'LangGraph', usage: 'Orchestrates the multi-step agent flow in AgriMind.' },
      { name: 'Vector Embeddings', usage: 'Retrieval index for the internship document pipeline.' },
      { name: 'Machine Learning', usage: 'Crop-yield prediction in AgriMind.' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    items: [
      { name: 'Python', usage: 'Primary language for the internship document pipelines.' },
      { name: 'FastAPI', usage: 'Backend for WorthyApply and AgriMind.' },
      { name: 'Node.js' },
      { name: 'Express.js' },
      { name: 'REST APIs', usage: 'Content, auth and progress-tracking endpoints in EduAI.' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    items: [
      { name: 'React', usage: 'Interfaces for EduAI and AgriMind.' },
      { name: 'JavaScript' },
      { name: 'Tailwind CSS', usage: 'Design tokens and layout for this site.' },
      { name: 'Three.js', usage: 'The node-and-edge scene running behind this page.' },
      { name: 'GSAP', usage: 'Scroll choreography across this page.' },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud / Infra',
    items: [
      { name: 'AWS', usage: 'Platform for the enterprise document-processing pipelines.' },
      { name: 'Amazon Bedrock', usage: 'Model access in the internship document-processing pipeline.' },
      { name: 'Amazon S3', usage: 'Document storage for the ingestion pipeline.' },
      { name: 'OpenSearch', usage: 'Retrieval index for the bank-document RAG system.' },
      { name: 'Git' },
      { name: 'GitHub' },
    ],
  },
  {
    id: 'data',
    label: 'Databases',
    items: [{ name: 'MySQL' }],
  },
]

/* ------------------------------------------------------------------ */
/* Experience                                                         */
/* ------------------------------------------------------------------ */

export interface Experience {
  company: string
  role: string
  period: string
  summary: string
  work: string[]
  tech: string[]
  impact: { value: string; label: string }
}

export const experience: Experience = {
  company: 'Fusion Cards',
  role: 'AI Software Engineer Intern',
  period: 'June 2026 — Present',
  summary:
    'Enterprise document processing: getting bank documents into a form a retrieval system can answer from.',
  work: [
    'Contributed to enterprise AI document-processing pipelines using AWS Bedrock, OpenSearch and Amazon S3.',
    'Worked on a RAG-based knowledge retrieval system for credit-card documents across 18+ banks.',
    'Improved document chunking strategies for shared bank-wide documents (MITC, Terms & Conditions, fee schedules).',
    'Analyzed production data pipelines and proposed architectural improvements for scraper, extractor and chunking workflows.',
  ],
  tech: ['Python', 'AWS Bedrock', 'Amazon S3', 'OpenSearch', 'RAG', 'LLMs', 'Prompt Engineering'],
  impact: { value: '18+', label: 'banks covered by the retrieval system' },
}

/* ------------------------------------------------------------------ */
/* WorthyApply — flagship case study                                  */
/* ------------------------------------------------------------------ */

export interface PipelineStage {
  id: string
  label: string
  note: string
}

export interface ArchitectureNode {
  id: string
  label: string
  description: string
}

export const worthyApply = {
  name: 'WorthyApply',
  kind: 'AI-Powered Job Application & Resume Optimization Platform',
  status: 'Shipped',
  summary:
    'Analyzes a job description against a resume, identifies requirement gaps, and generates structured recommendations to improve alignment.',

  problem: {
    title: 'Problem',
    body: 'A job description and a resume describe the same role in different vocabulary. Working out what is genuinely missing means reading both closely, and the answer changes with every posting. Done by hand it is slow; done by a model that just returns a number, it is not repeatable.',
  },
  solution: {
    title: 'Solution',
    body: 'One pipeline reads both documents, extracts requirements and evidence as structured data, and scores the match from that structure rather than from a model opinion. The output is a gap list and a set of concrete edits — plus an ATS-friendly resume built from them.',
  },

  pipeline: [
    { id: 'input', label: 'Resume / JD', note: 'Uploaded resume and the target job description enter the pipeline.' },
    { id: 'extraction', label: 'Extraction', note: 'Both documents are parsed into structured fields — PDF resumes included.' },
    { id: 'job-analysis', label: 'Job Analysis', note: 'Requirements, responsibilities and skills are pulled out of the posting.' },
    { id: 'resume-analysis', label: 'Resume Analysis', note: 'Experience and skill evidence is pulled out of the resume.' },
    { id: 'match', label: 'Match Analysis', note: 'Requirements are matched against evidence; unmatched requirements become gaps.' },
    { id: 'optimization', label: 'Optimization', note: 'Gaps become structured, specific recommendations rather than generic advice.' },
    { id: 'output', label: 'Tailored Resume', note: 'An ATS-friendly resume generated from the accepted recommendations.' },
  ] satisfies PipelineStage[],

  performance: {
    before: { label: '3 sequential analysis calls', seconds: 16.07, bars: 3 },
    after: { label: '1 combined analysis pipeline', seconds: 5.89, bars: 1 },
    reduction: 63.3,
    note: 'Average latency, measured before and after collapsing three sequential analysis calls into a single combined pipeline.',
  },

  deterministic: {
    title: 'Deterministic scoring',
    body: 'The final assessment is computed deterministically from structured evidence extracted by the LLM, instead of trusting an LLM-generated score.',
    steps: [
      { id: 'llm', label: 'LLM', note: 'Reads both documents.' },
      { id: 'evidence', label: 'Structured evidence', note: 'Requirements and matching evidence, as data.' },
      { id: 'score', label: 'Deterministic score', note: 'Computed from that data — same input, same result.' },
    ],
  },

  architecture: [
    { id: 'frontend', label: 'Frontend', description: 'Upload, review the gap list, accept recommendations, export the resume.' },
    { id: 'fastapi', label: 'FastAPI', description: 'Request handling and orchestration for the analysis pipeline.' },
    { id: 'pipeline', label: 'Analysis Pipeline', description: 'One combined pass over the job description and the resume.' },
    { id: 'llm', label: 'LLM / Structured Output', description: 'The model returns structured fields, not prose or a score.' },
    { id: 'scoring', label: 'Deterministic Scoring', description: 'The assessment is computed from that structure, so it is repeatable.' },
    { id: 'optimization', label: 'Optimization', description: 'Gaps are turned into specific, reviewable resume edits.' },
    { id: 'resume', label: 'Resume Output', description: 'An ATS-friendly resume generated from the accepted edits.' },
  ] satisfies ArchitectureNode[],

  features: [
    'Resume Builder',
    'PDF Resume Import',
    'Resume Extraction',
    'Job Description Analysis',
    'Resume Analysis',
    'Job ↔ Resume Matching',
    'Requirement / Skill Gap Analysis',
    'Resume Optimization',
    'Tailor Resume workflow',
    'ATS-friendly resume generation',
    'Structured AI analysis',
  ],

  stack: ['FastAPI', 'Python', 'LLMs', 'Structured Output'],

  // TODO: add WorthyApply GitHub URL
  github: null as ExternalLink,
  // TODO: add WorthyApply live demo URL
  demo: null as ExternalLink,
}

/* ------------------------------------------------------------------ */
/* Other projects                                                     */
/* ------------------------------------------------------------------ */

export interface Project {
  id: string
  name: string
  kind: string
  description: string
  stack: string[]
  highlights: string[]
  github: ExternalLink
  demo: ExternalLink
}

export const projects: Project[] = [
  {
    id: 'agrimind',
    name: 'AgriMind',
    kind: 'Agentic Farm Advisory System',
    description:
      'An agentic RAG system that answers farm questions from retrieved agronomic knowledge and a crop-yield prediction model.',
    stack: ['LangGraph', 'RAG', 'Machine Learning', 'FastAPI', 'React', 'Python'],
    highlights: [
      'LangGraph orchestrates retrieval, relevance evaluation and answering as distinct steps.',
      'Retrieved passages are evaluated for relevance before they reach the answer.',
      'A crop-yield prediction model runs alongside knowledge retrieval, not instead of it.',
    ],
    // TODO: verify AgriMind GitHub URL — the resume PDF in /public points at
    // github.com/Agrim-2007/GENAI-capstone instead of this repo.
    github: 'https://github.com/sanath-2512/cropyeild_ml',
    demo: 'https://agrimind-five.vercel.app/',
  },
  {
    id: 'eduai',
    name: 'EduAI',
    kind: 'AI-Powered Learning Platform',
    description:
      'A learning platform that generates explanations and quizzes, behind an authenticated, role-aware API.',
    stack: ['React', 'REST APIs', 'LLMs'],
    highlights: [
      'AI-generated explanations and automated quiz generation.',
      'JWT authentication with role-based access control.',
      'REST APIs for content, auth and progress tracking.',
    ],
    // TODO: verify the EduAI GitHub URL — the trailing dot comes from the
    // previous site and the resume PDF, and may not resolve.
    github: 'https://github.com/sanath-2512/EduAI.',
    demo: 'https://edu-ai-rho-hazel.vercel.app',
  },
]

/* ------------------------------------------------------------------ */
/* Agent flow illustration — AgriMind                                 */
/* ------------------------------------------------------------------ */

export const agentFlow = [
  { id: 'retrieve', label: 'Retrieve' },
  { id: 'evaluate', label: 'Evaluate relevance' },
  { id: 'answer', label: 'Answer / predict' },
]

/* ------------------------------------------------------------------ */
/* How I build                                                        */
/* ------------------------------------------------------------------ */

export interface BuildStep {
  index: string
  title: string
  body: string
  example: string
}

export const howIBuild: BuildStep[] = [
  {
    index: '01',
    title: 'Understand',
    body: 'Read the system that already exists before proposing anything for it.',
    example:
      'Analyzed production data pipelines at Fusion Cards and proposed architectural improvements for the scraper, extractor and chunking workflows.',
  },
  {
    index: '02',
    title: 'Design',
    body: 'Decide where the model sits, and what the system — not the model — is responsible for.',
    example:
      'WorthyApply computes its final assessment deterministically from structured evidence, instead of trusting an LLM-generated score.',
  },
  {
    index: '03',
    title: 'Build',
    body: 'Get it working end to end, then fix the part that actually limits quality.',
    example:
      'Improved document chunking strategies for shared bank-wide documents — MITC, Terms & Conditions, fee schedules — so retrieval had the right units to work with.',
  },
  {
    index: '04',
    title: 'Measure',
    body: 'A number you can reproduce, taken before you change anything.',
    example:
      'WorthyApply started at 16.07s average latency across three sequential analysis calls.',
  },
  {
    index: '05',
    title: 'Improve',
    body: 'Change one thing, measure again, keep the change if the number moved.',
    example:
      'Combining those calls into one analysis pipeline brought average latency to 5.89s — a 63.3% reduction.',
  },
]

/* ------------------------------------------------------------------ */
/* "Why?" notes — rendered inside the section they belong to          */
/* ------------------------------------------------------------------ */

export interface WhyNote {
  question: string
  answer: string
  context: string
}

export const whyNotes: Record<'rag' | 'deterministic' | 'combined' | 'langgraph', WhyNote> = {
  rag: {
    question: 'Why RAG?',
    answer: 'Ground responses in relevant documents.',
    context: 'Fusion Cards · AgriMind',
  },
  deterministic: {
    question: 'Why deterministic scoring?',
    answer: 'Reduce variability when scoring structured requirements.',
    context: 'WorthyApply',
  },
  combined: {
    question: 'Why combine analysis calls?',
    answer: 'Fewer model calls, lower latency — 16.07s → 5.89s.',
    context: 'WorthyApply',
  },
  langgraph: {
    question: 'Why LangGraph?',
    answer: 'Orchestrating multi-step agentic workflows.',
    context: 'AgriMind',
  },
}

/* ------------------------------------------------------------------ */
/* Metrics strip                                                      */
/* ------------------------------------------------------------------ */

export interface Metric {
  id: string
  value: number
  decimals: number
  prefix?: string
  suffix: string
  label: string
}

export const metrics: Metric[] = [
  { id: 'reduction', value: 63.3, decimals: 1, suffix: '%', label: 'lower average latency, WorthyApply' },
  { id: 'latency', value: 5.89, decimals: 2, suffix: 's', label: 'average analysis latency, down from 16.07s' },
  { id: 'banks', value: 18, decimals: 0, suffix: '+', label: 'banks covered by the retrieval system' },
]

/* ------------------------------------------------------------------ */
/* Achievements                                                       */
/* ------------------------------------------------------------------ */

export interface Achievement {
  title: string
  detail: string
  meta: string
  links?: { label: string; href: string }[]
}

export const achievements: Achievement[] = [
  {
    title: 'Top 7',
    detail: 'Buildspace Hackathon',
    meta: 'Thapar Institute Tech Fest · 2026',
  },
  {
    title: 'Competitive Programming',
    detail: 'LeetCode · CodeChef · Codeforces',
    meta: 'Data structures and algorithms',
    links: [
      { label: 'LeetCode', href: 'https://leetcode.com/u/LvqtSP4dgr/' },
      { label: 'CodeChef', href: 'https://www.codechef.com/users/colony_dice_69' },
      { label: 'Codeforces', href: 'https://codeforces.com/profile/sanath25' },
    ],
  },
  {
    title: 'Sports',
    detail: 'Badminton · Cricket',
    meta: 'Inter-college level',
  },
]

/* ------------------------------------------------------------------ */
/* Navigation                                                         */
/* ------------------------------------------------------------------ */

export interface NavItem {
  id: string
  label: string
}

/** Ordered to match scroll order so the active indicator never moves backwards. */
export const navItems: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Stack' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

export const contactPrompt = 'Have something worth building?'

export const siteMeta = {
  title: `${profile.name} — ${profile.role}`,
  description: `${profile.name} builds AI systems, LLM and RAG applications, full-stack products and backend services.`,
  year: new Date().getFullYear(),
}
