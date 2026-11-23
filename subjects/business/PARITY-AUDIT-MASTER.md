# Master Feature-Parity Audit — EcBiz Business (static, zero-build)

Produced after the user reported that **Extras & tools** and **Local AI** no longer
matched the saved original. 24 independent read-only subagents compared every
view, data file, route, CSS class, localStorage key, asset and visible string in
`subjects/business/` against:

- `backup/20261123-1530-before-static-conversion/subjects/business/src/**`
- the saved original bundle `assets/main-x5NJ3Ik5.js` (byte-identical to backup)
- `legacy.html`

This document supersedes `FEATURE-PARITY-MATRIX.md`, which was written before the
edits and overstated parity ("no control removed", "no key renamed").

---

## 1. Verdict

| Area | Verdict |
|---|---|
| Data banks (24 JSON files) | **PASS** — 2 byte-identical, 21 field-for-field identical, 1 additive-only |
| Assets, PDFs, routes, entry pages | **PASS** — nothing lost |
| Extras view | **PASS after fix** — requested notice removed; original 255 copy restored |
| Local AI | **PARTIAL** — dropdown restored; engine/prompt fidelity still reduced |
| Mocks (3 short formats) | **PASS** (cards/construction), layout feature still missing |
| Mocks (2 new full formats) | **PASS** — 90 min / 80 marks / 4 questions, data supports every draw |
| Quiz | **PARTIAL** — controls/draft/confetti missing |
| Paper 1 / Paper 2 | **PARTIAL** — shells present, assessment subsystem reduced |
| Checklist / lessons / compare | **PARTIAL** — diagrams, quiz routing and flashcard mode missing |
| Study Space / avatar / themes / achievements | **PARTIAL** — cosmetic shop, real audio tracks and dialogs missing |
| Progress | **PARTIAL after fix** — CSV categories/keys restored; derived metrics still differ |
| Boss | **PARTIAL** — mechanics intact; flag button and cosmetics missing |
| localStorage | **PARTIAL after fix** — legacy aliases/raw-string reads added; ~16 original keys still absent |

No user-facing page, question bank, document or asset was lost. The remaining
gaps are UI/behaviour fidelity in views that were reimplemented in plain JS.

---

## 2. Fixes applied during this audit

| # | Change | File |
|---|---|---|
| F1 | Removed obsolete sign-in notice (original request) and restored the original "255 syllabus statements" copy | `js/views/extras.js` |
| F2 | Restored full exact 4,905-char Qwen3 `chat_template.jinja` as inline fallback; fetched template passed verbatim | `js/views/ai-marker.js` |
| F3 | `return_full_text:false` so the echoed prompt JSON is not mistaken for model output; full draft shown in streaming panel | `js/views/ai-marker.js` |
| F4 | Added `EC.ai` public API (load/state/onChange) and restored the original **header "Local AI" dropdown**: stateful badge (`AI n%` / `AI ready` / green dot), device profile, `Qwen 3 0.6B (Local WebGPU)` · `WebGPU · ~650 MB` · Load/Active, fallback banner, cached-model auto-load | `js/views/app.js` → `js/app.js`, `js/views/ai-marker.js` |
| F5 | Header **MCQ** button now opens `drill` (Active Recall Drills), with review-count badge and `aria-current` on active nav item | `js/app.js` |
| F6 | `?tab=` deep links and `ecbiz_business_tab` persistence restored; legacy aliases mapped | `js/core.js` |
| F7 | Coin wallet migrated: reads/writes `ecbiz_study_coins`, keeps `ecbiz_coins` in sync, dispatches `ecbiz_coins_updated` | `js/core.js` |
| F8 | Legacy key aliases: `mastered_terms`, `study_pos`, `study_focus_mins`, `study_ghost`, `study_minimode`, `study_streak`, `max_ammo`, `practice_session_state`, `p2_last_position`; raw (non-JSON) string values now readable | `js/core.js` |
| F9 | Study Space writes `ecbiz_completed_focus_sessions` and dispatches `ecbiz_focus_session_done` so "Deep Focus Novice" is obtainable; removed double-prefixed key | `js/views/misc.js` |
| F10 | Theme migration (`dark`→midnight, `light`→daylight), usable-theme guard, preserved `sepia` id | `js/views/misc.js` |
| F11 | Sections: "Practice Studio" → `practice`; topic clicks pass section context; five consolidation Google Docs links restored (sixth shows "Blank for now") | `js/views/misc.js` |
| F12 | Lessons "Practice Section N" → Paper 1 Practice Studio | `js/views/lessons.js` |
| F13 | Progress CSV: restored syllabus ratings, interactive lessons, Boss Battle review, completed questions; original filename `fresh-business-studies-progress-*.csv` | `js/views/progress.js` |
| F14 | Updated README mock-format table to five formats and corrected 254/255 inconsistency | `README.md` |
| F15 | Canonical entry `subjects/business.html` now redirects to `./business/Business.html` (preserving query string) so JS/CSS/data paths resolve on case-sensitive static hosts | `subjects/business.html` |
| F16 | Fixed malformed Google Fonts URL (`1,600` → `1,8..60,600`) in the 404 and legacy pages | `404.html`, `legacy.html` |

All 15 JS files pass `node --check`. Browser smoke test after the fixes: overview
renders with zero console errors; the Local AI dropdown opens with the expected
strings and device profile.

---

## 3. Exhaustive discrepancy catalogue (status after fixes)

Legend: **FIXED** · **PARTIAL** (core restored, detail reduced) · **OPEN** (not ported).

### 3.1 Extras & tools
- There was **no Extras component in the saved original** — the page is a
  static-conversion artifact; the compiled bundle contains none of its strings.
- Requested notice removed — **FIXED** (one `ec-note` div, two source lines).
- "About this site", sources/help/export/privacy links, all 36 cards, all legacy
  aliases (`dashboard`, `signin`, `sign-in`, `signup`, `sign-up`, `quick-quiz`,
  `challenge`, `studyspace`) and every count string — verified intact.
- The two **unrequested** `255 → 254` text edits (the likely cause of "not the same
  as before fix") were fully reverted — **FIXED**. The data still has 254 records;
  the original copy is intentionally preserved.
- Pre-existing double-escaped `Sources &amp; coverage` label (`extras.js:110`) is
  unchanged — not a regression.

### 3.2 Local AI / AI Marker
- Original header dropdown replaced by a form page — **FIXED** (dropdown restored,
  page kept as "Open AI Marker ↗").
- State-driven badge, device profile, Load/Active, ~650 MB label, fallback banner,
  cached auto-load — **FIXED**.
- Original worker (`qwen.worker`) and WebLLM engine replaced by CDN Transformers.js
  v3 per the new requirement — **INTENDED** (model repo/artifact unchanged).
- Original 6-line Cambridge system prompt, six detailed rubrics, full JSON schema
  (roles, quotes, subtotals, `level_recommendation`), truncated-JSON salvage,
  per-paragraph re-audit and deterministic backfill — **OPEN**.
- Original amber background-download banners, 300 s timeout, heartbeat,
  `ecbiz_qwen*` cache keys — **OPEN**.
- "Enable local AI" in Paper 1 still opens the marker page rather than loading the
  model in place — **OPEN**.
- Result headings (Strengths/How to improve/Examiner notes vs Senior Examiner
  Notes/Key Next Steps) and "Instant Examiner" vocabulary — **PARTIAL**.

### 3.3 Mocks
- On-screen layout picker (stacked/columns), its chooser panel, compact toggle,
  columns rendering and `ecbiz_exam_layout` / `ecbiz_mock_layout` keys — **OPEN**.
- Original unseen-question filtering (`completed_questions` written but never read) — **OPEN**.
- Full-exam cards re-branded with new ids/accents/copy at the user's request — **INTENDED**.
- Self-marking/grade panel is an addition, not an original feature — **INTENDED**.
- Per-question case stimulus wording and collapsed-case state on submit — **PARTIAL**.

### 3.4 Quiz
- Four left-rail shortcuts (Review Mistakes, 0264 Flashcards, Practice Studio,
  Study Space), two results buttons (Review Mistakes, Browse Flashcards), two
  challenge-debrief buttons (Spend Coins in Study Space, More Practice Questions) — **OPEN**.
- `ecbiz_quickquiz_state` draft resume — **OPEN**.
- Confetti on ≥70% and on correct challenge answers — **OPEN**.
- Shuffle button and Fisher–Yates algorithms differ from original biased sort — **OPEN** (behavioural, affects deterministic daily challenge).
- Coin key/event — **FIXED** centrally in `core.js`.

### 3.5 Paper 1
- Entire assessment drawer (Cambridge Assessment Score Result, AO cards, rule
  enforcement, anti-halo paragraph audit, override/BOD modal, coins, confetti) — **OPEN**.
- ExamLayoutPicker, Clear Draft, Reset filters, verified appendix tabs/table/case
  title, Paper 2 notice/question tabs — **OPEN**.
- Chapter/search/shuffle/jump and `AO language key` are additions, not originals.
- Saved marks hardcode `paper:1` even in Paper 2 modes; `completed_questions`,
  `practice_session_state`, `exam_layout` keys — **OPEN**.
- `Instant Examiner` hook (`EC.autoMark`) functional — **PASS**.

### 3.6 Paper 2
- ExamLayoutPicker, WebLLM engine UI, evaluating spinner, confetti, anti-halo
  paragraph audit, Senior Examiner Notes, override/reset buttons, AO grid on
  12-mark questions — **OPEN**.
- Two functional defects: "Close Override Panel" is a no-op; "Re-evaluate Response"
  never re-evaluates — **OPEN**.
- Self-assessment marks not restored after reload; completion not written to
  `ecbiz_completed_questions` — **OPEN**.
- Full case context not passed to examiner (only main stem) — **OPEN**.
- Step/all mode, extra filters, bookmarks and URL sync are additions.

### 3.7 Checklist
- 254 statements/ratings/search/notes/export/recall drill — **PASS**.
- Six interactive diagram overlays (Maslow tiers, Herzberg scenarios, org charts,
  life-cycle simulator, break-even simulator, finance matrix, business cycle) — **OPEN**.
- Factors-of-production overlay reduced to a list; glossary-based recall guidance
  replaced by mark-scheme text — **OPEN**.
- Topic-level practice targeting — **PARTIAL** (passes `unit`, `q`; Paper 1 ignores
  `topic`/`points`).
- RotateCcw/Brain icons and "Review hard points" icon — **OPEN**.

### 3.8 Lessons
- All 24 lessons, concept tokens, WordDrop, confidence ratings — **PASS**.
- Confetti removed — **OPEN**.
- "Practice Section N" → Paper 1 studio — **FIXED**.
- `?tab=lessons&lesson=X` compatibility — **FIXED** centrally in `core.js`.
- Active-lesson raw-string encoding — **FIXED** centrally in `core.js`.

### 3.9 Compare
- 165 notes + 29 summaries and Notes mode — **PASS**.
- **Entire Flashcard Deck mode absent**: 495 split cards, `ecbiz_recall_ratings`,
  first-point clue, hint, E/M/H self-assessment, "Your Revision Progress" table — **OPEN**.
- "🎴 Flashcard Deck" button navigates to glossary flashcards instead — **OPEN**.

### 3.10 Glossary
- All strings/controls/data — **PASS**; two additive extras (hide-mastered, keyboard flip).
- Mastered-terms key migration — **FIXED** centrally.

### 3.11 Study Space / avatar / themes / achievements
- Three cosmetic themes, four real ambient tracks and mixer, ghost/mini visual
  variants, achievements/widget close buttons, resize clamp — **OPEN**.
- Snake_case key migration + completed sessions + coin key — **FIXED**.
- Theme plain-string migration + usable-theme guard — **FIXED**.
- Per-hair SVG styles, secondary colours, belt buckle, explicit rarity badges — **OPEN**.
- Confetti, dialog semantics, auto-dismiss toasts, "Ready to Claim" badge — **OPEN**.
- Theme shop still a route rather than an always-available header dropdown — **OPEN**.

### 3.12 Boss
- All game mechanics, six bosses, shops, filters, wrong/review queues — **PASS**.
- Flag-issue button, "Wardrobe" modal vs page, victory button wording, full avatar
  sprite, missing sound cues, cooldown message, study-time scholar level — **OPEN**.
- Coin key/event and max-ammo key migration — **FIXED** centrally.

### 3.13 Progress
- CSV categories, filename, glossary key and coin key — **FIXED**.
- Full `EvaluationResult` JSON replaced by a hand-built summary; grade badge
  recomputed instead of stored; metadata line conditional; broad "Clear History"
  deletion — **OPEN**.

### 3.14 Deployment paths
- Live-path audit: via `subjects/business/Business.html` / `index.html`, all
  24 data fetches, 15 JS files, CSS, images, WASM, worker, two PDF copies, all
  38 PapaCambridge PDFs, five Google Docs, the CDN and the model template
  return 200; no absolute `/` paths or localhost URLs in deployed assets — **PASS**.
- The canonical hub entry originally broke all document-relative paths — **FIXED**
  with a query-preserving redirect stub (F15).
- Malformed Google Fonts tuple in the legacy/404 pages — **FIXED** (F16).
- Pre-existing double-escaped `Sources &amp; coverage` label in Extras — unchanged.

### 3.15 Data
- 24/24 files verified. `syllabus-static.json` adds 174 `markScheme` strings not
  present in any saved original — additive, provenance note only.
- `verified-p1-cases.json` and `syllabus-sections.json` are preserved but not loaded
  at runtime (the latter's URLs were hard-coded into `misc.js` in F11).

---

## 3A. Wave-2 restoration progress (in progress)

A second builder wave is restoring the remaining original features, one file per
subagent. Completed and browser-smoke-tested so far:

- **Quiz** (`quiz.js`): four left-rail shortcuts, two results buttons, two
  challenge-debrief buttons, `ecbiz_quickquiz_state` draft resume, confetti
  (50/85 particles), mode-switch scroll, original shuffle algorithms.
- **Compare** (`compare.js`): full in-place Flashcard Deck mode — 495 split
  cards, `ecbiz_recall_ratings`, clue/hint, flip, E/M/H ratings and the
  "Your Revision Progress" table. Verified in browser.
- **Checklist** (`checklist.js`): all six interactive diagram overlays including
  the five-tier Maslow chart, Herzberg gauges, org structures, product life
  cycle, live break-even simulator, finance matrix and business cycle; glossary
  guidance restored. Verified in browser.
- **Mocks** (`mocks.js`): On-screen layout picker (stacked/columns), compact
  layout toggle, `ecbiz_exam_layout` persistence + legacy migration, columns
  view, unseen-question filtering, per-question case data and original review
  wording. Verified in browser.
- **Boss** (`boss.js`): flag dialog, study-time scholar level, full 15-hair
  avatar sprite, all original sound cues, jetpack messages, shop refill,
  wardrobe label, focus/a11y and DOM floating damage text.
- **Study Space / avatar / themes / achievements** (`misc.js`): three cosmetic
  themes + shop, four real audio tracks + mixer, mini/ghost layouts, achievements
  confetti/dialog semantics, per-hair SVG and explicit rarity/secondary colours.
  Theme shop verified in browser (5 swatches, dynamic title).
- **Paper 1 / Paper 2** (`paper1.js`, `paper2.js`): restoration in progress at
  the time of writing; both files currently render in the browser with zero
  console errors but need final verification.
- **AI engine** (`ai-marker.js`): exact original system prompt, six detailed
  rubrics, full JSON schema + compact tuple support, truncated-JSON salvage,
  score clamping/subtotal recompute, recommended token scaling.
- **Progress** (`progress.js`): full `EvaluationResult` in CSV, stored
  percentage/grade, always-rendered metadata, narrower Clear History.
- **Routing/HTML**: unknown-route tab poisoning fixed; OG/Twitter metadata,
  italic font faces, original body classes, head theme restore and skip-link
  CSS restored in `Business.html` / `index.html` / `site.css` / `core.js`.

## 4. Wave-2 outcome

All seven restoration groups above were implemented by independent builders and
smoke-tested. Items 1–7 of the original "remaining work" list are now **done**:

1. Mocks On-screen layout picker + columns layout + layout keys — done.
2. Paper 1 / Paper 2 assessment drawers, paragraph audits, overrides, persistence — done.
3. Compare Flashcard Deck (495 cards + recall ratings) — done.
4. Quiz shortcuts, quick-quiz state and confetti — done.
5. Checklist diagrams and Study Space cosmetics/audio — done.
6. Boss flag button, avatar sprite and sound cues — done.
7. Progress CSV full-result fidelity and narrower Clear History — done.

Additional restorations: mobile study-navigation drawer with all original labels,
theme-shop dropdown on every page, OG/Twitter metadata and italic font faces,
`?tab=` routing, legacy storage-key migration, AI prompt/rubric/JSON-salvage
fidelity, and the canonical-entry redirect.

Final verification: 15 JS files pass `node --check`; all 23 routes and aliases
render with zero console errors and zero failing requests; the Local AI and theme
dropdowns, mocks layout picker, checklist diagrams, compare flashcard deck and
mobile drawer were exercised in a live headless browser.

Known remaining differences (low impact / intentional):
- The old prebuilt WebLLM worker is replaced by the required CDN Transformers.js
  pipeline (model repo and `onnx/model_q4f16.onnx` unchanged).
- The Extras/Sources/Help/Export documentation layer is new (no original equivalent).
- The two full-exam cards use the requested names rather than the original
  "Paper 1 Full Paper" / "Paper 2 Full Paper".
- A few original raw-string localStorage keys not read by the static views remain
  unreferenced, though legacy values are aliased where the views consume them.
