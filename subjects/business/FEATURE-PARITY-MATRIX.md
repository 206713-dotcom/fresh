# Feature Parity Matrix — EcBiz IGCSE Business (static, zero-build)

> **Superseded by `PARITY-AUDIT-MASTER.md`.** This Stage-1 inventory was written
> before edits; the 24-agent audit found that several "no control removed / no
> key renamed" claims here were inaccurate. See the master audit for the
> exhaustive discrepancy catalogue and current status.

Stage 1 inventory, produced before any edits in this conversion round.
Source of truth: `subjects/business/js/**` (static app) plus `legacy.html` /
`assets/main-x5NJ3Ik5.js` (saved original). All counts were measured directly
from the JSON files, not taken from documentation.

## 1. Routes, views and aliases

Router: `js/core.js` — `register()`, `navigate()`, `current()`, `render()`
(falls back to `views.overview`). HTML entries load all view scripts, then `app.js`.

| Category | Route | File | Status |
|---|---|---|---|
| Core | `overview` (default/fallback) | `js/app.js` | present |
| Practice | `quiz`, `drill` | `js/views/quiz.js` | present |
| Practice | `practice`, `paper1` (alias) | `js/views/paper1.js` | present |
| Practice | `paper2` | `js/views/paper2.js` | present |
| Revision | `checklist` | `js/views/checklist.js` | present |
| Revision | `glossary` | `js/views/glossary.js` | present |
| Revision | `lessons` | `js/views/lessons.js` | present |
| Revision | `compare` | `js/views/compare.js` | present |
| Progress | `progress`, `dashboard`, `signin`, `sign-in`, `signup`, `sign-up` (aliases) | `js/views/progress.js`, `js/views/extras.js` | present |
| Mock exams | `mocks` | `js/views/mocks.js` | present — **new full-exam formats added in Stage 2** |
| Gamification | `boss-battle`, `boss` (alias) | `js/views/boss.js` | present |
| Study tools | `misc`, `review`, `sections`, `chapter-sheets`, `archive`, `study-space`, `achievements`, `avatar`, `themes`, `flashcards` | `js/views/misc.js` | present |
| AI | `ai-marker` | `js/views/ai-marker.js` | present — **pipeline replaced with CDN ESM in Stage 2** |
| Information | `extras`, `sources`, `help`, `export` | `js/views/extras.js` | present |
| Legacy aliases | `quick-quiz`, `challenge`, `studyspace` | `js/views/extras.js` | present |

All entries: `Business.html`, `index.html`, `subjects/business.html`, `legacy.html`.

## 2. Syllabus content and data banks (100% preserved)

| Data file | Records | Consumed by |
|---|---|---|
| `mcq-section1..6.json` | 2,000 each = **12,000** MCQs | `quiz.js`, `boss.js` |
| `paper1.json` | **6,000** sets / 24,000 questions (2/4/6/8-mark parts) | `paper1.js`, `mocks.js` |
| `paper2.json` | **3,000** cases / 24,000 questions (8/12-mark parts) | `paper2.js`, `mocks.js` |
| `verified-questions.json` | **189** official/specimen questions | `paper1.js` |
| `verified-p2-cases.json` | **11** official case inserts | `paper1.js` |
| `other-paper2-cases.json` | **1** additional insert | `paper1.js` |
| `verified-p1-cases.json` | 20 case objects | archive/reference |
| `glossary.json` | **275** terms | `glossary.js`, `misc.js`, `extras.js` |
| `syllabus-static.json` | **254** statements | `checklist.js` |
| `syllabus-sections.json` | **6** sections | section metadata |
| `compare-notes-static.json` | **165** notes | `compare.js` |
| `revision-summaries.json` | **29** summaries | `compare.js` |
| `lessons.json` | **6** sections / 24 lessons | `lessons.js` |
| `one-page-sheets.json` | **6** sheets | `misc.js` |
| avatar JSONs | 9 skin tones + 4 × 15 items | `misc.js` |

Six syllabus sections: 1 Understanding business activity · 2 People in business ·
3 Marketing · 4 Operations management · 5 Financial information and decisions ·
6 External influences on business activity.

## 3. UI controls / behaviour by category (no control removed)

- **Header**: EcBiz brand, Mock exam, Syllabus dropdown (checklist, sections,
  advantages/disadvantages + six chapter links), Resources dropdown (glossary,
  archive, progress, bug/suggestion), Local AI, Study Space, avatar,
  achievements, themes, theme toggle, 8 primary nav buttons, Boss Battle.
- **Overview**: hero, study cards, section revision pack (chapter summaries,
  section diagrams, consolidation document per section), MCQ knowledge practice.
- **MCQ quiz / drill / challenge**: section + chapter filters, set sizes,
  shuffle, refresh, Wrong Only (two-day rule), A/B/C/D options with green/red
  feedback and per-option explanations, exact banner text, coins, Daily/Weekly
  challenge countdown, flashcards/practice/review shortcuts.
- **Paper 1**: 3 modes (Topical, Official Past Papers, Paper 2 Specimen Insert),
  chapter/search/shuffle, part tabs a–d, one editor at a time, autosave drafts,
  bookmarks, flag, timer, AO highlight, mark scheme, model answer, Instant
  Examiner, save mark, hero Mock Exam / Study Space actions.
- **Paper 2**: case navigator, appendices 1–3, step/all modes, textarea autosave,
  timer, bookmarks, self-assessment with 8-mark bands and 12-mark Level gating,
  mark scheme rubric, model answer, Enable local AI, Instant Examiner, Flag issue,
  Submit for Assessment, ✏️ Self-Assess / Grade.
- **Checklist**: 254 statements, ratings, search, notes, CSV export, targeted
  practice, recall dialog, six section visual-diagram overlays.
- **Glossary / compare / lessons / boss / mocks / study tools / progress / export**:
  all controls listed in the live button audit retained (see verification log).

## 4. State and persistence

`EC.store` auto-prefixes all keys with `ecbiz_`. Logical keys include:
`coins`; quiz: `mcq_wrong`, `mcq_completed`, `challenge_history`; boss:
`boss_stage`, `boss_difficulty`, `boss_max_ammo`, `armour_id`, `char_id`,
`jetpack_unlocked`, `boss_battles_count`, `boss_wrong_questions`, `boss_filters`,
`mcq_review`, avatar keys; P1: `draft_*`, `p1_studio_state`, `p1_last_position`,
`question_flags`, `flagged_question_ids`, `bookmarked_questions`, `submissions`;
P2: `p2_drafts`, `p2_position`, `p2_submissions`, `p2_coins_awarded`,
`p2_bookmarks`; mocks: `mocks_results`, `submissions`, `completed_questions`;
checklist: `subpoint_ratings_v2`, `syllabus_notes_v1`; lessons:
`interactive_lessons_progress_v1`, `_hints_v1`, `_active_v1`; glossary:
`glossaryMastered`, `glossaryHideMastered`, `flashcards_known`; study-space and
theme/achievement keys. No key renamed or removed in this conversion.

## 5. Mock exam formats

Syllabus (`718123-2027-2029-syllabus_74cc6921.pdf`, §4) defines the real papers:

- **Paper 1 — Short Answer and Data Response**: 1 h 30 min, **80 marks**, four
  compulsory questions, mixture of short answers and structured data responses,
  stimulus material (tables, graphs, images).
- **Paper 2 — Case Study**: 1 h 30 min, **80 marks**, four compulsory questions
  based on a case-study insert with appendices (tables, graphs, extracts, ads).

Existing shortened formats (kept): Paper 1 Mock 30 min / 20 marks;
Paper 2 Full 60 min / 40 marks; Paper 2 Short 30 min / 20 marks.

Added in Stage 2 (following the specimen/syllabus format):
- **Full Paper 1 exam** — 1 h 30 min, 80 marks, 4 compulsory questions made from
  4 real cases × (2 + 4 + 6 + 8 = 20 marks each), with stimulus/data material.
- **Full Paper 2 exam** — 1 h 30 min, 80 marks, 4 compulsory questions based on
  one case-study insert (matching the real 0264 format), each with an 8-mark and
  a 12-mark part (4 × 20 = 80), with Appendices 1–3.

Both reuse the existing timer, navigator, review, mark scheme/model answer,
self-marking and `mocks_results` / `submissions` persistence.

## 6. Browser-side local AI — required configuration

No model-repo changes. Artifact `onnx/model_q4f16.onnx` remains downloaded by
the browser from `SemiLunarz/qwen3-0.6b-igcse-0264-onnx`.

Required ESM loader and pipeline (Stage 2 target):

```
import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3')
env.allowLocalModels = false
env.useBrowserCache = true
pipeline('text-generation', 'SemiLunarz/qwen3-0.6b-igcse-0264-onnx',
         { dtype: 'q4f16', device: 'webgpu' | 'wasm', progress_callback })
tokenizer.apply_chat_template(messages,
         { tokenize:false, add_generation_prompt:true, enable_thinking:false })
new TextStreamer(tokenizer,
         { skip_prompt:true, skip_special_tokens:true, callback_function })
generator(prompt, { max_new_tokens:760, do_sample:false, streamer })
```

- WebGPU first, graceful retry on `wasm`; deterministic marker always fallback.
- Download progress → status text **and** progress bar; generation → streamed
  output; friendly notice when `location.protocol === 'file:'`.
- Existing `EC.autoMark` result shape and AO caps must stay unchanged.

## 7. Static runtime / deployment

- All page assets use relative `./` paths; root homepage/Economics links already
  updated; outer entry `subjects/business.html` mirrors the PDF compatibility
  copies under `subjects/assets/aistudio/`.
- Zero build tools: plain HTML/CSS/JS + JSON, served by any static host.
- Legacy bundle retained at `assets/main-*.js` for `legacy.html` rollback only.
