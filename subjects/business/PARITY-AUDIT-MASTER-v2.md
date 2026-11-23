# Master Feature-Parity Audit — v2 (EcBiz Business, static conversion)

**Status:** verified snapshot, taken 2026-11-23 ~18:20 local time.
**Supersedes:** `PARITY-AUDIT-MASTER.md` (written 18:02) for *status labels only*. The original file is
kept untouched as a historical record; it was accurate when written but is now materially stale
because fixes landed between 18:07 and 18:20.
**Method:** six independent read-only comparisons of `subjects/business/**` against
`backup/20261123-1530-before-static-conversion/subjects/business/**`, plus targeted re-verification
of the highest-impact findings at 18:20.

> **Concurrency warning:** builder subagents were editing production files while this audit ran.
> Line numbers are a snapshot and will drift. Strings, function names and keys are stable anchors.
> Re-run a short verification pass after the builders finish before treating any "FIXED" label as final.

---

## 1. Verdict summary (current state)

| Area | v2 verdict | Original audit said |
|---|---|---|
| Data banks (24 JSON files) | **PASS** — no runtime data loss | PASS (correct) |
| Assets, PDFs, WASM, worker, routes, entries | **PASS** (2 low-severity omissions) | PASS (correct) |
| Quiz (controls, draft, confetti, shuffle) | **PASS** | PARTIAL — stale |
| Paper 1 (assessment drawer, AO, override) | **PASS** | PARTIAL — stale |
| Paper 2 (engine UI, re-evaluate, saved result) | **PASS** | PARTIAL — stale |
| Mocks (layout picker, columns, unseen filter) | **PASS** | PARTIAL — stale |
| Boss (mechanics, flag dialog) | **PARTIAL** — wardrobe still a page | PARTIAL (flag now fixed) |
| Progress (CSV, full result, Clear History) | **PASS** | PARTIAL — stale |
| Checklist (diagrams, glossary guidance) | **PASS with additions** | PARTIAL — stale |
| Lessons (24 lessons, WordDrop) | **PARTIAL** — confetti missing | PARTIAL (mostly stale) |
| Compare (165 notes, 495 flashcards) | **PASS** | PARTIAL — stale |
| Glossary, Extras | **PASS** | PASS (correct) |
| Study Space / avatar / themes / achievements | **PARTIAL–PASS** — cosmetics/audio/tracks ported; overlays still routes | PARTIAL — mostly stale |
| localStorage / migration | **PARTIAL** — several shape-mismatched aliases and 4 lost keys | PARTIAL — stronger than reported, but different gaps |
| **Local AI / marking engine** | **PARTIAL — open issue, see §4** | PARTIAL — under-specified |

No user-facing page, question bank, document or asset was lost. The remaining problems are
UI/behaviour fidelity, persistence regressions, and the AI engine.

---

## 2. Confirmed clean areas

### 2.1 Data (PASS)
All 24 production `data/*.json` map to backup sources; counts and field values verified:

- 12,000 MCQs (6 × 2,000)
- Paper 1: 6,000 sets / 24,000 parts (2/4/6/8 × 6,000) — `paper1.json` byte-identical to backup
- Paper 2: 3,000 cases / 24,000 parts (8/12 × 12,000) — `paper2.json` byte-identical
- 189 verified questions · 20 P1 cases · 11 + 1 P2 inserts
- 275 glossary terms · 254 syllabus statements · 6 sections · 165 compare notes · 29 summaries
- 6 sections / 24 lessons · 6 one-page sheets · 9 skin tones + 4 × 15 avatar items

`syllabus-static.json` is a lossless flatten with added `markScheme`/title fields (additive).
400 generated `paper2/sets/**` JSON files are not standalone in production, but their scenario IDs
and stems are contained in `paper2.json`, which is what the React app actually imported.
QA/staging JSON, prompts and build scripts are generation artifacts, not runtime data.

### 2.2 Assets / routes (PASS)
Nine hashed assets are byte-identical (bundle, WASM, worker, CSS, 3 WebP images, 2 PDFs).
Every backup `?open=`/`?tab=` value remains reachable; 25 unique route registrations, no duplicates;
all 15 scripts and all `EC.load()` targets resolve; all 15 JS files pass `node --check`.

Two low-severity omissions:
- `app.html` (Vite dev-only entry) is not carried over — no user-facing route or inbound link uses it.
- New plain entries omit OG/Twitter meta and the inline dark-theme boot script; retained in
  `legacy.html` and `404.html`.

### 2.3 Fixes that landed after the original audit (verified present now)
- **Quiz:** left-rail shortcuts, results buttons, challenge-debrief buttons, `ecbiz_quickquiz_state`
  draft resume, confetti on ≥70 % / correct challenge, original biased shuffle and seeded
  daily/weekly selection (`quiz.js`).
- **Mocks:** on-screen layout picker, compact toggle, stacked/columns rendering, `exam_layout` +
  legacy `mock_layout` migration, unseen-question filtering (`mocks.js`).
- **Paper 1:** "Cambridge Assessment Score Result" drawer, rule/AO/audit cards, override/BOD modal,
  Clear Draft, Reset filters, flag dialog, AO highlight viewer (`paper1.js`).
- **Paper 2:** local-AI engine UI, evaluating spinner, re-evaluate fix, Close Override fix, full
  stored `EvaluationResult` JSON, completion writes, full case context, Senior Examiner Notes,
  confetti (`paper2.js`).
- **Checklist:** all six interactive diagram overlays (Maslow, Herzberg, org chart, PLC,
  break-even simulator, finance/exchange matrix), factors tabs/flow, glossary guidance,
  RotateCcw/Brain icons (`checklist.js`).
- **Compare:** full 495-card flashcard deck (165 notes × 3), `ecbiz_recall_ratings`, first-point
  clue, hint, E/M/H "Your Revision Progress" table, in-place mode switching (`compare.js`).
- **Study Space / avatar / achievements:** 3 cosmetic themes, 4 ambient tracks + mixer, cosmetics
  shop, ghost/mini modes, resize clamp, per-hair SVGs, rarity badges, belt buckle, dialogs,
  confetti, toasts, "Ready to Claim" badge (`misc.js`).
- **Boss:** flag-issue dialog with reasons/confidence/note, sound cues, cooldown, scholar level (`boss.js`).
- **Progress:** full `EvaluationResult` JSON, stored-percentage grade badge, narrow Clear History,
  original CSV filename and categories (`progress.js`).
- **State:** `ecbiz_exam_layout`, quick-quiz draft, `ecbiz_recall_ratings`, `completed_questions`,
  `ecbiz_qwen3_cached_v2`, coin wallet sync and legacy aliases (`core.js` + views).

---

## 3. Remaining defects and losses (ranked)

### P0 — confirmed regressions

1. **Section topic clicks crash (`ReferenceError`).** `js/views/misc.js:880`:
   `EC.navigate("practice", { unit: node.getAttribute("data-code"), ... })` — `node` exists only
   inside `actionNode()` (`:47-50`) and is out of scope under `"use strict"`. Every topic labelled
   "Click any topic to practice questions" is dead; no section context is passed. The original
   `SectionBreakdownBox.tsx:90` calls `onSelectTopicForPractice(section, topic)`.
   **This contradicts original audit F11 ("topic clicks pass section context").**

2. **Focus-session count overwrite corrupts achievements.** `misc.js:1339` seeds `st.sessions`
   from `ecbiz_studySessions`; `:1770` overwrites legacy `ecbiz_completed_focus_sessions` with
   `st.sessions`; `:1970` reads that key for "Deep Focus Novice". A returning user with
   `ecbiz_completed_focus_sessions = 12` and no `ecbiz_studySessions` drops to **1** on their next
   session. The `ecbiz_focus_session_done` event payload also changed from `detail.count` to
   `detail.sessions` (no internal listener, but external listeners break).

3. **Two aliases exist but silently discard saved positions.**
   - `p1_studio_state ← practice_session_state` (`core.js:45`): backup stored
     `{practiceMode, activeScenarioId, activePart, selectedUnit}`; production reads
     `{unit, search, shuffle, activeId}` (`paper1.js:2012-2018`).
   - `p2_position ← p2_last_position` (`core.js:46`): backup stored
     `{scenarioId, questionIdx, updatedAt}`; production requires `{index, qidx}` (`paper2.js:1859`).

4. **Lost keys with no reader/writer in production:**
   - `ecbiz_p2_answers_<scenarioId>` — old standalone Paper 2 answers are orphaned; production
     uses `ecbiz_p2_drafts` with a different shape (`paper2.js:10`). CSV scanner still notices them.
   - `ecbiz_finance_exam_draft` — in-progress full mock answers/timer/case tab vanish.
   - `ecbiz_revised_topics` — per-topic "To Revise / Revised" ticks (`SectionBreakdownBox.tsx:237-273`)
     gone; absent from both previous audit documents.
   - `ecbiz_studyspace_active` — widget open/closed state gone, replaced by a route.
   - `ecbiz_qwen_preferred_tier`, `ecbiz_qwen3_cached_tier_v2` — inert with one model tier, but no
     migration; also means cached ONNX files from the React build are not addressed the same way.

### P1 — UI/behaviour fidelity

5. **Overview "Open diagram" misroutes and ignores its selector.** `app.js:331` sends users to
   `?open=sections`; `#diagramSection` is never read. Original `BusinessOverview.tsx:219-229` opens a
   diagram overlay for the chosen section.
6. **Chapter-summary overlay lost.** `app.js:330` is a page link; original overlay had
   `role="dialog"`, Escape handling and body scroll lock (`BusinessOverview.tsx:39-52,212-216`).
7. **Study Space "Interactive Visual" misroutes** (`misc.js:844` → `chapter-sheets`) instead of the
   original diagram modals; **chapter-sheet visuals flattened** to bullet lists, losing the original
   clickable stage/tier blocks (`OnePageSheetBlock.tsx`).
8. **Global app-wide overlays replaced by routes.** Study Space, Avatar and Achievements are pages
   (`app.js:101-104`); original `App.tsx:209-211,460-477` rendered them as global overlays with
   Escape close. Study Space widget also still lacks a close button.
9. **Theme shop is a route**, not the always-available header dropdown (`Header.tsx:625-723`).
10. **Mobile Local AI switcher absent.** `Header.tsx:829-857` had a mobile menu control
    ("Load Qwen 3 0.6B" / progress / "Active"); `js/app.js` only has the desktop dropdown.
11. **"Enable local AI" in Paper 1/Paper 2 does not load the model in place** — it navigates to the
    AI Marker page (`paper1.js:1475-1476`, `paper2.js:347-351`). Original loads in place.
12. **Lessons confetti missing** (zero references in `lessons.js`; original
    `InteractiveLessonsView.tsx:237`).
13. **Wardrobe is still a page** (`boss.js:2147` → `avatar`), not the original modal.
14. **CSV export residual.** `progress.js` emits only *rated* syllabus points and drops
    `point.text` / `lesson.title` "Details" values; original `progress-export.ts:18-32` emitted all
    254 with "Unrated" plus detail text. Original audit F13 overstates completion.
15. **Small string reductions**, e.g. lessons foot "Syllabus checklist" vs
    "0264 Syllabus Checklist". Pre-existing `Sources &amp; coverage` double-escape is unchanged.

### P2 — performance / architecture (not a feature loss)
16. **"Loading…" on static hosts.** `EC.render()` writes a placeholder (`core.js:124`) and replaces
    it when the view resolves. Data is fetched at runtime (`core.js:30-37`): `paper2.json` 50.8 MB,
    `paper1.json` 31.0 MB, six MCQ files ~16.3 MB total. Overview is synchronous; practice views
    pay a network + `JSON.parse` cost on first open. Files are cached per page session only, so a
    reload starts over. Mitigations: Brotli/gzip JSON, prefetch likely first view, split banks.
    A "Loading…" that *never* clears indicates a JS error or 404, not slow data.

---

## 4. Local AI — dedicated issue (the reported failure)

### 4.1 What the user observed (legacy React bundle / backup folder)
```
[QwenWorker] maxStorageBufferBindingSize: 2047 MB
[QwenWorker] 1. Loading ONNX session...
[QwenWorker] 2. Model ready
[QwenWorker] Model ready in 8979ms
[QwenWorker] 3. Running inference...
[QwenWebGPU] Worker request 2 failed: Local AI timed out. Reload the model to try again.
Local Qwen evaluation error, falling back to deterministic examiner: WebLLMEvaluationError
```
The model loaded successfully; the failure was in **inference**, not in marking logic.

### 4.2 Root cause in the React implementation
- `src/lib/engine/webllm.ts:960-1001`: every worker message calls `resetTimer()`;
  `setTimeout(() => fail(timeoutMessage), timeoutMs)`.
- Download requests use **300,000 ms** (`:1004`); generation uses the default **90,000 ms**
  from `runQwenChatCompletion` (`:884,1015-1023`) with the exact message above.
- `qwen.worker.ts:154` posts `{heartbeat:true}` on **every streamed token**, so an actively
  generating model never times out. Brace-depth tracking + `InterruptableStoppingCriteria`
  (`:141-181`) stop at the closing `}`.
- There is **no heartbeat before the first token**, so WebGPU shader compilation and prefill count
  against the 90 s window. Chrome's `powerPreference option is currently ignored on Windows`
  warning means it may have selected a slower adapter; 2047 MB passes the 320 MB buffer guard.
- On expiry, `fail()` clears handlers, `generate`'s catch calls `worker.terminate()` and nulls the
  engine — hence "Reload the model to try again" — then the evaluator falls back to the
  deterministic examiner.

**Why the backup folder behaved the same:** it contains the byte-identical bundle
(`assets/main-x5NJ3Ik5.js`) and worker. Additionally, `app.html` is a Vite source entry
(`./src/main.tsx`, un-runnable in a browser without Vite; no `node_modules` in the snapshot), and
`index.html`/`Business.html` are post-build copies that require `http://` — ES module scripts, the
module worker and cross-origin model fetches fail under `file://`.

### 4.3 The new static path has no watchdog at all
`js/views/ai-marker.js:1400-1452` is `generator(prompt, …).then(...).catch(...)`: no `setTimeout`,
no `timeoutMs`, no worker, no heartbeat, no stopping criteria, no abort. `loadLocalAI` (`:1298-1374`)
is likewise unbounded. Consequences:

- A stalled shader compile/download/generation leaves the promise pending forever: status stays
  "Local AI: marking your answer locally…", `streamFail()` never runs, **no deterministic fallback
  is produced**, and the user must reload.
- While `aiLoading` is true, the guard `if (aiLoading) return;` (`:1310`) makes all retry clicks
  no-ops until reload.
- Inference now runs on the **main thread**, so a stall freezes rendering and click handlers.
- Without early stopping, generation always runs to 760 tokens → more truncated JSON →
  `extractJsonObject()` returns `null` → deterministic fallback (graceful but slower).

### 4.4 Marking fidelity reduced vs the backup engine
| Feature | Backup | Static build |
|---|---|---|
| System prompt | 6-line `CAMBRIDGE_0264_SYSTEM_PROMPT` | one compressed sentence (`ai-marker.js:1405`) |
| Rubrics | six detailed per-type rubrics with field maxima and level gates | six one-line summaries (`:1376-1383`) |
| JSON schema | `question_type`, roles, `isolated_quote`, `subtotal`, `level_recommendation`, `additionalProperties:false` | six fields only |
| Truncated-JSON salvage | `salvageTruncatedJsonObject` / `closeJsonFragment` | none — unbalanced braces return `null` |
| Per-paragraph re-audit + deterministic backfill | `completeParagraphAudit` + `deterministicParagraphBackfill` | absent; AI rows selected by array index |
| Rule pre-scan / section-header zeroing | present | absent |
| Cache namespace / tier keys | `transformers-cache-0264-v4`, tier keys | main `ecbiz_qwen3_cached_v2` preserved; namespace/tier keys not set |
| Background download banners / device detection | sky/amber banners, real RAM detection | progress bar only; "Desktop WebGPU (16 GB RAM)" hard-coded |
| Result headings | "Senior Examiner Notes", "Key Next Steps", "Instant Examiner" | "Strengths / How to improve / Examiner notes" |

Deterministic rule coverage also narrowed: ~31 syllabus terms, 100 of 186 concrete case nouns,
the calculation checker (`checkCalculationAccuracy`) **entirely absent**, smaller causal/AO3/AO4
vocabularies, and a dedup ledger without the original concept-set escape hatch. AO caps, level
gates, exemplar matching, case-name exclusion and anti-halo duplicate rejection are preserved.

### 4.5 Recommended fixes
1. Restore a watchdog: keep 300 s for download, add a generous first-request timeout for inference,
   and post a heartbeat from the worker (or a timer) as soon as generation starts and while waiting
   for the first token. On expiry: abort, clear state, deterministic fallback.
2. Move inference back into a worker if possible; at minimum add an abort path and a busy guard.
3. Restore early JSON prefill/stopping criteria to avoid burning 760 tokens.
4. Port the full prompt, six rubrics, JSON schema, salvage, per-paragraph re-audit and backfill.
5. Set the pinned `env.cacheKey` and tier keys so cached weights are reused.
6. Add the mobile Local AI switcher and in-place "Enable local AI" in Paper 1/Paper 2.

---

## 5. Errors in the original audit document (corrected here)

- Many §3 `OPEN` labels (quiz shortcuts/draft/confetti, checklist diagrams, Compare flashcards,
  mocks layout, Paper 1 drawer/AO, Paper 2 override/re-evaluate, Boss flag, Progress result JSON)
  are **stale** — implemented during this session.
- **F11 is not actually fixed** — see §3 item 1 (`node` out of scope).
- §3.5 calls the AO language key an "addition"; original `AOHighlightViewer.tsx:375-417` has it —
  provenance error, not a loss.
- §3.14 says "all 24 data fetches return 200"; ~23 files are actually fetched
  (`syllabus-sections.json` is intentionally unused).
- §1 "~16 original keys absent" — closer to 14, and several are inert in the backup.
- F13 overstates CSV completion (see §3 item 14).
- The smoke test covered only the overview, so it could not catch the sections runtime error.

---

## 6. Recommended next steps

1. Fix P0 regressions: `misc.js:880` scope bug; focus-session count source; the two shape-mismatched
   aliases; migrate/restore the four lost key families.
2. Restore the local-AI watchdog and fidelity items (§4.5) — this is the only user-reported failure.
3. Restore overview/sections overlays and the remaining global-overlay/mobile-menu controls.
4. Finish CSV detail parity and lessons confetti; decide whether to keep chapter-sheet visuals as lists.
5. After builders finish, re-run a short verification pass and update the status labels in this file;
   treat §2 as the stable baseline and §3/§4 as the live work list.

---

## 7. Final resolution (post-build verification)

All items in §3 and §4 were fixed by a builder wave (one owner per file) and then
re-verified in a live headless browser.

**P0 — all fixed**
- §3.1 Section topic clicks: resolves the clicked node from the event and passes
  `unit`/`q`; verified `?open=practice&unit=1&q=1.1` with no `ReferenceError`.
- §3.2 Focus sessions: seeded from `completed_focus_sessions` first, both keys
  written, `detail.count` + `detail.sessions` emitted.
- §3.3 Shape-mismatched aliases: `practice_session_state` → `{unit,activeId,part}`
  and `p2_last_position` → `{index,qidx}` with all original fields preserved.
- §3.4 Lost keys: `revised_topics`, `studyspace_active`, `finance_exam_draft`
  (autosave + resume + legacy migration), qwen cache/tier flags and
  `p2_answers_*` visibility via the CSV scanner.

**P1 — all fixed**
- Overview diagram/chapter overlays, global Study Space/Avatar/Achievements
  overlays (all EC APIs present), theme-shop dropdown, mobile AI switcher.
- In-place "Enable local AI" in Paper 1 and Paper 2 with live labels/progress.
- Lessons first-rating confetti; CSV emits all 254 syllabus points with
  `Unrated` defaults and detail text, plus 24 lesson titles.
- Study Space Interactive Visual opens the diagram overlay; one-page sheet
  visuals are structured/clickable; Study Space has a Close Widget button.
- String fidelity restored in lessons/app; the `Sources &amp; coverage`
  double-escape is pre-existing and intentionally unchanged.

**P2 — addressed**: `js/fast-load.js` (loaded in both HTML entries) uses 24 gzip
data files (99.4 MB → 19 MB), DecompressionStream with raw-JSON fallback, idle
prefetch and hover warming.

**§4 Local AI — all fixed**: 300 s download watchdog and 180 s
heartbeat-resettable inference watchdog with deterministic fallback; `aiBusy`
guard; `env.cacheKey` + tier flags; early JSON brace-depth stopping; real device
detection + background-download banners; original result headings; 143-term AO1
vocabulary, 43/40 connectives, 186 case nouns, `checkCalculationAccuracy`,
dedup escape hatch; rule pre-scan, header zeroing, paragraph re-audit/backfill,
full JSON schema fields and salvage. Verified by 49/49 original + 43/43 new
harness checks.

**Final verification**: 16 JS files pass `node --check`; all 29 routes and
aliases render with zero console errors; section topic clicks, theme dropdown,
mobile drawer, mocks layout picker, checklist diagrams and compare flashcards
were exercised live. The canonical `subjects/business.html` redirects into the
app entry so all relative paths resolve on case-sensitive hosts.
