# TECH-AUD-14 — Tier 2B Schema / Math / Grounding Audit (Wave 01)

**Auditor:** TECH-AUD-14 (Tier 2B schema/math/grounding)
**Date:** 2026-11-19
**Sets audited:** P2_SET_106, P2_SET_107, P2_SET_108, P2_SET_109, P2_SET_110 (GEN-02); P2_SET_131, P2_SET_132, P2_SET_133, P2_SET_134, P2_SET_135 (GEN-07)
**Files audited:** `C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_106.json … P2_SET_110.json`, `…\P2_SET_131.json … P2_SET_135.json`
**Staging dir:** `C:\Users\jayde\AppData\Local\Temp\opencode\techaud14` (copies only; sets NOT modified)

> Every figure below was re-derived by hand from the stem/appendices, independently of the gatekeeper. Tolerances used: ratio ±0.06, percentage margins ±0.75pt, money ±0.6% rel / $0.51 abs (gatekeeper tolerances), plus exact-integer checks for $'000 cells.

---

## 0. Readiness gate

On first check the `wave_01` directory was empty. A background re-check loop (45 s interval, max 20 iterations) was started. Files appeared progressively (10 → 9 → 8 → 5 → 3 → 2 → 1 → 0 missing) and **all 10 files were present and JSON-parseable at iteration 16 of 20** (~12 minutes). No NOT_READY verdicts were required. All 10 files were copied to the staging dir and parsed with `json.load(..., encoding='utf-8')` without error before auditing.

---

## 1. Gatekeeper runs (verbatim)

### 1a. Run prescribed by the brief (staged copies, `--sets-dir` = staging dir) — verbatim

```
==============================================================================
GATEKEEPER REPORT  |  checked 10 set(s)
==============================================================================
[FAIL] P2_SET_106  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud14\P2_SET_106.json)
    ERROR: business initials 'KPE' already used by set P2_SET_106
    ERROR: scenario_id 'P2_SET_106' already used in P2_SET_106.json
[FAIL] P2_SET_107  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud14\P2_SET_107.json)
    ERROR: business initials 'AAC' already used by set P2_SET_107
    ERROR: scenario_id 'P2_SET_107' already used in P2_SET_107.json
[FAIL] P2_SET_108  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud14\P2_SET_108.json)
    ERROR: business initials 'APC' already used by set P2_SET_108
    ERROR: scenario_id 'P2_SET_108' already used in P2_SET_108.json
[FAIL] P2_SET_109  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud14\P2_SET_109.json)
    ERROR: business initials 'MTT' already used by set P2_SET_109
    ERROR: scenario_id 'P2_SET_109' already used in P2_SET_109.json
[FAIL] P2_SET_110  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud14\P2_SET_110.json)
    ERROR: business initials 'VEL' already used by set P2_SET_110
    ERROR: scenario_id 'P2_SET_110' already used in P2_SET_110.json
[FAIL] P2_SET_131  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud14\P2_SET_131.json)
    ERROR: business initials 'ADG' already used by set P2_SET_131
    ERROR: scenario_id 'P2_SET_131' already used in P2_SET_131.json
[FAIL] P2_SET_132  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud14\P2_SET_132.json)
    ERROR: business initials 'BNG' already used by set P2_SET_132
    ERROR: scenario_id 'P2_SET_132' already used in P2_SET_132.json
[FAIL] P2_SET_133  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud14\P2_SET_133.json)
    ERROR: business initials 'RVH' already used by set P2_SET_133
    ERROR: scenario_id 'P2_SET_133' already used in P2_SET_133.json
[FAIL] P2_SET_134  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud14\P2_SET_134.json)
    ERROR: business initials 'MCC' already used by set P2_SET_134
    ERROR: scenario_id 'P2_SET_134' already used in P2_SET_134.json
[FAIL] P2_SET_135  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud14\P2_SET_135.json)
    ERROR: business initials 'BTP' already used by set P2_SET_135
    ERROR: scenario_id 'P2_SET_135' already used in P2_SET_135.json
==============================================================================
Sets passed: 0/10   |   failed: 10
```

**These FAIL lines are an artifact of the prescribed staging method, not real defects.** The gatekeeper's "previously used" scan covers `paper2/sets/**` and `paper2/waves/*.json`, skipping only files located *under* `--sets-dir`. Because the staged copies live in `%LOCALAPPDATA%\Temp\opencode\techaud14`, the original files still present in `sets\wave_01` were scanned as "prior" uses, so each staged set collided with itself. Evidence: every error references the *same* scenario_id as the file under test (e.g. `initials 'KPE' already used by set P2_SET_106` reported for `P2_SET_106.json`) — a genuine cross-set duplicate would reference a *different* set id. All other gatekeeper checks (structure, marks, words, math, grounding) produced **zero** errors for all 10 sets in this run.

### 1b. Correct-semantics run (`--sets-dir` = the live `sets\wave_01`, all 40 wave-01 sets) — my 10 lines + summary, verbatim

Command: `python gatekeeper.py --sets-dir C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01` (exit code **0**). Full log saved at `C:\Users\jayde\AppData\Local\Temp\opencode\techaud14\gatekeeper_wave01.log`.

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
[PASS] P2_SET_107  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_107.json)
[PASS] P2_SET_108  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_108.json)
[PASS] P2_SET_109  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_109.json)
[PASS] P2_SET_110  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_110.json)
[PASS] P2_SET_111  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_111.json)
[PASS] P2_SET_112  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_112.json)
[PASS] P2_SET_113  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_113.json)
[PASS] P2_SET_114  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_114.json)
[PASS] P2_SET_115  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_115.json)
[PASS] P2_SET_116  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_116.json)
[PASS] P2_SET_117  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_117.json)
[PASS] P2_SET_118  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_118.json)
[PASS] P2_SET_119  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_119.json)
[PASS] P2_SET_120  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_120.json)
[PASS] P2_SET_121  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_121.json)
[PASS] P2_SET_122  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_122.json)
[PASS] P2_SET_123  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_123.json)
[PASS] P2_SET_124  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_124.json)
[PASS] P2_SET_125  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_125.json)
[PASS] P2_SET_126  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_126.json)
[PASS] P2_SET_127  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_127.json)
[PASS] P2_SET_128  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_128.json)
[PASS] P2_SET_129  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_129.json)
[PASS] P2_SET_130  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_130.json)
[PASS] P2_SET_131  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_131.json)
[PASS] P2_SET_132  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_132.json)
[PASS] P2_SET_133  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_133.json)
[PASS] P2_SET_134  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_134.json)
[PASS] P2_SET_135  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_135.json)
[PASS] P2_SET_136  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_136.json)
[PASS] P2_SET_137  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_137.json)
[PASS] P2_SET_138  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_138.json)
[PASS] P2_SET_139  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_139.json)
[PASS] P2_SET_140  (C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\P2_SET_140.json)
==============================================================================
Sets passed: 40/40   |   failed: 0
```

All 40 wave-01 sets PASS (`Sets passed: 40/40 | failed: 0`, exit 0). This run enforces uniqueness of initials and scenario_ids across the whole wave within a single pass, and is the authoritative gatekeeper result for my 10 sets: **all 10 PASS**. Note: 30 non-assigned sets were also checked by this run; their verdicts are their own auditors' call and are not decided here.

**Gatekeeper verdict for my 10 sets: PASS (correct-semantics run). Temp-staging run reported self-match artifacts only (see 1a); sets were not modified.**

---

## 2. Independent recalculation (per set)

### P2_SET_106 — Kestrel Precision Engineering (KPE) — liquidity set
Stem: FC $540,000; VC $18.50; SP $32.00; output 48,000; workforce 120; stem words **114**.
- Contribution = 32.00 − 18.50 = **$13.50** ✔ (model: $13.50)
- Break-even = 540,000 ÷ 13.50 = **40,000 units** ✔ (model: 40,000)
- Margin of safety = 48,000 − 40,000 = **8,000 units** ✔ (≥5,000 required ✔)
- ATC = 540,000 ÷ 48,000 + 18.50 = 11.25 + 18.50 = **$29.75** ✔ (model: $29.75)
- Labour productivity = 48,000 ÷ 120 = **400 units/worker**
- Current assets: 2024 = 210 + 340 + 80 = **$630k**; 2025 = 150 + 420 + 110 = **$680k**
- CR 2024 = 630 ÷ 450 = **1.40**; CR 2025 = 680 ÷ 425 = **1.60** ✔ (model lines match)
- Acid test 2024 = (630 − 210) ÷ 450 = 420 ÷ 450 = 0.9333 → **0.93**; 2025 = (680 − 150) ÷ 425 = 530 ÷ 425 = 1.2471 → **1.25** ✔ (model lines match)

### P2_SET_107 — Arden Automotive Components (AAC) — liquidity set
Stem: FC $570,000; VC $9.80; SP $15.50; output 150,000; workforce 340; stem words **116**.
- Contribution = 15.50 − 9.80 = **$5.70** ✔
- Break-even = 570,000 ÷ 5.70 = **100,000 units** ✔
- Margin of safety = 150,000 − 100,000 = **50,000 units** ✔
- ATC = 570,000 ÷ 150,000 + 9.80 = 3.80 + 9.80 = **$13.60** ✔ (model: $13.60)
- Labour productivity = 150,000 ÷ 340 ≈ **441.2 units/worker**
- Current assets: 2024 = 500 + 550 + 150 = **$1,200k**; 2025 = 380 + 640 + 230 = **$1,250k**
- CR 2024 = 1,200 ÷ 960 = **1.25**; CR 2025 = 1,250 ÷ 900 = 1.3889 → **1.39** ✔
- Acid test 2024 = (1,200 − 500) ÷ 960 = 700 ÷ 960 = 0.7292 → **0.73**; 2025 = (1,250 − 380) ÷ 900 = 870 ÷ 900 = 0.9667 → **0.97** ✔

### P2_SET_108 — Aldermere Packaging Cooperative (APC) — liquidity set
Stem: FC $310,000; VC $1.10; SP $4.20; output 160,000; workforce 60; stem words **111**.
- Contribution = 4.20 − 1.10 = **$3.10** ✔
- Break-even = 310,000 ÷ 3.10 = **100,000 units** ✔
- Margin of safety = 160,000 − 100,000 = **60,000 units** ✔
- ATC = 310,000 ÷ 160,000 + 1.10 = 1.9375 + 1.10 = 3.0375 → **$3.04** ✔ (model: $3.04)
- Labour productivity = 160,000 ÷ 60 ≈ **2,667 units/member**
- Current assets: 2024 = 95 + 130 + 60 = **$285k**; 2025 = 70 + 150 + 85 = **$305k**
- CR 2024 = 285 ÷ 190 = **1.50**; CR 2025 = 305 ÷ 175 = 1.7429 → **1.74** ✔
- Acid test 2024 = (285 − 95) ÷ 190 = 190 ÷ 190 = **1.00**; 2025 = (305 − 70) ÷ 175 = 235 ÷ 175 = 1.3429 → **1.34** ✔

### P2_SET_109 — Marlow Technical Textiles (MTT) — liquidity set
Stem: FC $432,000; VC $7.60; SP $13.00; output 110,000; workforce 85; stem words **111**.
- Contribution = 13.00 − 7.60 = **$5.40** ✔
- Break-even = 432,000 ÷ 5.40 = **80,000 units** ✔
- Margin of safety = 110,000 − 80,000 = **30,000 units** ✔
- ATC = 432,000 ÷ 110,000 + 7.60 = 3.9273 + 7.60 = 11.5273 → **$11.53** ✔ (model: $11.53)
- Labour productivity = 110,000 ÷ 85 ≈ **1,294.1 units/worker** ✔ (model: ≈1,294)
- Current assets: 2024 = 140 + 175 + 55 = **$370k**; 2025 = 110 + 195 + 70 = **$375k**
- CR 2024 = 370 ÷ 260 = 1.4231 → **1.42**; CR 2025 = 375 ÷ 225 = 1.6667 → **1.67** ✔
- Acid test 2024 = (370 − 140) ÷ 260 = 230 ÷ 260 = 0.8846 → **0.88**; 2025 = (375 − 110) ÷ 225 = 265 ÷ 225 = 1.1778 → **1.18** ✔

### P2_SET_110 — Vantor Electronics (VEL) — liquidity set
Stem: FC $784,000; VC $14.20; SP $24.00; output 130,000; workforce 210; stem words **111**.
- Contribution = 24.00 − 14.20 = **$9.80** ✔
- Break-even = 784,000 ÷ 9.80 = **80,000 units** ✔
- Margin of safety = 130,000 − 80,000 = **50,000 units** ✔
- ATC = 784,000 ÷ 130,000 + 14.20 = 6.0308 + 14.20 = 20.2308 → **$20.23** ✔ (model: $20.23)
- Labour productivity = 130,000 ÷ 210 ≈ **619.0 panels/worker** ✔ (model: ≈619)
- Current assets: 2024 = 260 + 380 + 90 = **$730k**; 2025 = 200 + 440 + 130 = **$770k**
- CR 2024 = 730 ÷ 520 = 1.4038 → **1.40**; CR 2025 = 770 ÷ 500 = **1.54** ✔
- Acid test 2024 = (730 − 260) ÷ 520 = 470 ÷ 520 = 0.9038 → **0.90**; 2025 = (770 − 200) ÷ 500 = 570 ÷ 500 = **1.14** ✔

### P2_SET_131 — Alderney Dental Group (ADG) — profitability set
Stem: FC $384,000; VC $28.00; SP $60.00; output 96,000; workforce 84; stem words **114**.
- GP = Rev − CoS: 2024: 5,000 − 3,000 = **2,000** ✔; 2025: 5,760 − 3,168 = **2,592** ✔ (exact $'000)
- GPM = 2,000/5,000 = **40.0%**; 2,592/5,760 = **45.0%** ✔
- PM = 750/5,000 = **15.0%**; 1,152/5,760 = **20.0%** ✔
- ROCE = 750/5,000 = **15.0%**; 1,152/6,400 = **18.0%** ✔
- Contribution = 60.00 − 28.00 = **$32.00** ✔; Break-even = 384,000 ÷ 32.00 = **12,000 units** ✔; MoS = 96,000 − 12,000 = **84,000 units** ✔
- ATC = 384,000 ÷ 96,000 + 28.00 = 4.00 + 28.00 = **$32.00** ✔ (model: $32.00); productivity = 96,000 ÷ 84 ≈ **1,143 units/worker**

### P2_SET_132 — Brightwood Nursery Group (BNG) — profitability set
Stem: FC $528,000; VC $9.00; SP $16.50; output 90,000; workforce 132; stem words **119**.
- GP = Rev − CoS: 2024: 1,300 − 845 = **455** ✔; 2025: 1,485 − 891 = **594** ✔
- GPM = 455/1,300 = **35.0%**; 594/1,485 = **40.0%** ✔
- PM = 195/1,300 = **15.0%**; 297/1,485 = **20.0%** ✔
- ROCE = 195/1,560 = **12.5%**; 297/1,980 = **15.0%** ✔
- Contribution = 16.50 − 9.00 = **$7.50** ✔; Break-even = 528,000 ÷ 7.50 = **70,400 units** ✔; MoS = 90,000 − 70,400 = **19,600 units** ✔
- ATC = 528,000 ÷ 90,000 + 9.00 = 5.8667 + 9.00 = 14.8667 → **$14.87** ✔ (model: $14.87); productivity = 90,000 ÷ 132 ≈ **681.8 units/worker**
- Cross-check 3(a)(iii): 6% discount ⇒ price 16.50 × 0.94 = $15.51; contribution 15.51 − 9.00 = $6.51 ✔ internally consistent.

### P2_SET_133 — Riverbend Veterinary Hospital (RVH) — profitability set
Stem: FC $720,000; VC $12.00; SP $22.00; output 80,000; workforce 156; stem words **117**.
- GP = Rev − CoS: 2024: 1,500 − 900 = **600** ✔; 2025: 1,760 − 968 = **792** ✔
- GPM = 600/1,500 = **40.0%**; 792/1,760 = **45.0%** ✔
- PM = 225/1,500 = **15.0%**; 352/1,760 = **20.0%** ✔
- ROCE = 225/1,800 = **12.5%**; 352/2,200 = **16.0%** ✔
- Contribution = 22.00 − 12.00 = **$10.00** ✔; Break-even = 720,000 ÷ 10.00 = **72,000 units** ✔; MoS = 80,000 − 72,000 = **8,000 units** ✔ (≥5,000 ✔)
- ATC = 720,000 ÷ 80,000 + 12.00 = 9.00 + 12.00 = **$21.00** ✔ (model: $21.00); productivity = 80,000 ÷ 156 ≈ **513 units/worker**

### P2_SET_134 — Meadowlark Community Care (MCC) — profitability set
Stem: FC $765,000; VC $8.50; SP $17.00; output 120,000; workforce 210; stem words **118**.
- GP = Rev − CoS: 2024: 1,800 − 1,170 = **630** ✔; 2025: 2,040 − 1,224 = **816** ✔
- GPM = 630/1,800 = **35.0%**; 816/2,040 = **40.0%** ✔
- PM = 216/1,800 = **12.0%**; 306/2,040 = **15.0%** ✔
- ROCE = 216/1,500 = **14.4%**; 306/1,800 = **17.0%** ✔
- Contribution = 17.00 − 8.50 = **$8.50** ✔; Break-even = 765,000 ÷ 8.50 = **90,000 units** ✔; MoS = 120,000 − 90,000 = **30,000 units** ✔
- ATC = 765,000 ÷ 120,000 + 8.50 = 6.375 + 8.50 = 14.875 → **$14.875** ✔ (model states $14.875 exactly); productivity = 120,000 ÷ 210 ≈ **571.4 units/worker**

### P2_SET_135 — Brightpath Tuition Partners (BTP) — profitability set
Stem: FC $120,000; VC $4.00; SP $14.00; output 25,000; workforce 36; stem words **122**.
- GP = Rev − CoS: 2024: 300 − 135 = **165** ✔; 2025: 350 − 147 = **203** ✔
- GPM = 165/300 = **55.0%**; 203/350 = **58.0%** ✔
- PM = 45/300 = **15.0%**; 63/350 = **18.0%** ✔
- ROCE = 45/250 = **18.0%**; 63/300 = **21.0%** ✔
- Contribution = 14.00 − 4.00 = **$10.00** ✔; Break-even = 120,000 ÷ 10.00 = **12,000 units** ✔; MoS = 25,000 − 12,000 = **13,000 units** ✔
- ATC = 120,000 ÷ 25,000 + 4.00 = 4.80 + 4.00 = **$8.80** ✔ (model: $8.80); productivity = 25,000 ÷ 36 ≈ **694.4 units/tutor** ✔ (model: ≈694)
- Cross-check 3(a)(iii): productivity quote 694 ✔; hire-purchase $120,000 consistent with insert ✔.

**All recomputed values match the model answers within tolerance. No discrepancies.**

---

## 3. JSON structure & content checks (all 10 sets)

- Top-level keys exactly `scenario_id`, `unit`, `case_study_insert`, `questions`; `unit` = `Paper 2 Case Study` ✔
- Exactly 8 questions, numbers/order 1(a),1(b),2(a),2(b),3(a),3(b),4(a),4(b); marks 8/12/8/12/8/12/8/12 = 80 ✔
- `case_study_insert` keys exactly `main_stem`, `appendix_1_marketing_ops`, `appendix_2_financial_data`, `appendix_3_external_environment` ✔
- `appendix_2_financial_data`: keys exactly `title`,`headers`,`rows`; headers exactly `["Financial Metric","2024","2025"]`; exactly 6 rows; comma-formatted strings, `$` omitted; titles match the canonical liquidity/profitability phrasings and include `$ '000` ✔. Liquidity sets (106–110) use the exact required labels `Inventories`, `Trade receivables`, `Cash and cash equivalents`, `Current liabilities`, `Non-current assets`, `Capital employed`. Profitability sets (131–135) use `Revenue`, `Cost of sales`, `Gross profit`, `Operating profit`, `Capital employed` + free 6th row `Interest payable`, with GP = Rev − CoS exact in both years ✔.
- 8-mark (a) parts: `mark_scheme` keys exactly `knowledge_max_2`,`application_analysis_max_6` ✔; (b) parts: exactly `level_1_1_to_4`,`level_2_5_to_8`,`level_3_9_to_12` ✔; 3(a): exactly `working_marks` ✔; 3(a) `sub_parts` exactly 3, parts (i)/(ii)/(iii) with marks 2/2/4 and keys exactly `part`,`marks`,`question_text`,`model_answer` ✔
- Every part (a) question_text contains the business initials (gatekeeper + eyeball) ✔; every (b) question_text uses the `Which … ? Justify your …` pattern ✔; every (b) model answer ends with an explicit recommendation/decision rejecting the alternatives ✔
- 3(a)(i)/(ii) question texts contain the exact required phrases (`break-even output`, `contribution per unit`) ✔
- 3(b) model answers contain the labelled summary lines in the exact required format (liquidity: `Current Ratio 2024 = 1.40 : 1` …; profitability: `Gross Profit Margin 2024 = 40.0%` / `Profit Margin 2024 = 15.0%` / `ROCE 2024 = 15.0%` …) — verified by regex, 2 lines each per year ✔. `Detailed workings:` calculation lines contain no ratio-label words (see §5 note on the P2_SET_133 `procedures` substring false-positive) ✔
- Appendix 1: ≥120 chars, ≥4 numeric metrics each (106: defect 4.6%/2.9%, complaints 9→17, $38,000, 4.1 days, 68%, 57%, $1,150 — ≥4 ✔; same pattern verified for all 10) ✔
- Appendix 3: THREE external changes with figures each (e.g. 106: interest 5.25→6.0%; minimum wage +5.8% to $12.17; input costs +9.6% / inflation 6.8% / export demand +5.4%) ✔
- Main stem includes: `<Name> (<INI>)`, legal structure, sector, `workforce of N`, named founder, leadership/structure, exact capital cost, finance mix, `fixed costs of $X a year`, `variable cost of $Y a unit`, `selling price of $Z`, `produces N units`, operational/HR problem ✔ (all 10 verified by reading)
- Scenario_id matches filename; `scenario_id` pattern `P2_SET_###` within 101–500 ✔

---

## 4. Deterministic grounding (valid_app_words)

**Hand check — first 3 questions of ALL 10 sets (1(a), 1(b), 2(a)):** every `valid_app_words` entry located case-insensitively as a substring of the combined insert (main_stem + appendices incl. title/headers/rows). Examples:
- 106 1(a): `retained profit`, `bank loan`, `$650,000`, `$800,000`, `$1,450,000` (stem), `private limited company` (stem) — all present ✔; 1(b): `export order`, `$1,450,000`, `48,000`, `68%` (App1), `$32.00`, `industrial` ✔; 2(a): `autocratic leadership`, `defect rate`, `4.6%`, `workforce of 120`, `export order`, `48,000` ✔
- 107 1(a): `share issue`, `bank loan`, `$1,100,000`, `$1,200,000`, `$2,300,000`, `public limited company` ✔; 1(b): `automotive`, `$2,300,000`, `150,000`, `car manufacturers`, `91%` (App1), `$15.50` ✔; 2(a): `democratic leadership`, `labour turnover`, `14%`, `workforce of 340`, `$1,400` (App1), `welding` ✔
- 108 1(a): `retained profit`, `bank loan`, `$380,000`, `$600,000`, `$980,000`, `cooperative` ✔; 1(b): `eco-friendly`, `$980,000`, `160,000`, `71%` (App1), `e-commerce`, `$4.20` ✔; 2(a): `democratic leadership`, `11%`, `workforce of 60`, `offcut waste`, `$26,000` (App1), `cooperative` ✔
- 109 1(a): `retained profit`, `bank loan`, `$270,000`, `$450,000`, `$720,000`, `laissez-faire` ✔; 1(b): `recycled-fibre`, `$720,000`, `110,000`, `58%` (App1), `$13.00`, `flame-retardant` ✔; 2(a): `laissez-faire leadership`, `absenteeism`, `12%`, `workforce of 85`, `weaving hall`, `$1,000` (App1) ✔
- 110 1(a): `retained profit`, `share issue`, `$450,000`, `$650,000`, `$1,100,000`, `autocratic leadership` ✔; 1(b): `$1,100,000`, `130,000`, `66%` (App1), `ISO 14001` (App1), `$24.00`, `appliance` ✔; 2(a): `autocratic leadership`, `skills gap`, `workforce of 210`, `surface-mount technology`, `$1,200` (App1), `SMT` ✔
- 131 1(a): `retained profit`, `bank loan`, `$500,000`, `$700,000`, `$1,200,000`, `$384,000` ✔; 1(b): `Millbrook`, `$1,200,000`, `62%` (App1), `48%` (App1), `750` (App1), `11 days` ✔; 2(a): `turnover of 24%`, `workforce of 84`, `autocratic leadership`, `96,000`, `11 days`, `1.6%` (App1) ✔
- 132 1(a): `retained profit`, `bank loan`, `$300,000`, `$450,000`, `$750,000`, `$528,000` ✔; 1(b): `Riverside`, `$750,000`, `57%` (App1), `71%` (App1), `800` (App1), `145 children` ✔; 2(a): `turnover of 27%`, `workforce of 132`, `waiting list of 145`, `22,500` (App1), `0.9%` (App1), `57%` (App1) ✔
- 133 1(a): `retained profit`, `share issue`, `$900,000`, `$1,500,000`, `$2,400,000`, `$720,000` ✔; 1(b): `$2,400,000`, `66%` (App1), `39%` (App1), `$24` (App1), `900` (App1), `emergency` ✔; 2(a): `laissez-faire leadership`, `29%`, `52%` (App1), `66%` (App1), `workforce of 156`, `specialist` ✔
- 134 1(a): `retained profit`, `bank loan`, `$240,000`, `$400,000`, `$640,000`, `$765,000` ✔; 1(b): `Eastvale`, `$640,000`, `74%` (App1), `41%` (App1), `700` (App1), `93.2%` (App1) ✔; 2(a): `turnover of 34%`, `workforce of 210`, `30,000` (App1), `93.2%` (App1), `democratic leadership`, `waiting list` ✔
- 135 1(a): `retained profit`, `hire-purchase`, `$260,000`, `$120,000`, `$380,000`, `$120,000 a year` ✔; 1(b): `Northgate`, `$380,000`, `69%` (App1), `54%` (App1), `600` (App1), `$45` (App1) ✔; 2(a): `turnover of 21%`, `workforce of 36`, `autocratic leadership`, `25,000`, `6,250` (App1), `waiting list` ✔

**Independent scripted re-check (all 8 questions × 10 sets):** every `valid_app_words` entry found (case-insensitive substring, insert for non-3(x) questions; insert + model_answer + sub_parts for 3(a)/3(b)). 5–8 entries per question, all strings ✔. Zero misses.

**Hand check statement:** I hand-verified the first 3 questions of each of the 10 sets (30/30 question-level hand checks, all pass), as required.

**Marking keys:** 5–8 entries, all strings, verbatim-copied from the insert/computed values; no invented values found ✔.

### Note on the P2_SET_133 "ROCE" substring scan
A case-insensitive substring scan for the word `roce` outside the labelled summary lines flagged one line in the 3(b) Conclusion: `… completed procedures.` — the match is `procedures` ⊃ `roce`, not the acronym. The `Detailed workings:` calculation lines of P2_SET_133 (and all other sets) contain no occurrences of `current ratio`, `acid test`, `gross profit margin`, `profit margin` or `ROCE`. No breach.

---

## 5. Uniqueness (wave_01, wave_02, waves/, exemplar)

**Sibling folders/files checked:**
- `C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\` — all 40 sets (P2_SET_101…140)
- `C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\` — 39 sets present at audit time (P2_SET_141…179; 180 not yet written) — still populating, results current as of 2026-11-19
- `C:\Users\jayde\Documents\GitHub\fresh\paper2\waves\` — empty (0 files)
- `C:\Users\jayde\Documents\GitHub\fresh\paper2\prompts\example_set.json` — exemplar (P2_SET_101 Lakestone Fresh Foods / LFF)
- No per-generator folders exist; all generators write directly into `sets\wave_XX\`.

**Business-identity uniqueness (business name, initials, scenario_id): ALL 10 sets UNIQUE.** No shared business names, no shared initials, no shared scenario_ids across wave_01 + wave_02 + waves/ + exemplar. Initials: KPE, AAC, APC, MTT, VEL, ADG, BNG, RVH, MCC, BTP — none reused anywhere. Business names (Kestrel Precision Engineering, Arden Automotive Components, Aldermere Packaging Cooperative, Marlow Technical Textiles, Vantor Electronics, Alderney Dental Group, Brightwood Nursery Group, Riverbend Veterinary Hospital, Meadowlark Community Care, Brightpath Tuition Partners) — none reused.

**Founder-name reuse observation (not a business-identity duplicate; flagged for the wave lead, not scored as a TECH-AUD failure):**
- `Daniel Okafor` — P2_SET_106 (GEN-02), P2_SET_135 (GEN-07), also P2_SET_127 (wave_01) and P2_SET_161 (wave_02)
- `Priya Raman` — P2_SET_107 (also P2_SET_101, P2_SET_118, P2_SET_126 in wave_01; P2_SET_157, P2_SET_167 in wave_02); `Dr Priya Raman` — P2_SET_131 (also `Dr Priya Raman` in P2_SET_171, wave_02)
- `Rosa Jiménez` — P2_SET_108 (also P2_SET_143, wave_02)
- `Marcus Whitfield` — P2_SET_110 (also P2_SET_119, wave_01)

The generator brief requires uniqueness of *business name and initials* (the gatekeeper enforces initials); it does not require unique founder/leader first-and-last names. All 10 audited sets are distinct businesses in distinct sectors/settings with distinct insert data. The reuse is endemic across the whole wave (8+ sets per name) and indicates shallow name pools in both generators, not copying. I flag it for the wave lead to decide whether to instruct regeneration on originality grounds; it does not breach the schema/math/grounding mandate and is not a basis for rejection in this audit.

---

## 6. Model-answer length (informational; benchmark = gold exemplar)

Exemplar model-answer word counts: 8-mark: 136 / 119 / 133; 12-mark: 273 / 208 / 262 / 395. Audited sets — 8-mark min: 136 (P2_SET_110 2(a)), 140 (P2_SET_110 1(a)), 143–181 elsewhere; 12-mark min: 213 (P2_SET_132 2(b)), 223–224 (P2_SET_133 2(b), P2_SET_110 2(b)), max 319 (P2_SET_132 4(b)). All within the range of the gate-passing exemplar; none are pathologically short or padded. (`3(a)` summary answers are intentionally short: 54–61 words.)

---

## 7. Verdict table

| Set | Scenario ID | Type | Gatekeeper (correct-semantics run) | Recalc | JSON structure | Appendix completeness | Grounding (hand + scripted) | Uniqueness (identity) | Verdict |
|-----|-------------|------|-----------------------------------|--------|----------------|----------------------|------------------------------|-----------------------|---------|
| 106 | P2_SET_106 | liquidity (KPE) | PASS | ✔ exact | ✔ | ✔ | ✔ | unique | **APPROVED_BY_TECH_AUD** |
| 107 | P2_SET_107 | liquidity (AAC) | PASS | ✔ exact | ✔ | ✔ | ✔ | unique | **APPROVED_BY_TECH_AUD** |
| 108 | P2_SET_108 | liquidity (APC) | PASS | ✔ exact | ✔ | ✔ | ✔ | unique | **APPROVED_BY_TECH_AUD** |
| 109 | P2_SET_109 | liquidity (MTT) | PASS | ✔ exact | ✔ | ✔ | ✔ | unique | **APPROVED_BY_TECH_AUD** |
| 110 | P2_SET_110 | liquidity (VEL) | PASS | ✔ exact | ✔ | ✔ | ✔ | unique | **APPROVED_BY_TECH_AUD** |
| 131 | P2_SET_131 | profitability (ADG) | PASS | ✔ exact | ✔ | ✔ | ✔ | unique | **APPROVED_BY_TECH_AUD** |
| 132 | P2_SET_132 | profitability (BNG) | PASS | ✔ exact | ✔ | ✔ | ✔ | unique | **APPROVED_BY_TECH_AUD** |
| 133 | P2_SET_133 | profitability (RVH) | PASS | ✔ exact | ✔ | ✔ | ✔ | unique | **APPROVED_BY_TECH_AUD** |
| 134 | P2_SET_134 | profitability (MCC) | PASS | ✔ exact | ✔ | ✔ | ✔ | unique | **APPROVED_BY_TECH_AUD** |
| 135 | P2_SET_135 | profitability (BTP) | PASS | ✔ exact | ✔ | ✔ | ✔ | unique | **APPROVED_BY_TECH_AUD** |

**Notes**
1. The brief-prescribed temp-staging gatekeeper invocation reports self-match artifacts only (§1a); the correct-semantics run (§1b) passes all 10; no set was modified by this audit.
2. Founder-name reuse across the wave is reported in §5 for the wave lead; not a TECH-AUD failure ground.
3. Minor prose observations (non-blocking, not corrected per protocol): 106 2(b) mentions "water-treatment exhibition" for oil-and-gas valves; 109 1(b) "from a 85-person firm"; 108 4(b) estimates input-cost loss as "roughly $15,800" (computed 0.70 × 13.8% × 160,000 ≈ $15,456; the wage-vs-input conclusion is unaffected); 134 4(b) "about $22,400" (computed ≈ $22,320); 3(b) Evaluation sections use the word "procedures" which substring-matches `roce` (P2_SET_133) — harmless. None of these affect any recalculated, labelled or gatekeeper-checked value.
