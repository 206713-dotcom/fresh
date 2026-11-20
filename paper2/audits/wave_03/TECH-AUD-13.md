# TECH-AUD-13 — Tier 2B Schema/Math/Grounding Audit — Wave 03
**Auditor:** TECH-AUD-13 (Tier 2B schema/math/grounding)
**Date:** 2026-11-20
**Sets audited:** P2_SET_181, P2_SET_182, P2_SET_183, P2_SET_184, P2_SET_185, P2_SET_216, P2_SET_217, P2_SET_218, P2_SET_219, P2_SET_220 (wave_03)
**Live files audited** (sets/wave_03/*.json, read-only): identical to the staged copies (SHA-256 verified). No live file was modified.
**Staged copies:** `C:\Users\jayde\AppData\Local\Temp\opencode\w03t13\` (10 files, created 2026-11-20)

---

## 0. File existence & JSON parse

| File | Exists | Parses | Top-level keys | scenario_id | unit | Stem words |
|---|---|---|---|---|---|---|
| P2_SET_181.json | ✓ | ✓ | ['scenario_id','unit','case_study_insert','questions'] | P2_SET_181 | Paper 2 Case Study | 132 |
| P2_SET_182.json | ✓ | ✓ | ['scenario_id','unit','case_study_insert','questions'] | P2_SET_182 | Paper 2 Case Study | 141 |
| P2_SET_183.json | ✓ | ✓ | ['scenario_id','unit','case_study_insert','questions'] | P2_SET_183 | Paper 2 Case Study | 143 |
| P2_SET_184.json | ✓ | ✓ | ['scenario_id','unit','case_study_insert','questions'] | P2_SET_184 | Paper 2 Case Study | 126 |
| P2_SET_185.json | ✓ | ✓ | ['scenario_id','unit','case_study_insert','questions'] | P2_SET_185 | Paper 2 Case Study | 131 |
| P2_SET_216.json | ✓ | ✓ | ['scenario_id','unit','case_study_insert','questions'] | P2_SET_216 | Paper 2 Case Study | 121 |
| P2_SET_217.json | ✓ | ✓ | ['scenario_id','unit','case_study_insert','questions'] | P2_SET_217 | Paper 2 Case Study | 123 |
| P2_SET_218.json | ✓ | ✓ | ['scenario_id','unit','case_study_insert','questions'] | P2_SET_218 | Paper 2 Case Study | 123 |
| P2_SET_219.json | ✓ | ✓ | ['scenario_id','unit','case_study_insert','questions'] | P2_SET_219 | Paper 2 Case Study | 125 |
| P2_SET_220.json | ✓ | ✓ | ['scenario_id','unit','case_study_insert','questions'] | P2_SET_220 | Paper 2 Case Study | 118 |

All stems within the 110–145 word band; every set has the exact 8 questions in order (1a, 1b, 2a, 2b, 3a, 3b, 4a, 4b) and unit "Paper 2 Case Study".

---

## 1. Gatekeeper

### 1a. Staged-copy run (as briefed) — VERBATIM

Command: `& "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe" C:\Users\jayde\Documents\GitHub\fresh\paper2\scripts\gatekeeper.py --sets-dir C:\Users\jayde\AppData\Local\Temp\opencode\w03t13`

```
==============================================================================
GATEKEEPER REPORT  |  checked 10 set(s)
==============================================================================
[FAIL] P2_SET_181  (C:\Users\jayde\AppData\Local\Temp\opencode\w03t13\P2_SET_181.json)
    ERROR: business initials 'VDO' already used by set P2_SET_181
    ERROR: scenario_id 'P2_SET_181' already used in P2_SET_181.json
[FAIL] P2_SET_182  (C:\Users\jayde\AppData\Local\Temp\opencode\w03t13\P2_SET_182.json)
    ERROR: business initials 'BRE' already used by set P2_SET_182
    ERROR: scenario_id 'P2_SET_182' already used in P2_SET_182.json
[FAIL] P2_SET_183  (C:\Users\jayde\AppData\Local\Temp\opencode\w03t13\P2_SET_183.json)
    ERROR: business initials 'SBV' already used by set P2_SET_183
    ERROR: scenario_id 'P2_SET_183' already used in P2_SET_183.json
[FAIL] P2_SET_184  (C:\Users\jayde\AppData\Local\Temp\opencode\w03t13\P2_SET_184.json)
    ERROR: business initials 'GSM' already used by set P2_SET_184
    ERROR: scenario_id 'P2_SET_184' already used in P2_SET_184.json
[FAIL] P2_SET_185  (C:\Users\jayde\AppData\Local\Temp\opencode\w03t13\P2_SET_185.json)
    ERROR: business initials 'AHF' already used by set P2_SET_185
    ERROR: scenario_id 'P2_SET_185' already used in P2_SET_185.json
[FAIL] P2_SET_216  (C:\Users\jayde\AppData\Local\Temp\opencode\w03t13\P2_SET_216.json)
    ERROR: business initials 'WPB' already used by set P2_SET_216
    ERROR: scenario_id 'P2_SET_216' already used in P2_SET_216.json
[FAIL] P2_SET_217  (C:\Users\jayde\AppData\Local\Temp\opencode\w03t13\P2_SET_217.json)
    ERROR: business initials 'WLW' already used by set P2_SET_217
    ERROR: scenario_id 'P2_SET_217' already used in P2_SET_217.json
[FAIL] P2_SET_218  (C:\Users\jayde\AppData\Local\Temp\opencode\w03t13\P2_SET_218.json)
    ERROR: business initials 'FGS' already used by set P2_SET_218
    ERROR: scenario_id 'P2_SET_218' already used in P2_SET_218.json
[FAIL] P2_SET_219  (C:\Users\jayde\AppData\Local\Temp\opencode\w03t13\P2_SET_219.json)
    ERROR: business initials 'AET' already used by set P2_SET_219
    ERROR: scenario_id 'P2_SET_219' already used in P2_SET_219.json
[FAIL] P2_SET_220  (C:\Users\jayde\AppData\Local\Temp\opencode\w03t13\P2_SET_220.json)
    ERROR: business initials 'AEB' already used by set P2_SET_220
    ERROR: scenario_id 'P2_SET_220' already used in P2_SET_220.json
==============================================================================
Sets passed: 0/10   |   failed: 10
```

**Interpretation of the staged FAIL (artifact, not a set defect).** The gatekeeper seeds its duplicate-detection tables from `paper2/sets/**/*.json` and `paper2/waves/*.json` — but the briefed staging directory lives outside `paper2/sets`, so the exclusion `if str(Path(args.sets_dir).resolve()) in str(wf.resolve()): continue` never fires. The staged copies therefore "collide" only with the **live repo copies of the very same files**. Proof:

1. SHA-256 of staged vs live is **identical for all 10 files** (verified with Get-FileHash; see header of this report).
2. In every error above, the "conflicting" set is the same scenario_id as the checked file (e.g. `'VDO' already used by set P2_SET_181` for staged P2_SET_181.json). No error names any *other* set.
3. `paper2/waves/` is **empty (0 files)**, so it contributed nothing to the seeding.
4. All remaining gatekeeper checks (structure, marks, math, valid_app_words, appendix consistency) ran on the staged copies and reported **zero additional errors** — the 20 errors above are the only output.

### 1b. Live run on the live wave — VERBATIM

Command: `& "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe" C:\Users\jayde\Documents\GitHub\fresh\paper2\scripts\gatekeeper.py --sets-dir C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03`

```
==============================================================================
GATEKEEPER REPORT  |  checked 40 set(s)
==============================================================================
[PASS] P2_SET_181  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_181.json)
[PASS] P2_SET_182  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_182.json)
[PASS] P2_SET_183  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_183.json)
[PASS] P2_SET_184  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_184.json)
[PASS] P2_SET_185  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_185.json)
[PASS] P2_SET_186  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_186.json)
[PASS] P2_SET_187  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_187.json)
[PASS] P2_SET_188  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_188.json)
[PASS] P2_SET_189  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_189.json)
[PASS] P2_SET_190  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_190.json)
[PASS] P2_SET_191  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_191.json)
[PASS] P2_SET_192  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_192.json)
[PASS] P2_SET_193  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_193.json)
[PASS] P2_SET_194  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_194.json)
[PASS] P2_SET_195  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_195.json)
[PASS] P2_SET_196  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_196.json)
[PASS] P2_SET_197  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_197.json)
[PASS] P2_SET_198  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_198.json)
[PASS] P2_SET_199  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_199.json)
[PASS] P2_SET_200  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_200.json)
[PASS] P2_SET_201  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_201.json)
[PASS] P2_SET_202  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_202.json)
[PASS] P2_SET_203  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_203.json)
[PASS] P2_SET_204  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_204.json)
[PASS] P2_SET_205  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_205.json)
[PASS] P2_SET_206  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_206.json)
[PASS] P2_SET_207  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_207.json)
[PASS] P2_SET_208  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_208.json)
[PASS] P2_SET_209  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_209.json)
[PASS] P2_SET_210  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_210.json)
[PASS] P2_SET_211  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_211.json)
[PASS] P2_SET_212  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_212.json)
[PASS] P2_SET_213  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_213.json)
[PASS] P2_SET_214  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_214.json)
[PASS] P2_SET_215  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_215.json)
[PASS] P2_SET_216  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_216.json)
[PASS] P2_SET_217  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_217.json)
[PASS] P2_SET_218  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_218.json)
[PASS] P2_SET_219  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_219.json)
[PASS] P2_SET_220  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_220.json)
==============================================================================
Sets passed: 40/40   |   failed: 0
```

**Gatekeeper verdict for the 10 audited sets: PASS (zero genuine errors).** Live run on the wave directory: 40/40 pass, 0 failures; the gatekeeper's own 3(a) (i)/(ii) and 3(b) ratio recompute checks all passed for the audited sets.

---

## 2. Independent recalculation (from main_stem; 3(b) from appendix 2 rows)

Formulas used (gatekeeper + briefs): contribution = SP − VC; break-even = FC ÷ contribution; margin of safety = output − break-even; ATC = FC ÷ output + VC. Liquidity 3(b): CA = Inventories + Trade receivables + Cash; CR = CA ÷ Current liabilities; AT = (CA − Inventories) ÷ Current liabilities. Profitability 3(b): GPM = GP ÷ Revenue × 100; PM = Operating profit ÷ Revenue × 100; ROCE = Operating profit ÷ Capital employed × 100. Values below were re-derived by hand from the staged copies; every restated value in each set's model answers matches (within gatekeeper tolerances: ±0.06 ratio, ±0.75 p.p. percentage, ±0.5% money).

**P2_SET_181 — Valle Dorado Olive Oil (liquidity)**
- 3(a): Contribution = $14.60 − $8.20 = **$6.40** (3a ii ✓); Break-even = $288,000 ÷ $6.40 = **45,000 units** (3a i ✓); MOS = 95,000 − 45,000 = **50,000 units** (3a iii ✓); ATC = $288,000 ÷ 95,000 + $8.20 = **$11.2316 ≈ $11.23** (3a iii ✓).
- 3(b): CA24 = 210 + 150 + 80 = 440 → CR = 440/260 = **1.69**; AT = (440 − 210)/260 = **0.88**. CA25 = 180 + 190 + 95 = 465 → CR = 465/235 = **1.98**; AT = (465 − 180)/235 = **1.21**. (Model answers: 1.69 / 1.98, 0.88 / 1.21 ✓.)

**P2_SET_182 — Bramblewick Free-Range Eggs (liquidity)**
- 3(a): Contribution = $9.50 − $4.70 = **$4.80** (✓); Break-even = $216,000 ÷ $4.80 = **45,000** (✓); MOS = 105,000 − 45,000 = **60,000** (✓); ATC = $216,000 ÷ 105,000 + $4.70 = **$6.7571 ≈ $6.76** (✓).
- 3(b): CA24 = 140 + 90 + 35 = 265 → CR = 265/180 = **1.47**; AT = (265 − 140)/180 = **0.69**. CA25 = 170 + 75 + 50 = 295 → CR = 295/150 = **1.97**; AT = (295 − 170)/150 = **0.83**. (Model: 1.47 / 1.97, 0.69 / 0.83 ✓.)

**P2_SET_183 — Stonebarrow Vineyard & Wine Co-operative (liquidity)**
- 3(a): Contribution = $16.80 − $9.60 = **$7.20** (✓); Break-even = $360,000 ÷ $7.20 = **50,000** (✓); MOS = 120,000 − 50,000 = **70,000** (✓); ATC = $360,000 ÷ 120,000 + $9.60 = **$12.60** (✓).
- 3(b): CA24 = 320 + 210 + 60 = 590 → CR = 590/300 = **1.97**; AT = (590 − 320)/300 = **0.90**. CA25 = 290 + 240 + 85 = 615 → CR = 615/275 = **2.24**; AT = (615 − 290)/275 = **1.18**. (Model: 1.97 / 2.24, 0.90 / 1.18 ✓.)

**P2_SET_184 — Goldensheaf Milling Company (liquidity)**
- 3(a): Contribution = $18.50 − $11.30 = **$7.20** (✓); Break-even = $540,000 ÷ $7.20 = **75,000** (✓); MOS = 150,000 - 75,000 = **75,000** (✓); ATC = $540,000 ÷ 150,000 + $11.30 = **$14.90** (✓).
- 3(b): CA24 = 260 + 330 + 95 = 685 → CR = 685/480 = **1.43**; AT = (685 − 260)/480 = **0.89**. CA25 = 230 + 360 + 70 = 660 → CR = 660/430 = **1.53**; AT = (660 − 230)/430 = **1.00**. (Model: 1.43 / 1.53, 0.89 / 1.00 ✓.)

**P2_SET_185 — Amberline Honey Farm (liquidity)**
- 3(a): Contribution = $8.40 − $3.60 = **$4.80** (✓); Break-even = $144,000 ÷ $4.80 = **30,000** (✓); MOS = 80,000 - 30,000 = **50,000** (✓); ATC = $144,000 ÷ 80,000 + $3.60 = **$5.40** (✓).
- 3(b): CA24 = 75 + 40 + 25 = 140 → CR = 140/95 = **1.47**; AT = (140 − 75)/95 = **0.68**. CA25 = 62 + 55 + 38 = 155 → CR = 155/80 = **1.94**; AT = (155 − 62)/80 = **1.16**. (Model: 1.47 / 1.94, 0.68 / 1.16 ✓.)

**P2_SET_216 — Wexley Plasterboard (profitability)**
- 3(a): Contribution = $12.50 − $7.50 = **$5.00** (✓); Break-even = $600,000 ÷ $5.00 = **120,000** (✓); MOS = 170,000 - 120,000 = **50,000** (✓); ATC = $600,000 ÷ 170,000 + $7.50 = **$11.03** (✓).
- 3(b): GP24 = 8,400 - 5,040 = 3,360; GP25 = 9,600 - 5,280 = 4,320 (appendix_2 consistency ✓). GPM24 = 3,360/8,400 = **40.0%**; GPM25 = 4,320/9,600 = **45.0%**. PM24 = 1,050/8,400 = **12.5%**; PM25 = 1,440/9,600 = **15.0%**. ROCE24 = 1,050/6,000 = **17.5%**; ROCE25 = 1,440/7,200 = **20.0%**. (Model: 40.0/45.0, 12.5/15.0, 17.5/20.0 ✓.)

**P2_SET_217 — Wrenford Limestone Walling (profitability)**
- 3(a): Contribution = $18.00 - $10.50 = **$7.50** (✓); Break-even = $375,000 ÷ $7.50 = **50,000** (✓); MOS = 72,000 - 50,000 = **22,000** (✓); ATC = $375,000 ÷ 72,000 + $10.50 = **$15.71** (✓).
- 3(b): GP24 = 4,200 - 2,310 = 1,890; GP25 = 4,900 - 2,450 = 2,450 (consistency ✓). GPM24 = 1,890/4,200 = **45.0%**; GPM25 = 2,450/4,900 = **50.0%**. PM24 = 525/4,200 = **12.5%**; PM25 = 735/4,900 = **15.0%**. ROCE24 = 525/2,625 = **20.0%**; ROCE25 = 735/3,500 = **21.0%**. (Model: 45.0/50.0, 12.5/15.0, 20.0/21.0 ✓.)

**P2_SET_218 — Ferndale Green Steel (profitability)**
- 3(a): Contribution = $620 - $440 = **$180** (✓); Break-even = $3,600,000 ÷ $180 = **20,000** (✓); MOS = 34,000 - 20,000 = **14,000** (✓); ATC = $3,600,000 ÷ 34,000 + $440 = **$545.88** (✓).
- 3(b): GP24 = 15,800 - 10,270 = 5,530; GP25 = 18,400 - 11,500 = 6,900 (consistency ✓). GPM24 = 5,530/15,800 = **35.0%**; GPM25 = 6,900/18,400 = **37.5%**. PM24 = 1,580/15,800 = **10.0%**; PM25 = 2,208/18,400 = **12.0%**. ROCE24 = 1,580/7,900 = **20.0%**; ROCE25 = 2,208/9,600 = **23.0%**. (Model: 35.0/37.5, 10.0/12.0, 20.0/23.0 ✓.)

**P2_SET_219 — Aldervan Engineered Timber (profitability)**
- 3(a): Contribution = $210 - $128 = **$82** (✓); Break-even = $1,640,000 ÷ $82 = **20,000** (✓); MOS = 26,500 - 20,000 = **6,500** (✓); ATC = $1,640,000 ÷ 26,500 + $128 = **$189.89** (✓).
- 3(b): GP24 = 6,900 - 4,140 = 2,760; GP25 = 7,800 - 4,290 = 3,510 (consistency ✓). GPM24 = 2,760/6,900 = **40.0%**; GPM25 = 3,510/7,800 = **45.0%**. PM24 = 828/6,900 = **12.0%**; PM25 = 1,170/7,800 = **15.0%**. ROCE24 = 828/4,600 = **18.0%**; ROCE25 = 1,170/5,200 = **22.5%**. (Model: 40.0/45.0, 12.0/15.0, 18.0/22.5 ✓.)

**P2_SET_220 — Ashcombe Eco Bricks (profitability)**
- 3(a): Contribution = $8.50 - $4.80 = **$3.70** (✓); Break-even = $888,000 ÷ $3.70 = **240,000** (✓); MOS = 305,000 - 240,000 = **65,000** (✓); ATC = $888,000 ÷ 305,000 + $4.80 = **$7.71** (✓).
- 3(b): GP24 = 5,200 - 2,860 = 2,340; GP25 = 6,000 - 3,180 = 2,820 (consistency ✓). GPM24 = 2,340/5,200 = **45.0%**; GPM25 = 2,820/6,000 = **47.0%**. PM24 = 650/5,200 = **12.5%**; PM25 = 840/6,000 = **14.0%**. ROCE24 = 650/3,250 = **20.0%**; ROCE25 = 840/3,500 = **24.0%**. (Model: 45.0/47.0, 12.5/14.0, 20.0/24.0 ✓.)

Disrepancy check: all recomputed values are consistent with the values restated in the sets' model answers (gatekeeper tolerance: money ±0.5% / ±$0.51, ratios ±0.06). No set required rejection.

---

## 3. Deterministic grounding — valid_app_words (VAW) sweep

Method: script `C:\Users\jayde\AppData\Local\Temp\opencode\w03t13_checks.py`; case-insensitive substring test of each valid_app_words entry (5–8 per question, all strings) against the combined insert (main_stem + appendix_1 + appendix_2 title/headers/rows + appendix_3); for 3(a)/3(b) against the insert + the set's own model_answer + sub_parts. Script output:

```
=== VAW SWEEP (case-insensitive substring; 3a/3b vs insert+own model_answer+sub_parts) ===
P2_SET_181: OK (all valid_app_words found)
P2_SET_182: OK (all valid_app_words found)
P2_SET_183: OK (all valid_app_words found)
P2_SET_184: OK (all valid_app_words found)
P2_SET_185: OK (all valid_app_words found)
P2_SET_216: OK (all valid_app_words found)
P2_SET_217: OK (all valid_app_words found)
P2_SET_218: OK (all valid_app_words found)
P2_SET_219: OK (all valid_app_words found)
P2_SET_220: OK (all valid_app_words found)
VAW issues: NONE
```

Hand-checked by eye (first three questions of each set, 1a/1b/2a) — pass:
- 181: 1a — retained profit ✓, share issue ✓, $650,000 ✓, $550,000 ✓, $1,200,000 ✓, $288,000 ✓, filtration unit ✓ (in insert/appendices). 1b — single-estate ✓, $1,200,000 ✓, 95,000 ✓, 58% ✓, 47% ✓, supermarket ✓. 2a — autocratic leadership ✓, quality complaints ✓, 2.4% ✓, hierarchical structure ✓, 26 ✓, $1,200,000 ✓.
- 182: 1a — hire purchase ✓, $180,000 ✓, $420,000 ✓, $600,000 ✓, grading machinery ✓, 27,300 ✓. 1b — free-range ✓, $600,000 ✓, 105,000 ✓, 61% ✓, 44% ✓, farm shops ✓. 2a — democratic leadership ✓, rejection rate ✓, 6.5% ✓, flat structure ✓, 27,300 ✓, $320 ✓.
- 183: 1a — retained profit ✓, community share issue ✓, $400,000 ✓, $550,000 ✓, $950,000 ✓, single-vineyard ✓. 1b — single-vineyard ✓, 59% ✓, 51% ✓, 120,000 ✓, $950,000 ✓, cellar door ✓. 2a — harvest bonus ✓, labour turnover ✓, 28% ✓, casual harvest ✓, 2.1% ✓, 310 tonnes ✓.
- 184: 1a — share issue ✓, $900,000 ✓, $600,000 ✓, $1,500,000 ✓, wholegrain ✓, $540,000 ✓. 1b — wholegrain ✓, $0.75 ✓, 57% ✓, bag ✓, 150,000 ✓, $1,500,000 ✓. 2a — democratic leadership ✓, skills gap ✓, staff councils ✓, 4.8% ✓, $1,100 ✓, certified mill operatives ✓.
- 185: 1a — personal savings ✓, $270,000 ✓, $180,000 ✓, overdraft ✓, $450,000 ✓, harvest ✓. 1b — online honey club ✓, 46% ✓, 63% ✓, $0.60 ✓, $450,000 ✓, raw unfiltered ✓. 2a — absenteeism ✓, 11% ✓, job rotation ✓, part-time ✓, 80,000 ✓, flat structure ✓.
- 216: 1a — retained profit ✓, bank loan ✓, $500,000 ✓, $900,000 ✓, $1,400,000 ✓, $600,000 ✓. 1b — recycled-paper ✓, 71% ✓, 58% ✓, $0.60 ✓, $1,400,000 ✓, 480 ✓. 2a — labour turnover ✓, autocratic leadership ✓, workforce of 85 ✓, $750 ✓, 2.6% ✓, defect rate ✓.
- 217: 1a — diamond-wire ✓, dressing shed ✓, workforce of 32 ✓, retained profit ✓, $750,000 ✓, $450,000 ✓. 1b — certified low-carbon ✓, 68% ✓, 54% ✓, $1.20 ✓, $750,000 ✓, 300 ✓. 2a — workforce of 32 ✓, labour turnover ✓, 3.4% ✓, cutting waste ✓, 18,500 ✓, $600 ✓.
- 218: 1a — share issue ✓, retained profit ✓, $1,300,000 ✓, $1,100,000 ✓, $2,400,000 ✓, $3,600,000 ✓. 1b — low-carbon steel ✓, 74% ✓, 8% ✓, 250 ✓, 92% ✓, $2,400,000 ✓. 2a — melt shop ✓, workforce of 120 ✓, absenteeism ✓, 10% ✓, 8,600 ✓, $2,400,000 ✓.
- 219: 1a — retained profit ✓, bank loan ✓, $1,150,000 ✓, $700,000 ✓, $1,850,000 ✓, $1,640,000 ✓. 1b — CLT ✓, 62% ✓, 55% ✓, 6% ✓, 380 ✓, certified ✓. 2a — democratic leadership ✓, workforce of 64 ✓, labour turnover ✓, 13% ✓, 2.9% ✓, $850 ✓.
- 220: 1a — hire purchase ✓, bank loan ✓, $550,000 ✓, $430,000 ✓, $980,000 ✓, $888,000 ✓. 1b — recycled-content ✓, 69% ✓, 61% ✓, $0.80 ✓, 420 ✓, $980,000 ✓. 2a — absenteeism ✓, workforce of 140 ✓, 84,000 ✓, 1.6% ✓, 305,000 ✓, $4.80 ✓.

All sets: VAW sweep — script OK for all 8 questions; VAW issues NONE.

---

## 4. Uniqueness

Business name and initials (from main_stem, e.g. `Valle Dorado Olive Oil (VDO)`) checked for duplicates:
- Within `paper2/sets/wave_03/` (all 40 files, incl. non-audited 186–215),
- In `paper2/sets/wave_01/`, `wave_02/`, `wave_04/`, `wave_05/` (all set files in those dirs),
- In `paper2/waves/` (empty — 0 files).

Script output:

```
P2_SET_181 (VDO, 'Valle Dorado Olive Oil'): unique
P2_SET_182 (BRE, 'Bramblewick Free-Range Eggs'): unique
P2_SET_183 (SBV, 'Stonebarrow Vineyard & Wine Co-operative'): unique
P2_SET_184 (GSM, 'Goldensheaf Milling Company'): unique
P2_SET_185 (AHF, 'Amberline Honey Farm'): unique
P2_SET_216 (WPB, 'Wexley Plasterboard'): unique
P2_SET_217 (WLW, 'Wrenford Limestone Walling'): unique
P2_SET_218 (FGS, 'Ferndale Green Steel'): unique
P2_SET_219 (AET, 'Aldervan Engineered Timber'): unique
P2_SET_220 (AEB, 'Ashcombe Eco Bricks'): unique
waves/ dir empty: True
```

No duplicates found; sibling folders checked: wave_01, wave_02, wave_04, wave_05, wave_03 (live + staged coverage), waves/.

---

## 5. Per-set verdict table

| Set | Verdict |
|---|---|
| P2_SET_181 | APPROVED_BY_TECH_AUD |
| P2_SET_182 | APPROVED_BY_TECH_AUD |
| P2_SET_183 | APPROVED_BY_TECH_AUD |
| P2_SET_184 | APPROVED_BY_TECH_AUD |
| P2_SET_185 | APPROVED_BY_TECH_AUD |
| P2_SET_216 | APPROVED_BY_TECH_AUD |
| P2_SET_217 | APPROVED_BY_TECH_AUD |
| P2_SET_218 | APPROVED_BY_TECH_AUD |
| P2_SET_219 | APPROVED_BY_TECH_AUD |
| P2_SET_220 | APPROVED_BY_TECH_AUD |

**Summary:** All 10 sets pass every check — live gatekeeper (wave_03: 40/40 PASS), independent recalculation (all 3(a)/3(b) restated values match within tolerance; GP consistency in all profitability sets verified), VAW sweep (all 8 questions, all sets), and uniqueness (initials + names unique across wave_01–05, wave_03, and waves/). No live files modified. The staged-copy run's duplicate errors are artifacts of the gatekeeper's seeding logic (live copies collide) and are reproduced verbatim above per protocol; the live-run output is the authoritative pass/fail.
