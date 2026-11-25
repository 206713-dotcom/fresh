# EcBiz Video Pipeline — SHARED CONTRACT (all 18 subagents must read this first)

Project root: `C:\Users\jayde\Documents\GitHub\fresh`
Business app root: `C:\Users\jayde\Documents\GitHub\fresh\subjects\business`
Shard directory: `C:\Users\jayde\Documents\GitHub\fresh\subjects\business\tmp_shards`

## 0. READ-ONLY SOURCE MATERIAL (never modify these)
- `data/lessons.json` — textbook lesson copy, 6 units, chapter concepts with `[[term]]` glosses, `examTip`, `caseStudy`/scenario material.
- `data/syllabus-static.json` — exact 0264 syllabus statements per sub-topic plus AO1/AO2/AO3 notes.
- `data/syllabus-sections.json` — topic titles and key concepts.
- `data/glossary.json` — Cambridge 0264 definitions.

**STRICTLY FORBIDDEN TO OPEN-IN-WRITE OR EDIT:** `data/mcq-*.json`, `data/paper1.json`, `data/paper2.json`, `data/verified-*`, any `js/` file except the new `js/views/videos.js`, any HTML shell file (Tier 3 only). These are read-only for everyone; creators do not need them at all.

## 1. SHARD FILE MAP (exact filenames — no deviations)
Video IDs are sequential per unit: `VID_U1_01 … VID_U6_03`.

| Unit | Files (all inside `tmp_shards/`) | Chapters |
|---|---|---|
| 1 | `vid_u1_01.json` … `vid_u1_05.json` | 1.1 Business activity; 1.2 Economic sectors; 1.3 Enterprise/growth/size; 1.4 Types of business organisation; 1.5 Business & stakeholder objectives |
| 2 | `vid_u2_01.json` … `vid_u2_04.json` | 2.1 Motivating employees; 2.2 Organisation & management; 2.3 Recruitment/selection/training; 2.4 Internal & external communication |
| 3 | `vid_u3_01.json` … `vid_u3_04.json` | 3.1 Marketing/competition/customer; 3.2 Market research; 3.3 Marketing mix (PLC, pricing, place, promotion); 3.4 Marketing strategy, legal controls & foreign markets |
| 4 | `vid_u4_01.json` … `vid_u4_04.json` | 4.1 Production of goods & services; 4.2 Costs, scale & break-even; 4.3 Achieving quality production; 4.4 Location decisions |
| 5 | `vid_u5_01.json` … `vid_u5_05.json` | 5.1 Finance needs & sources; 5.2 Cash-flow forecasting & working capital; 5.3 Income statements; 5.4 Statement of financial position; 5.5 Analysis of accounts (ratios) |
| 6 | `vid_u6_01.json` … `vid_u6_03.json` | 6.1 Economic issues; 6.2 Environmental & ethical issues; 6.3 International economy (globalisation, exchange rates, tariffs, quotas) |

Total: **25 videos**. Exactly one shard per video.

## 2. EXACT SHARD SCHEMA (do not add/remove top-level keys)
```json
{
  "video_id": "VID_U4_02",
  "unit_number": 4,
  "unit_title": "Unit 4: Operations management",
  "chapter_code": "4.2",
  "chapter_title": "Costs, scale of production and break-even analysis",
  "video_title": "Visualising Break-Even Charts & Margin of Safety",
  "target_duration_sec": 240,
  "status": "UNVERIFIED",
  "learning_objectives": ["...", "...", "..."],
  "scenes": [
    {
      "scene_number": 1,
      "start_sec": 0,
      "end_sec": 18,
      "visual_type": "animated_scenario_hook",
      "on_screen_title": "Can Maya's Bakery Cover Its Costs?",
      "on_screen_labels": ["Fixed Rent: $2,000/month", "Flour: $2/cake", "Price: $6/cake"],
      "animation_directives": {
        "layout": "split_screen_left_diagram_right_metrics",
        "elements": [
          { "type": "icon_factory", "id": "bakery", "label": "Maya's Artisan Bakery" },
          { "type": "animated_counter", "target": "fixed_cost", "from": 0, "to": 2000, "prefix": "$" }
        ],
        "camera_motion": "smooth_zoom_into_cost_breakdown",
        "visual_beats": [
          { "at_sec": 0, "directive": "Show empty bakery counter" },
          { "at_sec": 8, "directive": "Rent coin stack animates in" }
        ]
      },
      "voiceover_script": "Imagine Maya opens a small bakery...",
      "word_count": 48,
      "syllabus_concepts_tagged": ["fixed costs", "variable costs", "break-even output"]
    }
  ],
  "end_of_video_recap_quiz": {
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correct_index": 0,
    "visual_explanation": "..."
  }
}
```

Required top-level keys exactly: `video_id, unit_number, unit_title, chapter_code, chapter_title, video_title, target_duration_sec, status, learning_objectives, scenes, end_of_video_recap_quiz`.
Required scene keys exactly: `scene_number, start_sec, end_sec, visual_type, on_screen_title, on_screen_labels, animation_directives, voiceover_script, word_count, syllabus_concepts_tagged`.
`animation_directives` must contain `layout` (string), `elements` (array of objects), and `camera_motion` (string); `visual_beats` is REQUIRED for any scene longer than 15 seconds. `axes`, `lines`, `highlight_intersection`, `flow_nodes`, `org_chart` etc. may be added inside `animation_directives` as extra keys.

### Hard numeric/structural gates (Tier 3 will verify mechanically)
1. `status` = `"UNVERIFIED"` on every shard at creation time.
2. `target_duration_sec` integer 180–300.
3. 6–9 scenes per video. First scene `start_sec` = 0; each scene `end_sec` = next `start_sec`; last `end_sec` = `target_duration_sec`. No gaps/overlaps. Each scene duration 8–40 seconds.
4. Any scene longer than 15 s MUST include `visual_beats` (each beat `at_sec` within scene, consecutive beats ≤15 s apart).
5. Voiceover pacing: actual words in `voiceover_script` ÷ scene duration must be **2.25–2.60 words/sec** (135–156 wpm). `word_count` must equal actual word count (±0). Use plain ASCII word counting: `.split()` on whitespace after stripping punctuation at token edges — so avoid exotic punctuation.
6. Every `on_screen_labels` entry ≤ 18 words. Every `on_screen_title` ≤ 12 words. No "wall of text".
7. All colours are uppercase hex `#RRGGBB`.
8. All `video_id` values globally unique; each business scenario/case name globally unique across all 25 videos (invent fresh names — do not reuse).
9. `end_of_video_recap_quiz`: exactly 4 options, `correct_index` 0–3, and `visual_explanation` describes a concrete on-screen animation.

## 3. BLACKLIST — INSTANT REJECTION if any appears in voiceover, labels, titles, quiz text, or element labels
Case-insensitive regex-free list (auditors search for these literal/substring forms):
`McGregor`, `Theory X`, `Theory Y`, `Mayo`, `Hawthorne`, `Ansoff`, `Boston Matrix`, `BCG`, `Critical Path`, `CPA`, `gearing`, `investment appraisal`, `NPV`, `net present value`, `ARR`, `accounting rate of return`, `payback period`, `internal rate of return`, `Mendelow`, `Porter's Five Forces`, `Porter`, `SWOT analysis`, `decision tree`, `share price maximisation`, `shareholder value analysis`, `PED formula`, `price elasticity of demand =`, `PED =`, `elasticity calculation`, `A-Level`, `A level`, `9609`, `0450`, `Balance Sheet`, `balance sheet`, `Profit and Loss Account`, `profit and loss account`, `Acid Test Ratio` (must be hyphenated `Acid-Test Ratio`), `labour turnover formula`, `capital employed =` inside Unit 6.

Allowed (do NOT flag): `Maslow`, `Herzberg`, `Taylor`, `scientific management`, `Hygiene factors`, `motivators`, `conceptual PED` (describe revenue direction verbally, never compute a coefficient), `Statement of Financial Position`, `Income Statement`, `Acid-Test Ratio`, `Current Ratio`, `Gross Profit Margin`, `Profit Margin`, `ROCE`.

## 4. PEDAGOGICAL CONTRACT (AO coverage)
Every video must contain:
- **AO1** exact 0264 textbook definition(s) taken from `data/lessons.json` / `data/syllabus-static.json` / `data/glossary.json`. Use exact exam wording, e.g. `Statement of Financial Position`, `Income Statement`, `Acid-Test Ratio`, `added value`, `opportunity cost`.
- **AO2** at least one concrete animated business scenario with named business, numbers, and on-screen motion (pipes, arrows, charts, org charts, funnels, curves, merges).
- **AO3** one causal chain ("because … therefore … so …") in voiceover.
- **AO4** explicit two-sided evaluation (advantage AND limitation / pro AND con) in a dedicated scene, with on-screen split-screen labels.
- A final recap quiz that tests application, not recall only.
- Visual types must be concrete: `animated_scenario_hook`, `flow_diagram`, `interactive_graph_build`, `split_screen_comparison`, `org_chart_morph`, `funnel_animation`, `curve_reveal`, `formula_substitution`, `timeline_animation`, `evaluation_split`, `recap_quiz`. Avoid `text_slide`, `bullet_list`, `title_card_only`.

## 5. UNIT-SPECIFIC MATH RULES (Tier 2B recalculates every number)
- **Unit 4**: break-even output = fixed costs ÷ (price − variable cost per unit). Margin of safety = actual output − break-even output. Labour productivity = output ÷ labour input. Total cost = fixed + variable. Plot axes with coherent coordinate geometry. All example numbers must be internally consistent across scenes.
- **Unit 5**: net cash flow = inflow − outflow; closing balance = opening + net cash flow; gross profit = revenue − cost of sales; profit = gross profit − expenses; Current Ratio = current assets ÷ current liabilities; Acid-Test Ratio = (current assets − inventories) ÷ current liabilities; GPM = gross profit ÷ revenue × 100; PM = profit ÷ revenue × 100; ROCE = profit ÷ capital employed × 100. State results to 2 d.p. where non-integer.
- **Unit 6**: appreciation makes imports cheaper / exports dearer; depreciation makes imports dearer / exports cheaper. Any exchange-rate conversion must be arithmetically correct. No PED coefficient calculations.

## 6. AUDIT OUTPUT FORMAT (Tier 2A and Tier 2B only)
Write one file: `tmp_shards/audit_syl_u{N}.json` or `tmp_shards/audit_vis_u{N}.json`:
```json
{
  "auditor_id": "SYL-VID-AUD-01",
  "target_unit": 1,
  "verdict": "APPROVED_BY_SYL_AUD",
  "shards": {
    "vid_u1_01.json": {
      "verdict": "APPROVED_BY_SYL_AUD",
      "notes": [],
      "blacklist_hits": [],
      "scene_fixes": []
    }
  },
  "summary": "..."
}
```
For rejection use verdict `REJECT_SYLLABUS` (Tier 2A) or `REJECT_TECHNICAL` (Tier 2B), and put exact scene numbers/timestamps plus concrete correction instructions in `scene_fixes`. Per-shard verdicts may differ; the overall verdict is `APPROVED_*` only if every shard is approved.

## 7. TIER BOUNDARIES
- Tier 1 creators: write ONLY their assigned `vid_u{N}_XX.json` shards with `status: UNVERIFIED`. Never approve. Never edit another unit's files. Never edit audit files.
- Tier 2A auditors: read assigned shards; write ONLY their `audit_syl_u{N}.json`. Never edit video shards.
- Tier 2B auditors: read assigned shards (orthogonal unit assignment); write ONLY their `audit_vis_u{N}.json`. Never edit video shards.
- Tier 3 (Main Orchestrator): runs gatekeeper, merges, renders, wires UI. Only Tier 3 may set final `APPROVED` status.
