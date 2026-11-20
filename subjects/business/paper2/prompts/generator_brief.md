# GENERATOR BRIEF — Cambridge IGCSE (0264) Paper 2, Wave sets
You are one of 8 Generator subagents. You produce **5 complete, original, 80-mark Paper 2 Case Study sets**. Your sets are marked `STATUS: UNVERIFIED` and will be adversarially audited; write as if a hostile examiner will read every figure.

## READ THESE FILES FIRST (absolute paths)
- Exemplar (style & format ONLY — do NOT copy its business, facts or wording): `C:\Users\jayde\Documents\GitHub\fresh\paper2\prompts\example_set.json`
- Syllabus whitelist & blacklist: `C:\Users\jayde\Documents\GitHub\fresh\paper2\prompts\syllabus_rules.md`

## HARD OUTPUT RULES
1. Write **one JSON file per set** to `C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_XX\<scenario_id>.json` (pretty-printed, 2-space indent, UTF-8). Create no other files. Do not modify anything else.
2. The JSON must parse. After writing each file, self-check it:
   `& "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe" -c "import json,sys; json.load(open(sys.argv[1], encoding='utf-8'))" "<path>"`
   (self-checking is NOT self-approval — auditors still decide.)
3. `scenario_id` exactly as assigned to you. `unit` = `"Paper 2 Case Study"`.
4. **8 questions, marks 8+12+8+12+8+12+8+12 = 80.** Keys exactly as in the exemplar. `3(a)` has `sub_parts` (i) 2m, (ii) 2m, (iii) 4m. `mark_scheme` keys exactly `knowledge_max_2` and `application_analysis_max_6` (8-mark part a), `level_1_1_to_4`, `level_2_5_to_8`, `level_3_9_to_12` (12-mark part b, incl. 3(b)), `working_marks` only for 3(a).
5. **All 8 questions applied to the named business**; every part (a) question_text MUST contain the business initials (e.g. LFF). Part (b) questions MUST contain the pattern `Which ... ? Justify your recommendation/decision/answer.` 1(b) discusses THREE options; 2(b) discusses TWO options; model answers end with an explicit recommendation/decision/conclusion that rejects alternatives.
6. NO pure definitions anywhere. NO blacklist content. All facts consistent with the insert; quoted figures must originate in the insert or be shown as an explicit computation FROM insert figures. **No unstated assumptions:** never invent component decompositions of variable cost, headcounts affected, hours worked (e.g. 2,000h), or pay-equals-minimum. If you cannot derive a figure from the insert and the arithmetic is not shown inline, keep the claim qualitative.

## MAIN_STEM (110–145 words — the gatekeeper counts whitespace-separated tokens)
MUST include ALL of these (exact phrasing so the gatekeeper can re-derive the maths):
- `<Name> (<INI>)` with 2–7 capital-letter initials, e.g. `Lakestone Fresh Foods (LFF)`
- legal structure: private limited company / public limited company / sole trader / partnership / cooperative
- sector & industry; `workforce of N` (N number of employees)
- leadership/organisational structure (e.g. democratic leadership / flat structure / hierarchical / autocratic)
- expansion decision with EXACT capital cost: e.g. `invest $850,000 in ...`
- financing choices (e.g. bank loan + retained profit / overdraft / share issue / hire purchase)
- `fixed costs of $X a year` ; `variable cost of $Y a unit` ; `selling price of $Z` ; `produces N units` (e.g. `produces 90,000 units a year`)
- an operational or HR problem (absenteeism, waste, defect rate, labour turnover, quality complaints, skills gap)
- named founder or leader (adds realism) — keep stem ≤145 words.

Choose NUMBERS so that: contribution per unit = Z − Y ≥ $3; break-even output = X ÷ (Z−Y) is a whole or ≤2dp number; margin of safety ≥ 5,000 units; ATC values sensible. **Show no formulas in the stem** — only raw data.

## APPENDIX 1 (Marketing/Ops extract, ≥120 chars, ≥4 numerical metrics)
One of: Advertisement Extract / Operations Log / Market Research Summary / Quality/Waste Report.
Include: concrete figures (units sold, defect rate, complaint counts, survey sample & %, delivery days, waste %, price points). Numbers here are reused in Q1, Q2 or Q4.

## APPENDIX 2 (Appendix 2 is `appendix_2_financial_data` — structured object)
`title`: `"Extract from the Statement of Financial Position of <Name> as at 31 March 2025 ($ '000)"` (liquidity sets) OR `"Extract from the Statement of Profit or Loss and Capital employed data of <Name> for the year ended 31 March 2025 ($ '000)"` (profitability sets).
`headers`: EXACTLY `["Financial Metric", "2024", "2025"]`. `rows`: EXACTLY 6 arrays `[label, "2024val", "2025val"]` (strings, comma-formatted, `$` omitted).
**LIQUIDITY sets must use these exact row labels**: `Inventories`, `Trade receivables`, `Cash and cash equivalents`, `Current liabilities`, `Non-current assets`, `Capital employed`.
**PROFITABILITY sets must use these exact row labels**: `Revenue`, `Cost of sales`, `Gross profit`, `Operating profit`, `Capital employed`, plus a 6th free row, e.g. `Interest payable`.
**Internal consistency (enforced):** Profitability sets: Gross profit = Revenue − Cost of sales EXACTLY, both years (integer $'000). Liquidity sets: no such constraint.
Choose figures so margins are clean to 1 decimal place where possible (e.g. 40.0%, 12.5%, 18.2%).

## APPENDIX 3 (Economic/News Bulletin, ≥80 chars)
THREE specific external changes with exact figures, e.g.: base interest rate rise to X.X%; minimum wage up X.X% to $X.XX; input-cost inflation X.X%; inflation X.X%; consumer spending +X.X%. Every figure must be usable in Q4(b).

## Q3(a) — sub-parts (i)/(ii) question_text MUST contain one of these exact phrases:
`break-even output`, `margin of safety`, `average total cost`, `contribution per unit`, `variable cost per unit`, `labour productivity`, `unit cost`.
model_answer format: `Formula: ... Substitution: ... = RESULT. Answer: <labels> units/$.` The gatekeeper recomputes from the stem and requires the exact value to appear in that model_answer (commas allowed).
(iii): `Explain four ways ...` with exactly 4 numbered, contextual uses.

## PART (b) PATTERNS (per ORCHESTRATOR RULING 2026-11-19)
- 1(b)/2(b) MUST carry the `Consider … Which …? Justify your recommendation/decision/answer.` pattern.
- 3(b) is schema-fixed (`Using Appendix 2 … Justify your answer.`) — do NOT add `Consider …`. If your 3(b) question text asks which ratio is the stronger evidence, the model answer MUST state that ratio and WHY in one explicit sentence.
- 4(b) is schema-fixed (`Using Appendix 3 … Which change will have the greatest impact? Justify your answer.`) — do NOT add `Consider …`.

## Q3(b) — MODEL ANSWER MUST contain lines exactly like:
LIQUIDITY sets:
`Current Ratio 2024 = 1.44 : 1`
`Current Ratio 2025 = 1.64 : 1`
`Acid Test Ratio 2024 = 0.94 : 1`
`Acid Test Ratio 2025 = 1.20 : 1`
(one line per year; you compute these from your rows: CA = Inventories + Trade receivables + Cash; CR = CA ÷ Current liabilities; AT = (CA − Inventories) ÷ Current liabilities. 2dp each.)
PROFITABILITY sets:
`Gross Profit Margin 2024 = 40.0%` / `Gross Profit Margin 2025 = 45.0%`
`Profit Margin 2024 = 12.5%` / `Profit Margin 2025 = 15.0%`   (Profit Margin = Operating profit ÷ Revenue × 100)
`ROCE 2024 = 18.0%` / `ROCE 2025 = 22.5%`              (ROCE = Operating profit ÷ Capital employed × 100)
Then `Detailed workings:` lines (must NOT contain the words "current ratio"/"acid test"/"gross profit margin"/"profit margin"/"ROCE" on calculation lines other than the labelled summary lines above — put evaluation in plain prose naming only e.g. "liquidity" or "margins"), then `Evaluation:` and `Conclusion:` with a justified improved/not improved judgement.

## qwen_marking_keys.valid_app_words (ALL 8 questions)
5–8 entries. For 1(a), 1(b), 2(a), 2(b), 4(a), 4(b): every entry MUST appear **verbatim (substring, case-insensitive)** in the combined insert (main_stem + appendices, incl. title/headers/rows text). Copy formatting EXACTLY as in the insert (e.g. `$850,000`, `64%`, `90,000`, `ready-meal`). For 3(a) and 3(b): entries may appear in the insert OR in that question's model_answer. Do not use values that appear nowhere.

## UNIQUENESS
Business name and initials must be unique — invent distinctive ones; do NOT reuse `LFF` (exemplar). Do not reuse another generator's known plot (new product/expansion angle each time). Avoid the exact sector clichés twice across your 5 sets: vary industry, country-flavoured setting (keep `$`), founder, leadership style, finance mix.

## QUALITY BAR (what auditors will reject)
- Part (a) anything resembling a definition; part (b) missing the `Which ... Justify ...` pattern or missing rejection of alternatives in the recommendation.
- Any blacklist theory (NPV/IRR/PESTLE/SWOT/gearing/debtor days/ABC/variance…), any invented ratio, any fact contradicting the insert.
- Word count outside 110–145; maths inconsistent (GP ≠ Rev−CoS; ratios that don't recompute); valid_app_words not substring-verbatim; wrong mark allocations; missing/extra JSON keys.
- Model answers under ~150 words for 8-mark questions and under ~250 words for 12-mark questions; generic non-contextual filler.
