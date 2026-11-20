# TECH-AUD-14 — Tier 2B Schema / Math / Grounding Audit (Wave 03)

**Auditor:** TECH-AUD-14 (Tier 2B schema/math/grounding)
**Date:** 2026-11-20
**Sets audited:** P2_SET_186, P2_SET_187, P2_SET_188, P2_SET_189, P2_SET_190, P2_SET_211, P2_SET_212, P2_SET_213, P2_SET_214, P2_SET_215 (10 sets)
**Files audited:** `C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\P2_SET_186.json` … `P2_SET_190.json`, `…\P2_SET_211.json` … `P2_SET_215.json`
**Staging dir:** `C:\Users\jayde\AppData\Local\Temp\opencode\w03t14` (copies only; sets NOT modified). Originals match staged copies by hash (e.g., P2_SET_186 = 69661F063DA7FAC5D755C772F9C3AC4E7B820F6A2BCEE53EF4FCE87C8B8FC2FD; P2_SET_215 = 4A5810504002C6E6E980EFBBC22BFEEA50686E8E68BB23C656162BAA1D1834B2).

> Every figure below was re-derived by hand from the stem/appendices, independently of the gatekeeper. Tolerances used: ratio ±0.06, percentage margins ±0.75pt, money ±0.6% rel / $0.51 abs (gatekeeper tolerances), plus exact-integer checks for $'000 cells.

---

## 0. Readiness gate

All 10 files are present in the live wave directory, parse with `json.load(..., encoding='utf-8')` without error, and are hash-identical to the staged copies taken at audit start. No NOT_READY verdicts required. No set was modified by this audit.

---

## 1. Gatekeeper runs (verbatim)

### 1a. Run prescribed by the brief (staged copies, `--sets-dir` = staging dir) — verbatim

```
==============================================================================
GATEKEEPER REPORT  |  checked 10 set(s)
==============================================================================
[FAIL] P2_SET_186  (C:\Users\jayde\AppData\Local\Temp\opencode\w03t14\P2_SET_186.json)
    ERROR: business initials 'KBC' already used by set P2_SET_186
    ERROR: scenario_id 'P2_SET_186' already used in P2_SET_186.json
[FAIL] P2_SET_187  (C:\Users\jayde\AppData\Local\Temp\opencode\w03t14\P2_SET_187.json)
    ERROR: business initials 'RMA' already used by set P2_SET_187
    ERROR: scenario_id 'P2_SET_187' already used in P2_SET_187.json
[FAIL] P2_SET_188  (C:\Users\jayde\AppData\Local\Temp\opencode\w03t14\P2_SET_188.json)
    ERROR: business initials 'CSF' already used by set P2_SET_188
    ERROR: scenario_id 'P2_SET_188' already used in P2_SET_188.json
[FAIL] P2_SET_189  (C:\Users\jayde\AppData\Local\Temp\opencode\w03t14\P2_SET_189.json)
    ERROR: business initials 'THB' already used by set P2_SET_189
    ERROR: scenario_id 'P2_SET_189' already used in P2_SET_189.json
[FAIL] P2_SET_190  (C:\Users\jayde\AppData\Local\Temp\opencode\w03t14\P2_SET_190.json)
    ERROR: business initials 'DMP' already used by set P2_SET_190
    ERROR: scenario_id 'P2_SET_190' already used in P2_SET_190.json
[FAIL] P2_SET_211  (C:\Users\jayde\AppData\Local\Temp\opencode\w03t14\P2_SET_211.json)
    ERROR: business initials 'HVI' already used by set P2_SET_211
    ERROR: scenario_id 'P2_SET_211' already used in P2_SET_211.json
[FAIL] P2_SET_212  (C:\Users\jayde\AppData\Local\Temp\opencode\w03t14\P2_SET_212.json)
    ERROR: business initials 'HCA' already used by set P2_SET_212
    ERROR: scenario_id 'P2_SET_212' already used in P2_SET_212.json
[FAIL] P2_SET_213  (C:\Users\jayde\AppData\Local\Temp\opencode\w03t14\P2_SET_213.json)
    ERROR: business initials 'VRM' already used by set P2_SET_213
    ERROR: scenario_id 'P2_SET_213' already used in P2_SET_213.json
[FAIL] P2_SET_214  (C:\Users\jayde\AppData\Local\Temp\opencode\w03t14\P2_SET_214.json)
    ERROR: business initials 'RPS' already used by set P2_SET_214
    ERROR: scenario_id 'P2_SET_214' already used in P2_SET_214.json
[FAIL] P2_SET_215  (C:\Users\jayde\AppData\Local\Temp\opencode\w03t14\P2_SET_215.json)
    ERROR: business initials 'HMP' already used by set P2_SET_215
    ERROR: scenario_id 'P2_SET_215' already used in P2_SET_215.json
==============================================================================
Sets passed: 0/10   |   failed: 10
==============================================================================
```

**These FAIL lines are an artifact of the prescribed staging method, not real defects.** The gatekeeper's "previously used" scan covers `paper2/sets/**` and `paper2/waves/*.json`, skipping only files located *under* `--sets-dir`. Because the staged copies live in `%LOCALAPPDATA%\Temp\opencode\w03t14`, the original files still present in `sets\wave_03` were scanned as "prior" uses, so each staged set collided with itself. Evidence: every error references the *same* scenario_id as the file under test (e.g., `initials 'KBC' already used by set P2_SET_186` reported for `P2_SET_186.json`) — a genuine cross-set duplicate would reference a *different* set id. All other gatekeeper checks (structure, marks, words, math, grounding) produced **zero errors** for all 10 sets in this run. (Same convention as the wave_01 TECH-AUD-14 report.)

### 1b. Correct-semantics run (`--sets-dir` = the live `sets\wave_03`, all 40 wave-03 sets) — verbatim, exit code **0**. Full log saved at `C:\Users\jayde\AppData\Local\Temp\opencode\w03t14\gatekeeper_wave03.log`.

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
==============================================================================
```

All 40 wave-03 sets PASS (`Sets passed: 40/40 | failed: 0`, exit 0). This run enforces uniqueness of initials and scenario_ids across the whole wave within a single pass, and is the authoritative gatekeeper result for my 10 sets: **all 10 PASS**. Note: the 30 non-assigned wave-03 sets were also checked by this run; their verdicts are their own auditors' call and are not decided here.

**Gatekeeper verdict for my 10 sets: PASS (correct-semantics run). Temp-staging run reported self-match artifacts only (see 1a); sets were not modified.**

---

## 2. Independent recalculation (per set, hand arithmetic)

### P2_SET_186 — Kingsbarrow Ceramics (KBC) — liquidity set
Stem: FC $360,000; variable cost $9.50 a unit; selling price $18.50; produces 75,000 units; workforce 68; stem word count 122.
- Contribution per unit = $18.50 − $9.50 = **$9.00** ✔ (model 3(a)(i): $9.00)
- Break-even output = $360,000 ÷ $9.00 = **40,000 units** ✔ (model 3(a)(ii): 40,000)
- Margin of safety = 75,000 − 40,000 = **35,000 units** ✔ (model 3(a)(iii): "margin of safety of 35,000 units")
- Average total cost = $360,000 ÷ 75,000 + $9.50 = 4.80 + 9.50 = **$14.30** ✔ (model 3(a)(iii): $14.30)
- Labour productivity = 75,000 ÷ 68 ≈ **1,102.9 units/worker**
- Appendix 2 liquidity (CA = Inventories + Trade receivables + Cash): 2024 CA = 150 + 210 + 60 = 420; CR = 420 ÷ 300 = **1.40**; Acid = (420 − 150) ÷ 300 = 270 ÷ 300 = **0.90** — model: 1.40, 0.90 ✔. 2025 CA = 165 + 265 + 95 = 525; CR = 525 ÷ 350 = **1.50**; Acid = (525 − 165) ÷ 350 = 360 ÷ 350 ≈ **1.03** — model: 1.50, 1.03 ✔

### P2_SET_187 — Redmoor Abrasives (RMA) — liquidity set
Stem: FC $528,000; VC $13.00; SP $24.00; output 96,000; workforce 140; words 119.
- Contribution = $24.00 − $13.00 = **$11.00** ✔ (model: $11.00)
- Break-even = $528,000 ÷ $11.00 = **48,000 units** ✔
- Margin of safety = 96,000 − 48,000 = **48,000 units** ✔
- ATC = $528,000 ÷ 96,000 + $13.00 = 5.50 + 13.00 = **$18.50** ✔
- Labour productivity = 96,000 ÷ 140 ≈ **685.7 units/worker**
- Appendix 2 liquidity: 2024 CA = 260 + 300 + 120 = 680; CR = 680 ÷ 400 = **1.70**; Acid = (680 − 260) ÷ 400 = 420 ÷ 400 = **1.05** — model: 1.70, 1.05 ✔. 2025 CA = 240 + 350 + 170 = 760; CR = 760 ÷ 475 = **1.60** (1.5957); Acid = (760 − 240) ÷ 475 = 520 ÷ 475 ≈ **1.09** (1.095) — model: 1.60, 1.09 ✔

### P2_SET_188 — Clearspire Filtration (CSF) — liquidity set
Stem: FC $312,000; VC $18.00; SP $30.00; output 48,000; workforce 34; words 127.
- Contribution = $30.00 − $18.00 = **$12.00** ✔; Break-even = $312,000 ÷ $12.00 = **26,000 units** ✔; Margin of safety = 48,000 − 26,000 = **22,000 units** ✔; ATC = $312,000 ÷ 48,000 + $18.00 = 6.50 + 18.00 = **$24.50** ✔; productivity = 48,000 ÷ 34 ≈ **1,411.8 units/worker**
- Appendix 2 liquidity: 2024 CA = 90 + 145 + 45 = 280; CR = 280 ÷ 200 = **1.40**; Acid = (280 − 90) ÷ 200 = 190 ÷ 200 = **0.95** — model: 1.40, 0.95 ✔. 2025 CA = 100 + 165 + 65 = 330; CR = 330 ÷ 220 = **1.50**; Acid = (330 − 100) ÷ 220 = 230 ÷ 220 ≈ **1.05** — model: 1.50, 1.05 ✔

### P2_SET_189 — Thorncombe Belting (THB) — liquidity set
Stem: FC $405,000; VC $27.00; SP $45.00; output 36,000; workforce 52; words 127.
- Contribution = $45.00 − $27.00 = **$18.00** ✔; Break-even = $405,000 ÷ $18.00 = **22,500 units** ✔; Margin of safety = 36,000 − 22,500 = **13,500 units** ✔; ATC = $405,000 ÷ 36,000 + $27.00 = 11.25 + 27.00 = **$38.25** ✔; productivity = 36,000 ÷ 52 ≈ **692.3 units/worker**
- Appendix 2 liquidity: 2024 CA = 210 + 260 + 90 = 560; CR = 560 ÷ 350 = **1.60**; Acid = (560 − 210) ÷ 350 = 350 ÷ 350 = **1.00** — model: 1.60, 1.00 ✔. 2025 CA = 225 + 300 + 135 = 660; CR = 660 ÷ 400 = **1.65**; Acid = (660 − 225) ÷ 400 = 435 ÷ 400 ≈ **1.09** (1.0875) — model: 1.65, 1.09 ✔

### P2_SET_190 — Dunmore Plastics (DMP) — liquidity set
Stem: FC $315,000; VC $8.10; SP $12.60; output 110,000; workforce 81; words 126.
- Contribution = $12.60 − $8.10 = **$4.50** ✔; Break-even = $315,000 ÷ $4.50 = **70,000 units** ✔; Margin of safety = 110,000 − 70,000 = **40,000 units** ✔; ATC = $315,000 ÷ 110,000 + $8.10 = 2.86 + 8.10 = **$10.96** ✔; productivity = 110,000 ÷ 81 ≈ **1,358.0 units/worker**
- Appendix 2 liquidity: 2024 CA = 180 + 235 + 65 = 480; CR = 480 ÷ 320 = **1.50**; Acid = (480 − 180) ÷ 320 = 300 ÷ 320 = **0.94** (0.9375) — model: 1.50, 0.94 ✔. 2025 CA = 190 + 255 + 75 = 520; CR = 520 ÷ 325 = **1.60**; Acid = (520 − 190) ÷ 325 = 330 ÷ 325 ≈ **1.02** (1.0154) — model: 1.60, 1.02 ✔

### P2_SET_211 — Harborne Vision Institute (HVI) — profitability set
Stem: FC $306,000; VC $14.50; SP $40.00; output 78,000; workforce 38; words 117.
- Contribution = $40.00 − $14.50 = **$25.50** ✔; Break-even = $306,000 ÷ $25.50 = **12,000 units** ✔; Margin of safety = 78,000 − 12,000 = **66,000 units** ✔; ATC = $306,000 ÷ 78,000 + $14.50 = 3.92 + 14.50 = **$18.42** ✔; productivity = 78,000 ÷ 38 ≈ **2,052.6 units/worker**
- Appendix 2 profitability (Gross profit = Revenue − Cost of sales): 2024 GP = 2,600 − 1,690 = **910 = GP 910** ✔; 2025 GP = 3,120 − 1,716 = **1,404 = GP 1,404** ✔. GPM 2024 = 910 ÷ 2,600 = **35.0%** ✔; GPM 2025 = 1,404 ÷ 3,120 = **45.0%** ✔. PM 2024 = 312 ÷ 2,600 = **12.0%** ✔; PM 2025 = 624 ÷ 3,120 = **20.0%** ✔. ROCE 2024 = 312 ÷ 3,120 = **10.0%** ✔; ROCE 2025 = 624 ÷ 4,160 = **15.0%** ✔ (model 3(b): 35.0, 45.0, 12.0, 20.0, 10.0, 15.0)

### P2_SET_212 — Hexfield Code Academy (HCA) — profitability set
Stem: FC $715,000; VC $450; SP $1,000; output 6,800; workforce 26; words 122.
- Contribution = $1,000 − $450 = **$550** ✔; Break-even = $715,000 ÷ $550 = **1,300 units** ✔; Margin of safety = 6,800 − 1,300 = **5,500** ✔; ATC = $715,000 ÷ 6,800 + $450 = 105.09 + 450 = **$555.15** ✔; productivity = 6,800 ÷ 26 ≈ **261.5 units/worker**
- Appendix 2 profitability: 2024 GP = 5,600 − 3,360 = **2,240 = GP 2,240** ✔; 2025 GP = 6,800 − 3,740 = **3,060 = GP 3,060** ✔. GPM 2024 = 2,240 ÷ 5,600 = **40.0%** ✔; GPM 2025 = 3,060 ÷ 6,800 = **45.0%** ✔. PM 2024 = 840 ÷ 5,600 = **15.0%** ✔; PM 2025 = 1,360 ÷ 6,800 = **20.0%** ✔. ROCE 2024 = 840 ÷ 8,400 = **10.0%** ✔; ROCE 2025 = 1,360 ÷ 8,500 = **16.0%** ✔

### P2_SET_213 — Vital Roots Meal Prep (VRM) — profitability set
Stem: FC $247,500; VC $7.25; SP $12.75; output 96,000; workforce 52; words 128.
- Contribution = $12.75 − $7.25 = **$5.50** ✔; Break-even = $247,500 ÷ $5.50 = **45,000 units** ✔; Margin of safety = 96,000 − 45,000 = **51,000 units** ✔; ATC = $247,500 ÷ 96,000 + $7.25 = 2.58 + 7.25 = **$9.83** ✔; productivity = 96,000 ÷ 52 ≈ **1,846.2 units/worker**
- Appendix 2 profitability: 2024 GP = 1,080 − 756 = **324 = GP 324** ✔; 2025 GP = 1,224 − 765 = **459 = GP 459** ✔. GPM 2024 = 324 ÷ 1,080 = **30.0%** ✔; GPM 2025 = 459 ÷ 1,224 = **37.5%** ✔. PM 2024 = 108 ÷ 1,080 = **10.0%** ✔; PM 2025 = 153 ÷ 1,224 = **12.5%** ✔. ROCE 2024 = 108 ÷ 1,350 = **8.0%** ✔; ROCE 2025 = 153 ÷ 1,530 = **10.0%** ✔

### P2_SET_214 — Rowan Physio & Sports Clinic (RPS) — profitability set
Stem: FC $342,000; VC $22.00; SP $60.00; output 42,000; workforce 31; words 123.
- Contribution = $60.00 − $22.00 = **$38.00** ✔; Break-even = $342,000 ÷ $38 = **9,000 units** ✔; Margin of safety = 42,000 − 9,000 = **33,000 units** ✔; ATC = $342,000 ÷ 42,000 + $22 = 8.14 + 22 = **$30.14** ✔; productivity = 42,000 ÷ 31 ≈ **1,354.8 units/worker**
- Appendix 2 profitability: 2024 GP = 2,200 − 1,320 = **880 = GP 880** ✔; 2025 GP = 2,520 − 1,386 = **1,134 = GP 1,134** ✔. GPM 2024 = 880 ÷ 2,200 = **40.0%** ✔; GPM 2025 = 1,134 ÷ 2,520 = **45.0%** ✔. PM 2024 = 330 ÷ 2,200 = **15.0%** ✔; PM 2025 = 504 ÷ 2,520 = **20.0%** ✔. ROCE 2024 = 330 ÷ 3,300 = **10.0%** ✔; ROCE 2025 = 504 ÷ 3,600 = **14.0%** ✔

### P2_SET_215 — Halcyon Montessori Preschool (HMP) — profitability set
Stem: FC $155,000; VC $2.30; SP $8.50; output 96,000; workforce 22; words 120.
- Contribution = $8.50 − $2.30 = **$6.20** ✔; Break-even = $155,000 ÷ $6.20 = **25,000 units** ✔; Margin of safety = 96,000 − 25,000 = **71,000 units** ✔; ATC = $155,000 ÷ 96,000 + $2.30 = 1.61 + 2.30 = **$3.91** ✔; productivity = 96,000 ÷ 22 ≈ **4,363.6 units/worker**
- Appendix 2 profitability: 2024 GP = 700 − 420 = **280 = GP 280** ✔; 2025 GP = 816 − 408 = **408 = GP 408** ✔. GPM 2024 = 280 ÷ 700 = **40.0%** ✔; GPM 2025 = 408 ÷ 816 = **50.0%** ✔. PM 2024 = 105 ÷ 700 = **15.0%** ✔; PM 2025 = 204 ÷ 816 = **25.0%** ✔. ROCE 2024 = 105 ÷ 1,400 = **7.5%** ✔; ROCE 2025 = 204 ÷ 1,700 = **12.0%** ✔

**All recomputed values match the model answers within tolerance. No discrepancies.**

---

## 3. JSON structure & content checks (all 10 sets)

- Top-level keys exactly `scenario_id`, `unit`, `case_study_insert`, `questions`; `unit` = `Paper 2 Case Study` ✔ (10/10)
- Exactly 8 questions, numbers/order `1(a), 1(b), 2(a), 2(b), 3(a), 3(b), 4(a), 4(b)`; marks 8/12/8/12/8/12/8/12 (total 80) ✔
- `case_study_insert` keys exactly `main_stem`, `appendix_1_marketing_ops`, `appendix_2_financial_data`, `appendix_3_external_environment` ✔
- `appendix_2_financial_data`: keys exactly `title`, `headers`, `rows`; `headers` exactly `["Financial Metric", "2024", "2025"]`; exactly 6 rows; comma-formatted strings, `$` omitted; titles match canonical liquidity/profitability phrasings including `$ '000` ✔
- Liquidity sets (186–190) use the exact required labels: `Inventories`, `Trade receivables`, `Cash and cash equivalents`, `Current liabilities`, `Non-current assets`, `Capital employed` (verified from the rows of each set) ✔
- Profitability sets (211–215) use `Revenue`, `Cost of sales`, `Gross profit`, `Operating profit`, `Capital employed` plus a 6th free row — `Interest payable` in each — with **GP = Revenue − Cost of sales exact in both years** (verified: HVI 910 = 2,600 − 1,690 and 1,404 = 3,120 − 1,716; HCA 2,240 = 5,600 − 3,360 and 3,060 = 6,800 − 3,740; VRM 324 = 1,080 − 756 and 459 = 1,224 − 765; RPS 880 = 2,200 − 1,320 and 1,134 = 2,520 − 1,386; HMP 280 = 700 − 420 and 408 = 816 − 408) ✔
- 8-mark (a) parts: `mark_scheme` keys exactly `knowledge_max_2` and `application_analysis_max_6` ✔; (b) parts: exactly `level_1_1_to_4`, `level_2_5_to_8`, `level_3_9_to_12` ✔; 3(a): exactly `working_marks` ✔
- Every part (a) `question_text` contains the business initials (gatekeeper + eyeball) ✔; every (b) `question_text` uses the `Which ... ? Justify your ...` pattern ✔; every (b) model answer ends with an explicit recommendation/decision rejecting alternatives ✔
- 3(a)(i)/(ii) question texts contain the exact required phrases (e.g., 186: "Calculate KBC's contribution per unit." / "Calculate KBC's break-even output.") ✔
- 3(b) model answers contain the labelled summary lines in the exact required format (2 lines per year; e.g., HVI: `Gross Profit Margin 2024 = 35.0%`, `Gross Profit Margin 2025 = 45.0%`, `Profit Margin 2024 = 12.0%`, `Profit Margin 2025 = 20.0%`, `ROCE 2024 = 10.0%`, `ROCE 2025 = 15.0%` — all recompute-verified) ✔
- Appendix 1: ≥120 chars and ≥4 numeric metrics each — spot-verified across the 10 (186: 17,500, 3.1%, 16→9, 94.2%, 260, 71%, 49%, $850, …; analogous for the other nine) ✔
- Appendix 3: THREE external changes with exact figures each (e.g., 186: interest rate 5.00%→5.75%, minimum wage +5.8% to $12.27, uPVC/feldspar input costs +9.6%, industrial inflation 6.8%, grid transmission +3.8%) ✔
- Main stem: named business with initials, legal structure, sector, workforce of N, leadership/structure, capital cost, finance mix, fixed and variable costs, selling price, produces N units, operational problem — all present; stem word counts 120–128 (within 110–145) ✔
- `scenario_id` matches filename and matches `P2_SET_###` in range ✔
- Marking keys: 5–8 entries, all strings, verbatim values from the insert/computed; no invented values ✔

---

## 4. Deterministic grounding (VAW) sweep

VAW = every entry of `qwen_marking_keys.valid_app_words`, checked verbatim (case-insensitive substring).

**Hand check — first 3 questions of ALL 10 sets (1(a), 1(b), 2(a)):** every valid_app_word located case-insensitively in the combined insert (main_stem + appendices incl. title/headers/rows):

- 186 1(a): retained profit, bank loan, $450,000, $700,000, $1,150,000, $360,000 — all present ✔; 1(b): 10,000-hour, 71%, 49%, 260, $1,150,000, 94.2% ✔; 2(a): on-the-job training, 14 of 68, $850, 3.1%, 94.2%, $1,150,000 ✔
- 187 1(a): retained profit, share issue, $600,000, $1,000,000, $1,600,000, $528,000 ✔; 1(b): batch-tested, 68%, 55%, 320, $1,600,000, 96,000 ✔; 2(a): absenteeism, 8.4%, labour turnover, 95.1%, 2.2%, $1,600,000 ✔
- 188 1(a): hire purchase, overdraft, $480,000, $300,000, $780,000, $312,000 ✔; 1(b): 99%, 61%, same-day, 210, $780,000, 3.4% ✔; 2(a): flat structure, shared democratic decision-making, 3.4%, 4.1 days, workforce of 34, $780,000 ✔
- 189 1(a): share issue, bank loan, $320,000, $600,000, $920,000, $405,000 ✔; 1(b): 77%, 53%, 180, $920,000, $405,000, 22% ✔; 2(a): share issue, 5.6%, workforce of 52, $920,000, calendering, 36,000 ✔
- 190 1(a): delivery fleet, bank loan, $550,000, $800,000, $1,350,000, $315,000 ✔; 1(b): 69%, 45%, 280, $1,350,000, workforce of 81, wall-thickness ✔; 2(a): wall-thickness testing, wall-thickness, 2.8%, 4.2%, 2.6 days, 69% ✔
- 211 1(a): retained profit, bank loan, $320,000, $600,000, $306,000, laser ✔; 1(b): laser, $920,000, 59%, 44%, $25, Saturday clinics ✔; 2(a): democratic leadership, workforce of 38, 16%, 1.3%, $820, 78,000 ✔
- 212 1(a): share issue, bank loan, $250,000, $400,000, $715,000, $1,000 ✔; 1(b): data-analytics, 57%, 46%, $150, 87%, $650,000 ✔; 2(a): laissez-faire leadership, workforce of 26, 9 of 26 staff, 87%, $700, outdated course materials ✔
- 213 1(a): retained profit, hire purchase, $330,000, $450,000, $247,500, $12.75 ✔; 1(b): compostable packaging, 63%, 49%, 96,000, meal boxes, $780,000 ✔; 2(a): autocratic leadership, labour turnover, 19%, 7.4%, 2.2%, 1.8 days ✔
- 214 1(a): retained profit, bank loan, $240,000, $300,000, $540,000, $342,000 ✔; 1(b): hydrotherapy pool, 61%, 47%, $20, $540,000, 42,000 ✔; 2(a): democratic leadership, skills gap, 12 days, 1.1%, $950, 42,000 ✔
- 215 1(a): share issue, bank loan, $130,000, $250,000, $155,000, nature garden ✔; 1(b): nature garden, 58%, 45%, $1.20, 6 weeks, $380,000 ✔; 2(a): laissez-faire leadership, 21%, 96%, workforce of 22, waiting lists, $650 ✔

**Hand-check statement:** I hand-verified the first 3 questions of each of the 10 sets (30/30 question-level hand checks, all pass), as required.

**Independent scripted re-check (all 8 questions × 10 sets):** every `valid_app_words` entry found (case-insensitive substring; haystack = combined insert for 1(a), 1(b), 2(a), 2(b), 4(a), 4(b); insert + model_answer + sub_parts for 3(a)/3(b)). **5–8 entries per question, all strings; TOTAL MISSES: 0.** Zero misses across all questions.

---

## 5. Uniqueness (wave_01…wave_03, waves/, exemplar)

**Sibling folders/files checked:**
- `C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_01\` — 40 sets (P2_SET_101–140)
- `C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_02\` — 40 sets present at audit time (P2_SET_141–180)
- `C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_03\` — 40 sets (P2_SET_181–220; audited 186–190, 211–215)
- `C:\Users\jayde\Documents\GitHub\fresh\paper2\waves\` — empty (0 files)
- `C:\Users\jayde\Documents\GitHub\fresh\paper2\prompts\example_set.json` — exemplar (P2_SET_101 Lakestone Fresh Foods / LFF)
- No per-generator folders exist; all generators write directly into `sets\wave_XX\`.
- `paper2\audits\wave_04\` and `paper2\audits\wave_05\` do not exist yet — no wave_04/05 set directories exist; only wave_01, wave_02, wave_03 exist under `paper2/sets/`.

**Business-identity uniqueness (business name, initials, scenario_id): ALL 10 sets UNIQUE.** No shared business names, no shared initials, no shared scenario_ids across wave_01 + wave_02 + wave_03 + waves/ + exemplar. Initials of my 10 sets: KBC, RMA, CSF, THB, DMP, HVI, HCA, VRM, RPS, HMP — none reused anywhere (the gatekeeper's global scan passed 40/40). Business names: Kingsbarrow Ceramics, Redmoor Abrasives, Clearspire Filtration, Thorncombe Belting, Dunmore Plastics, Harborne Vision Institute, Hexfield Code Academy, Vital Roots Meal Prep, Rowan Physio & Sports Clinic, Halcyon Montessori Preschool — none reused.

**Founder-name reuse observation (not a business-identity duplicate; flagged for the wave lead, not scored as a TECH-AUD failure):**
- `Priya Raman` — P2_SET_186 (Kingsbarrow Ceramics), also P2_SET_127 (wave_01), P2_SET_157, P2_SET_167 (wave_02). (The wave_01 TECH-AUD-14 report flagged the endemic reuse of founder/leader first names — Daniel Okafor, Priya Raman, Rosa Jiménez, Marcus Whitfield pools — as a generator-quality issue.)
- Other founders in this wave (Marek Nowak / RMA, Thandi Mokoena / THB, Daniel Soriano / DMP, Sofia Marin / VRM, Dr Natalie Rowan / RPS, Clara Whitmore / HMP, Rhea Calloway / HCA, Dr Lena Harborne / HVI, Sofia Almeida & Rafael Duarte / CSF) are not currently reused anywhere else — noted for the wave lead's founder-name-originality review.

---

## 6. Verdict table

| Set | Scenario ID | Type | Gatekeeper (correct-semantics) | Recalc | JSON structure | Appendix completeness | Grounding | Uniqueness | Verdict |
|-----|-------------|------|--------------------------------|--------|----------------|----------------------|-----------|---------|---------|
| 186 | P2_SET_186 | liquidity | PASS | ✔ exact | ✔ | ✔ | ✔ | unique | **APPROVED_BY_TECH_AUD** |
| 187 | P2_SET_187 | liquidity | PASS | ✔ exact | ✔ | ✔ | ✔ | unique | **APPROVED_BY_TECH_AUD** |
| 188 | P2_SET_188 | liquidity | PASS | ✔ exact | ✔ | ✔ | ✔ | unique | **APPROVED_BY_TECH_AUD** |
| 189 | P2_SET_189 | liquidity | PASS | ✔ exact | ✔ | ✔ | ✔ | unique | **APPROVED_BY_TECH_AUD** |
| 190 | P2_SET_190 | liquidity | PASS | ✔ exact | ✔ | ✔ | ✔ | unique | **APPROVED_BY_TECH_AUD** |
| 211 | P2_SET_211 | profitability | PASS | ✔ exact | ✔ | ✔ | ✔ | unique | **APPROVED_BY_TECH_AUD** |
| 212 | P2_SET_212 | profitability | PASS | ✔ exact | ✔ | ✔ | ✔ | unique | **APPROVED_BY_TECH_AUD** |
| 213 | P2_SET_213 | profitability | PASS | ✔ exact | ✔ | ✔ | ✔ | unique | **APPROVED_BY_TECH_AUD** |
| 214 | P2_SET_214 | profitability | PASS | ✔ exact | ✔ | ✔ | ✔ | unique | **APPROVED_BY_TECH_AUD** |
| 215 | P2_SET_215 | profitability | PASS | ✔ exact | ✔ | ✔ | ✔ | unique | **APPROVED_BY_TECH_AUD** |

**Notes**
1. The brief-prescribed temp-staging gatekeeper invocation reports self-match artifacts only (§1a); the correct-semantics run (§1b) passes all 10 (and the rest of wave_03); no set was modified by this audit.
2. Founder-name reuse across the wave is reported in §5 for the wave lead; not a TECH-AUD failure ground.
3. All recomputed values matched the model answers within tolerance (§2); zero discrepancies — including the 3(a)(i)/(ii) recalculated values, the 3(b) ratio lines and the GP = Rev − CoS exactness checks.
4. Model answers sit within the exemplar benchmark ranges for length (no pathological filler); minor prose observations (e.g., non-decisional prose in some answers) were not made, as all required decision/recommendation patterns are present.
