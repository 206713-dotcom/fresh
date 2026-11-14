# EcBiz

### Cambridge IGCSE Business Studies, practised properly.

**EcBiz is an independent, student-built revision platform for Cambridge IGCSE Business Studies (0264 / 0450).** It turns the syllabus into a loop: learn the idea, answer the exact command word, get marked against AO1–AO4, find the gap, and come back to it later.

[Browse the source](https://github.com/205737-cmyk/EcBiz) · [Report an issue](https://forms.gle/6X2CAR1LkSQGRBx68) · [Run it locally](#run-ecbiz-locally) · [Deploy your own](#deploy-ecbiz)

[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-typed-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![WebLLM](https://img.shields.io/badge/AI-WebLLM_·_WebGPU-FF6F00)](https://github.com/mlc-ai/web-llm)
[![Google Sheets](https://img.shields.io/badge/Progress-Google_Sheets-34A853?logo=googlesheets&logoColor=white)](#accounts-progress-and-privacy)
[![Licence: MIT](https://img.shields.io/badge/Licence-MIT-green.svg)](#licence)

> **Independent student project.** EcBiz is not affiliated with, endorsed by, or connected to Cambridge International. It is a revision aid, not an official qualification resource. Always check the official syllabus and mark scheme.

---

## Contents

1. [Why EcBiz exists](#why-ecbiz-exists)
2. [By the numbers](#by-the-numbers)
3. [What I built and what it taught me](#what-i-built-and-what-it-taught-me)
4. [What is inside](#what-is-inside)
5. [How the marking engine works](#how-the-marking-engine-works)
6. [Architecture](#architecture)
7. [Data model](#data-model)
8. [Accounts, progress and privacy](#accounts-progress-and-privacy)
9. [Content and accuracy](#content-and-accuracy)
10. [Run EcBiz locally](#run-ecbiz-locally)
11. [Connect the Google Sheet (optional)](#connect-the-google-sheet-optional)
12. [Deploy EcBiz](#deploy-ecbiz)
13. [Project structure](#project-structure)
14. [Quality and verification](#quality-and-verification)
15. [Release milestones](#release-milestones)
16. [Roadmap](#roadmap)
17. [Credits](#credits)
18. [Licence](#licence)

---

## Why EcBiz exists

I am a student taking Cambridge IGCSE Business Studies. The syllabus is enormous: six sections, more than twenty-five chapters, hundreds of definitions, formulas, case-study skills, and four assessment objectives that all have to appear in the right proportion. The exam rewards **exact** wording. A vague answer can lose the mark even when the underlying idea is correct.

Most revision material I could find fell into two camps:

- **Passive** — read a textbook, watch a video, highlight notes. Comfortable, but it never tests whether you can *produce* the Cambridge wording under pressure.
- **One-shot** — a single worksheet you complete once and throw away. No repetition, no tracking, no sense of progress.

EcBiz started as a **Social and Emotional Learning (SEL) wellbeing activity** — a small "build something that helps your classmates" project. A handful of flashcards for a few friends grew, week by week, into a full revision platform once I realised how many students were quietly struggling for practice material. The moment a classmate told me *"I finally feel ready for Paper 1"* was the moment I decided to take it seriously and ship it properly.

The goal: give every student the same thing a well-resourced candidate gets — thousands of exam-style questions, instant "is this the Cambridge wording?" feedback, a clear record of what they have actually mastered, and a teacher-visible progress trail — for free, in a browser, with no paywall.

---

## By the numbers

| What | How much | Where it lives |
|---|---:|---|
| MCQ drill bank | **6,000** questions (1,000 per section) | `src/lib/data/mcq-bank-section1..6.ts` |
| Paper 1 scenarios | **240** (40 per section) | `src/lib/data/paper1-database.json` |
| Paper 1 structured questions | **960** (240 each of 2, 4, 6 and 8 marks) | same |
| Paper 2 case studies | **100** | `src/lib/data/paper2-database.json` |
| Paper 2 structured questions | **800** (400 × 8-mark, 400 × 12-mark) | same |
| Verified past-paper questions | **189** | `src/lib/data/verified-questions.ts` |
| Verified past-paper case studies | **31** (20 Paper 1 scenarios, 11 Paper 2 cases) | `src/lib/data/verified-case-studies.ts` |
| Interactive lessons | **24** across all six sections | `src/lib/data/interactive-lessons.ts` |
| Granular syllabus statements | **255**, across 61 subtopics and 29 topics | `src/lib/data/detailed-syllabus-0264.ts` |
| Glossary terms | **275** | `src/lib/data/glossary.ts` |
| Advantages/disadvantages notes | **165** | `src/lib/data/compare-notes.ts` |
| One-page revision sheets | **6** sections, **28** topic blocks | `src/lib/data/one-page-sheets.ts` |
| Mock exam formats | **3** (Paper 1, Paper 2 full, Paper 2 short) | `src/components/MockExamMode.tsx` |
| Achievements | **14** | `src/components/AchievementsModal.tsx` |
| Themes | **5** (2 free, 3 coin-unlocked) | `src/lib/themes.ts` |
| Boss encounters | **6** | `src/components/BossBattleArena.tsx` |

That is **6,000 multiple-choice questions**, **1,760 structured Paper 1 and Paper 2 questions**, a separate **189-question verified archive**, and enough lesson, glossary and revision material to cover the whole course without opening a second tab.

---

## What I built and what it taught me

### The story

EcBiz did not begin as a software project. It began as a wellbeing activity: make something that helps someone else. The first version had 129 hand-written multiple-choice questions and a chapter filter. It was useful, but small.

Then three things happened.

First, I realised that a question bank is only valuable if it is **big enough to revisit**. A student who has seen all 120 questions has not practised; they have memorised a worksheet. So the bank grew to 6,000 questions, split by section and sub-topic, with an explanation for every option.

Second, I realised that multiple-choice questions do not train the part of the exam that actually hurts: **writing**. Paper 1 asks for 2, 4, 6 and 8 marks. Paper 2 asks for 8 and 12 marks in a case-study context. So EcBiz gained a full written-answer studio with mark schemes, model answers, AO-by-AO feedback, keyword rules, and a local AI examiner.

Third, I realised that feedback is only useful if it is **visible over time**. So the platform gained a progress ledger, a syllabus checklist, a glossary mastery loop, a wrong-only drill mode, a teacher spreadsheet, and a set of small motivations — coins, themes, achievements, a focus space and a boss battle — that make coming back feel less like homework.

### What I actually built

| Area | Work |
|---|---|
| **Curriculum** | Mapped the 0264 syllabus into 255 granular statements, 61 subtopics and 29 topics. Structured 24 lessons around the six sections and the Sixth Edition textbook sequence. |
| **Content** | Built 240 Paper 1 scenario sets and 100 Paper 2 case studies with appendices, 6,000 MCQs with explanations, 275 glossary terms, 165 comparison notes, and 189 verified past-paper questions with provenance metadata. |
| **Assessment** | Designed the AO1–AO4 breakdown, deterministic application/evaluation rules, level-band descriptors, mark-scheme viewers, model-answer matching, manual overrides with an audit trail, and a fallback heuristic examiner. |
| **AI** | Integrated a small Qwen model through WebLLM and WebGPU so essay feedback can run on the student's own device, with a strict JSON schema, deterministic temperature, validation, and a non-AI fallback. |
| **Front end** | Built the whole interface in React 19, TypeScript, Vite 8 and Tailwind CSS 4: lessons, practice studios, mock exams, dashboards, glossary, checklist, archive, game, modals and responsive layouts. |
| **Back end** | Wrote the Google Apps Script service that handles registration, login, salted password hashing, HMAC-signed sessions, lockouts, row-level reads/writes and progress snapshots into Google Sheets — with no external database. |
| **Product & writing** | Wrote the teaching copy, exam guidance, mark-scheme language, onboarding, error states, empty states, accessibility labels and the feedback loop with classmates. |

### What this project demonstrates

- **Curriculum design under real constraints.** Every feature is tied to a syllabus outcome, a command word or an assessment objective — not added because it looked impressive.
- **Assessment design.** Marking is not "ask an LLM for a number". It is a pipeline: deterministic keyword guards first, then model interpretation, then schema validation, then a human override if the result is obviously wrong.
- **Full-stack thinking without a traditional backend.** Accounts, persistence and teacher visibility are built on a Google Sheet and Apps Script, because that was the constraint I had to design around.
- **Local-first AI.** The interesting part is not that a model runs in the browser; it is that the product still works when it does not.
- **Data engineering at scale.** Six thousand questions cannot live in one file or one render path. The bank is split, typed, filtered and cached deliberately.
- **Shipping for real people.** A classmate opening the site on a school laptop is a harder test than a local build passing.

---

## What is inside

### 1. Learn: 24 interactive lessons

Each lesson is a short guided read, not a wall of notes. A lesson contains:

- a clear learning objective and an estimated time;
- several concept cards with the key term hidden behind a `[[term]]` token;
- a **Hint** button that reveals the next 25% of hidden terms, so recall is gradual rather than all-or-nothing;
- a drag-and-drop **gap-fill exercise** built from the same hidden terms, with decoy words so the answer cannot be solved by elimination;
- a command-word guide for the practice question;
- an exam tip, a multiple-choice checkpoint, and a full model answer.

Lessons are grouped by section, with per-section completion and an overall mastery percentage. At the end of a lesson you rate your confidence as **Easy**, **Moderate** or **Hard**. That rating is not decoration: the syllabus checklist uses the same three bands to build targeted practice sets, and the lesson screen shows a running `E/M/H` confidence count.

Progress, hint reveals, confidence ratings and the last opened lesson are stored locally and can be reset from the lesson header.

### 2. Drill: the 6,000-question MCQ bank

The Quick Quiz is the fast, low-friction loop:

- filter by **Section** (1–6), then by **sub-topic**, or use the whole bank;
- switch on **Wrong Only** to replay exactly the questions you have missed;
- choose a set size of **3, 5, 10 or 20** and reshuffle at any time;
- see the correct answer, the reason it is correct, and why each distractor is wrong;
- earn Study Coins: 15 for a correct answer, 5 for a revision attempt, 25 for completing a set.

Wrong answers are written to `ecbiz_mcq_wrong`. When you later answer the same question correctly, it leaves the list. The list is also mirrored to the teacher spreadsheet, which turns a private study habit into a visible intervention signal.

The quiz also includes a **Daily Blitz** and **Weekly Master** challenge. The prompt is selected deterministically from the UTC date or week, so every student sees the same question. Both are timed at 60 seconds and award 50 or 150 bonus coins.

### 3. Write: the Paper 1 topical studio

Paper 1 is where definitions and case application meet. The studio contains **240 scenario sets**, 40 per section, each with a full case stem and four structured parts:

| Part | Marks | What it tests |
|---|---:|---|
| (a) | 2 | Knowledge and understanding |
| (b) | 4 | Knowledge plus application to the case |
| (c) | 6 | Developed analysis in context |
| (d) | 8 | Balanced evaluation with a justified judgement |

For every question you get:

- the exact command word and mark value;
- a **mark-scheme viewer** split into knowledge, application, analysis and evaluation;
- an AO-highlight viewer that shows the language the examiner is looking for;
- a model answer;
- a live timer and a locally auto-saved draft, so a closed tab does not lose the paragraph you were midway through;
- bookmarks for questions you want to revisit;
- a choice of marking engine: **Instant** (heuristic, no download) or **Qwen** (local AI, more nuanced feedback).

The deterministic rules are deliberately strict. If the question requires case application and your answer contains none of the case's valid application keywords, AO2 is capped at zero. If an 8-mark evaluation question contains no evaluative judgement language, AO4 is capped at zero. The reasoning is shown in the feedback, so the cap teaches the rule instead of feeling arbitrary.

### 4. Apply: the Paper 2 case-study simulator

Paper 2 is a different skill: read an unseen business, use the appendices, and write under time pressure. The simulator includes **100 full case studies**, each with:

- a main case narrative;
- **Appendix 1** — marketing and operations data;
- **Appendix 2** — financial accounts, cash flow or balance-sheet data;
- **Appendix 3** — external environment and economic context;
- four topic pairs, each containing one 8-mark and one 12-mark question.

That is **800 questions** in total, split evenly between 8 and 12 marks. The 8-mark questions use band descriptors from "Basic" to "Maximum"; the 12-mark questions use Cambridge-style Level 1, 2 and 3 descriptors with a supported recommendation at the top level.

You can move sequentially, jump to a set by number, or pick a random case. Answers can be evaluated by the local model or by the built-in heuristic examiner. A manual override modal records the original AI score, the new score, the reason and whether benefit of the doubt was applied, so a class discussion can correct a mark without erasing what the machine said.

### 5. Verify: the official past-paper archive

The verified archive is deliberately separate from the generated practice banks. It contains **189 questions** drawn from inspected Cambridge and Cambridge-branded PDFs, each carrying:

- syllabus, year, series, paper and question number;
- the case context;
- a link to the question paper and mark scheme;
- a `verification` field describing how the item was checked;
- `source_status` and `mark_scheme_status` fields;
- a curriculum note explaining where it fits.

There are also **31 verified case studies** — 20 Paper 1 scenarios plus 11 Paper 2 cases — with their original business titles, tables and appendices. You can filter the archive topically across the six sections. This is the part of the platform to use when you want to see the real thing rather than a Cambridge-style imitation.

The Document Archive links to the official 0264 specimen Paper 1 and Paper 2, the mark schemes, the case insert, the 2027–2029 syllabus, and a revision guide. The syllabus and revision guide are served locally; the specimen papers link to Cambridge.

### 6. Perform: the mock exam room

Mock Exam Mode removes the navigation, the widgets and the safety net. You choose one of three formats:

| Format | Time | Marks | Question mix |
|---|---:|---:|---|
| Paper 1 Mock | 30 min | 20 | 1 × 2, 1 × 4, 1 × 6, 1 × 8 |
| Paper 2 Full Mock | 60 min | 40 | 2 × 8, 2 × 12 |
| Paper 2 Short Mock | 30 min | 20 | 1 × 8, 1 × 12 |

The paper uses a real case study and the matching appendices, keeps a visible countdown, and submits automatically when time runs out. The review screen shows the mark scheme and model answer beside each response so you can mark yourself honestly. The real Cambridge papers are 80 marks and 1 hour 30 minutes; these mocks are shortened practice versions, not replica papers.

### 7. Keep going: the study system around the questions

The question banks are the engine. The rest of the platform is the reason students return.

**Progress ledger.** Every evaluated answer is saved with its question, mark, paper, unit, word count, time spent and full AO breakdown. The dashboard shows questions practised, average mark, AO1–AO4 totals, examiner notes and a submission history. The `/dashboard` route gives a signed-in student a compact personal view.

**Syllabus checklist.** All 255 statements are browsable and searchable. Rate each one **Hard**, **Moderate** or **Easy**, add a note, reveal the CIE mark scheme, and launch a practice set containing only the points you flagged. The counts for each band update live, so revision becomes a triage decision rather than a vague feeling.

**Glossary.** 275 terms with a definition, syllabus reference, example context, exam advice, formula where relevant and a common-mistake warning. Mark terms as mastered to shrink the list.

**Advantages and disadvantages.** 165 comparison notes organised by section and topic, written in the "on the one hand / on the other hand" shape that evaluation questions reward.

**One-page sheets.** Six A4-style revision sheets covering 28 topic blocks, with structured points, visuals and exam framing. They are reachable from Sections & Chapters.

**Sections & Chapters.** A syllabus-first view of all six sections that links every topic into the practice studio, the comparison notes or the one-page sheet.

### 8. Make it yours: coins, themes, focus space and the arena

- **Study Coins** are earned across quizzes, lessons, challenges and the game.
- **Themes** are pure CSS-variable swaps: Daylight and Midnight are free; Vintage Scholar, Blueprint and Sakura are bought with coins.
- **Avatar customiser** includes 7 skin tones and 10 options each for hair, tops, bottoms and shoes.
- **Study Space** is a draggable focus widget with a Pomodoro timer, custom durations, ambient sound mixing and a "ghost mode" that keeps the numbers visible while fading the panel.
- **Achievements** include 14 milestones for first submissions, context mastery, high marks, syllabus triage, focus sessions and glossary work.
- **Boss Battle Arena** is a 2D canvas game with six business-themed bosses, question attacks, damage multipliers, armour tiers, extra lives and a shop. It is deliberately silly; it is also another retrieval loop.

---

## How the marking engine works

The marking pipeline is the most interesting engineering in the project. It is designed around a simple rule: **do not let a language model be the only thing standing between a student and a mark.**

```text
Student answer
      │
      ▼
┌───────────────────────────────────────────────┐
│ 0. Exemplar check                             │
│    Exact or substantial model-answer match?   │
│    → full credit, no model call               │
└───────────────────────────────────────────────┘
      │
      ▼
┌───────────────────────────────────────────────┐
│ 1. Deterministic rule scans                   │
│    • case-application keywords → AO2          │
│    • evaluative judgement words → AO4         │
│    Missing required evidence? cap to zero.    │
└───────────────────────────────────────────────┘
      │
      ▼
┌───────────────────────────────────────────────┐
│ 2. Local Qwen model (WebLLM / WebGPU)         │
│    temperature 0.1 · max 350 tokens           │
│    strict JSON schema · clamped to max marks  │
│    returns AO1/AO2/AO3 feedback + notes       │
└───────────────────────────────────────────────┘
      │
      ├── WebGPU unavailable / invalid JSON
      ▼
┌───────────────────────────────────────────────┐
│ 3. Heuristic fallback examiner                │
│    word-count, paragraph, keyword and         │
│    structure signals — never a blank screen   │
└───────────────────────────────────────────────┘
      │
      ▼
┌───────────────────────────────────────────────┐
│ 4. AO totals, strengths, improvements,        │
│    examiner notes, manual override option     │
└───────────────────────────────────────────────┘
```

Why this shape?

- **The rules are transparent.** A student can see *why* AO2 was capped: the answer did not mention the case. That is a teachable moment, not a black box.
- **The model is constrained.** It receives the question, mark scheme, rubric and statistical metrics, and returns a strict shape. If it returns invalid JSON, the app does not guess; it falls back.
- **The fallback is honest.** If WebGPU is unavailable, the app still marks. The UI tells you which engine is active.
- **The human stays in charge.** Manual overrides preserve the original AI score and the reason, so a teacher or student can correct a harsh or generous result without destroying the record.

The model runs on the student's device. Once the weights are cached, essay text is not uploaded by the app. The first download is large, so the UI treats it as an explicit action and caches the result.

---

## Architecture

```text
┌──────────────────────────────────────────────────────────────────┐
│ Browser                                                          │
│                                                                  │
│  React 19 · TypeScript · Vite 8 · Tailwind CSS 4                │
│                                                                  │
│  Study UI ──► ecbiz_* localStorage ──► sheetSync (debounced)     │
│      │                    │                                      │
│      │                    └──► Google Apps Script Web App        │
│      │                                  │                       │
│      │                                  ▼                       │
│      │                          Google Sheet                      │
│      │                    Users · Students · Progress            │
│      │                                                           │
│      └──► WebLLM (WebGPU) ──► local Qwen model                   │
│              no essay upload                                     │
└──────────────────────────────────────────────────────────────────┘
```

Key design decisions:

- **No external database.** The school forbids one. The app is fully usable without a backend; the Sheet is a mirror, not a dependency.
- **Optional accounts.** The study app works signed out. Signing in adds sync and teacher visibility; it does not gate the content.
- **Prefix-based snapshot.** Every progress key starts with `ecbiz_`, so the sync layer can snapshot the whole surface without knowing what each key means.
- **Debounced writes.** Saves are scheduled 4 seconds after a change and flushed when the tab is hidden. A minute-by-minute refresh lets a teacher raise coins in the Sheet and have them appear without a reload.
- **Local-first AI.** The model is downloaded once and cached in the browser. Marking continues without a server.
- **Deterministic challenges.** Daily and weekly prompts are seeded from the UTC date/week, so no server coordination is required.

---

## Data model

The content is typed and split by purpose rather than dumped into one file.

### MCQ

```ts
interface MCQItem {
  id: string;                 // e.g. "P1_U1_MCQ_001"
  section: string;            // "1".."6"
  unit: string;
  chapter: string;            // e.g. "1.1 Business activity"
  questionNumber: string;
  question: string;
  options: Record<string, string>; // { A, B, C, D }
  correctOption: string;
  correctAnswer: string;
  questionType: string;
  explanation?: {
    correct_reason: string;
    distractor_reasons: Record<string, string>;
  };
}
```

### Paper 1

```ts
interface Paper1ScenarioSet {
  scenario_id: string;
  unit: string;
  scenario_stem: string;
  questions: Paper1Question[]; // a:2, b:4, c:6, d:8
}

interface Paper1Question {
  part: "a" | "b" | "c" | "d";
  mark_value: 2 | 4 | 6 | 8;
  question_text: string;
  model_answer: string;
  mark_scheme: Paper1MarkScheme;
  qwen_marking_keys: {
    valid_app_words: string[];
    deterministic_rules?: {
      if_app_words_missing?: string;
      if_no_eval_word?: string;
    };
  };
}
```

### Paper 2

```ts
interface Paper2Scenario {
  scenario_id: string;
  unit: string;
  case_study_insert: {
    main_stem: string;
    appendix_1_marketing_ops: string | object;
    appendix_2_financial_data: string | object;
    appendix_3_external_environment: string | object;
  };
  questions: Paper2Question[]; // 8-mark and 12-mark pairs
}
```

### Evaluation

```ts
interface EvaluationResult {
  totalScore: number;
  maxMarks: number;
  percentage: number;
  aoBreakdown: {
    ao1: { score: number; max: number; feedback: string };
    ao2: { score: number; max: number; feedback: string };
    ao3: { score: number; max: number; feedback: string };
    ao4: { score: number; max: number; feedback: string };
  };
  strengths: string[];
  improvements: string[];
  examinerNotes: string;
  modelAnswerSnippet: string;
  isAiEvaluated: boolean;
  evaluatedAt: string;
  ruleEnforcement?: RuleEnforcementResult;
  manualOverride?: ManualOverrideData;
}
```

The `ruleEnforcement` object is what makes the marking explainable: it records the required application words, the words found, whether AO2 was capped, whether an evaluation word was required, whether AO4 was capped, and the rule notes shown to the student.

---

## Accounts, progress and privacy

### The optional account system

The platform is usable without an account. If a teacher wants a class roster, they deploy the Apps Script backend and set `VITE_APPS_SCRIPT_URL`. Students can then sign up with a **6-digit student number** and a password of at least 6 characters.

The backend is `apps-script/Code.gs` and creates three tabs automatically:

| Tab | Purpose |
|---|---|
| `Users` | Student number, name, salted password hash, failed attempts, lockout, timestamps |
| `Students` | Roster and headline figures: coins, streak, time spent, MCQs completed, wrong-question IDs, mark-band scores, topical log, recommended focus |
| `Progress` | One row per student with the full `ecbiz_*` snapshot as JSON |

### Security model

- Passwords are hashed with a per-user salt and 250 iterations of SHA-256, then compared in constant time.
- Sessions are HMAC-SHA256 signed tokens with a 30-day expiry and the student number as the subject.
- Five failed login attempts trigger a 15-minute lockout.
- Reads and writes require a valid token; a student can only access their own row.
- Writes use `LockService` to avoid concurrent-write corruption.
- Requests use `Content-Type: text/plain` to avoid a CORS preflight that Apps Script cannot answer.

This is a school-project security model, not audited production cryptography. Do not reuse an important password, and treat the Sheet as a classroom record rather than a hardened student-information system.

### What is private

- **Signed out:** everything stays in `localStorage`. No account, no upload.
- **Signed in:** the app snapshots `ecbiz_*` keys to the teacher's Sheet. That includes quiz history, wrong-question IDs, drafts, lesson progress and coin balances.
- **AI marking:** the model runs locally. Essay text is not sent to a third-party API by the app.
- **Hosting:** the deployment imports Vercel Analytics for aggregate page views. Remove the `<Analytics />` component in `src/main.tsx` if you do not want it.

The sync layer is deliberately defensive: a failed pull reports an error instead of overwriting local data, and a stale Sheet row can never take coins away from a student mid-session.

---

## Content and accuracy

### What is official and what is practice

- The **verified archive** links to inspected Cambridge and Cambridge-branded PDFs and records its provenance. It is the closest thing to "the real thing" in the app.
- The **large practice banks** are Cambridge-style questions written for revision. They follow the syllabus, command words and mark-scheme shape, but they are not past papers and should not be quoted as official.
- The **AI examiner** produces practice feedback, not an official grade. It can be harsh, generous or wrong. Use the mark scheme, the model answer and your teacher's judgement.
- The **lesson, glossary and one-page** material is original teaching copy mapped to the 0264 syllabus and the Sixth Edition textbook sequence. It is a study aid, not a replacement for the textbook or your teacher.

Some of the bulk content was drafted with AI assistance and then structured, checked and edited into the app. The verified archive exists precisely because generated practice should never be confused with a real paper. If you spot an error, use the feedback link at the top of the README.

### Scope

EcBiz covers the six sections of Cambridge IGCSE Business Studies (0264 / 0450):

1. Understanding business activity
2. People in business
3. Marketing
4. Operations management
5. Financial information and decisions
6. External influences on business activity

The 255 syllabus statements are the scaffold. Not every statement has its own simulation or lesson; the platform is a set of selected learning activities, not a claim of complete outcome-level coverage.

### Copyright

Original source code, interface text and teaching notes are MIT licensed. Official Cambridge syllabi, specimen papers and mark schemes remain the property of Cambridge International and are used here for reference and revision. If you are a rights holder and want a document removed, open an issue.

---

## Run EcBiz locally

### Prerequisites

- **Node.js 22+**
- A modern browser
- Optional: a Google account if you want the Sheet backend

### Install and run

```bash
git clone https://github.com/205737-cmyk/EcBiz.git
cd EcBiz
npm install
cp .env.example .env.local   # optional: add your Apps Script URL
npm run dev                  # Vite dev server on http://localhost:3000
```

On Windows PowerShell, use `Copy-Item .env.example .env.local` instead of `cp`.

No API key, build server or external database is required. The app runs without the backend; you only need `VITE_APPS_SCRIPT_URL` for accounts and sync.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server on port 3000 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Type-check with `tsc --noEmit` |
| `npm run clean` | Remove `dist/` and the legacy `server.js` |

### First run

1. Open `http://localhost:3000/`.
2. Start with **Interactive Lessons** if you are learning a topic for the first time.
3. Use **Topical Questions** for Paper 1 and **Paper 2** for case-study writing.
4. Use **Quick Quiz** for fast retrieval and **Mock Exam** when you want the clock on.
5. Sign in only if you want your progress mirrored to a Sheet.

---

## Connect the Google Sheet (optional)

1. Create a Google Sheet. Call it whatever you like.
2. Open **Extensions → Apps Script**.
3. Replace the default file with the contents of [`apps-script/Code.gs`](./apps-script/Code.gs).
4. Deploy it as a **Web App** with access set to **Anyone**.
5. Copy the `/exec` URL.
6. Put it in `.env.local`:

```bash
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/your-deployment-id/exec
```

7. Restart the dev server.

The script creates the `Users`, `Students` and `Progress` tabs on first use. A teacher can open the Sheet and see the class roster, coin balances, streaks, completed MCQs, wrong-question IDs and score bands without opening a separate admin tool. Coins can be raised directly in the Sheet; the app refreshes them on focus and once a minute.

If you leave the variable unset, the app stays local-only. Nothing breaks.

---

## Deploy EcBiz

EcBiz is a static site. The tested path is Vercel, because `vercel.json` already rewrites every route to `index.html` so `/sign-in`, `/sign-up` and `/dashboard` work on refresh.

### Vercel

1. Push the repository to GitHub.
2. Import it into Vercel.
3. Framework preset: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add `VITE_APPS_SCRIPT_URL` if you want the Sheet backend.
7. Deploy.

### Any static host

Upload `dist/`. The host must support an SPA fallback to `index.html`; otherwise deep links such as `/dashboard` will 404. GitHub Pages needs an explicit fallback or a hash-based router, which this project does not currently use.

The app uses Google Fonts for typography. If you need a fully self-contained deployment, vendor the fonts locally and update `index.html`.

---

## Project structure

```text
EcBiz/
├── src/
│   ├── App.tsx                     # Tab routing, modals, theme, submissions
│   ├── main.tsx                    # Entry point, /sign-in, /sign-up, /dashboard
│   ├── components/
│   │   ├── PracticeStudio.tsx      # Paper 1 + verified archive + Paper 2 entry
│   │   ├── Paper2PracticeView.tsx  # 100-case Paper 2 simulator
│   │   ├── MockExamMode.tsx        # Timed Paper 1 / Paper 2 mocks
│   │   ├── InteractiveLessonsView.tsx
│   │   ├── InteractiveLessonCard.tsx
│   │   ├── WordDropExercise.tsx    # Drag-the-word gap fill
│   │   ├── DailyQuickQuiz.tsx      # 6,000-question drill + wrong-only
│   │   ├── DailyWeeklyChallenge.tsx
│   │   ├── BossBattleArena.tsx     # 2D canvas boss game
│   │   ├── ProgressDashboard.tsx
│   │   ├── SyllabusRevisionChecklist.tsx
│   │   ├── GlossaryView.tsx
│   │   ├── CompareNotesView.tsx
│   │   ├── SectionsView.tsx
│   │   ├── OnePageSheets.tsx
│   │   ├── DocumentArchive.tsx
│   │   ├── StudySpace.jsx          # Focus realm, timer, ambient sound
│   │   ├── AchievementsModal.tsx
│   │   ├── AvatarCustomizerModal.tsx
│   │   └── MarkOverrideModal.tsx
│   ├── lib/
│   │   ├── engine/
│   │   │   ├── evaluator.ts        # Rule scans, AI call, fallback
│   │   │   └── webllm.ts           # WebGPU model, schema, validation
│   │   ├── data/
│   │   │   ├── mcq-bank-section1..6.ts
│   │   │   ├── paper1-database.json
│   │   │   ├── paper2-database.json
│   │   │   ├── verified-questions.ts
│   │   │   ├── verified-case-studies.ts
│   │   │   ├── interactive-lessons.ts
│   │   │   ├── detailed-syllabus-0264.ts
│   │   │   ├── glossary.ts
│   │   │   ├── compare-notes.ts
│   │   │   └── one-page-sheets.ts
│   │   ├── auth.ts                 # Session decode, login, register
│   │   ├── sheetSync.ts            # Debounced localStorage ↔ Sheet sync
│   │   ├── cookies.ts              # Progress helpers
│   │   ├── lessons-progress.ts     # Lesson, hint and confidence storage
│   │   └── themes.ts               # Coin-unlocked themes
│   ├── pages/
│   │   ├── SignInPage.tsx
│   │   ├── SignUpPage.tsx
│   │   └── StudyDashboard.tsx
│   └── index.css                   # Design tokens, themes, layout
├── apps-script/Code.gs             # Accounts, tokens, Sheet persistence
├── public/assets/                  # Syllabus and revision documents
├── scripts/                        # Local preview helpers
├── .env.example
├── vercel.json                     # SPA rewrites + Vite deployment
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Quality and verification

EcBiz is checked in layers:

| Gate | What it does |
|---|---|
| `npm run lint` | Runs `tsc --noEmit`, catching type errors across components, data and the marking engine |
| `npm run build` | Produces the production bundle and catches bundler/import failures |
| Browser pass | Every tab, filter, quiz size, lesson, mock format, modal and responsive breakpoint is exercised manually |
| Content provenance | Verified questions carry source, verification and mark-scheme status fields |
| Failure paths | WebGPU unavailable, invalid model JSON, expired sessions, failed Sheet pulls and missing drafts all degrade to a usable state |

There is **no automated test suite yet**. That is the most important gap in the project, and it is the first item on the roadmap. The right tests are not screenshot tests; they are tests for the marking rules (AO2/AO4 caps), the fallback examiner, the sync conflict policy, the data integrity of 7,000+ question records, and the authentication helpers.

The marking rules are deterministic functions and were written to be testable. `scanApplicationKeywords`, `scanEvaluationKeywords`, `checkIsExactOrSubstantialModelAnswer` and `checkKnowledgePointMatches` can be exercised without a browser or a model, which makes the next step straightforward.

---

## Release milestones

### First release — 129 questions and a Google Sheet

The original build had a hand-written bank, a chapter filter and a simple `localStorage` snapshot pushed to a Sheet. It proved the loop: answer, get feedback, see a record.

### Second release — coins, streaks and a safer sync

Gamification arrived: Study Coins, streaks, a daily challenge, a weekly challenge and a boss battle. The sync layer was hardened with expired-session handling, roster seeding and coin refreshes. The app became something students wanted to open, not just something they needed.

### Third release — the 6,000-question bank

The 129-question bank was replaced with 6,000 Cambridge-style questions across six sections, split into six typed files. Cascading Section → Sub-topic filters, Wrong Only mode, wrong-question tracking and per-student `mcq_errors` arrived at the same time. The README was rewritten around the new scale.

### The exam-room build — Paper 1, Paper 2 and mocks

The platform grew a written-answer studio: 240 Paper 1 scenario sets, 100 Paper 2 case studies with three appendices, mark-scheme viewers, model answers, drafts, bookmarks, timers and three timed mock formats. This is the release that turned EcBiz from a quiz into an exam trainer.

### The feedback build — AO rules and a local examiner

The marking engine was rebuilt around AO1–AO4. Deterministic keyword scans enforce application and evaluation before the model sees the answer. A local Qwen model through WebLLM provides AO1/AO3 interpretation with a strict JSON schema and a fallback examiner. Manual overrides with an audit trail keep the human in the loop.

### The classroom build — lessons, accounts and visibility

Twenty-four interactive lessons, a 255-statement checklist, a 275-term glossary, 165 comparison notes, six one-page sheets and a verified past-paper archive completed the study surface. Optional accounts and the Sheet roster gave teachers a view without introducing a database. The current platform is the sum of those releases: a complete learn → practise → sit → review loop.

---

## Roadmap

- [ ] Add automated tests for the marking rules, fallback examiner, sync policy, auth helpers and content integrity.
- [ ] Add a review workflow for flagging and correcting a question from inside the app.
- [ ] Add teacher authoring or CSV import for school-specific questions.
- [ ] Vendor the fonts and add optional offline caching for low-connectivity classrooms.
- [ ] Add exportable progress reports for teachers and parents.
- [ ] Run a formal accessibility audit and close the gaps.
- [ ] Add more Paper 2 case studies beyond the current 100.
- [ ] Improve the AI examiner's rubric awareness while keeping the deterministic guards.

---

## Credits

- **Cambridge IGCSE Business Studies (0264 / 0450)** — syllabus structure, assessment objectives and command-word expectations. EcBiz is independent and not endorsed by Cambridge.
- **Borrington & Stimpson, *Cambridge IGCSE & O Level Business*, Sixth Edition** — chapter sequence used to organise the 24 lessons.
- **Cambridge International and PapaCambridge** — official specimen papers, mark schemes and syllabus documents linked from the archive.
- **Google Apps Script and Google Sheets** — the only persistence layer, chosen because external databases were not permitted.
- **React, Vite, TypeScript, Tailwind CSS, Lucide, Motion and canvas-confetti** — the front-end stack.
- **WebLLM and the Qwen model family** — local, in-browser essay interpretation.
- **Every classmate who tested an early build** and told me what was confusing. The Wrong Only mode, the 60-second challenge and the confidence ratings all came from those conversations.

---

## Licence

MIT for the original source code, interface text and teaching notes. See [LICENSE](./LICENSE).

Official Cambridge syllabi, specimen papers and mark schemes remain the property of Cambridge International and are included or linked for reference and revision only.

---

Built by **Jayden Tan** for Cambridge IGCSE Business Studies students who, like me, just wanted enough practice to walk into the exam confident. If this helps you, drill one sub-topic a day — and pass.
