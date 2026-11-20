# TECH-AUD-13 - Tier 2B Schema/Math/Grounding Audit - Wave 02
**Auditor:** TECH-AUD-13 (Tier 2B schema/math/grounding)
**Date:** 2026-11-20
**Sets audited:** P2_SET_141, P2_SET_142, P2_SET_143, P2_SET_144, P2_SET_145 (GEN-13 batch 1); P2_SET_176, P2_SET_177, P2_SET_178, P2_SET_179, P2_SET_180 (GEN-13 batch 2)
**Live files audited** (sets/wave_02/*.json, read-only): identical to the staged copies (SHA-256 verified, all 10 sets hash-equal). No live file was modified.
**Staged copies:** `C:\Users\jayde\AppData\Local\Temp\opencode\w02t13\` (created 2026-11-20; all JSON parses)

---

## 0. File existence & JSON parse (python json.load)

| File | Exists | Parses | Top-level keys | scenario_id | unit | Stem words |
|---|---|---|---|---|---|---|
| P2_SET_141.json | OK | OK | ['scenario_id','unit','case_study_insert','questions'] | P2_SET_141 | Paper 2 Case Study | 142 |
| P2_SET_142.json | OK | OK | same | P2_SET_142 | Paper 2 Case Study | 123 |
| P2_SET_143.json | OK | OK | same | P2_SET_143 | Paper 2 Case Study | 120 |
| P2_SET_144.json | OK | OK | same | P2_SET_144 | Paper 2 Case Study | 125 |
| P2_SET_145.json | OK | OK | same | P2_SET_145 | Paper 2 Case Study | 137 |
| P2_SET_176.json | OK | OK | same | P2_SET_176 | Paper 2 Case Study | 120 |
| P2_SET_177.json | OK | OK | same | P2_SET_177 | Paper 2 Case Study | 125 |
| P2_SET_178.json | OK | OK | same | P2_SET_178 | Paper 2 Case Study | 121 |
| P2_SET_179.json | OK | OK | same | P2_SET_179 | Paper 2 Case Study | 119 |
| P2_SET_180.json | OK | OK | same | P2_SET_180 | Paper 2 Case Study | 120 |

Sets 141-145 are **liquidity** sets (Statement of Financial Position format, 6 rows Inventories/Trade receivables/Cash and cash equivalents/Current liabilities/Non-current assets/Capital employed); sets 176-180 are **profitability** sets (Statement of Profit or Loss format, 6 rows Revenue/Cost of sales/Gross profit/Operating profit/Capital employed/Interest payable). All main_stem word counts are within the 110-145 band; appendix completeness checks (brief 4) pass for all 10 (appendix_1 >=13 numeric metrics, appendix_2 exact headers and 6 rows, appendix_3 >=3 percentage figures).

---

## 1. Gatekeeper

### 1a. Staged-copy run - VERBATIM

Command: `& "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe" C:\Users\jayde\Documents\GitHub\fresh\paper2\scripts\gatekeeper.py --sets-dir C:\Users\jayde\AppData\Local\Temp\opencode\w02t13` (exit code 1)

```
==============================================================================
GATEKEEPER REPORT  |  checked 10 set(s)
==============================================================================
[FAIL] P2_SET_141  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t13\P2_SET_141.json)
    ERROR: business initials 'WVC' already used by set P2_SET_141
    ERROR: scenario_id 'P2_SET_141' already used in P2_SET_141.json
[FAIL] P2_SET_142  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t13\P2_SET_142.json)
    ERROR: business initials 'RSFJ' already used by set P2_SET_142
    ERROR: scenario_id 'P2_SET_142' already used in P2_SET_142.json
[FAIL] P2_SET_143  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t13\P2_SET_143.json)
    ERROR: business initials 'CKB' already used by set P2_SET_143
    ERROR: scenario_id 'P2_SET_143' already used in P2_SET_143.json
[FAIL] P2_SET_144  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t13\P2_SET_144.json)
    ERROR: business initials 'ICR' already used by set P2_SET_144
    ERROR: scenario_id 'P2_SET_144' already used in P2_SET_144.json
[FAIL] P2_SET_145  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t13\P2_SET_145.json)
    ERROR: business initials 'TTC' already used by set P2_SET_145
    ERROR: scenario_id 'P2_SET_145' already used in P2_SET_145.json
[FAIL] P2_SET_176  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t13\P2_SET_176.json)
    ERROR: business initials 'GSQ' already used by set P2_SET_176
    ERROR: scenario_id 'P2_SET_176' already used in P2_SET_176.json
[FAIL] P2_SET_177  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t13\P2_SET_177.json)
    ERROR: business initials 'CLW' already used by set P2_SET_177
    ERROR: scenario_id 'P2_SET_177' already used in P2_SET_177.json
[FAIL] P2_SET_178  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t13\P2_SET_178.json)
    ERROR: business initials 'MCFC' already used by set P2_SET_178
    ERROR: scenario_id 'P2_SET_178' already used in P2_SET_178.json
[FAIL] P2_SET_179  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t13\P2_SET_179.json)
    ERROR: business initials 'VSS' already used by set P2_SET_179
    ERROR: scenario_id 'P2_SET_179' already used in P2_SET_179.json
[FAIL] P2_SET_180  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t13\P2_SET_180.json)
    ERROR: business initials 'BFS' already used by set P2_SET_180
    ERROR: scenario_id 'P2_SET_180' already used in P2_SET_180.json
==============================================================================
Sets passed: 0/10   |   failed: 10
```

**Interpretation of the staged FAIL (artifact, not a set defect).** The gatekeeper seeds its duplicate-detection tables from `paper2/sets/**/*.json` and `paper2/waves/*.json`; the briefed staging copies in `C:\Users\jayde\AppData\Local\Temp\opencode\w02t13\` live outside `paper2/sets`, so the exclusion never fires and the staged copies "collide" only with the live repo copies of the very same files (proof: staged vs live SHA-256 identical; every error names the same scenario_id as the checked file). All other gatekeeper checks (structure, marks, math, valid_app_words, appendix consistency) ran on the staged copies and reported **zero** additional errors - the 20 errors above are the only output. Per the stack precedent (wave_01 TECH-AUD-13), each of these is the staging artifact; there are **no real set defects found by the gatekeeper**.

---

## 2. Independent recalculation from stems (per set, tolerance 0.51 or 0.06 as noted)

Computed independently from `main_stem` via script `C:\Users\jayde\AppData\Local\Temp\opencode\w02t13\audit_math.py` (written for this audit; not the gatekeeper).

### P2_SET_141 - Wexford Vale Creamery Cooperative (WVC), liquidity
- Stem parse: FC=225,000; VC=9.50; SP=14.00; output=64,000; workers=38; stem=142 words (in band)
- Contribution per unit = 14.00 - 9.50 = **$4.50**
- Break-even output = 225,000 / 4.50 = **50,000 units** (3(a)(i) model: "break-even output is 50,000 units a year" - OK)
- Margin of safety = 64,000 - 50,000 = **14,000 units** (3(a)(iii) mentions "margin of safety of 14,000 units" - OK)
- Average total cost = 225,000 / 64,000 + 9.50 = 3.5156 + 9.50 = **$13.0156** (~ $13.02, model states $13.02 - OK)
- Labour productivity = 64,000 / 38 = **1,684.21 units**

### P2_SET_142 - Rio Sol Fruit Juices (RSFJ), liquidity
- Stem parse: FC=510,000; VC=4.10; SP=7.50; output=210,000; workers=240; stem=123 words
- Contribution per unit = 7.50 - 4.10 = **$3.40** (model: $3.40 - OK)
- Break-even output = 510,000 / 3.40 = **150,000 units** (model: 150,000 - OK)
- Margin of safety = 210,000 - 150,000 = **60,000 units** (model: 60,000 - OK)
- Average total cost = 510,000 / 210,000 + 4.10 = 2.4286 + 4.10 = **$6.5286** (~ $6.53, model $6.53 - OK)
- Labour productivity = 210,000 / 240 = **875.00 units**

### P2_SET_143 - Copper Kettle Bakery (CKB), liquidity
- Stem parse: FC=90,000; VC=4.75; SP=8.50; output=34,000; workers=12; stem=120 words
- Contribution per unit = 8.50 - 4.75 = **$3.75** (model: $3.75 - OK)
- Break-even output = 90,000 / 3.75 = **24,000 units** (model: 24,000 - OK)
- Margin of safety = 34,000 - 24,000 = **10,000 units** (model: 10,000 - OK)
- Average total cost = 90,000 / 34,000 + 4.75 = 2.6471 + 4.75 = **$7.3971** (~ $7.40, model $7.40 - OK)
- Labour productivity = 34,000 / 12 = **2,833.33 units**

### P2_SET_144 - Ironhill Coffee Roasters (ICR), liquidity
- Stem parse: FC=141,000; VC=11.80; SP=16.50; output=40,000; workers=16; stem=125 words
- Contribution per unit = 16.50 - 11.80 = **$4.70** (model: $4.70 - OK)
- Break-even output = 141,000 / 4.70 = **30,000 units** (model: 30,000 - OK)
- Margin of safety = 40,000 - 30,000 = **10,000 units** (model: 10,000 - OK)
- Average total cost = 141,000 / 40,000 + 11.80 = 3.5250 + 11.80 = **$15.325** (~ $15.33, model $15.33 - OK)
- Labour productivity = 40,000 / 16 = **2,500.00 units**

### P2_SET_145 - Tidewater Trout Company (TTC), liquidity
- Stem parse: FC=352,000; VC=8.60; SP=13.00; output=105,000; workers=52; stem=137 words
- Contribution per unit = 13.00 - 8.60 = **$4.40** (model: $4.40 - OK)
- Break-even output = 352,000 / 4.40 = **80,000 units** (model: 80,000 - OK)
- Margin of safety = 105,000 - 80,000 = **25,000 units** (model: 25,000 - OK)
- Average total cost = 352,000 / 105,000 + 8.60 = 3.3524 + 8.60 = **$11.9524** (~ $11.95, model $11.95 - OK)
- Labour productivity = 105,000 / 52 = **2,019.23 units**

### P2_SET_176 - Greywater Slate Quarry (GSQ), profitability
- Stem parse: FC=225,000; VC=5.10; SP=9.60; output=75,000; workers=46; stem=120 words
- Contribution per unit = 9.60 - 5.10 = **$4.50** (model: $4.50 - OK)
- Break-even output = 225,000 / 4.50 = **50,000 units** (model: 50,000 - OK)
- Margin of safety = 75,000 - 50,000 = **25,000 units** (model: 25,000 - OK)
- Average total cost = 225,000 / 75,000 + 5.10 = 3.00 + 5.10 = **$8.10** (model: $8.10 - OK)
- Labour productivity = 75,000 / 46 = **1,630.43 units**

### P2_SET_177 - Caldbeck Lime Works (CLW), profitability
- Stem parse: FC=168,000; VC=8.40; SP=14.40; output=40,000; workers=33; stem=125 words
- Contribution per unit = 14.40 - 8.40 = **$6.00** (model: $6.00 - OK)
- Break-even output = 168,000 / 6.00 = **28,000 units** (model: 28,000 - OK)
- Margin of safety = 40,000 - 28,000 = **12,000 units** (model: 12,000 - OK)
- Average total cost = 168,000 / 40,000 + 8.40 = 4.20 + 8.40 = **$12.60** (model: $12.60 - OK)
- Labour productivity = 40,000 / 33 = **1,212.12 units**

### P2_SET_178 - Montagu Cork Flooring Co-operative (MCFC), profitability
- Stem parse: FC=180,000; VC=9.00; SP=15.00; output=45,000; workers=29; stem=121 words
- Contribution per unit = 15.00 - 9.00 = **$6.00** (model: $6.00 - OK)
- Break-even output = 180,000 / 6.00 = **30,000 units** (model: 30,000 - OK)
- Margin of safety = 45,000 - 30,000 = **15,000 units** (model: 15,000 - OK)
- Average total cost = 180,000 / 45,000 + 9.00 = 4.00 + 9.00 = **$13.00** (model: $13.00 - OK)
- Labour productivity = 45,000 / 29 = **1,551.72 units**

### P2_SET_179 - Vulcan Structural Steel (VSS), profitability
- Stem parse: FC=840,000; VC=28.50; SP=38.50; output=120,000; workers=120; stem=119 words
- Contribution per unit = 38.50 - 28.50 = **$10.00** (model: $10.00 - OK)
- Break-even output = 840,000 / 10.00 = **84,000 units** (model: 84,000 - OK)
- Margin of safety = 120,000 - 84,000 = **36,000 units** (model: 36,000 - OK)
- Average total cost = 840,000 / 120,000 + 28.50 = 7.00 + 28.50 = **$35.50** (model: $35.50 - OK)
- Labour productivity = 120,000 / 120 = **1,000.00 units**

### P2_SET_180 - Bower Formwork Systems (BFS), profitability
- Stem parse: FC=160,000; VC=10.50; SP=15.50; output=40,000; workers=21; stem=120 words
- Contribution per unit = 15.50 - 10.50 = **$5.00** (model: $5.00 - OK)
- Break-even output = 160,000 / 5.00 = **32,000 units** (model: 32,000 - OK)
- Margin of safety = 40,000 - 32,000 = **8,000 units** (model: 8,000 - OK)
- Average total cost = 160,000 / 40,000 + 10.50 = 4.00 + 10.50 = **$14.50** (model: $14.50 - OK)
- Labour productivity = 40,000 / 21 = **1,904.76 units**

**3(a)(i)/(ii) cross-check:** every 3(a) sub-part model_answer (Formula/Substitution/Answer) restates the same break-even/contribution figures computed above - all match (141: 50,000 & $4.50; 142: 150,000 & $3.40; 143: 24,000 & $3.75; 144: 30,000 & $4.70; 145: 80,000 & $4.40; 176: 50,000 & $4.50; 177: 28,000 & $6.00; 178: 30,000 & $6.00; 179: 84,000 & $10.00; 180: 32,000 & $5.00). **No discrepancy > tolerance.**

---

## 3. Appendix 2 & profitability math (per set)

### Liquidity sets (141-145) - ratio derivations

| Set | CA2024 = Inv + TradeReceiv + Cash | CA2025 | CR = CA/CL2024 / 2025 | Acid test = (CA - Inv)/CL | Model statements (3(b)) - diff <= 0.06? |
|---|---|---|---|---|---|
| 141 WVC | 160+130+35 = **$325,000** | 145+155+50 = **$350,000** | 325/250 = **1.30**; 350/225 = **1.5556** | (325-160)/250 = **0.66**; (350-145)/225 = **0.9111** | Model: 1.30 / 1.56 / 0.66 / 0.91 - diffs <= 0.005 OK |
| 142 RSFJ | 420+520+90 = **$1,030,000** | 380+610+150 = **$1,140,000** | 1,030/700 = **1.4714**; 1,140/760 = **1.5000** | (1,030-420)/700 = **0.8714**; (1,140-380)/760 = **1.0000** | Model: 1.47 / 1.50 / 0.87 / 1.00 - OK |
| 143 CKB | 28+35+8 = **$71,000** | 22+48+15 = **$85,000** | 71/55 = **1.2909**; 85/62 = **1.3710** | (71-28)/55 = **0.7818**; (85-22)/62 = **1.0161** | Model: 1.29 / 1.37 / 0.78 / 1.02 - OK |
| 144 ICR | 65+42+18 = **$125,000** | 58+55+30 = **$143,000** | 125/98 = **1.2755**; 143/104 = **1.3750** | (125-65)/98 = **0.6122**; (143-58)/104 = **0.8173** | Model: 1.28 / 1.38 / 0.61 / 0.82 - diffs <= 0.005 OK |
| 145 TTC | 200+260+75 = **$535,000** | 185+310+95 = **$590,000** | 535/400 = **1.3375**; 590/430 = **1.3721** | (535-200)/400 = **0.8375**; (590-185)/430 = **0.9419** | Model: 1.34 / 1.37 / 0.84 / 0.94 - diffs <= 0.005 OK |

All liquidity model statements match within tolerance; no discrepancy > 0.06.

### Profitability sets (176-180) - ratios & GP = Rev - CoS consistency

| Set | GPM = GP/Rev x100 | PM = OpProfit/Rev x100 | ROCE = OpProfit/Capital employed x100 | GP = Rev - CoS (2024, 2025)? |
|---|---|---|---|---|
| 176 GSQ | 2,040/5,100 = **40.00%**; 2,565/5,700 = **45.00%** | 765/5,100 = **15.00%**; 1,026/5,700 = **18.00%** | 765/4,250 = **18.00%**; 1,026/5,130 = **20.00%** | 2,040 = 5,100-3,060 OK; 2,565 = 5,700-3,135 OK |
| 177 CLW | 1,386/3,850 = **36.00%**; 1,760/4,400 = **40.00%** | 308/3,850 = **8.00%**; 528/4,400 = **12.00%** | 308/2,800 = **11.00%**; 528/3,520 = **15.00%** | 1,386 = 3,850-2,464 OK; 1,760 = 4,400-2,640 OK |
| 178 MCFC | 935/2,750 = **34.00%**; 1,134/3,150 = **36.00%** | 275/2,750 = **10.00%**; 378/3,150 = **12.00%** | 275/2,200 = **12.50%**; 378/2,520 = **15.00%** | 935 = 2,750-1,815 OK; 1,134 = 3,150-2,016 OK |
| 179 VSS | 4,030/12,400 = **32.50%**; 4,760/13,600 = **35.00%** | 868/12,400 = **7.00%**; 1,020/13,600 = **7.50%** | 868/6,200 = **14.00%**; 1,020/6,800 = **15.00%** | 4,030 = 12,400-8,370 OK; 4,760 = 13,600-8,840 OK |
| 180 BFS | 714/1,700 = **42.00%**; 855/1,900 = **45.00%** | 170/1,700 = **10.00%**; 228/1,900 = **12.00%** | 170/1,700 = **10.00%**; 228/1,900 = **12.00%** | 714 = 1,700-986 OK; 855 = 1,900-1,045 OK |

All profitability model statements (3(b) lines and workings) match computed values within tolerance; GP = Rev - CoS exact in both years for all 5 profitability sets (appendix_2 internal consistency, brief 4). **No discrepancy > tolerance.**

---

## 4. Deterministic grounding sweep (valid_app_words)

Method: for every question, every entry of `qwen_marking_keys.valid_app_words` (5-8 entries per question) must appear case-insensitively as a substring of the combined insert (main_stem + appendix_1 + appendix_2 json + appendix_3). For 3(a)/3(b) the haystack additionally includes the question's model_answer and sub_parts (as the gatekeeper does).

Hand check for the first 3 questions of each set (1(a), 1(b), 2(a)): performed by reading each set's insert and appendix texts and matching the listed words against them - all present. Example for 141: 1(a) words "member capital contributions" (main_stem), "bank loan" (main_stem), "$300,000", "$720,000", "cooperative" (main_stem), "$140,000" (main_stem); 1(b) words "locally produced cheese" (appendix_1 survey), "eco-packaging" (appendix_1), "$0.60", "58%", "47%" (appendix_1 survey), "supermarket" (main_stem), "$720,000" (main_stem); 2(a) words "64 member farms", "workforce of 38", "flat organisational structure", " democratic leadership", "absenteeism" (main_stem), "$750" (appendix_1).

Full machine sweep for all 8 questions per set (script `audit_math.py` output - every question ALL PRESENT):

| Set | 1(a) | 1(b) | 2(a) | 2(b) | 3(a) | 3(b) | 4(a) | 4(b) |
|---|---|---|---|---|---|---|---|---|
| 141 | 6/6 | 7/7 | 6/6 | 6/6 | 7/7 | 7/7 | 6/6 | 7/7 |
| 142 | 6/6 | 7/7 | 6/6 | 6/6 | 7/7 | 7/7 | 7/7 | 7/7 |
| 143 | 6/6 | 7/7 | 6/6 | 6/6 | 7/7 | 7/7 | 6/6 | 7/7 |
| 144 | 6/6 | 7/7 | 6/6 | 6/6 | 7/7 | 7/7 | 6/6 | 7/7 |
| 145 | 6/6 | 7/7 | 6/6 | 6/6 | 7/7 | 7/7 | 6/6 | 7/7 |
| 176 | 7/7 | 7/7 | 6/6 | 6/6 | 7/7 | 7/7 | 7/7 | 6/6 |
| 177 | 7/7 | 7/7 | 6/6 | 6/6 | 7/7 | 7/7 | 6/6 | 6/6 |
| 178 | 7/7 | 7/7 | 6/6 | 6/6 | 7/7 | 7/7 | 7/7 | 6/6 |
| 179 | 7/7 | 7/7 | 6/6 | 6/6 | 7/7 | 7/7 | 6/6 | 7/7 |
| 180 | 7/7 | 7/7 | 6/6 | 6/6 | 7/7 | 7/7 | 6/6 | 6/6 |

(Entry counts vary 5-8 per question; all present.) **0 missing anywhere.**

---

## 5. Uniqueness

Script `audit_uniq.py` collected business initials and scenario_ids from all set files under `paper2/sets/wave_01`, `wave_02`, `wave_03` plus `paper2/waves/*.json` (sibling folders checked: wave_01, wave_02, wave_03; waves/ - empty). Results:

| Set | Initials | Business (name) | Occurrences of these initials in wave_01..03 + waves/ |
|---|---|---|---|
| 141 | WVC | Wexford Vale Creamery Cooperative | 1 (its own live file) |
| 142 | RSFJ | Rio Sol Fruit Juices | 1 (own) |
| 143 | CKB | Copper Kettle Bakery | 1 (own) |
| 144 | ICR | Ironhill Coffee Roasters | 1 (own) |
| 145 | TTC | Tidewater Trout Company | 1 (own) |
| 176 | GSQ | Greywater Slate Quarry | 1 (own) |
| 177 | CLW | Caldbeck Lime Works | 1 (own) |
| 178 | MCFC | Montagu Cork Flooring Co-operative | 1 (own) |
| 179 | VSS | Vulcan Structural Steel | 1 (own) |
| 180 | BFS | Bower Formwork Systems | 1 (own) |

No duplicate initials anywhere (no duplicates printed); no scenario_id duplicates for 141-180 outside their own live files (gatekeeper run shows only the self-collisions described in 1a). Uniqueness: **OK**.

---

## 6. Verdict table

| Set | Gatekeeper (real defects) | Independent recalc | Grounding | Unique | Verdict |
|---|---|---|---|---|---|
| P2_SET_141 | PASS (artifact FAIL only) | OK (all values match) | OK | OK | APPROVED_BY_TECH_AUD |
| P2_SET_142 | PASS (artifact FAIL only) | OK | OK | OK | APPROVED_BY_TECH_AUD |
| P2_SET_143 | PASS (artifact FAIL only) | OK | OK | OK | APPROVED_BY_TECH_AUD |
| P2_SET_144 | PASS (artifact FAIL only) | OK | OK | OK | APPROVED_BY_TECH_AUD |
| P2_SET_145 | PASS (artifact FAIL only) | OK | OK | OK | APPROVED_BY_TECH_AUD |
| P2_SET_176 | PASS (artifact FAIL only) | OK | OK | OK | APPROVED_BY_TECH_AUD |
| P2_SET_177 | PASS (artifact FAIL only) | OK | OK | OK | APPROVED_BY_TECH_AUD |
| P2_SET_178 | PASS (artifact FAIL only) | OK | OK | OK | APPROVED_BY_TECH_AUD |
| P2_SET_179 | PASS (artifact FAIL only) | OK | OK | OK | APPROVED_BY_TECH_AUD |
| P2_SET_180 | PASS (artifact FAIL only) | OK | OK | OK | APPROVED_BY_TECH_AUD |

Per brief rules: gatekeeper FAILs are artifact-only (no real defects); independent recalculation matches model answers within tolerance; every valid_app_word is present (machine sweep + hand spot-check of first three questions per set); no uniqueness conflicts. **None of the sets fails any check; none is rejected.**

Helper scripts used: `C:\Users\jayde\AppData\Local\Temp\opencode\w02t13\audit_math.py`, `audit_uniq.py`, `math_out.txt`, `gk_out.txt`.
