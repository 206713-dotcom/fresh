# EcBiz

### Cambridge IGCSE Business Studies, practised properly.

**EcBiz is an independent, student-built revision platform for Cambridge IGCSE Business Studies (0264 / 0450).** It turns the syllabus into a loop: learn the idea, answer the command word, get marked against the assessment objectives, find the gap, and come back to it later.

**Where it stands:** EcBiz has been tested with my classmates and submitted to my school for review. It is not widely used yet, and I am not claiming that it is. It is a real project used by real classmates, still early.

[Source on GitHub (Fresh hub)](https://github.com/206713-dotcom/fresh) · [Report an issue](https://forms.gle/6X2CAR1LkSQGRBx68) · [Run it locally](#run-ecbiz-locally) · [Deploy your own](#deploy-ecbiz)

[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-typed-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Transformers.js](https://img.shields.io/badge/AI-Transformers.js_·_WebGPU-FF6F00)](https://huggingface.co/docs/transformers.js)
[![Local progress](https://img.shields.io/badge/Progress-This_browser-203e32)](#local-progress-and-privacy)
[![Licence: MIT](https://img.shields.io/badge/Licence-MIT-green.svg)](#licence)

> **Independent student project.** EcBiz is not affiliated with, endorsed by, or connected to Cambridge International. It is a revision aid, not an official qualification resource. Always check the official syllabus and mark scheme.

---

## Contents

1. [Why EcBiz exists](#why-ecbiz-exists)
2. [My role, honestly](#my-role-honestly)
3. [By the numbers](#by-the-numbers)
4. [What is inside](#what-is-inside)
5. [How the marking works](#how-the-marking-works)
6. [Architecture](#architecture)
7. [Data model](#data-model)
8. [Local progress and privacy](#local-progress-and-privacy)
9. [Content and accuracy](#content-and-accuracy)
10. [Run EcBiz locally](#run-ecbiz-locally)
11. [Deploy EcBiz](#deploy-ecbiz)
12. [Project structure](#project-structure)
13. [Quality and verification](#quality-and-verification)
14. [How this grew](#how-this-grew)
15. [Roadmap](#roadmap)
16. [Credits](#credits)
17. [Licence](#licence)

---

## Why EcBiz exists

I am a Year 11 student taking Cambridge IGCSE Business Studies. The syllabus is huge: six sections, more than twenty-five chapters, hundreds of definitions, formulas and case-study skills, and four assessment objectives that all have to show up in the right proportion. The exam rewards **exact** wording. A vague answer can lose the mark even when the idea behind it is right.

Most revision material I could find fell into two camps:

- **Passive** — read a textbook, watch a video, highlight notes. Comfortable, but it never tests whether you can *produce* the Cambridge wording under pressure.
- **One-shot** — a worksheet you complete once and throw away. No repetition, no tracking, no sense of progress.

EcBiz started as a **Social and Emotional Learning (SEL) wellbeing activity** — a small "build something that helps your classmates" project. A handful of flashcards for a few friends grew, week by week, into a full revision platform once I saw how many students were quietly struggling for practice material.

The goal: give every student the same thing a well-resourced candidate gets — thousands of exam-style questions, instant feedback on wording, a clear record of what they have actually mastered, and a progress trail they can review on their device — for free, in a browser, with no paywall.

---

## My role, honestly

I want to be upfront about how this was actually built, because the person reading this (a teacher, a scholarship interviewer, a classmate) deserves a straight answer.

- **I designed, built, tested and maintain EcBiz, working with AI coding tools.** I am not pretending this was typed out entirely by hand, and I am not pretending the AI did my thinking for me either. The product decisions, the feature design, the layout, the marking logic and the testing were mine. The code was written with AI assistants that I prompted, reviewed, ran and debugged.
- **The practice question bank was generated with Gemini, using Cambridge model answers as the source material.** The questions follow the syllabus and the mark-scheme shape, but they are practice questions, not past papers. I checked and edited them, but they are not official Cambridge documents.
- **What I personally focused on:** designing the features, fixing confusing layouts based on feedback from my classmates, and testing the AI marker against Cambridge marking criteria until it scored fairly. The local AI grader went through many rounds of me marking test answers, comparing its mark to the real mark scheme, finding where it was wrong, and fixing the rules.
- **What I can confidently explain in person:** every feature listed below, why it exists, how marking works in plain English, where the content came from, what the app does well, and what it does badly. If you ask me something deeper than that, the honest answer is "the AI helped with that part and I tested it" — which is the whole point of testing it.
- **Testing so far:** EcBiz has been used and tested by my classmates, and it has been submitted to my school for review. It does not have widespread adoption, a user base, or official endorsement. The feedback link at the top is a real way to report mistakes.

---

## By the numbers

| What | How much | Where it lives |
|---|---:|---|
| MCQ drill bank | **6,000** questions (1,000 per section) | `src/lib/data/mcq-bank-section1..6.ts` |
| Paper 1 scenarios | **1,200** (200 per section) | `src/lib/data/paper1-database.json` |
| Paper 1 structured questions | **4,800** (1,200 each of 2, 4, 6 and 8 marks) | same |
| Paper 2 case studies | **100** | `src/lib/data/paper2-database.json` |
| Paper 2 structured questions | **800** (400 × 8-mark, 400 × 12-mark) | same |
| Verified past-paper questions | **189** | `src/lib/data/verified-questions.ts` |
| Verified past-paper case studies | **31** (20 Paper 1 scenarios, 11 Paper 2 cases) | `src/lib/data/verified-case-studies.ts` |
| Interactive lessons | **24** across all six sections | `src/lib/data/interactive-lessons.ts` |
| Granular syllabus statements | **255**, across 61 subtopics and 29 topics | `src/lib/data/detailed-syllabus-0264.ts` |
| Glossary terms | **275** | `src/lib/data/glossary.ts` |
| Advantages/disadvantages notes | **165** | `src/lib/data/compare-notes.ts` |
| Chapter summaries | **6** sections, **28** topic blocks | `src/lib/data/one-page-sheets.ts` |
| Mock exam formats | **3** (Paper 1, Paper 2 full, Paper 2 short) | `src/components/MockExamMode.tsx` |
| Achievements | **14** | `src/components/AchievementsModal.tsx` |
| Themes | **5** (2 free, 3 coin-unlocked) | `src/lib/themes.ts` |
| Boss encounters | **6** | `src/components/BossBattleArena.tsx` |

That is **6,000 multiple-choice questions**, **5,600 structured Paper 1 and Paper 2 questions**, a separate **189-question verified archive**, and enough lesson, glossary and revision material to cover the whole course without opening a second tab.

One honest caveat: the large practice banks were generated with AI (Gemini) using Cambridge model answers as the basis, then checked and edited by me. They are built to *match* the syllabus, not to be official material. The separate verified archive (see section 5 below) is the part of the app built from inspected Cambridge past papers.

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

The quiz also includes a **Daily Blitz** and **Weekly Master** challenge. The prompt is picked from the UTC date or week, so every student sees the same question on the same day. Both are timed at 60 seconds and award 50 or 150 bonus coins.

### 3. Write: the Paper 1 topical studio

Paper 1 is where definitions and case application meet. The studio contains **1,200 scenario sets**, 200 per section, each with a full case and four structured parts:

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
- a choice of marking engine: **Instant** (works on any computer, no download) or **Qwen 3 0.6B** (a small AI model that runs locally in the browser, gives more nuanced feedback).

The marking rules are deliberately strict. If the question needs you to apply to the case and your answer mentions none of the case's application keywords, your Application (AO2) mark is capped at zero. If an 8-mark evaluation question contains no evaluation language, your AO4 mark is capped at zero. The reasoning is shown in the feedback, so the cap teaches the rule instead of feeling random.

Two-mark questions are a special case: they are pure knowledge. The engine forces the breakdown to `K: 0–2` and zeroes Application, Analysis and Evaluation, then awards one Knowledge mark per distinct correct defining point. A definition of a private limited company that mentions both "shares sold privately / not on the stock exchange" and "limited liability" therefore scores 2/2, and the results screen shows a single Knowledge card instead of asking for application the question never set.

### 4. Apply: the Paper 2 case-study simulator

Paper 2 is a different skill: read an unseen business, use the appendices, and write under time pressure. The simulator includes **100 full case studies**, each with:

- a main case narrative;
- **Appendix 1** — marketing and operations data;
- **Appendix 2** — financial accounts, cash flow or balance-sheet data;
- **Appendix 3** — external environment and economic context;
- four topic pairs, each containing one 8-mark and one 12-mark question.

That is **800 questions** in total, split evenly between 8 and 12 marks. The 8-mark questions use band descriptors from "Basic" to "Maximum"; the 12-mark questions use the official Cambridge Level 3, Level 2, Level 1 and Level 0 descriptors with a supported recommendation at the top level.

For 12 marks, the result screen shows the Level badge, the mark out of 12 and short qualitative tags per paragraph ("Knowledge & Context Shown", "Needs Consequence Chain", "Basic Judgement — Weigh Trade-offs"). It does not show an AO1–AO4 card grid or per-paragraph marks, because those would imply a points-based scheme that the question does not use. Numeric per-paragraph marks only appear on the 4-, 6- and 8-mark questions, where they are the correct model.

You can move sequentially, jump to a set by number, or pick a random case. Answers can be marked by the local model or by the built-in Instant examiner. A manual override modal records the original AI score, the new score, the reason and whether benefit of the doubt was applied, so a class discussion can correct a mark without erasing what the machine said.

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

**Chapter summaries.** A full-size, full-width revision view of every chapter: all topic blocks, visuals and exam takeaways on one scrollable document. Reachable from Sections & Chapters, the overview page, and the revision pack.

**Sections & Chapters.** A syllabus-first view of all six sections that links every topic into the practice studio, the comparison notes or the chapter summary.

### 8. Make it yours: coins, themes, focus space and the arena

- **Study Coins** are earned across quizzes, lessons, challenges and the game.
- **Themes** are pure CSS-variable swaps: Daylight and Midnight are free; Vintage Scholar, Blueprint and Sakura are bought with coins.
- **Avatar customiser** includes 7 skin tones and 15 options each for hair, tops, bottoms and shoes.
- **Study Space** is a draggable focus widget with a Pomodoro timer, custom durations, ambient sound mixing and a "ghost mode" that keeps the numbers visible while fading the panel.
- **Achievements** include 14 milestones for first submissions, context mastery, high marks, syllabus triage, focus sessions and glossary work.
- **Boss Battle Arena** is a 2D canvas game with six business-themed bosses. It includes unit, subsection and focus filters (all subjects, wrong-only, definitions, calculations, application), spaced repetition that weights previously missed questions, armour tiers with real effects, extra lives, a shop with 9 character skins, 7 armour tiers up to Grandmaster Mantle, coin upgrades up to 100-ammo capacity, and distinct hair styles that render in-game. The top nav always has an **MCQ** entry for the 6,000-question drill.
- **MCQ tab** in the top navigation opens the full 6,000-question drill bank instantly from any screen.

### 9. Report issues from inside the app

Every question view across Topical Practice, Official Past Papers, Paper 2 case studies and Boss Battle carries a subtle **Flag** button. Tap it and a compact dialog opens with:

- four issue reasons: **Typo in question** · **Mark scheme issue** · **Wrong unit / tag** · **Other**
- a confidence pill selector: **Pretty sure** (default) · **Very confident** · **100% certain**
- an optional note field (up to 240 characters)
- a single-submit guard so the same question cannot be reported twice in one session

Question flags are saved in this browser with the question ID, reason, confidence, note and timestamp. They remain available on the current device.

### 10. Progressive difficulty and spaced repetition (Boss Battle)

Boss Battle questions ramp by stage: early rounds hit definition and recall questions, later stages hit application and analysis. On higher difficulties the timer tightens further. The question pool respects the unit, subsection and focus filters you pick on the setup screen, and previously missed questions are drawn back into the rotation more often — with even more weight the more you miss them — until you answer them correctly.

---

## How the marking works

The core design rule: **do not let a language model be the only thing standing between a student and a mark.**

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
│ 1. Fixed rule scans                           │
│    • case-application keywords → AO2          │
│    • evaluation judgement words → AO4         │
│    Missing required evidence? cap to zero.    │
└───────────────────────────────────────────────┘
      │
      ▼
┌───────────────────────────────────────────────┐
│ 2. Local Qwen 3 0.6B (Transformers.js)      │
│    temperature 0.0 · adaptive token budget    │
│    strict JSON schema · per-paragraph audit   │
│    diagnostics only — no score arithmetic     │
└───────────────────────────────────────────────┘
      │
      ├── WebGPU unavailable / invalid JSON
      ▼
┌───────────────────────────────────────────────┐
│ 3. Instant (built-in) examiner                │
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

- **The rules are visible.** A student can see *why* AO2 was capped: the answer did not mention the case. That is a teachable moment, not a mystery.
- **The model is kept on a tight leash.** It gets the question, mark scheme and rubric, and it returns a strict shape. If it returns invalid JSON, the app does not guess; it falls back to the built-in examiner.
- **The fallback always works.** If the computer does not support WebGPU, the app still marks. The UI tells you which engine is active.
- **The human stays in charge.** Manual overrides preserve the original AI score and the reason, so a teacher or student can correct a harsh or generous result without destroying the record.

### What the local model is actually allowed to decide

The model is a **paragraph reader**, not a calculator. It returns a small JSON object per paragraph — `k_score`, `app_score`, `an_score`, `eval_score`, a short `critique`, and the exact quote it judged — and that is all. The code owns every number that reaches the student:

- the per-paragraph subtotal and its maximum;
- the AO1–AO4 totals and their caps;
- the mark totals for 2-, 4-, 6- and 8-mark questions;
- the official Paper 2 Level band and the final mark out of 8 or 12;
- the rule-enforcement record shown in the feedback panel.

That separation is why the engine can be strict even with a small model. The model supplies judgement about *wording and business reasoning*; the code supplies *the maths and the rubric rules*. When the two disagree, the code wins.

### The grading problems I had to solve

Getting a 0.6B (very small) model to behave like a Cambridge examiner was not one task. It was six separate problems, each with its own failure mode, plus a lot of iteration after the first version "worked" but still marked unfairly.

#### 1. Running AI entirely on the device, with no API keys

**The problem.** External APIs meant server cost, rate limits and keys that could be exposed. Supporting a second, larger model also doubled the download and added memory pressure — and in practice the bigger model did not remove the need for the coded marking rules, it just hid their absence behind a heavier download.

**What I changed.** I built a zero-API-key WebGPU pipeline on `@huggingface/transformers`, removed the larger 2B model completely, and standardised on **Qwen 3 0.6B** — now the fine-tuned `SemiLunarz/qwen3-0.6b-igcse-0264-onnx` (single self-contained `onnx/model_q4f16.onnx`, ~535 MB). The model loads through the `text-generation` pipeline (`dtype: 'q4f16'`, `device: 'webgpu'`) with `enable_thinking: false`, weight caching is enabled with `env.useBrowserCache = true`, and generation is 4-bit (`q4f16`). Devices without WebGPU fall back to the built-in Instant examiner instead of showing a dead end.

**Why it mattered.** One model means one download (~380 MB), one cache key and one behaviour to test. The app has to earn its accuracy in code instead of buying it with a bigger download — which turned out to be the more reliable design anyway.

#### 2. The small model kept muddling the maths

**The problem.** Asking a 0.6B model to score AO1–AO4 *and* add up the marks in one pass produced erratic totals. Qwen 3 0.6B's default `<think>...</think>` blocks also ate the token budget before the JSON was finished, and the model regularly made small addition errors that turned a fair paragraph into a wrong final score.

**What I changed.** I disabled thinking mode (`enable_thinking: false`), added a step to strip any stray reasoning tags before `JSON.parse()`, and locked generation to `temperature: 0.0`. Then I removed all of the adding-up from the AI: the model returns per-paragraph judgements, and the TypeScript code computes every subtotal, AO total and Level band. The token budget is now adaptive (roughly 460–1,150 tokens) instead of a fixed number that truncated longer answers.

**Why it mattered.** The same answer now produces the same mark far more often. It also fixed a subtler bug: the model could "award" a mark the rubric did not contain. Because the maxima live in code, a hallucinated sixth mark on a 4-mark question is now impossible.

#### 3. The AI was too kind to later paragraphs — and students could double-count points

**The problem.** Standard AI marking let strong context or analysis in paragraph 1 bleed into weak later paragraphs. Students could also double-dip by repeating — or lightly rewording — the same syllabus point or case fact in a second paragraph and collect the marks twice.

**What I changed.** I rewrote marking so **each paragraph is checked separately, on its own, so students don't get double marks for repeating points.** Each paragraph is audited in isolation with its own quote and its own scores. On top of that, a running **ledger of already-credited points** records every syllabus concept and every case-study detail that has already earned marks. A repeated concept earns zero Knowledge marks; a reused case fact earns zero Application marks; a paragraph whose sentences are too similar to an earlier paragraph is treated as a duplicate and earns no new credit. The Paper 2 conclusion is also checked against the other paragraphs so a recommendation cannot simply restate them.

**Why it mattered.** Marking later paragraphs too generously was the single biggest source of over-marking. Checking paragraphs separately also made the feedback more useful, because the student can see exactly which paragraph was thin rather than getting one vague overall judgement.

#### 4. Application: keyword lists versus name-dropping

**The problem.** Fixed lists of "valid application words" were sometimes too narrow and capped valid answers at zero. The obvious fix — counting capitalised words as application — created the opposite failure, letting a student earn Application marks just by writing the company's name.

**What I changed.** I built automatic reading of the case stem. It pulls concrete, defensible context: currencies, percentages, ratios, quantities and other figures, plus domain nouns that belong to the case. It also identifies standalone company names, brands and acronyms so name-dropping can be detected and excluded from the evidence pool. Curated keyword lists are still used, but as one signal among several rather than a hard gate.

**Why it mattered.** AO2 is supposed to test whether a student can *use* the case, not whether they can memorise a keyword list. Automatic fact extraction made marking fairer across the 340+ scenarios without hand-maintaining a keyword list for every case.

#### 5. Over-crediting wordy "analysis"

**The problem.** Small models — and simple connective-word checks — were fooled by wordy paragraphs that used "because" or "therefore" while merely restating a knowledge point or summarising case facts. The paragraph looked analytical without explaining a commercial consequence.

**What I changed.** I added a strict consequence test. The code requires both a causal link **and** a real business outcome — cash flow, unit costs, risk, efficiency, productivity, revenue, profit, survival or decision-making — before crediting analysis. Restatements, bare cost claims and speed claims without a mechanism are rejected. On Paper 2, the scan distinguishes single-step reasons from developed two-step chains, so a list of six isolated reasons cannot pass as top-band analysis.

**Why it mattered.** AO3 was where the early engine was most generous. Requiring a named consequence made the feedback more specific ("you said it would be cheaper, but not why that matters to the business") and brought the mark distribution much closer to a real mark scheme.

#### 6. Evaluation (AO4) and the official Paper 2 Level bands

**The problem.** A 0.6B model struggled to separate a one-sided assertion from a balanced, justified conclusion, and it applied the official Level 1–3 descriptors inconsistently on 8- and 12-mark questions. Adding the AI's paragraph scores together also produced totals that contradicted the Level, and — on 2-mark definitions — it kept trying to award Application marks the question does not assess.

**What I changed.** I moved AO4 evaluation and Paper 2 Level gating out of the AI and into code. The engine isolates the final conclusion and checks for a clear recommendation, two-sided contrast, case-specific justification, comparison against the rejected alternative, and mitigation or contingency reasoning. Level 3, Level 2, Level 1 and Level 0 now use the official Cambridge wording; the final mark is decided by the Level, not by paragraph addition. I also fixed two marking mismatches:

- **2-mark definitions are pure knowledge.** `evaluateStudentEssay` forces `ao1Max: 2` and Application/Analysis/Evaluation to zero, so "Define…" and "What is meant by…" award one Knowledge mark per distinct accurate characteristic and never ask for application. The results UI hides the non-assessed AO cards for these questions.
- **12-mark results are Levels-based.** The UI shows the Level badge, the exact mark out of 12 and short qualitative paragraph tags. It deliberately does **not** show an AO1–AO4 card grid or per-paragraph mark counters for 12-mark questions, because those numbers would imply a points-based total that Cambridge does not use. Numeric per-paragraph scoring remains for 4-, 6- and 8-mark questions, where it is correct.

**Why it mattered.** The displayed result now matches the mark scheme the student is being taught. There is no contradiction between "AO4: 0/3" at the top and "Eval: 1/3" below, and no paragraph arithmetic pretending to be a Level.

### How I kept it honest

The first version of the local examiner returned a number. It was not trustworthy. Most of the later work was **subtraction**: removing scoring power from the model, removing the bigger model tier, removing paragraph totals from 12-mark results, removing Application marks from 2-mark definitions, and removing the assumption that a bigger model would fix a marking problem the code should have enforced.

Each fix came from a concrete failure I found while testing: a definition that scored 1/2 despite two correct points, a 12-mark conclusion that showed two different evaluation scores, a repeated case fact earning application twice, a paragraph full of "therefore" with no consequence. I reproduced each one and wrote it into `scripts/test-grading.ts`. The suite now holds **122 checks across 35 numbered cases** — automated checks to make sure updates don't break the grading rules. They cover consequence detection, AO maxima, Level gating, paragraph-isolation clamping, 2-mark pure-knowledge scoring, 12-mark AO4 sync, and the duplicate-paragraph rules.

Those automated checks are the part I am most pleased with. A small model will always be a little unpredictable; the checks are what stop that unpredictability from becoming a marking policy. When I changed the 12-mark UI and removed the AO cards, the checks caught the conclusion-audit inconsistency that would otherwise have shipped.

The model runs on the student's device. Once the weights are cached, essay text is not uploaded by the app. The first download is large, so the UI treats it as an explicit action and caches the result.

One more honest note: the AI marker is a practice tool, not an examiner. It can be harsh, generous or just wrong. Use the mark scheme, the model answer and your teacher's judgement.

---

## Architecture

The React study interface saves drafts, submissions, checklist ratings, lessons, coins and themes directly to the current browser's localStorage. The AI model is downloaded to the browser and marks answers on the device.

Students can open the site and begin studying immediately. Returning to the same browser and device restores saved work.

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
  questionType?: "paper1_2m" | "paper1_4m" | "paper1_6m" | "paper1_8m" | "paper2_8m_a" | "paper2_12m_b";
  paragraphAudits?: ParagraphAuditItem[];
  ruleEnforcement?: RuleEnforcementResult;
  manualOverride?: ManualOverrideData;
}

interface ParagraphAuditItem {
  paragraph_number: number;
  role?: "body_point" | "option" | "conclusion";
  isolated_quote: string;   // the exact paragraph the model judged
  k_score: number;
  app_score: number;
  an_score: number;
  eval_score?: number;      // conclusion paragraph only
  subtotal: number;
  max_subtotal?: number;
  critique: string;
  is_duplicate?: boolean;
  has_detailed_an?: boolean;
}
```

The `ruleEnforcement` object is what makes the marking explainable: it records the required application words, the words found, whether AO2 was capped, whether an evaluation word was required, whether AO4 was capped, and the rule notes shown to the student.

---

## Local progress and privacy

Business Studies and Economics save progress in the current browser. Clearing site data or using another browser or device starts a separate study record.

- Business Studies stores answer drafts, submissions, checklist ratings, lessons, quiz history, Boss Battle mistakes, coins and themes in localStorage.
- Economics stores practice answers and feedback, flashcard positions, checklist tasks, revision activities and game progress in localStorage.
- Question flags in Business Studies are saved as local notes for the student.
- The progress page downloads a CSV of submissions, checklist ratings, lesson progress, Boss Battle review and answer drafts. Economics provides its progress CSV on the syllabus checklist page.
- The Business app migrates earlier progress cookies to localStorage and removes old session credentials from browser storage.
- AI marking runs on the device. Model downloads require an internet connection.
- The site is hosted on GitHub Pages at [gisfresh.me](https://gisfresh.me/).

The former account screens and Google Sheets connection have been removed. Visiting an old sign-in, sign-up or dashboard query link opens the local progress page.

Any records previously uploaded to a Google Sheet require separate removal from that Sheet by its owner.

---

## Content and accuracy

### What is official and what is practice

- The **verified archive** links to inspected Cambridge and Cambridge-branded PDFs and records where each item came from. It is the closest thing to "the real thing" in the app.
- The **large practice banks** are Cambridge-style questions written for revision. They follow the syllabus, command words and mark-scheme shape, but they are not past papers and should not be quoted as official. Most of this bulk content was generated with Gemini using Cambridge model answers as the basis, then structured, checked and edited by me.
- The **AI examiner** produces practice feedback, not an official grade. It can be harsh, generous or wrong. Use the mark scheme, the model answer and your teacher's judgement.
- The **lesson, glossary and chapter summary** material is original teaching copy mapped to the 0264 syllabus and the Sixth Edition textbook sequence. It is a study aid, not a replacement for the textbook or your teacher.

The verified archive exists precisely because AI-generated practice should never be confused with a real paper. If you spot an error, use the feedback link at the top of the README.

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

### Install and run

```bash
git clone https://github.com/206713-dotcom/fresh.git
cd fresh/subjects/business
npm install
npm run dev                  # Vite dev server on http://localhost:3000
```


Progress is saved in the browser. The study app runs as a static site.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server on port 3000 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Type-check with `tsc --noEmit` |
| `npm test` | Run the marking-engine automated checks (`scripts/test-grading.ts`) |
| `npm run clean` | Remove `dist/` and the legacy `server.js` |

### First run

1. Open `http://localhost:3000/`.
2. Start with **Interactive Lessons** if you are learning a topic for the first time.
3. Use **Topical Questions** for Paper 1 and **Paper 2** for case-study writing.
4. Use **Quick Quiz** for fast retrieval and **Mock Exam** when you want the clock on.
5. Refresh the page to check that your progress is restored in the same browser.

---

## Deploy EcBiz

EcBiz is a static site. It is hosted on **GitHub Pages** at [gisfresh.me/subjects/business/Business.html](https://gisfresh.me/subjects/business/Business.html) as part of the broader Fresh hub.

### GitHub Pages (live)

1. Build: `npm run build` from `subjects/business/`
2. The build output (`index.html`, `Business.html`, `assets/`) is committed to the repo alongside the rest of Fresh.
3. GitHub Pages serves it at `https://gisfresh.me/subjects/business/Business.html` with all assets resolved relatively (`./assets/…`) — no absolute paths, no Vercel dependency.

### Any static host

Upload `subjects/business/` (or the parent Fresh repo). All asset references are relative (`./assets/…`) so it works under any path on any domain. Deep links like `?open=dashboard` work because the app reads query parameters, not browser routes.

The app uses Google Fonts for typography. If you need a fully self-contained deployment, vendor the fonts locally and update `index.html`.

---

## Project structure

```text
EcBiz/
├── src/
│   ├── App.tsx                     # Tab routing, modals, theme, submissions
│   ├── main.tsx                    # Study app and local progress migration
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
│   │   │   ├── evaluator.ts        # Rule scans, paragraph-by-paragraph marking, AO4 + Levels
│   │   │   └── webllm.ts           # Qwen 3 0.6B WebGPU loader, prompt, JSON parser
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
│   │   ├── cookies.ts              # Progress helpers
│   │   ├── lessons-progress.ts     # Lesson, hint and confidence storage
│   │   └── themes.ts               # Coin-unlocked themes
│   └── index.css                   # Design tokens, themes, layout
├── public/assets/                  # Syllabus and revision documents
├── scripts/                        # Preview helpers + marking automated checks
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
| `npm test` | Runs the marking-engine automated checks: 122 checks across 35 numbered cases |
| `npm run build` | Produces the production bundle and catches bundler/import failures |
| Browser pass | Every tab, filter, quiz size, lesson, mock format, modal and responsive breakpoint is exercised manually |
| Content provenance | Verified questions carry source, verification and mark-scheme status fields |
| Failure paths | WebGPU unavailable, invalid model JSON, expired sessions, failed Sheet pulls and missing drafts all degrade to a usable state |

The marking engine has real automated checks. `scripts/test-grading.ts` runs headlessly through `tsx` — no browser, no downloaded model weights — because the rules that decide marks live in plain TypeScript code. It covers:

- consequence-chain detection, including single-step versus developed two-step reasons;
- AO maxima for every paper and mark tier (`AO1:2`, `AO2:3`, `AO3:4`, `AO4:3` on 12-mark questions);
- official Level 3 / Level 2 / Level 1 / Level 0 gating and the AO4-to-conclusion-audit sync;
- paragraph-by-paragraph clamping when the model over-credits a weak second paragraph;
- 2-mark pure-knowledge definitions, including the `K:2` private-limited-company example;
- duplicate-paragraph and repeated-point rejection;
- the mock Qwen `paragraphs[]` path for both conservative and full-credit audits.

The checks are not decoration. Several of the fixes described above were caught by them rather than by reading the UI: a conclusion badge that disagreed with the gated AO4 score, a 12-mark total that drifted from the Level, and a 2-mark question that leaked Application marks. When I changed the 12-mark results layout, the checks were what proved the displayed result still matched the rubric.

To be honest about what is **not** covered yet: there are no automated checks for the Sheet sync conflict policy, the authentication helpers, or the integrity of the 7,000+ question records. Those are the remaining targets on the roadmap.

---

## How this grew

### First release — 129 questions and a Google Sheet

The original build had a hand-written bank, a chapter filter and a simple `localStorage` snapshot pushed to a Sheet. It proved the loop: answer, get feedback, see a record.

### Second release — coins, streaks and a safer sync

Gamification arrived: Study Coins, streaks, a daily challenge, a weekly challenge and a boss battle. The sync layer was hardened with expired-session handling, roster seeding and coin refreshes. The app became something students wanted to open, not just something they needed.

### Third release — the 6,000-question bank

The 129-question bank was replaced with 6,000 Cambridge-style questions across six sections, split into six typed files. Cascading Section → Sub-topic filters, Wrong Only mode, wrong-question tracking and per-student `mcq_errors` arrived at the same time.

### The exam-room build — Paper 1, Paper 2 and mocks

The platform grew a written-answer studio: 1,200 Paper 1 scenario sets, 100 Paper 2 case studies with three appendices, mark-scheme viewers, model answers, drafts, bookmarks, timers and three timed mock formats. This is the release that turned EcBiz from a quiz into an exam trainer.

### The feedback build — AO rules and a local examiner

The marking engine was rebuilt around AO1–AO4. Keyword scans written in code enforce application and evaluation before the model sees the answer. A local Qwen model through Transformers.js provides paragraph-level interpretation with a strict JSON schema and a fallback examiner. Manual overrides with an audit trail keep the human in the loop.

### The examiner-hardening build — paragraph-by-paragraph marking and coded Levels

The first local examiner returned marks; this build made them defensible. Each paragraph is marked separately with its own quote so answers cannot double-count points, the AO4 rules and the Paper 2 Level bands moved entirely into code, and the 2-mark definitions were locked to pure knowledge. The regression checks grew alongside each fix.

### The classroom build — lessons and local progress

Twenty-four interactive lessons, a 255-statement checklist, a 275-term glossary, comparison notes, revision sheets and a verified archive support the study workflow. Progress is saved locally in the current browser.

---

## Roadmap

- [x] Add automated checks for the marking rules, AO caps and Level gating (`npm test`).
- [ ] Extend automated coverage to local persistence, the fallback examiner and content integrity.
- [x] Add a review workflow for flagging and correcting a question from inside the app.
- [ ] Add teacher authoring or CSV import for school-specific questions.
- [ ] Vendor the fonts and add optional offline caching for low-connectivity classrooms.
- [ ] Add exportable progress reports for teachers and parents.
- [ ] Run a formal accessibility audit and close the gaps.
- [ ] Add more Paper 2 case studies beyond the current 100.
- [ ] Improve the AI examiner's rubric awareness while keeping the coded marking rules.

---

## Credits

- **Cambridge IGCSE Business Studies (0264 / 0450)** — syllabus structure, assessment objectives and command-word expectations. EcBiz is independent and not endorsed by Cambridge.
- **Borrington & Stimpson, *Cambridge IGCSE & O Level Business*, Sixth Edition** — chapter sequence used to organise the 24 lessons.
- **Cambridge International and PapaCambridge** — official specimen papers, mark schemes and syllabus documents linked from the archive.
- **Google Gemini** — used to generate the bulk practice question banks (MCQs and Paper 1/2-style practice) from Cambridge model answers, which I then checked and edited.
- **Browser localStorage** — saves study progress on the current device.
- **React, Vite, TypeScript, Tailwind CSS, Lucide, Motion and canvas-confetti** — the front-end stack.
- **Transformers.js, WebGPU and the Qwen model family** — local, in-browser paragraph interpretation with a single Qwen 3 0.6B text decoder.
- **AI coding tools** — used throughout to help write, refactor and debug the code. I made the product decisions, reviewed the code, and tested it.
- **Every classmate who tested an early build** and told me what was confusing. The Wrong Only mode, the 60-second challenge, the confidence ratings and most of the layout fixes all came from those conversations.

---

## Licence

MIT for the original source code, interface text and teaching notes. See [LICENSE](./LICENSE).

Official Cambridge syllabi, specimen papers and mark schemes remain the property of Cambridge International and are included or linked for reference and revision only.

---

Built by **Jayden Tan**, a Year 11 IGCSE student, for other students who, like me, just wanted enough practice to walk into the exam confident. EcBiz has been tested with classmates and submitted to my school for review. If you find a mistake, flag it in the app or open an issue on GitHub — I would rather fix it than have a classmate learn the wrong thing.
