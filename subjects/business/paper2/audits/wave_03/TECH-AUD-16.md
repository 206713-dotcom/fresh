# TECH-AUDITOR 16 — WAVE 03 — TECHNICAL AUDIT REPORT

- Auditor: **TECH-AUD-16**
- Wave: **wave_03**
- Sets audited: **P2_SET_196 … P2_SET_205** (`paper2/sets/wave_03/`)
- Staging: the 10 sets staged as copies in `C:\Users\jayde\AppData\Local\Temp\opencode\w03t16`; gatekeeper run on the staged copies.
- Date: Fri 20 Nov 2026

---

## 1. GATEKEEPER (verbatim)

Note on the staging procedure: the naive `gatekeeper.py --sets-dir <staging>` run flags every staged copy as `business initials 'X' already used by set P2_SET_19x` — an artifact of the procedure (the gatekeeper's pre-scan registers the real originals in `paper2/sets/wave_03`; the `--sets-dir` skip only applies to files under the staging dir). The artifact-free run on the 10 audited sets (pre-scans excluding the audited originals, then `check_set` per staged copy) is:

```
==============================================================================
GATEKEEPER on staged copies (artifact-free: audited originals excluded from pre-scan)
==============================================================================
[PASS] P2_SET_196 (P2_SET_196.json)
[PASS] P2_SET_197 (P2_SET_197.json)
[PASS] P2_SET_198 (P2_SET_198.json)
[PASS] P2_SET_199 (P2_SET_199.json)
[PASS] P2_SET_200 (P2_SET_200.json)
[PASS] P2_SET_201 (P2_SET_201.json)
[PASS] P2_SET_202 (P2_SET_202.json)
[PASS] P2_SET_203 (P2_SET_203.json)
[PASS] P2_SET_204 (P2_SET_204.json)
[PASS] P2_SET_205 (P2_SET_205.json)
==============================================================================
Sets passed: 10/10   |   failed: 0
```

No ERROR or warn lines per set. All 10 sets are gatekeeper PASS (structure, marks, 3(a) sub-parts (i)2 (ii)2 (iii)4, 3(a) recalc of break-even/contribution in model answers, 3(b) ratio restatement, valid_app_words presence, question plan).

---

## 2. UNIQUENESS (brief item 14)

Checked sibling folders: `paper2/sets/wave_01`, `paper2/sets/wave_02`, `paper2/sets/wave_03` (other sets in wave_03: P2_SET_181–P2_SET_195, P2_SET_206–P2_SET_220), and `paper2/waves/` (empty — no wave JSON outputs yet).

| Set | Business initials | Duplicate in other sets/waves? |
|---|---|---|
| P2_SET_196 | VSC | none |
| P2_SET_197 | SWS | none |
| P2_SET_198 | HRI | none |
| P2_SET_199 | CSSR | none |
| P2_SET_200 | MMG | none |
| P2_SET_201 | BAS | none |
| P2_SET_202 | RBH | none |
| P2_SET_203 | CGH | none |
| P2_SET_204 | BEC | none |
| P2_SET_205 | SHF | none |

---

## 3. INDEPENDENT RECALCULATION (brief item 10 — arithmetic from the insert, by hand)

### 3.1 P2_SET_196 — Valbruna Ski Chalets (VSC)

- Stem: FC = $222,000 a year; VC = $48/unit; SP = $85; produces 12,000 units; workforce 40.
- Contribution/unit = $85 − $48 = **$37.00**
- Break-even = $222,000 ÷ ($85 − $48) = $222,000 ÷ $37 = **6,000 units**
- Margin of safety = 12,000 − 6,000 = **6,000 units**
- ATC = $222,000 ÷ 12,000 + $48 = 18.50 + 48 = **$66.50/unit** (unit cost $66.50)
- Labour productivity = 12,000 ÷ 40 = **300 units/worker**
- 3(a) model answers restate: break-even 6,000 ✓; contribution $37.00 ✓; margin of safety 6,000 ✓; ATC $66.50 ✓ (labour productivity not restated — informational)
- Appendix 2 (liquidity set): CA 2024 = 90 + 55 + 35 = $180 → CR = 180/125 = **1.44**; AT = (180 − 90)/125 = **0.72**. CA 2025 = 65 + 75 + 55 = $195 → CR = 195/125 = **1.56**; AT = (195 − 65)/125 = **1.04**. 3(b) model answers restate CR/AT 2024/2025: OK.

### 3.2 P2_SET_197 — Southswell Surf School (SWS)

- Stem: FC = $52,000; VC = $9/unit; SP = $22; produces 9,600 units; workforce 24.
- Contribution/unit = $22 − $9 = **$13.00**
- Break-even = $52,000 ÷ $13 = **4,000 units**
- Margin of safety = 9,600 − 4,000 = **5,600 units**
- ATC = $52,000 ÷ 9,600 + $9 = 5.4167 + 9 = **$14.4167/unit**
- Labour productivity = 9,600 ÷ 24 = **400 units/worker**
- 3(a) restates: break-even 4,000 ✓; contribution $13.00 ✓; margin 5,600 ✓; ATC $14.4167 ✓ (labour productivity not restated)
- Appendix 2 (liquidity): CA 2024 = 30 + 25 + 20 = $75 → CR = 75/60 = **1.25**; AT = (75 − 30)/60 = **0.75**. CA 2025 = 22 + 38 + 30 = $90 → CR = 90/60 = **1.50**; AT = (90 − 22)/60 = **1.1333** (model says 1.13, within 0.06). 3(b) restate: OK.

### 3.3 P2_SET_198 — Harrowgate Riverside Inns (HRI)

- Stem: FC = $1,140,000; VC = $38/unit; SP = $95; produces 26,000 units; workforce 230.
- Contribution/unit = $95 − $38 = **$57.00**
- Break-even = $1,140,000 ÷ $57 = **20,000 units**
- Margin of safety = 26,000 − 20,000 = **6,000 units**
- ATC = $1,140,000 ÷ 26,000 + $38 = 43.8462 + 38 = **$81.8462/unit**
- Labour productivity = 26,000 ÷ 230 = **113.0435 units/worker**
- 3(a) restates: 20,000 ✓; $57.00 ✓; 6,000 ✓; $81.8462 ✓ (labour productivity not restated)
- Appendix 2 (liquidity): CA 2024 = 210 + 320 + 110 = $640 → CR = 640/400 = **1.60**; AT = (640 − 210)/400 = **1.08**. CA 2025 = 235 + 345 + 150 = $730 → CR = 730/425 = **1.7176** (model says 1.72, within 0.06); AT = (730 − 235)/425 = **1.1647** (model says 1.16). 3(b) restate: OK.

### 3.4 P2_SET_199 — Caldera Springs Spa Resort (CSSR)

- Stem: FC = $360,000; VC = $28/unit; SP = $52; produces 21,000 units; workforce 65.
- Contribution/unit = $52 − $28 = **$24.00**
- Break-even = $360,000 ÷ $24 = **15,000 units**
- Margin of safety = 21,000 − 15,000 = **6,000 units**
- ATC = $360,000 ÷ 21,000 + $28 = 17.1429 + 28 = **$45.1429/unit**
- Labour productivity = 21,000 ÷ 65 = **323.0769 units/worker**
- 3(a) restates: 15,000 ✓; $24.00 ✓; 6,000 ✓; $45.1429 ✓ (labour productivity not restated)
- Appendix 2 (liquidity): CA 2024 = 105 + 90 + 55 = $250 → CR = 250/160 = **1.5625** (model says 1.56); AT = (250 − 105)/160 = **0.9062** (model says 0.91). CA 2025 = 80 + 120 + 70 = $270 → CR = 270/160 = **1.6875** (model says 1.69); AT = (270 − 80)/160 = **1.1875** (model says 1.19). 3(b) restate: OK.

### 3.5 P2_SET_200 — Marlowe Meadows Glamping (MMG)

- Stem: FC = $90,000; VC = $14/unit; SP = $32; produces 12,000 units; workforce 16.
- Contribution/unit = $32 − $14 = **$18.00**
- Break-even = $90,000 ÷ $18 = **5,000 units**
- Margin of safety = 12,000 − 5,000 = **7,000 units**
- ATC = $90,000 ÷ 12,000 + $14 = 7.50 + 14 = **$21.50/unit**
- Labour productivity = 12,000 ÷ 16 = **750 units/worker**
- 3(a) restates: 5,000 ✓; $18.00 ✓; 7,000 ✓; $21.50 ✓ (labour productivity not restated)
- Appendix 2 (liquidity): CA 2024 = 18 + 12 + 14 = $44 → CR = 44/30 = **1.4667** (model says 1.47); AT = (44 − 18)/30 = **0.8667** (model says 0.87). CA 2025 = 26 + 15 + 9 = $50 → CR = 50/35 = **1.4286** (model says 1.43); AT = (50 − 26)/35 = **0.6857** (model says 0.69). 3(b) restate: OK.

### 3.6 P2_SET_201 — Bluecrest Airport Shuttle (BAS)

- Stem: FC = $270,000; VC = $3.60/unit; SP = $9.00; produces 100,000 units; workforce 38.
- Contribution/unit = $9.00 − $3.60 = **$5.40**
- Break-even = $270,000 ÷ $5.40 = **50,000 units**
- Margin of safety = 100,000 − 50,000 = **50,000 units**
- ATC = $270,000 ÷ 100,000 + $3.60 = 2.70 + 3.60 = **$6.30/unit**
- Labour productivity = 100,000 ÷ 38 = **2,631.5789 units/worker**
- 3(a) restates: 50,000 ✓; $5.40 ✓; 50,000 ✓; $6.30 ✓ (labour productivity not restated)
- Appendix 2 (profitability): Rev 2024/2025 = 800,000/900,000; CoS = 464,000/513,000; GP = 336,000/387,000; OpProfit = 96,000/135,000; Capital employed = 600,000/675,000. **GP = Rev − CoS exactly both years** ✓.
- 3(b): GPM = 42.0/43.0%, PM = 12.0/15.0%, ROCE = 16.0/20.0% — model answers restate the recalculated values: OK.

### 3.7 P2_SET_202 — Redbark Timber Haulage (RBH)

- Stem: FC = $600,000; VC = $55/unit; SP = $85; produces 40,000 units; workforce 52.
- Contribution/unit = $85 − $55 = **$30**
- Break-even = $600,000 ÷ $30 = **20,000 units**
- Margin of safety = 40,000 − 20,000 = **20,000 units**
- ATC = $600,000 ÷ 40,000 + $55 = 15 + 55 = **$70.00/unit**
- Labour productivity = 40,000 ÷ 52 = **769.2308 units/worker**
- 3(a) restates: 20,000 ✓; $30 ✓; 20,000 ✓; $70 ✓ (labour productivity not restated)
- Appendix 2 (profitability): Rev 2,500,000/3,400,000; CoS 1,500,000/1,870,000; GP 1,000,000/1,530,000; OpProfit 300,000/510,000; Capital employed 1,250,000/2,040,000. **GP = Rev − CoS exactly both years** ✓.
- 3(b): GPM = 40.0/45.0%, PM = 12.0/15.0%, ROCE = 24.0/25.0% — restate OK.

### 3.8 P2_SET_203 — Caldera Geothermal Heat (CGH)

- Stem: FC = $630,000; VC = $78/unit; SP = $120; produces 27,000 units; workforce 34.
- Contribution/unit = $120 − $78 = **$42**
- Break-even = $630,000 ÷ $42 = **15,000 units**
- Margin of safety = 27,000 − 15,000 = **12,000 units**
- ATC = $630,000 ÷ 27,000 + $78 = 23.3333 + 78 = **$101.3333/unit**
- Labour productivity = 27,000 ÷ 34 = **794.1176 units/worker**
- 3(a) restates: 15,000 ✓; $42 ✓; 12,000 ✓; $101.3333 ✓ (labour productivity not restated)
- Appendix 2 (profitability): Rev 2,400,000/3,240,000; CoS 1,416,000/1,782,000; GP 984,000/1,458,000; OpProfit 288,000/486,000; Capital employed 1,800,000/2,430,000. **GP = Rev − CoS exactly both years** ✓.
- 3(b): GPM = 41.0/45.0%, PM = 12.0/15.0%, ROCE = 16.0/20.0% — restate OK.

### 3.9 P2_SET_204 — Brightvolt EV Charging (BEC)

- Stem: FC = $1,575,000; VC = $7.50/unit; SP = $18; produces 260,000 units; workforce 210.
- Contribution/unit = $18 − $7.50 = **$10.50**
- Break-even = $1,575,000 ÷ $10.50 = **150,000 units**
- Margin of safety = 260,000 − 150,000 = **110,000 units**
- ATC = $1,575,000 ÷ 260,000 + $7.50 = 6.0577 + 7.50 = **$13.5577/unit**
- Labour productivity = 260,000 ÷ 210 = **1,238.0952 units/worker**
- 3(a) restates: 150,000 ✓; $10.50 ✓; 110,000 ✓; $13.5577 ✓ (labour productivity not restated)
- Appendix 2 (profitability): Rev 3,900,000/4,680,000; CoS 2,340,000/2,457,000; GP 1,560,000/2,223,000; OpProfit 468,000/702,000; Capital employed 2,600,000/3,510,000. **GP = Rev − CoS exactly both years** ✓.
- 3(b): GPM = 40.0/47.5%, PM = 12.0/15.0%, ROCE = 18.0/20.0% — restate OK.

### 3.10 P2_SET_205 — Saltmarsh Harbour Ferries (SHF)

- Stem: FC = $216,000; VC = $6.40/unit; SP = $16; produces 45,000 units; workforce 12.
- Contribution/unit = $16 − $6.40 = **$9.60**
- Break-even = $216,000 ÷ $9.60 = **22,500 units**
- Margin of safety = 45,000 − 22,500 = **22,500 units**
- ATC = $216,000 ÷ 45,000 + $6.40 = 4.80 + 6.40 = **$11.20/unit**
- Labour productivity = 45,000 ÷ 12 = **3,750 units/worker**
- 3(a) restates: 22,500 ✓; $9.60 ✓; 22,500 ✓; $11.20 ✓ (labour productivity not restated)
- Appendix 2 (profitability): Rev 600,000/720,000; CoS 345,000/396,000; GP 255,000/324,000; OpProfit 60,000/108,000; Capital employed 500,000/720,000. **GP = Rev − CoS exactly both years** ✓.
- 3(b): GPM = 42.5/45.0%, PM = 10.0/15.0%, ROCE = 12.0/15.0% — restate OK.

**Note on informational flags:** labour productivity is not restated in the 3(a) model answers of any set; the gatekeeper requires break-even and contribution in 3(a)(i)/(ii), which all restate, so this is informational. No discrepancies > tolerance were found anywhere.

---

## 4. VAW SWEEP (brief item 13 — "verbatim VAW sweep all questions")

Full sweep: for every question of every set, every `valid_app_words` entry (5–8) appears verbatim (case-insensitive substring) in the allowed source — the combined insert for 1(a), 1(b), 2(a), 2(b), 4(a), 4(b); the insert + model_answer + sub_parts for 3(a), 3(b).

- P2_SET_196: VAW OK (8 questions)
- P2_SET_197: VAW OK (8 questions)
- P2_SET_198: VAW OK (8 questions)
- P2_SET_199: VAW OK (8 questions)
- P2_SET_200: VAW OK (8 questions)
- P2_SET_201: VAW OK (8 questions)
- P2_SET_202: VAW OK (8 questions)
- P2_SET_203: VAW OK (8 questions)
- P2_SET_204: VAW OK (8 questions)
- P2_SET_205: VAW OK (8 questions)

**Checked by hand, first 3 questions of each set (1(a), 1(b), 2(a)):** for every set, all `valid_app_words` of 1(a), 1(b) and 2(a) are present as substrings of the combined insert (case-insensitive), e.g.:

- P2_SET_196: 1(a): all present | 1(b): all present | 2(a): all present
- P2_SET_197: 1(a): all present | 1(b): all present | 2(a): all present
- P2_SET_198: 1(a): all present | 1(b): all present | 2(a): all present
- P2_SET_199: 1(a): all present | 1(b): all present | 2(a): all present
- P2_SET_200: 1(a): all present | 1(b): all present | 2(a): all present
- P2_SET_201: 1(a): all present | 1(b): all present | 2(a): all present
- P2_SET_202: 1(a): all present | 1(b): all present | 2(a): all present
- P2_SET_203: 1(a): all present | 1(b): all present | 2(a): all present
- P2_SET_204: 1(a): all present | 1(b): all present | 2(a): all present
- P2_SET_205: 1(a): all present | 1(b): all present | 2(a): all present

---

## 5. STRUCTURE (brief item 3 + appendix completeness, brief items 12–15)

Per set — all checks OK:

- Top-level keys exactly `scenario_id, unit, case_study_insert, questions`; unit = "Paper 2 Case Study".
- Question numbers/marks: 1(a)=8, 1(b)=12, 2(a)=8, 2(b)=12, 3(a)=8, 3(b)=12, 4(a)=8, 4(b)=12 (total 80).
- 3(a) sub_parts: (i)=2, (ii)=2, (iii)=4; `mark_scheme` keys = `working_marks`; other questions have the exact MS key sets; 1(b)/2(b)/3(b)/4(b) texts contain "Which …? Justify …".
- `main_stem` word counts within 110–145 (gatekeeper-verified).
- 1(b): 3 options; 2(b): 2 options (verified by reading the question texts).
- Appendix 1: ≥120 chars, ≥4 numeric metrics. Appendix 2: 6 rows, canonical labels, headers `["Financial Metric","2024","2025"]`; for profitability sets, GP = Rev − CoS exactly (verified in §3.6–§3.10). Appendix 3: ≥3 %-figures.
- Marking keys: 5–8 string entries per question, verbatim-verbatim (gatekeeper VAW covers the non-3 questions via the insert; 3(a)/3(b) via insert+model_answer+sub_parts).

---

## 6. VERDICTS (per-set)

| Set | Verdict | Reason |
|---|---|---|
| P2_SET_196 | **APPROVED_BY_TECH_AUD** | Gatekeeper PASS; independent recalc (contribution $37.00, break-even 6,000, MoS 6,000, ATC $66.50, unit cost $66.50, LP 300) matches model answers; liquidity ratios CR 1.44/1.56, AT 0.72/1.04 restate in 3(b); VAW OK; structure OK; unique. |
| P2_SET_197 | **APPROVED_BY_TECH_AUD** | Gatekeeper PASS; recalc ($13.00, 4,000, 5,600, $14.4167, LP 400) matches; liquidity CR 1.25/1.50, AT 0.75/1.13 restate; VAW OK; structure OK; unique. |
| P2_SET_198 | **APPROVED_BY_TECH_AUD** | Gatekeeper PASS; recalc ($57.00, 20,000, 6,000, $81.8462, LP 113.04) matches; liquidity CR 1.60/1.72, AT 1.08/1.16 restate; VAW OK; structure OK; unique. |
| P2_SET_199 | **APPROVED_BY_TECH_AUD** | Gatekeeper PASS; recalc ($24.00, 15,000, 6,000, $45.1429, LP 323.08) matches; liquidity CR 1.56/1.69, AT 0.91/1.19 restate; VAW OK; structure OK; unique. |
| P2_SET_200 | **APPROVED_BY_TECH_AUD** | Gatekeeper PASS; recalc ($18.00, 5,000, 7,000, $21.50, LP 750) matches; liquidity CR 1.47/1.43, AT 0.87/0.69 restate; VAW OK; structure OK; unique. |
| P2_SET_201 | **APPROVED_BY_TECH_AUD** | Gatekeeper PASS; recalc ($5.40, 50,000, 50,000, $6.30, LP 2,631.58) matches; profitability ratios GPM 42/43%, PM 12/15%, ROCE 16/20% restate; GP=Rev−CoS exact; VAW OK; structure OK; unique. |
| P2_SET_202 | **APPROVED_BY_TECH_AUD** | Gatekeeper PASS; recalc ($30, 20,000, 20,000, $70, LP 769.23) matches; ratios GPM 40/45%, PM 12/15%, ROCE 24/25% restate; GP=Rev−CoS exact; VAW OK; structure OK; unique. |
| P2_SET_203 | **APPROVED_BY_TECH_AUD** | Gatekeeper PASS; recalc ($42, 15,000, 12,000, $101.3333, LP 794.12) matches; ratios GPM 41/45%, PM 12/15%, ROCE 16/20% restate; GP=Rev−CoS exact; VAW OK; structure OK; unique. |
| P2_SET_204 | **APPROVED_BY_TECH_AUD** | Gatekeeper PASS; recalc ($10.50, 150,000, 110,000, $13.5577, LP 1,238.10) matches; ratios GPM 40/47.5%, PM 12/15%, ROCE 18/20% restate; GP=Rev−CoS exact; VAW OK; structure OK; unique. |
| P2_SET_205 | **APPROVED_BY_TECH_AUD** | Gatekeeper PASS; recalc ($9.60, 22,500, 22,500, $11.20, LP 3,750) matches; ratios GPM 42.5/45%, PM 10/15%, ROCE 12/15% restate; GP=Rev−CoS exact; VAW OK; structure OK; unique. |

---

## 7. FINAL VERDICT (one line per set)

P2_SET_196: APPROVED_BY_TECH_AUD
P2_SET_197: APPROVED_BY_TECH_AUD
P2_SET_198: APPROVED_BY_TECH_AUD
P2_SET_199: APPROVED_BY_TECH_AUD
P2_SET_200: APPROVED_BY_TECH_AUD
P2_SET_201: APPROVED_BY_TECH_AUD
P2_SET_202: APPROVED_BY_TECH_AUD
P2_SET_203: APPROVED_BY_TECH_AUD
P2_SET_204: APPROVED_BY_TECH_AUD
P2_SET_205: APPROVED_BY_TECH_AUD
