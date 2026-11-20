# TECH-AUD-15 — Tier 2B Schema/Math/Grounding Audit — Wave 02
**Auditor:** TECH-AUD-15 (Tier 2B schema/math/grounding)
**Date:** 2026-11-20
**Sets audited:** P2_SET_151 … P2_SET_155, P2_SET_166 … P2_SET_170 (wave_02)
**Live files audited** (sets/wave_02/*.json, read-only): identical to the staged copies (verified SHA-256 by re-read; no live file modified — nothing to modify, auditing only).
**Staged copies:** `C:\Users\jayde\AppData\Local\Temp\opencode\w02t15\` (created; all JSON parses)

---

## 0. File existence & JSON parse

| File | Exists | Parses | Top-level keys | scenario_id | unit | Stem words |
|---|---|---|---|---|---|---|
| P2_SET_151.json | ✓ | ✓ | ['scenario_id','unit','case_study_insert','questions'] | P2_SET_151 | Paper 2 Case Study | 121 |
| P2_SET_152.json | ✓ | ✓ | ['scenario_id','unit','case_study_insert','questions'] | P2_SET_152 | Paper 2 Case Study | 115 |
| P2_SET_153.json | ✓ | ✓ | ['scenario_id','unit','case_study_insert','questions'] | P2_SET_153 | Paper 2 Case Study | 119 |
| P2_SET_154.json | ✓ | ✓ | ['scenario_id','unit','case_study_insert','questions'] | P2_SET_154 | Paper 2 Case Study | 117 |
| P2_SET_155.json | ✓ | ✓ | ['scenario_id','unit','case_study_insert','questions'] | P2_SET_155 | Paper 2 Case Study | 121 |
| P2_SET_166.json | ✓ | ✓ | ['scenario_id','unit','case_study_insert','questions'] | P2_SET_166 | Paper 2 Case Study | 124 |
| P2_SET_167.json | ✓ | ✓ | ['scenario_id','unit','case_study_insert','questions'] | P2_SET_167 | Paper 2 Case Study | 128 |
| P2_SET_168.json | ✓ | ✓ | ['scenario_id','unit','case_study_insert','questions'] | P2_SET_168 | Paper 2 Case Study | 116 |
| P2_SET_169.json | ✓ | ✓ | ['scenario_id','unit','case_study_insert','questions'] | P2_SET_169 | Paper 2 Case Study | 120 |
| P2_SET_170.json | ✓ | ✓ | ['scenario_id','unit','case_study_insert','questions'] | P2_SET_170 | Paper 2 Case Study | 125 |

Stem word counts are within the 110–145 band for all 10 sets. Insert keys exactly {main_stem, appendix_1_marketing_ops, appendix_2_financial_data, appendix_3_external_environment} for all sets (verified).

---

## 1. Gatekeeper

### 1a. Staged-copy run (as briefed) — VERBATIM

Command: `& "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe" C:\Users\jayde\Documents\GitHub\fresh\paper2\scripts\gatekeeper.py --sets-dir C:\Users\jayde\AppData\Local\Temp\opencode\w02t15`

```
==============================================================================
GATEKEEPER REPORT  |  checked 10 set(s)
==============================================================================
[FAIL] P2_SET_151  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t15\P2_SET_151.json)
    ERROR: business initials 'NGF' already used by set P2_SET_151
    ERROR: scenario_id 'P2_SET_151' already used in P2_SET_151.json
[FAIL] P2_SET_152  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t15\P2_SET_152.json)
    ERROR: business initials 'PRB' already used by set P2_SET_152
    ERROR: scenario_id 'P2_SET_152' already used in P2_SET_152.json
[FAIL] P2_SET_153  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t15\P2_SET_153.json)
    ERROR: business initials 'TRO' already used by set P2_SET_153
    ERROR: scenario_id 'P2_SET_153' already used in P2_SET_153.json
[FAIL] P2_SET_154  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t15\P2_SET_154.json)
    ERROR: business initials 'FLF' already used by set P2_SET_154
    ERROR: scenario_id 'P2_SET_154' already used in P2_SET_154.json
[FAIL] P2_SET_155  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t15\P2_SET_155.json)
    ERROR: business initials 'LSP' already used by set P2_SET_155
    ERROR: scenario_id 'P2_SET_155' already used in P2_SET_155.json
[FAIL] P2_SET_166  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t15\P2_SET_166.json)
    ERROR: business initials 'ARA' already used by set P2_SET_166
    ERROR: scenario_id 'P2_SET_166' already used in P2_SET_166.json
[FAIL] P2_SET_167  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t15\P2_SET_167.json)
    ERROR: business initials 'SMF' already used by set P2_SET_167
    ERROR: scenario_id 'P2_SET_167' already used in P2_SET_167.json
[FAIL] P2_SET_168  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t15\P2_SET_168.json)
    ERROR: business initials 'PFI' already used by set P2_SET_168
    ERROR: scenario_id 'P2_SET_168' already used in P2_SET_168.json
[FAIL] P2_SET_169  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t15\P2_SET_169.json)
    ERROR: business initials 'SAW' already used by set P2_SET_169
    ERROR: scenario_id 'P2_SET_169' already used in P2_SET_169.json
[FAIL] P2_SET_170  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t15\P2_SET_170.json)
    ERROR: business initials 'BCD' already used by set P2_SET_170
    ERROR: scenario_id 'P2_SET_170' already used in P2_SET_170.json
==============================================================================
Sets passed: 0/10   |   failed: 10

Exit code: 1
```

**Interpretation of the staged FAIL (artifact, not a set defect).** The gatekeeper seeds its duplicate-detection tables from `paper2/sets/**/*.json` and `paper2/waves/*.json` — but the briefed staging directory lives outside `paper2/sets`, so the exclusion `if str(Path(args.sets_dir).resolve()) in str(wf.resolve()): continue` never fires. The staged copies therefore "collide" only with the live repo copies of the very same files. Proof:

1. Staged copies are byte-identical to the live files (re-read for hash comparison; both parse, same scenario_ids/initials).
2. In every error above, the "conflicting" set is the same scenario_id as the checked file (e.g. `'NGF' already used by set P2_SET_151` for staged P2_SET_151.json). No error names any *other* set.
3. `paper2/waves/` has 0 files, so it contributed nothing to seeding; a sweep of `paper2/sets/wave_01`, `wave_02`, `wave_03` found no duplicate initials (details in §4).
4. All remaining gatekeeper checks (structure, marks, math, valid_app_words, appendix consistency) ran on the staged copies and reported **zero additional errors** — the 20 errors above are the only output.

### 1b. Live wave run, excerpt — VERBATIM (sets 151–155, 166–170 as part of the full wave run)

Command: `& "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe" C:\Users\jayde\Documents\GitHub\fresh\paper2\scripts\gatekeeper.py --sets-dir C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02`

```
==============================================================================
GATEKEEPER REPORT  |  checked 40 set(s)
==============================================================================
[PASS] P2_SET_141  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_141.json)
[PASS] P2_SET_142  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_142.json)
[PASS] P2_SET_143  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_143.json)
[PASS] P2_SET_144  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_144.json)
[PASS] P2_SET_145  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_145.json)
[PASS] P2_SET_146  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_146.json)
[PASS] P2_SET_147  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_147.json)
[PASS] P2_SET_148  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_148.json)
[PASS] P2_SET_149  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_149.json)
[PASS] P2_SET_150  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_150.json)
[PASS] P2_SET_151  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_151.json)
[PASS] P2_SET_152  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_152.json)
[PASS] P2_SET_153  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_153.json)
[PASS] P2_SET_154  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_154.json)
[PASS] P2_SET_155  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_155.json)
[PASS] P2_SET_156  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_156.json)
[PASS] P2_SET_157  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_157.json)
[PASS] P2_SET_158  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_158.json)
[PASS] P2_SET_159  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_159.json)
[PASS] P2_SET_160  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_160.json)
[PASS] P2_SET_161  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_161.json)
[PASS] P2_SET_162  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_162.json)
[PASS] P2_SET_163  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_163.json)
[PASS] P2_SET_164  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_164.json)
[PASS] P2_SET_165  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_165.json)
[PASS] P2_SET_166  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_166.json)
[PASS] P2_SET_167  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_167.json)
[PASS] P2_SET_168  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_168.json)
[PASS] P2_SET_169  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_169.json)
[PASS] P2_SET_170  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_170.json)
[PASS] P2_SET_171  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_171.json)
[PASS] P2_SET_172  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_172.json)
[PASS] P2_SET_173  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_173.json)
[PASS] P2_SET_174  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_174.json)
[PASS] P2_SET_175  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_175.json)
[PASS] P2_SET_176  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_176.json)
[PASS] P2_SET_177  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_177.json)
[PASS] P2_SET_178  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_178.json)
[PASS] P2_SET_179  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_179.json)
[PASS] P2_SET_180  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\P2_SET_180.json)
==============================================================================
Sets passed: 40/40   |   failed: 0
```

**Gatekeeper verdict for the 10 audited sets: PASS** (exit code 0; the 20 errors in 1a are the self-comparison artifact explained there — the live run covers the same sets on the live files with zero genuine errors).

---

## 2. Independent recalculation (hand, from the stems — FC ÷ (SP − VC))

Tolerance per TECH-AUD-13 conventions: ratios within ±0.01 display of the model answer, money per gatekeeper. "Discrepancy > tolerance ⇒ REJECTED" — none found; all recomputed values match the sets' 3(a)/3(b) restatements (where present).

**P2_SET_151 — Northgate Formalwear (NGF), liquidity set.** Stem: FC $310,000, VC $14.50, SP $24.50, output 55,000, workforce 60.
- Contribution = $24.50 − $14.50 = **$10.00**; Break-even = $310,000 ÷ $10.00 = **31,000** units (model: 31,000 ✓); MOS = 55,000 − 31,000 = **24,000** units; ATC = $310,000 ÷ 55,000 + $14.50 = **$20.14** (matches 3(a)(iii)); LP = 55,000 ÷ 60 = **916.67 units/worker**.
- App2: CA 2024 = 260+140+30 = 430; CA 2025 = 210+175+55 = 440; **CR 2024 = 430÷300 = 1.43**; **CR 2025 = 440÷270 = 1.63**; **Acid 2024 = (430−260)÷300 = 0.57**; **Acid 2025 = (440−210)÷270 = 0.85** — matches 3(b) restatements.

**P2_SET_152 — Paloma Rose Boutique (PRB), liquidity set.** Stem: FC $420,000, VC $17.00, SP $38.00, output 32,000, workforce 48.
- Contribution = **$21.00**; Break-even = $420,000 ÷ $21.00 = **20,000** ✓ (model: 20,000); MOS = 32,000 − 20,000 = **12,000** ✓ (3(a)(ii)); ATC = $420,000÷32,000 + $17.00 = **$30.13** (3(a)(iii)); LP = 32,000÷48 = **666.67**.
- App2: CA 2024 = 380+190+25 = 595; CA 2025 = 320+170+60 = 550; **CR 2024 = 595÷350 = 1.70**; **CR 2025 = 550÷310 = 1.77**; **Acid 2024 = (595−380)÷350 = 0.61**; **Acid 2025 = (550−320)÷310 = 0.74** — matches 3(b).

**P2_SET_153 — Trailhead Outfitters (TRO), liquidity set.** Stem: FC $385,000, VC $27.50, SP $45.00, output 40,000.
- Contribution = **$17.50**; Break-even = $385,000 ÷ $17.50 = **22,000** ✓ (model: 22,000); MOS = 40,000 - 22,000 = **18,000** ✓ (3(a)(iii)); ATC = $385,000÷40,000 + $27.50 = **$37.13** (3(a)(iii)).
- App2: CA 2024 = 150+210+40 = 400; CA 2025 = 120+240+35 = 395; **CR 2024 = 400÷275 = 1.45**; **CR 2025 = 395÷260 = 1.52**; **Acid 2024 = (400−150)÷275 = 0.91**; **Acid 2025 = (395−120)÷260 = 1.06** — matches 3(b).

**P2_SET_154 — Fleetline Fashion (FLF), liquidity set.** Stem: FC $540,000, VC $5.00, SP $9.50, output 160,000.
- Contribution = **$4.50**; Break-even = $540,000 ÷ $4.50 = **120,000** ✓ (3(a)(i)).
- App2: CA 2024 = 420+260+85 = 765; CA 2025 = 520+270+45 = 835; **CR 2024 = 765÷380 = 2.01**; **CR 2025 = 835÷470 = 1.78**; **Acid 2024 = (765−420)÷380 = 0.91**; **Acid 2025 = (835−520)÷470 = 0.67** — matches 3(b).

**P2_SET_155 — Little Sprout Clothing Cooperative (LSP), liquidity set.** Stem: FC $210,000, VC $5.50, SP $12.00, output 40,000.
- Contribution = **$6.50**; Break-even = $210,000 ÷ $6.50 = **32,307.69** ✓ (model: 32,307.69); ATC = $210,000÷40,000 + $5.50 = **$10.75** ✓ (3(a)(ii)).
- App2: CA 2024 = 90+60+35 = 185; CA 2025 = 70+85+50 = 205; **CR 2024 = 185÷160 = 1.16**; **CR 2025 = 205÷150 = 1.37**; **Acid 2024 = (185−90)÷160 = 0.59**; **Acid 2025 = (205−70)÷150 = 0.90** — matches 3(b).

**P2_SET_166 — Ardent Analytics (ARA), profitability set.** Stem: FC $660,000, VC $160, SP $380, output 8,000.
- Contribution = **$220**; Break-even = $660,000 ÷ $220 = **3,000** ✓ (model: 3,000).
- App2: GP 2024 = 2,800 − 1,680 = **1,120,000**; GP 2025 = 3,040 − 1,672 = **1,368,000** (GP = Rev − CoS exact both years ✓). **GPM 2024 = 1,120,000÷2,800,000 = 40.0%**; **GPM 2025 = 1,368,000÷3,040,000 = 45.0%** — matches 3(b). **PM 2024 = 420,000÷2,800,000 = 15.0%**; **PM 2025 = 648,000÷3,040,000 = 21.316%** (model restates 21.3%; diff 0.016, within gatekeeper tolerance TOL_PCT = 0.75 and consistent with one-decimal rounding). **ROCE 2024 = 420,000÷2,400,000 = 17.5%**; **ROCE 2025 = 648,000÷3,600,000 = 18.0%** — matches 3(b).

**P2_SET_167 — Saltmeadow Fibre (SMF), profitability set.** Stem: FC $675,000, VC $105, SP $240, output 13,500.
- Contribution = **$135**; Break-even = $675,000 ÷ $135 = **5,000** ✓; MOS = 13,500 − 5,000 = **8,500** ✓ (3(a)(ii)).
- App2: GP 2024 = 2,700 − 1,620 = **1,080,000**; GP 2025 = 3,240 − 1,782 = **1,458,000** (exact ✓). **GPM 2024 = 40.0%**; **GPM 2025 = 1,458,000÷3,240,000 = 45.0%** — matches 3(b). **PM 2024 = 405,000÷2,700,000 = 15.0%**; **PM 2025 = 594,000÷3,240,000 = 18.333%** (model 18.3%; diff 0.003 ✓). **ROCE 2024 = 405,000÷2,700,000 = 15.0%**; **ROCE 2025 = 594,000÷3,300,000 = 18.0%** — matches 3(b).

**P2_SET_168 — Pixelforge Interactive (PFI), profitability set.** Stem: FC $672,000, VC $18, SP $60, output 60,000.
- Contribution = **$42**; Break-even = $672,000 ÷ $42 = **16,000** ✓; MOS = 60,000 − 16,000 = **44,000** ✓ (3(a)(ii)).
- App2: GP 2024 = 2,700 − 1,485 = **1,215,000**; GP 2025 = 3,600 − 1,800 = **1,800,000** (exact ✓). **GPM 2024 = 45.0%**; **GPM 2025 = 1,800,000÷3,600,000 = 50.0%** — matches 3(b). **PM 2024 = 540,000÷2,700,000 = 20.0%**; **PM 2025 = 720,000÷3,600,000 = 20.0%** — matches 3(b). **ROCE 2024 = 540,000÷3,000,000 = 18.0%**; **ROCE 2025 = 720,000÷3,950,000 = 18.228%** (model 18.2%; diff 0.002 ✓).

**P2_SET_169 — Serangoon Additive Works (SAW), profitability set.** Stem: FC $414,000, VC $17, SP $40, output 28,000.
- Contribution = **$23**; Break-even = $414,000 ÷ $23 = **18,000** ✓ (model: 18,000).
- App2: GP 2024 = 800 − 400 = **400,000**; GP 2025 = 1,120 − 504 = **616,000** (exact ✓). **GPM 2024 = 50.0%**; **GPM 2025 = 616,000÷1,120,000 = 55.0%** — matches 3(b). **PM 2024 = 200,000÷800,000 = 25.0%**; **PM 2025 = 336,000÷1,120,000 = 30.0%** — matches 3(b). **ROCE 2024 = 200,000÷1,600,000 = 12.5%**; **ROCE 2025 = 336,000÷1,860,000 = 18.1%** — matches 3(b).

**P2_SET_170 — Brightcart Digital (BCD), profitability set.** Stem: FC $312,000, VC $150, SP $540, output 6,500.
- Contribution = **$390**; Break-even = $312,000 ÷ $390 = **800** ✓ (3(a)(i)).
- App2: GP 2024 = 2,700 − 1,485 = **1,215,000**; GP 2025 = 3,510 − 1,755 = **1,755,000** (exact ✓). **GPM 2024 = 45.0%**; **GPM 2025 = 1,755,000÷3,510,000 = 50.0%** — matches 3(b). **PM 2024 = 270,000÷2,700,000 = 10.0%**; **PM 2025 = 386,000÷3,510,000 = 11.0%** (diff 0.0099, within display tolerance 0.01 and within gatekeeper TOL_PCT 0.75) — matches 3(b). **ROCE 2024 = 270,000÷1,800,000 = 15.0%**; **ROCE 2025 = 386,000÷2,120,000 = 18.2%** — matches 3(b).

No discrepancy > tolerance in any set.

---

## 3. Verbatim VAW sweep — hand-checked, first 3 questions of each set (1(a), 1(b), 2(a)); present case-insensitively as substrings of the combined insert (for 3(a)/3(b): insert OR model_answer — all 3(a)/3(b) VAW entries here appear in the inserts; the deterministic sweep of all 8 questions ran in the live gatekeeper with zero VAW errors).

- **P2_SET_151 (NGF):** 1(a): retained profit, $270,000, $450,000, $310,000, 5.4%, 13.5% ✓; 1(b): $720,000, 61%, 46%, 1,200, 55,000, $24.50 ✓; 2(a): democratic leadership, 13.5%, 163, 55,000, 61%, computer stock control ✓.
- **P2_SET_152 (PRB):** 1(a): venture capital, $400,000, $250,000, 22%, 9.4%, 6.0% ✓; 1(b): 210,000, 1,320, 640, 4.0%, $420,000, Austin ✓; 2(a): laissez-faire leadership, 22%, $86, workforce of 48, flat structure, Austin ✓.
- **P2_SET_153 (TRO):** 1(a): hire purchase, $540,000, $380,000, $920,000, 5.25%, $385,000 ✓; 1(b): $920,000, 4.2%, $45.00, 4.6%, 9,400, $385,000 ✓; 2(a): autocratic leadership, 4.6%, 96.2%, 433, 512, workforce of 85 ✓.
- **P2_SET_154 (FLF):** 1(a): share issue, $800,000, $400,000, $1,200,000, 160,000, 18% ✓; 1(b): 160,000, $9.50, 24%, 18%, $1,200,000, own-label ✓; 2(a): democratic leadership, 18%, 24%, 15%, 35%, 160,000 ✓.
- **P2_SET_155 (LSP):** 1(a): retained profit, $130,000, $220,000, $350,000, $210,000, cooperative ✓; 1(b): $350,000, 71%, 64%, 18.5%, 57%, $14 ✓; 2(a): democratic leadership, skills gap, 6 of 28, flat structure, 9,600, 5 days ✓.
- **P2_SET_166 (ARA):** 1(a): share issue, bank loan, $500,000, $700,000, $1,200,000, $660,000 ✓; 1(b): Texas, $29 per month, $32, 58%, 44%, 71% ✓; 2(a): autocratic, hierarchical, workforce of 38, 2.1%, 44%, 8,000 units ✓.
- **P2_SET_167 (SMF):** 1(a): hire purchase, retained profit, $220,000, $380,000, $600,000, 13,500 ✓; 1(b): $240, 6.5 hours, 99.2%, 4.6 out of 5, 340 new premises, 9 days ✓; 2(a): absenteeism, flat structure, 8%, 6.5 hours, 4.6 out of 5, workforce of 52 ✓.
- **P2_SET_168 (PFI):** 1(a): venture capital, $650,000, $300,000, $950,000, $672,000, open-world ✓; 1(b): 210,000, 38,000, 67%, 48%, $60, $95 ✓; 2(a): laissez-faire leadership, workforce of 64, 210,000, 5.5 days, flat structure, $60 ✓.
- **P2_SET_169 (SAW):** 1(a): retained profit, sale of older workshop equipment, $260,000, $220,000, $480,000, $58,000 ✓; 1(b): 62%, 55%, 130 marine and aerospace buyers, 84%, 11%, 15% premium ✓; 2(a): democratic leadership, hierarchical structure, cooperative, 6.5%, 5.1%, 84% ✓.
- **P2_SET_170 (BCD):** 1(a): bank loan, retained profit, $200,000, $120,000, $320,000, $312,000 ✓; 1(b): SellEverywhere, $45 per lead, 290 leads, 74%, 59%, 41% ✓; 2(a): absenteeism, 7%, 68%, 6.5 weeks, $312,000, 4.3 out of 5 ✓.

All hand checks pass; no valid_app_words entry is missing from its required haystack.

---

## 4. Uniqueness

Sibling folders checked: `paper2\sets\wave_01`, `paper2\sets\wave_02`, `paper2\sets\wave_03`, and `paper2\waves` (0 files). Python sweep across all set files in `paper2/sets/*` — **duplicate initials across wave dirs: NONE**. My initials — NGF (151), PRB (152), TRO (153), FLF (154), LSP (155), ARA (166), SMF (167), PFI (168), SAW (169), BCD (170) — are all unique; no name/initials is reused anywhere in wave_01/02/03. The live gatekeeper run also confirms scenario_id uniqueness (exit 0; no "already used" errors for any of the 10).

---

## 5. Verdict table

| Set | Verdict |
|---|---|
| P2_SET_151 | APPROVED_BY_TECH_AUD |
| P2_SET_152 | APPROVED_BY_TECH_AUD |
| P2_SET_153 | APPROVED_BY_TECH_AUD |
| P2_SET_154 | APPROVED_BY_TECH_AUD |
| P2_SET_155 | APPROVED_BY_TECH_AUD |
| P2_SET_166 | APPROVED_BY_TECH_AUD |
| P2_SET_167 | APPROVED_BY_TECH_AUD |
| P2_SET_168 | APPROVED_BY_TECH_AUD |
| P2_SET_169 | APPROVED_BY_TECH_AUD |
| P2_SET_170 | APPROVED_BY_TECH_AUD |

All 10 sets in wave 02 (generation batches A, 151–155, and B, 166–170) clear for marking: gatekeeper PASS (live run, zero errors), hand recalculation matches, VAW verified, initials unique. No files were modified.
