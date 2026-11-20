# TECH-AUD-13 — Tier 2B Schema/Math/Grounding Audit — Wave 01
**Auditor:** TECH-AUD-13 (Tier 2B schema/math/grounding)
**Date:** 2026-11-19
**Sets audited:** P2_SET_101, P2_SET_102, P2_SET_103, P2_SET_104, P2_SET_105 (GEN-01); P2_SET_136, P2_SET_137, P2_SET_138, P2_SET_139, P2_SET_140 (GEN-08)
**Live files audited** (sets/wave_01/*.json, read-only): identical to the staged copies (SHA-256 verified). No live file was modified.
**Staged copies:** `C:\Users\jayde\AppData\Local\Temp\opencode\techaud13b\` (created 2026-11-19; all JSON parses)

---

## 0. File existence & JSON parse (python json.load)

| File | Exists | Parses | Top-level keys | scenario_id | unit | Stem words |
|---|---|---|---|---|---|---|
| P2_SET_101.json | ✓ | ✓ | ['scenario_id','unit','case_study_insert','questions'] | P2_SET_101 | Paper 2 Case Study | 119 |
| P2_SET_102.json | ✓ | ✓ | same | P2_SET_102 | Paper 2 Case Study | 119 |
| P2_SET_103.json | ✓ | ✓ | same | P2_SET_103 | Paper 2 Case Study | 124 |
| P2_SET_104.json | ✓ | ✓ | same | P2_SET_104 | Paper 2 Case Study | 118 |
| P2_SET_105.json | ✓ | ✓ | same | P2_SET_105 | Paper 2 Case Study | 124 |
| P2_SET_136.json | ✓ | ✓ | same | P2_SET_136 | Paper 2 Case Study | 119 |
| P2_SET_137.json | ✓ | ✓ | same | P2_SET_137 | Paper 2 Case Study | 126 |
| P2_SET_138.json | ✓ | ✓ | same | P2_SET_138 | Paper 2 Case Study | 117 |
| P2_SET_139.json | ✓ | ✓ | same | P2_SET_139 | Paper 2 Case Study | 125 |
| P2_SET_140.json | ✓ | ✓ | same | P2_SET_140 | Paper 2 Case Study | 117 |

Sets 101–105 are **liquidity** sets (Statement of Financial Position format); sets 136–140 are **profitability** sets (Statement of Profit or Loss format). All 10 stems are within the 110–145 word band; share of appendix completeness checks in §4.

---

## 1. Gatekeeper

### 1a. Staged-copy run (as briefed) — VERBATIM

Command: `& "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe" C:\Users\jayde\Documents\GitHub\fresh\paper2\scripts\gatekeeper.py --sets-dir C:\Users\jayde\AppData\Local\Temp\opencode\techaud13b`

```
==============================================================================
GATEKEEPER REPORT  |  checked 10 set(s)
==============================================================================
[FAIL] P2_SET_101  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud13b\P2_SET_101.json)
    ERROR: business initials 'AAB' already used by set P2_SET_101
    ERROR: scenario_id 'P2_SET_101' already used in P2_SET_101.json
[FAIL] P2_SET_102  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud13b\P2_SET_102.json)
    ERROR: business initials 'GDC' already used by set P2_SET_102
    ERROR: scenario_id 'P2_SET_102' already used in P2_SET_102.json
[FAIL] P2_SET_103  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud13b\P2_SET_103.json)
    ERROR: business initials 'ICB' already used by set P2_SET_103
    ERROR: scenario_id 'P2_SET_103' already used in P2_SET_103.json
[FAIL] P2_SET_104  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud13b\P2_SET_104.json)
    ERROR: business initials 'BHS' already used by set P2_SET_104
    ERROR: scenario_id 'P2_SET_104' already used in P2_SET_104.json
[FAIL] P2_SET_105  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud13b\P2_SET_105.json)
    ERROR: business initials 'VPTE' already used by set P2_SET_105
    ERROR: scenario_id 'P2_SET_105' already used in P2_SET_105.json
[FAIL] P2_SET_136  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud13b\P2_SET_136.json)
    ERROR: business initials 'CVA' already used by set P2_SET_136
    ERROR: scenario_id 'P2_SET_136' already used in P2_SET_136.json
[FAIL] P2_SET_137  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud13b\P2_SET_137.json)
    ERROR: business initials 'HMH' already used by set P2_SET_137
    ERROR: scenario_id 'P2_SET_137' already used in P2_SET_137.json
[FAIL] P2_SET_138  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud13b\P2_SET_138.json)
    ERROR: business initials 'RRC' already used by set P2_SET_138
    ERROR: scenario_id 'P2_SET_138' already used in P2_SET_138.json
[FAIL] P2_SET_139  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud13b\P2_SET_139.json)
    ERROR: business initials 'TWI' already used by set P2_SET_139
    ERROR: scenario_id 'P2_SET_139' already used in P2_SET_139.json
[FAIL] P2_SET_140  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud13b\P2_SET_140.json)
    ERROR: business initials 'VMC' already used by set P2_SET_140
    ERROR: scenario_id 'P2_SET_140' already used in P2_SET_140.json
==============================================================================
Sets passed: 0/10   |   failed: 10

Exit code: 1
```

**Interpretation of the staged FAIL (artifact, not a set defect).** The gatekeeper seeds its duplicate-detection tables from `paper2/sets/**/*.json` and `paper2/waves/*.json` — but the briefed staging directory lives outside `paper2/sets`, so the exclusion `if str(Path(args.sets_dir).resolve()) in str(wf.resolve()): continue` never fires. The staged copies therefore "collide" only with the **live repo copies of the very same files**. Proof:

1. SHA-256 of staged vs live is **identical for all 10 files** (101/102/103/104/105/136/137/138/139/140 — all "IDENTICAL").
2. In every error above, the "conflicting" set is the same scenario_id as the checked file (e.g. `'AAB' already used by set P2_SET_101` for staged P2_SET_101.json). No error names any *other* set.
3. `paper2/waves/` is **empty (0 files)**, so it contributed nothing to the seeding.
4. All remaining gatekeeper checks (structure, marks, math, valid_app_words, appendix consistency) ran on the staged copies and reported **zero** additional errors — the 20 errors above are the only output.

### 1b. Documented invocation on the live wave (script docstring: `--wave 1 --sets-dir paper2/sets/wave_01`) — VERBATIM excerpt

Command: `& "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe" C:\Users\jayde\Documents\GitHub\fresh\paper2\scripts\gatekeeper.py --wave 1 --sets-dir C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01`

```
==============================================================================
GATEKEEPER REPORT  |  checked 40 set(s)
==============================================================================
[PASS] P2_SET_101  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_101.json)
[PASS] P2_SET_102  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_102.json)
[PASS] P2_SET_103  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_103.json)
[PASS] P2_SET_104  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_104.json)
[PASS] P2_SET_105  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_105.json)
[PASS] P2_SET_106  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_106.json)
…
[PASS] P2_SET_135  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_135.json)
[PASS] P2_SET_136  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_136.json)
[PASS] P2_SET_137  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_137.json)
[PASS] P2_SET_138  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_138.json)
[PASS] P2_SET_139  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_139.json)
[PASS] P2_SET_140  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_140.json)
==============================================================================
Sets passed: 40/40   |   failed: 0
```

(Full per-set log, including all 40 PASS lines, saved at `C:\Users\jayde\AppData\Local\Temp\opencode\techaud13b\gk_wave01.txt`. With `--sets-dir` = the live wave, the exclusion logic seeds wave_02/wave_03 + waves/ (empty), and checks all 40 wave_01 sets incrementally — all 40 PASS.)

**Gatekeeper verdict for the 10 audited sets: PASS (zero genuine errors).** The staged-copy FAIL output is reproduced verbatim above per protocol; its only content is the self-comparison artifact explained in 1a.

---

## 2. Independent recalculation (from the stem, hand-derived)

Tolerance: ratios ±0.01 (display) / money per gatekeeper; model answers restate rows exactly.

### P2_SET_101 — Amberhill Artisan Bakery (liquidity)
- Contribution = 8.00 − 4.40 = **$3.60**; Break-even = 225,000 ÷ 3.60 = **62,500** ✓ (model answer states 62,500)
- Margin of safety = 100,000 − 62,500 = **37,500 units** ✓ (cited in 3(a)(iii))
- ATC = 225,000 ÷ 100,000 + 4.40 = 2.25 + 4.40 = **$6.65** ✓ (3(a)(iii))
- Labour productivity = 100,000 ÷ 38 ≈ **2,631.6 units/worker**
- 2024: CA = 85+60+30 = 175; CR = 175÷125 = **1.40** ✓; Acid = (175−85)÷125 = 90÷125 = **0.72** ✓
- 2025: CA = 70+75+55 = 200; CR = 200÷110 = 1.8182 → **1.82** ✓; Acid = (200−70)÷110 = 130÷110 = 1.1818 → **1.18** ✓
- 3(b) model-answer lines `Current Ratio 2024 = 1.40 : 1` / `2025 = 1.82` / `Acid Test 2024 = 0.72` / `2025 = 1.18` — all match.

### P2_SET_102 — Greenvale Dairy Cooperative (liquidity)
- Contribution = 14.70 − 7.70 = **$7.00**; BE = 420,000 ÷ 7.00 = **60,000** ✓; MoS = 150,000 − 60,000 = **90,000** ✓ (3(a)(iii))
- ATC = 420,000 ÷ 150,000 + 7.70 = 2.80 + 7.70 = **$10.50** ✓ (3(a)(iii)); Productivity = 150,000 ÷ 120 = **1,250**
- 2024: CA = 260+210+70 = 540; CR = 540÷380 = 1.4211 → **1.42** ✓; Acid = (540−260)÷380 = 280÷380 = 0.7368 → **0.74** ✓
- 2025: CA = 310+240+40 = 590; CR = 590÷430 = 1.3721 → **1.37** ✓; Acid = (590−310)÷430 = 280÷430 = 0.6512 → **0.65** ✓
- 3(b) lines (1.42 / 1.37 / 0.74 / 0.65) — all match.

### P2_SET_103 — Ironpine Craft Brewery (liquidity)
- Contribution = 16.00 − 12.00 = **$4.00**; BE = 180,000 ÷ 4.00 = **45,000** ✓; MoS = 72,000 − 45,000 = **27,000** ✓
- ATC = 180,000 ÷ 72,000 + 12.00 = 2.50 + 12.00 = **$14.50** ✓ (3(a)(iii)); Productivity = 72,000 ÷ 52 ≈ **1,384.6**
- 2024: CA = 150+95+25 = 270; CR = 270÷190 = 1.4211 → **1.42** ✓; Acid = (270−150)÷190 = 120÷190 = 0.6316 → **0.63** ✓
- 2025: CA = 185+120+35 = 340; CR = 340÷230 = 1.4783 → **1.48** ✓; Acid = (340−185)÷230 = 155÷230 = 0.6739 → **0.67** ✓
- 3(b) lines (1.42 / 1.48 / 0.63 / 0.67) — all match.

### P2_SET_104 — Blueharbor Seafoods (liquidity)
- Contribution = 22.00 − 17.00 = **$5.00**; BE = 850,000 ÷ 5.00 = **170,000** ✓; MoS = 320,000 − 170,000 = **150,000** ✓
- ATC = 850,000 ÷ 320,000 + 17.00 = 2.65625 + 17.00 = 19.65625 → **$19.66** ✓ (3(a)(iii)); Productivity = 320,000 ÷ 240 ≈ **1,333.3**
- 2024: CA = 480+350+90 = 920; CR = 920÷620 = 1.4839 → **1.48** ✓; Acid = (920−480)÷620 = 440÷620 = 0.7097 → **0.71** ✓
- 2025: CA = 620+410+60 = 1,090; CR = 1,090÷760 = 1.4342 → **1.43** ✓; Acid = (1,090−620)÷760 = 470÷760 = 0.6184 → **0.62** ✓
- 3(b) lines (1.48 / 1.43 / 0.71 / 0.62) — all match.

### P2_SET_105 — Verdant Peak Tea Estate (liquidity)
- Contribution = 26.00 − 21.00 = **$5.00**; BE = 150,000 ÷ 5.00 = **30,000** ✓; MoS = 68,000 − 30,000 = **38,000** ✓
- ATC = 150,000 ÷ 68,000 + 21.00 = 2.2059 + 21.00 = 23.2059 → **$23.21** ✓ (3(a)(iii)); Productivity = 68,000 ÷ 85 = **800**
- 2024: CA = 140+85+20 = 245; CR = 245÷130 = 1.8846 → **1.88** ✓; Acid = (245−140)÷130 = 105÷130 = 0.8077 → **0.81** ✓
- 2025: CA = 105+95+45 = 245; CR = 245÷110 = 2.2273 → **2.23** ✓; Acid = (245−105)÷110 = 140÷110 = 1.2727 → **1.27** ✓
- 3(b) lines (1.88 / 2.23 / 0.81 / 1.27) — all match.

### P2_SET_136 — Calder Vale Aggregates (profitability)
- Contribution = 18.00 − 10.00 = **$8.00**; BE = 1,600,000 ÷ 8.00 = **200,000** ✓; MoS = 300,000 − 200,000 = **100,000** ✓
- ATC = 1,600,000 ÷ 300,000 + 10.00 = 5.3333 + 10.00 = 15.3333 → **$15.33** ✓; Productivity = 300,000 ÷ 140 ≈ **2,142.9** (3(a)(iii) states 2,143 ✓)
- Total-cost cross-check (3(a)(iii) "$4,600,000"): 1,600,000 + 10.00 × 300,000 = **4,600,000** ✓ → 4,600,000 ÷ 300,000 = 15.33 ✓
- GP = Rev − CoS: 2024: 4,680 − 3,042 = **1,638 ✓ integer**; 2025: 5,400 − 3,240 = **2,160 ✓ integer**
- GPM = 1,638÷4,680 = **35.0%** ✓; 2,160÷5,400 = **40.0%** ✓
- PM = 702÷4,680 = **15.0%** ✓; 1,080÷5,400 = **20.0%** ✓
- ROCE = 702÷3,900 = **18.0%** ✓; 1,080÷4,800 = **22.5%** ✓
- 3(b) lines (35.0/40.0/15.0/20.0/18.0/22.5) — all match.

### P2_SET_137 — Hartwell Modular Homes (profitability)
- Contribution = 150,000 − 96,000 = **$54,000**; BE = 1,620,000 ÷ 54,000 = **30 units (houses)** ✓; MoS = 60 − 30 = **30 houses** (noted in 3(a)(iii) as 30 houses; < 5,000 units gate, but each unit is a modular house — MoS stated explicitly and consistent)
- ATC = 1,620,000 ÷ 60 + 96,000 = 27,000 + 96,000 = **$123,000** ✓ (3(a)(iii): "$123,000 a unit ($7,380,000 total costs ÷ 60 units)"; total costs = 1,620,000 + 96,000×60 = **7,380,000** ✓)
- Productivity = 60 ÷ 120 = **0.5 houses/worker**
- GP = Rev − CoS: 2024: 7,800 − 5,460 = **2,340 ✓**; 2025: 9,000 − 6,120 = **2,880 ✓**
- GPM = 2,340÷7,800 = **30.0%** ✓; 2,880÷9,000 = **32.0%** ✓
- PM = 1,170÷7,800 = **15.0%** ✓; 1,440÷9,000 = **16.0%** ✓
- ROCE = 1,170÷6,500 = **18.0%** ✓; 1,440÷7,200 = **20.0%** ✓
- 3(b) lines (30.0/32.0/15.0/16.0/18.0/20.0) — all match.

### P2_SET_138 — Rivermead Recycling Co-operative (profitability)
- Contribution = 20.00 − 12.00 = **$8.00**; BE = 640,000 ÷ 8.00 = **80,000** ✓; MoS = 110,000 − 80,000 = **30,000** ✓
- ATC = 640,000 ÷ 110,000 + 12.00 = 5.8182 + 12.00 = 17.8182 → **$17.82** ✓ (3(a)(iii): "$17.82 a unit ($1,960,000 total costs ÷ 110,000 units)"; total costs = 640,000 + 12.00×110,000 = **1,960,000** ✓)
- Productivity = 110,000 ÷ 60 ≈ **1,833.3**
- GP = Rev − CoS: 2024: 1,850 − 1,221 = **629 ✓**; 2025: 2,200 − 1,364 = **836 ✓**
- GPM = 629÷1,850 = **34.0%** ✓; 836÷2,200 = **38.0%** ✓
- PM = 370÷1,850 = **20.0%** ✓; 484÷2,200 = **22.0%** ✓
- ROCE = 370÷2,000 = **18.5%** ✓; 484÷2,200 = **22.0%** ✓
- 3(b) lines (34.0/38.0/20.0/22.0/18.5/22.0) — all match.

### P2_SET_139 — ThermaWool Industries (profitability)
- Contribution = 25.00 − 13.50 = **$11.50**; BE = 1,150,000 ÷ 11.50 = **100,000** ✓; MoS = 166,000 − 100,000 = **66,000** ✓
- ATC = 1,150,000 ÷ 166,000 + 13.50 = 6.9277 + 13.50 = 20.4277 → **$20.43** ✓ (3(a)(iii): "$20.43 a unit ($3,391,000 total costs ÷ 166,000 units)"; total costs = 1,150,000 + 13.50×166,000 = **3,391,000** ✓)
- Productivity = 166,000 ÷ 85 ≈ **1,952.9**
- GP = Rev − CoS: 2024: 3,600 − 2,232 = **1,368 ✓**; 2025: 4,150 − 2,407 = **1,743 ✓**
- GPM = 1,368÷3,600 = **38.0%** ✓; 1,743÷4,150 = **42.0%** ✓
- PM = 648÷3,600 = **18.0%** ✓; 913÷4,150 = **22.0%** ✓
- ROCE = 648÷3,600 = **18.0%** ✓; 913÷3,652 = **25.0%** ✓ (3,652 × 0.25 = 913.0 exactly)
- 3(b) lines (38.0/42.0/18.0/22.0/18.0/25.0) — all match.

### P2_SET_140 — VerdeMix Concrete (profitability)
- Contribution = 75.00 − 45.00 = **$30.00**; BE = 1,350,000 ÷ 30.00 = **45,000** ✓; MoS = 104,000 − 45,000 = **59,000** ✓
- ATC = 1,350,000 ÷ 104,000 + 45.00 = 12.9808 + 45.00 = 57.9808 → **$57.98** ✓ (3(a)(iii): "$57.98 a unit ($6,030,000 total costs ÷ 104,000 units)"; total costs = 1,350,000 + 45.00×104,000 = **6,030,000** ✓)
- Productivity = 104,000 ÷ 110 ≈ **945.5**
- GP = Rev − CoS: 2024: 6,900 − 4,623 = **2,277 ✓**; 2025: 7,800 − 4,836 = **2,964 ✓**
- GPM = 2,277÷6,900 = **33.0%** ✓; 2,964÷7,800 = **38.0%** ✓
- PM = 1,035÷6,900 = **15.0%** ✓; 1,404÷7,800 = **18.0%** ✓
- ROCE = 1,035÷5,750 = **18.0%** ✓; 1,404÷6,240 = **22.5%** ✓
- 3(b) lines (33.0/38.0/15.0/18.0/18.0/22.5) — all match.

**All 10 sets: independent recalculation agrees with the model answers (break-even / contribution / margin of safety / ATC(unit cost) / productivity; current & acid ratios or GPM/PM/ROCE; GP = Rev−CoS exact integers in both years for every profitability set). No discrepancy > tolerance anywhere.**

---

## 3. JSON structure (exact keys at every level, marks, unit, order)

All 10 sets verified programmatically:

- Top level keys exactly `{scenario_id, unit, case_study_insert, questions}` ✓; `unit = "Paper 2 Case Study"` ✓
- `case_study_insert` keys exactly `{main_stem, appendix_1_marketing_ops, appendix_2_financial_data, appendix_3_external_environment}` ✓
- `appendix_2_financial_data` keys exactly `{title, headers, rows}`; `headers == ["Financial Metric","2024","2025"]`; 6 rows; 3-element arrays with numeric-string values ✓
- 8 questions in order `1(a) 1(b) 2(a) 2(b) 3(a) 3(b) 4(a) 4(b)`; marks **8/12/8/12/8/12/8/12 = 80** ✓
- Question keys exactly `{number, mark_value, question_text, model_answer, mark_scheme, qwen_marking_keys}` (3(a) adds `sub_parts`) ✓
- `mark_scheme` keys: (a)-questions `{knowledge_max_2, application_analysis_max_6}` ✓; (b)-questions `{level_1_1_to_4, level_2_5_to_8, level_3_9_to_12}` ✓; 3(a) exactly `{working_marks}` ✓
- `qwen_marking_keys` keys exactly `['valid_app_words']` for all 80 questions; 5–8 entries each (6–7 in practice); all strings, non-empty ✓
- 3(a) `sub_parts` == (i) 2m, (ii) 2m, (iii) 4m; sub_part keys exactly `{part, marks, question_text, model_answer}` ✓; 3(a) (i) contains "break-even output", (ii) contains "contribution per unit" in all 10 sets ✓
- Appendix 2 row labels are exactly the canonical ones — liquidity sets: `Inventories`, `Trade receivables`, `Cash and cash equivalents`, `Current liabilities`, `Non-current assets`, `Capital employed`; profitability sets: `Revenue`, `Cost of sales`, `Gross profit`, `Operating profit`, `Capital employed`, `Interest payable` ✓
- Appendix 2 titles include `$` and scale `($ '000)`; liquidity titles use Statement of Financial Position phrasing, profitability titles use Profit or Loss phrasing ✓

Question-pattern checks: every (a) question_text (except 3(a)) contains the business initials ✓; every (b) question except 3(b)/4(b) carries the `Consider … Which … Justify …` pattern (all 1(b)/2(b) verified `Consider=True Which=True Justify=True`) ✓; 3(b)/4(b) carry no `Consider` and end `Justify your answer.` ✓; 1(b) covers THREE options, 2(b) TWO options, and model answers end with an explicit recommendation rejecting the alternatives ✓ (spot-read all 10).

Model-answer lengths exceed the generator quality bar (8-mark ≥150 words except P2_SET_138/139/140 4(a)=165/150/160 and 2(a)=155/156/151 — all ≥150 ✓; 12-mark ≥250 words ✓). 3(a) top-level `model_answer` is short (47–53 words) in sets 136–140, but the scored content lives in `sub_parts` — sub-parts carry full applied, contextual answers; not a structural violation.

---

## 4. Appendix completeness

| Set | main_stem words | Initials | Legal structure | Sector/workforce/leadership | Capital cost & finance | FC/VC/SP/output | Operational problem | App1 metrics (≥4 req.) | App2 6 rows ✓ | App3 %s (≥3 req.) | GP=Rev−CoS |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 101 | 119 | AAB | private limited company | artisan bakery / 38 / flat+democratic | $620,000; $400k bank loan + $220k retained profit | $225,000 / $4.40 / $8.00 / 100,000 | 7% unsold-stock waste; 8% absenteeism | 616 chars / 16 metrics | ✓ | 532 chars / 6 %s | n/a (liquidity) |
| 102 | 119 | GDC | cooperative | dairy processing / 120 / hierarchical+autocratic | $1,400,000; $800k member share issue + $600k bank loan | $420,000 / $7.70 / $14.70 / 150,000 | cold-chain failures; packing-floor labour turnover | 677 chars / 16 metrics | ✓ | 511 chars / 6 %s | n/a |
| 103 | 124 | ICB | private limited company | craft brewing / 52 / flat+laissez-faire | $540,000; $150k overdraft + $390k retained profit | $180,000 / $12.00 / $16.00 / 72,000 | 3.2% defect rate; canning-line skills gap | 569 chars / 14 metrics | ✓ | 489 chars / 6 %s | n/a |
| 104 | 118 | BHS | public limited company | seafood processing / 240 / hierarchical+democratic | $3,800,000; $2.3m public share issue + $1.5m bank loan | $850,000 / $17.00 / $22.00 / 320,000 | export quality complaints; 19% labour turnover | 568 chars / 15 metrics | ✓ | 533 chars / 6 %s | n/a |
| 105 | 124 | VPTE | partnership | tea cultivation / 85 / hierarchical+autocratic | $480,000; $300k retained profit + $180k lease | $150,000 / $21.00 / $26.00 / 68,000 | 11% harvest absenteeism; orthodox-rolling skills gap | 567 chars / 14 metrics | ✓ | 506 chars / 6 %s | n/a |
| 136 | 119 | CVA | private limited company | quarrying & aggregates / 140 / hierarchical+autocratic | $1,450,000; $950k ten-year bank loan + $500k retained profit | $1,600,000 / $10.00 / $18.00 / 300,000 | dust above safety limits; 8% absenteeism | 460 chars / 12 metrics | ✓ | 471 chars / 5 %s | ✓ (1638=4680−3042; 2160=5400−3240) |
| 137 | 126 | HMH | public limited company | construction (modular homes) / 120 / flat+democratic | $2,300,000; $1.6m share issue + $700k bank loan | $1,620,000 / $96,000 / $150,000 / 60 | skills shortage (22/120 need erector cert); 7% absenteeism | 478 chars / 15 metrics | ✓ | 468 chars / 5 %s | ✓ (2340; 2880) |
| 138 | 117 | RRC | cooperative | recycling & waste-to-resource / 60 / flat+democratic | $980,000; $400k hire purchase + $580k retained profit | $640,000 / $12.00 / $20.00 / 110,000 | 6.4% waste contamination; 11% absenteeism | 457 chars / 13 metrics | ✓ | 498 chars / 5 %s | ✓ (629; 836) |
| 139 | 125 | TWI | private limited company | insulation & eco-materials / 85 / hierarchical+laissez-faire | $1,100,000; $600k bank loan + $500k hire purchase | $1,150,000 / $13.50 / $25.00 / 166,000 | skills gap (28/85 not certified); 2.9% defect rate | 396 chars / 11 metrics | ✓ | 427 chars / 5 %s | ✓ (1368; 1743) |
| 140 | 117 | VMC | public limited company | green concrete / 110 / flat+autocratic | $1,750,000; $1.0m share issue + $750k retained profit | $1,350,000 / $45.00 / $75.00 / 104,000 | two lost-time injuries 2026; 9% absenteeism | 449 chars / 11 metrics | ✓ | 426 chars / 5 %s | ✓ (2277; 2964) |

Appendix 3 in all 10 sets carries exactly THREE numbered external changes with explicit figures/percentages usable in Q4(b) (base rate, minimum wage, input-cost/landfill-tax/energy rise) ✓. Appendix 2 values all parse as comma-formatted numeric strings ✓. Gross profit == Revenue − Cost of sales **exactly, both years, all five profitability sets** ✓.

---

## 5. Deterministic grounding — valid_app_words

Haystacks: for 1(a)/1(b)/2(a)/2(b)/4(a)/4(b) → combined insert (main_stem + appendix_1 + appendix_2 JSON incl. title/headers/rows + appendix_3); for 3(a)/3(b) → insert **or** that question's model_answer/sub_parts. Substring match, case-insensitive, after whitespace normalisation.

**Full automated sweep of every valid_app_words entry (all 5–8 per question, all 8 questions, all 10 sets): 0 missing entries.** Results per set:

| Set | Sector | 1(a) | 1(b) | 2(a) | 2(b) | 3(a) | 3(b) | 4(a) | 4(b) |
|---|---|---|---|---|---|---|---|---|---|
| 101 | liquidity | ✓ 6/6 | ✓ 6/6 | ✓ 6/6 | ✓ 6/6 | ✓ 7/7 | ✓ 7/7 | ✓ 6/6 | ✓ 6/6 |
| 102 | liquidity | ✓ 6/6 | ✓ 6/6 | ✓ 6/6 | ✓ 6/6 | ✓ 7/7 | ✓ 7/7 | ✓ 6/6 | ✓ 6/6 |
| 103 | liquidity | ✓ 6/6 | ✓ 6/6 | ✓ 6/6 | ✓ 6/6 | ✓ 7/7 | ✓ 7/7 | ✓ 6/6 | ✓ 6/6 |
| 104 | liquidity | ✓ 6/6 | ✓ 6/6 | ✓ 6/6 | ✓ 6/6 | ✓ 7/7 | ✓ 7/7 | ✓ 6/6 | ✓ 6/6 |
| 105 | liquidity | ✓ 6/6 | ✓ 6/6 | ✓ 6/6 | ✓ 6/6 | ✓ 7/7 | ✓ 7/7 | ✓ 6/6 | ✓ 6/6 |
| 136 | profitability | ✓ 6/6 | ✓ 6/6 | ✓ 6/6 | ✓ 6/6 | ✓ 7/7 | ✓ 7/7 | ✓ 6/6 | ✓ 6/6 |
| 137 | profitability | ✓ 6/6 | ✓ 6/6 | ✓ 6/6 | ✓ 6/6 | ✓ 7/7 | ✓ 7/7 | ✓ 6/6 | ✓ 6/6 |
| 138 | profitability | ✓ 6/6 | ✓ 6/6 | ✓ 6/6 | ✓ 6/6 | ✓ 7/7 | ✓ 7/7 | ✓ 6/6 | ✓ 6/6 |
| 139 | profitability | ✓ 6/6 | ✓ 6/6 | ✓ 6/6 | ✓ 6/6 | ✓ 7/7 | ✓ 7/7 | ✓ 6/6 | ✓ 6/6 |
| 140 | profitability | ✓ 6/6 | ✓ 6/6 | ✓ 6/6 | ✓ 6/6 | ✓ 7/7 | ✓ 7/7 | ✓ 6/6 | ✓ 6/6 |

**First 3 questions (1(a), 1(b), 2(a)) checked by hand** in all 10 sets: question texts, insert text and VAW lists were read in full; every entry was located in the combined insert (e.g. P2_SET_101 2(a): `democratic leadership` (stem), `absenteeism` (stem+app1), `workforce of 38` (stem), `$700` (app1 hygiene-recertification cost), `2.6%` (app1 mis-bake rate), `100,000` (stem); P2_SET_136 2(a): `11 near-miss` (app1), `34 of 140 staff` (app1); P2_SET_140 2(a): `34 of 110 staff` (app1)). An additional 20-entry targeted grep spot-check across all 10 sets (`$700`, `$850`, `37,500`, `5.6%`, `18,400`, `$650`, `22 of 85`, `$600`, `11 near-miss`, `$410,000`, `2.7%`, `2.8 days`, `4.1%`, `$2.1 million` …) returned FOUND in every case. The full substring sweep above (every entry, every question, both sectors — at least one full set per sector) passes.

---

## 6. Uniqueness (initials & business names)

**Folders checked:** `C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\` (40 files), `...\wave_02\` (40 files), `...\wave_03\` (40 files), and `C:\Users\jayde\Documents\GitHub\fresh\paper2\waves\` (0 files — no combined wave output). No other generator output folders exist in the repo.

- Parenthesised initials across all 120 set files: **no duplicates** (scripted scan; P2_SET_138/P2_SET_123/P2_SET_178/P2_SET_183 names use hyphenated/compound forms my first regex missed, so additionally grep-verified: `Rivermead` / `RRC` occur **only** in P2_SET_138).
- The 10 audited initials each occur exactly **once** across the three waves: AAB, GDC, ICB, BHS, VPTE, CVA, HMH, RRC, TWI, VMC — grep counts all = 1.
- Business names distinct: Amberhill Artisan Bakery, Greenvale Dairy Cooperative, Ironpine Craft Brewery, Blueharbor Seafoods, Verdant Peak Tea Estate, Calder Vale Aggregates, Hartwell Modular Homes, Rivermead Recycling Co-operative, ThermaWool Industries, VerdeMix Concrete — no duplicates in any wave.
- Cross-wave gatekeeper seed (wave_02 + wave_03 + waves/) reported **zero** initials/scenario_id conflicts with the 10 audited sets in the canonical run (1b).

---

## 7. Marking keys (qwen_marking_keys)

- 5–8 entries per question (observed 6–7) — within bounds ✓
- Every entry is a string ✓; none empty ✓; keys of `qwen_marking_keys` are exactly `['valid_app_words']` in all 80 questions ✓
- All entries grounded verbatim in insert / insert+model_answer (§5) — no invented values ✓

---

## 8. Notes & non-defects (recorded, not rejections)

1. **Staged-copy gatekeeper FAIL** — self-comparison artifact vs the live identical files (§1a); documented invocation passes 40/40 (§1b). Not a set defect.
2. **P2_SET_137 margin of safety = 30 houses** — far below the generator's "≥5,000 units" heuristic, but each unit is a modular house (contribution $54,000/unit); the value is computed correctly and stated consistently; the TECH brief does not make it a rejection criterion.
3. **3(b) Evaluation/Conclusion prose** mentions "acid test" / "AT" / "CR" outside the calculation lines (the question itself asks *which ratio gives stronger evidence*, so naming it is mandatory); the **calculation lines** in `Detailed workings:` contain no forbidden ratio names — summary lines carry the required exact format. Compliant with the generator ruling.
4. **Blacklist scan** (NPV, IRR, PESTLE, SWOT, gearing, debtor days, ABC, variance, …): zero true positives. Two regex hits were false positives — P2_SET_104 "imp**orter**s" (inside valid words) and P2_SET_139 "**irr**elevant/irregularly" (inside ordinary words). No blacklist theory present.
5. **3(a) top-level `model_answer`** is short in the profitability sets (47–53 words) with the substance in `sub_parts` — allowed by schema; schema was validated exactly (keys, marks, working_marks).
6. Model-answer word counts (excluding 3(a), whose scored content is in `sub_parts` — see note 5): all 1(a)/2(a)/4(a) answers ≥150 words (minimum: P2_SET_139 4(a) = 150); all 12-mark answers ≥250 words (minimum: P2_SET_138 3(b) = 257) ✓.

---

## 9. Verdict table

| Set | Gatekeeper | Recalc | Structure | Appendices | Grounding | Uniqueness | Marking keys | Verdict |
|---|---|---|---|---|---|---|---|---|
| P2_SET_101 | PASS (1b) | ✓ | ✓ | ✓ | ✓ (liquidity) | ✓ | ✓ | **APPROVED_BY_TECH_AUD** |
| P2_SET_102 | PASS (1b) | ✓ | ✓ | ✓ | ✓ (liquidity) | ✓ | ✓ | **APPROVED_BY_TECH_AUD** |
| P2_SET_103 | PASS (1b) | ✓ | ✓ | ✓ | ✓ (liquidity) | ✓ | ✓ | **APPROVED_BY_TECH_AUD** |
| P2_SET_104 | PASS (1b) | ✓ | ✓ | ✓ | ✓ (liquidity) | ✓ | ✓ | **APPROVED_BY_TECH_AUD** |
| P2_SET_105 | PASS (1b) | ✓ | ✓ | ✓ | ✓ (liquidity) | ✓ | ✓ | **APPROVED_BY_TECH_AUD** |
| P2_SET_136 | PASS (1b) | ✓ | ✓ | ✓ | ✓ (profitability) | ✓ | ✓ | **APPROVED_BY_TECH_AUD** |
| P2_SET_137 | PASS (1b) | ✓ | ✓ | ✓ | ✓ (profitability) | ✓ | ✓ | **APPROVED_BY_TECH_AUD** |
| P2_SET_138 | PASS (1b) | ✓ | ✓ | ✓ | ✓ (profitability) | ✓ | ✓ | **APPROVED_BY_TECH_AUD** |
| P2_SET_139 | PASS (1b) | ✓ | ✓ | ✓ | ✓ (profitability) | ✓ | ✓ | **APPROVED_BY_TECH_AUD** |
| P2_SET_140 | PASS (1b) | ✓ | ✓ | ✓ | ✓ (profitability) | ✓ | ✓ | **APPROVED_BY_TECH_AUD** |

Files live-audited (read-only): `C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_101.json` … `P2_SET_105.json`, `P2_SET_136.json` … `P2_SET_140.json`. Staged copies (hash-identical) at `C:\Users\jayde\AppData\Local\Temp\opencode\techaud13b\`. No set was modified, fixed, or approved with any failing check.
