# TECH-AUD-14 — Wave 02 Tech Auditor Audit

- **Audited sets:** P2_SET_146 … P2_SET_150 and P2_SET_171 … P2_SET_175 (10 sets)
- **Auditor:** TECH-AUD-14
- **Repo:** C:\Users\jayde\Documents\GitHub\fresh
- **Files read:** paper2\prompts\tech_auditor_brief.md, paper2\prompts\generator_brief.md, paper2\prompts\example_set.json (canonical labels)
- **Assessed files:** paper2\sets\wave_02\P2_SET_146.json … P2_SET_150.json, P2_SET_171.json … P2_SET_175.json — confirmed stable (SHA-256 of the staged copies is byte-identical to the originals).

## 1. Staging

Copies staged to C:\Users\jayde\AppData\Local\Temp\opencode\w02t14\ (10 files: P2_SET_146–150, P2_SET_171–175). SHA-256 comparison of each copy vs the original in paper2\sets\wave_02: ALL 10 STAGED COPIES BYTE-IDENTICAL TO ORIGINALS.

## 2. Gatekeeper output — verbatim, on the staged copies

Note: `gatekeeper.py --sets-dir <dir>` skips `--sets-dir` itself from the cross-wave registry (paper2\sets\…); because the staging dir is outside paper2\sets, the real wave_02 originals are also loaded into the registry and their identical initials/scenario_ids are reported as duplicates of the staged copies. To run the gatekeeper on the copies without that artifact, the identical script was run from the staging dir itself (its wave_root then points outside the repo). Both runs are pasted:

```
==============================================================================
GATEKEEPER REPORT  |  checked 10 set(s)
==============================================================================
[PASS] P2_SET_146  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t14\P2_SET_146.json)
[PASS] P2_SET_147  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t14\P2_SET_147.json)
[PASS] P2_SET_148  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t14\P2_SET_148.json)
[PASS] P2_SET_149  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t14\P2_SET_149.json)
[PASS] P2_SET_150  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t14\P2_SET_150.json)
[PASS] P2_SET_171  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t14\P2_SET_171.json)
[PASS] P2_SET_172  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t14\P2_SET_172.json)
[PASS] P2_SET_173  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t14\P2_SET_173.json)
[PASS] P2_SET_174  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t14\P2_SET_174.json)
[PASS] P2_SET_175  (C:\Users\jayde\AppData\Local\Temp\opencode\w02t14\P2_SET_175.json)
==============================================================================
Sets passed: 10/10   |   failed: 0
```

## 3. Gatekeeper output — verbatim, on the real wave_02 dir (cross-wave registry: wave_01 + wave_03 + waves/)

```
==============================================================================
GATEKEEPER REPORT  |  checked 40 set(s)
==============================================================================
[PASS] P2_SET_141  (paper2\sets\wave_02\P2_SET_141.json)
[PASS] P2_SET_142  (paper2\sets\wave_02\P2_SET_142.json)
[PASS] P2_SET_143  (paper2\sets\wave_02\P2_SET_143.json)
[PASS] P2_SET_144  (paper2\sets\wave_02\P2_SET_144.json)
[PASS] P2_SET_145  (paper2\sets\wave_02\P2_SET_145.json)
[PASS] P2_SET_146  (paper2\sets\wave_02\P2_SET_146.json)
[PASS] P2_SET_147  (paper2\sets\wave_02\P2_SET_147.json)
[PASS] P2_SET_148  (paper2\sets\wave_02\P2_SET_148.json)
[PASS] P2_SET_149  (paper2\sets\wave_02\P2_SET_149.json)
[PASS] P2_SET_150  (paper2\sets\wave_02\P2_SET_150.json)
[PASS] P2_SET_151  (paper2\sets\wave_02\P2_SET_151.json)
[PASS] P2_SET_152  (paper2\sets\wave_02\P2_SET_152.json)
[PASS] P2_SET_153  (paper2\sets\wave_02\P2_SET_153.json)
[PASS] P2_SET_154  (paper2\sets\wave_02\P2_SET_154.json)
[PASS] P2_SET_155  (paper2\sets\wave_02\P2_SET_155.json)
[PASS] P2_SET_156  (paper2\sets\wave_02\P2_SET_156.json)
[PASS] P2_SET_157  (paper2\sets\wave_02\P2_SET_157.json)
[PASS] P2_SET_158  (paper2\sets\wave_02\P2_SET_158.json)
[PASS] P2_SET_159  (paper2\sets\wave_02\P2_SET_159.json)
[PASS] P2_SET_160  (paper2\sets\wave_02\P2_SET_160.json)
[PASS] P2_SET_161  (paper2\sets\wave_02\P2_SET_161.json)
[PASS] P2_SET_162  (paper2\sets\wave_02\P2_SET_162.json)
[PASS] P2_SET_163  (paper2\sets\wave_02\P2_SET_163.json)
[PASS] P2_SET_164  (paper2\sets\wave_02\P2_SET_164.json)
[PASS] P2_SET_165  (paper2\sets\wave_02\P2_SET_165.json)
[PASS] P2_SET_166  (paper2\sets\wave_02\P2_SET_166.json)
[PASS] P2_SET_167  (paper2\sets\wave_02\P2_SET_167.json)
[PASS] P2_SET_168  (paper2\sets\wave_02\P2_SET_168.json)
[PASS] P2_SET_169  (paper2\sets\wave_02\P2_SET_169.json)
[PASS] P2_SET_170  (paper2\sets\wave_02\P2_SET_170.json)
[PASS] P2_SET_171  (paper2\sets\wave_02\P2_SET_171.json)
[PASS] P2_SET_172  (paper2\sets\wave_02\P2_SET_172.json)
[PASS] P2_SET_173  (paper2\sets\wave_02\P2_SET_173.json)
[PASS] P2_SET_174  (paper2\sets\wave_02\P2_SET_174.json)
[PASS] P2_SET_175  (paper2\sets\wave_02\P2_SET_175.json)
[PASS] P2_SET_176  (paper2\sets\wave_02\P2_SET_176.json)
[PASS] P2_SET_177  (paper2\sets\wave_02\P2_SET_177.json)
[PASS] P2_SET_178  (paper2\sets\wave_02\P2_SET_178.json)
[PASS] P2_SET_179  (paper2\sets\wave_02\P2_SET_179.json)
[PASS] P2_SET_180  (paper2\sets\wave_02\P2_SET_180.json)
==============================================================================
Sets passed: 40/40   |   failed: 0
```

## 4. Independent math recalculation — auditor re-derivation from main_stem

Formulas re-derived by the auditor (brief point 2): contribution = SP − VC; break-even = FC ÷ contribution; margin of safety = output − break-even; ATC = FC ÷ output + VC; labour productivity = output ÷ workforce. Appendix 2 ratios re-derived: liquidity — CA = Inventories + Trade receivables + Cash; CR = CA/CL; acid test = (CA − Inventories)/CL; profitability — GPM = GP/Rev×100; PM = OpProfit/Rev×100; ROCE = OpProfit/Capital employed×100. Tolerances: ratio 0.06, margin of safety 1 unit, % 0.75, money max(0.51, 0.6%). All values re-derived below match the stated figures in the model answers / 3(b) within tolerance. Script cross-check (w02t14_math_check.py, run independently of the gatekeeper): per set "=> recalc verdict: OK"; SUMMARY: all recalcs OK = YES; SVC HCP 2024 profit margin 189/2050 = 9.22% vs stated 9.20%, diff 0.02 ≤ 0.75 — within tolerance.

**P2_SET_146 (CPC)**
- Stem: FC $384,000; selling price $22.50; variable cost $14.50.
- Contribution = $22.50 − $14.50 = **$8.00**
- Break-even = $384,000 ÷ $8.00 = **48,000 units** (3(a)(i) stated 48,000 — MATCH)
- Margin of safety = 120,000 − 48,000 = **72,000 units** (3(a)(iii) stated 72,000 — MATCH)
- Average total cost = $384,000 ÷ 120,000 + $14.50 = $3.20 + $14.50 = **$17.70**
- Labour productivity = 120,000 ÷ 80 workers = **1,500 units/worker**
- Appendix 2 (liquidity): CA2024 = 210 + 260 + 55 = 525; CR2024 = 525/350 = **1.50**; acid2024 = (525 − 210)/350 = **0.90**. CA2025 = 175 + 305 + 85 = 565; CR2025 = 565/330 = **1.71**; acid2025 = (565 − 175)/330 = **1.18**. Model: 1.50/1.71/0.90/1.18 (diffs ≤ 0.01). Verdict: OK.

**P2_SET_147 (BSW)**
- Stem: FC $198,000; SP $15.20; VC $9.20.
- Contribution = **$6.00** (stated $6.00 — MATCH)
- Break-even = $198,000 ÷ $6.00 = **33,000 units** (stated 33,000 — MATCH)
- Margin of safety = 72,000 − 33,000 = **39,000 units** (stated 39,000 — MATCH)
- ATC = $198,000 ÷ 72,000 + $9.20 = $2.75 + $9.20 = **$11.95**
- Labour productivity = 72,000 ÷ 36 = **2,000 units/worker** (stated 2,000 — MATCH)
- Appendix 2: CA2024 = 140 + 95 + 80 = 315; CR = 315/195 = **1.62**; acid = (315 − 140)/195 = **0.90**. CA2025 = 185 + 150 + 55 = 390; CR = 390/290 = **1.34**; acid = (390 − 185)/290 = **0.71**. Model: 1.62/1.34/0.90/0.71. Verdict: OK.

**P2_SET_148 (TSF)**
- Stem: FC $276,000; SP $34.80; VC $22.80.
- Contribution = **$12.00** (MATCH)
- Break-even = $276,000 ÷ $12.00 = **23,000 units** (MATCH)
- Margin of safety = 46,000 − 23,000 = **23,000 units** (MATCH)
- ATC = $276,000 ÷ 46,000 + $22.80 = $6.00 + $22.80 = **$28.80**
- Labour productivity = 46,000 ÷ 52 = **884.62 ≈ 885 units/worker** (stated "about 885" — MATCH)
- Appendix 2: CA2024 = 150 + 210 + 70 = 430; CR = 430/280 = **1.54**; acid = (430 − 150)/280 = **1.00**. CA2025 = 120 + 230 + 95 = 445; CR = 445/275 = **1.62**; acid = (445 − 120)/275 = **1.18**. Model: 1.54/1.62/1.00/1.18. Verdict: OK.

**P2_SET_149 (MRT)**
- Stem: FC $342,000; SP $7.60; VC $3.60.
- Contribution = **$4.00** (MATCH)
- Break-even = $342,000 ÷ $4.00 = **85,500 units** (MATCH)
- Margin of safety = 171,000 − 85,500 = **85,500 units** (MATCH)
- ATC = $342,000 ÷ 171,000 + $3.60 = $2.00 + $3.60 = **$5.60**
- Labour productivity = 171,000 ÷ 48 = **3,562.50 ≈ 3,563 units/worker** (stated "about 3,563" — MATCH)
- Appendix 2: CA2024 = 260 + 175 + 60 = 495; CR = 495/320 = **1.55**; acid = (495 − 260)/320 = **0.73**. CA2025 = 215 + 190 + 105 = 510; CR = 510/300 = **1.70**; acid = (510 − 215)/300 = **0.98**. Model: 1.55/1.70/0.73/0.98. Verdict: OK.

**P2_SET_150 (SFS)**
- Stem: FC $405,000; SP $28.00; VC $19.00.
- Contribution = **$9.00** (MATCH)
- Break-even = $405,000 ÷ $9.00 = **45,000 units** (MATCH)
- Margin of safety = 90,000 − 45,000 = **45,000 units** (MATCH; "100% headroom" per 3(a)(iii))
- ATC = $405,000 ÷ 90,000 + $19.00 = $4.50 + $19.00 = **$23.50**
- Labour productivity = 90,000 ÷ 95 = **947.37 ≈ 947 units/worker** (stated "about 947" — MATCH)
- Appendix 2: CA2024 = 380 + 250 + 90 = 720; CR = 720/400 = **1.80**; acid = (720 − 380)/400 = **0.85**. CA2025 = 310 + 265 + 135 = 710; CR = 710/380 = **1.87**; acid = (710 − 310)/380 = **1.05**. Model: 1.80/1.87/0.85/1.05. Verdict: OK.

**P2_SET_171 (DAC)**
- Stem: FC $210,000; SP $80.00; VC $38.00.
- Contribution = **$42.00** (MATCH)
- Break-even = $210,000 ÷ $42.00 = **5,000 units** (MATCH)
- Margin of safety = 11,000 − 5,000 = **6,000 units** (MATCH; stated 6,000 — MATCH)
- ATC = $210,000 ÷ 11,000 + $38.00 = $19.09 + $38.00 = **$57.09**
- Labour productivity = 11,000 ÷ 38 = **289.47 ≈ 289 units/worker** (stated "about 289" — MATCH)
- Appendix 2 (profitability): GP2024 = 720 = Rev 1,800 − CoS 1,080 ✓; GP2025 = 990 = Rev 2,200 − CoS 1,210 ✓.
- GPM: 720/1,800 = **40.0%** (stated 40.0%); 990/2,200 = **45.0%** (stored 45.0%). PM: 270/1,800 = **15.0%**; 396/2,200 = **18.0%**. ROCE: 270/1,500 = **18.0%**; 396/1,760 = **22.5%**. All stated values match recomputation. Verdict: OK.

**P2_SET_172 (WDS)**
- Stem: FC $128,000; SP $38.00; VC $22.00.
- Contribution = **$16.00** (MATCH)
- Break-even = $128,000 ÷ $16.00 = **8,000 units** (MATCH)
- Margin of safety = 13,500 − 8,000 = **5,500 units** (MATCH)
- ATC = $128,000 ÷ 13,500 + $22.00 = $9.48 + $22.00 = **$31.48**
- Labour productivity = 13,500 ÷ 24 = **562.50 ≈ 563 units/instructor** (stated "about 563" — MATCH)
- Appendix 2: GP2024 = 414 = 1,150 − 736 ✓; GP2025 = 552 = 1,380 − 828 ✓. GPM: 414/1,150 = **36.0%**; 552/1,380 = **40.0%**. PM: 138/1,150 = **12.0%**; 207/1,380 = **15.0%**. ROCE: 138/920 = **15.0%**; 207/1,150 = **18.0%**. All stated match. Verdict: OK.

**P2_SET_173 (BHT)**
- Stem: FC $70,000; SP $22.50; VC $12.50.
- Contribution = **$10.00** (MATCH)
- Break-even = $70,000 ÷ $10.00 = **7,000 units** (MATCH)
- Margin of safety = 12,500 − 7,000 = **5,500 units** (MATCH)
- ATC = $70,000 ÷ 12,500 + $12.50 = $5.60 + $12.50 = **$18.10**
- Labour productivity = 12,500 ÷ 52 = **240.38 ≈ 240 sessions/tutor** (stated "about 240" — MATCH)
- Appendix 2: GP2024 = 480 = 1,200 − 720 ✓; GP2025 = 675 = 1,500 − 825 ✓. GPM: 480/1,200 = **40.0%**; 675/1,500 = **45.0%**. PM: 144/1,200 = **12.0%**; 210/1,500 = **14.0%**. ROCE: 144/800 = **18.0%**; 210/1,050 = **20.0%**. All stated match. Verdict: OK.

**P2_SET_174 (HCP)**
- Stem: FC $168,000; SP $14.00; VC $8.00.
- Contribution = **$6.00** (MATCH)
- Break-even = $168,000 ÷ $6.00 = **28,000 units** (MATCH)
- Margin of safety = 34,000 − 28,000 = **6,000 units** (MATCH)
- ATC = $168,000 ÷ 34,000 + $8.00 = $4.94 + $8.00 = **$12.94**
- Labour productivity = 34,000 ÷ 27 = **1,259.26 ≈ 1,259 items/employee** (stated "about 1,259" — MATCH)
- Appendix 2: GP2024 = 615 = 2,050 − 1,435 ✓; GP2025 = 768 = 2,400 − 1,632 ✓. GPM: 615/2,050 = **30.0%**; 768/2,400 = **32.0%**. PM: 189/2,050 = **9.22%** (stored 9.20%, diff 0.02 ≤ 0.75 tolerance); 312/2,400 = **13.0%**. ROCE: 189/1,050 = **18.0%**; 312/1,600 = **19.5%**. Within tolerance. Verdict: OK.

**P2_SET_175 (CVO)**
- Stem: FC $232,000; SP $55.00; VC $26.00.
- Contribution = **$29.00** (MATCH)
- Break-even = $232,000 ÷ $29.00 = **8,000 units** (MATCH)
- Margin of safety = 14,500 − 8,000 = **6,500 units** (MATCH)
- ATC = $232,000 ÷ 14,500 + $26.00 = $16.00 + $26.00 = **$42.00**
- Labour productivity = 14,500 ÷ 41 = **353.66 ≈ 354 units/employee** (stated "about 354" — MATCH)
- Appendix 2: GP2024 = 720 = 1,600 − 880 ✓; GP2025 = 897 = 1,950 − 1,053 ✓. GPM: 720/1,600 = **45.0%**; 897/1,950 = **46.0%**. PM: 256/1,600 = **16.0%**; 351/1,950 = **18.0%**. ROCE: 256/1,280 = **20.0%**; 351/1,560 = **22.5%**. All stated match. Verdict: OK.

## 5. Verbatim VAW sweep (brief point 5)

Method: for every question, every valid_app_words entry must appear case-insensitively as a substring of the combined insert (main_stem + appendix_1_marketing_ops + appendix_2_financial_data JSON incl. title/headers/rows + appendix_3_external_environment); for 3(a)/3(b) the haystack also includes the question's model_answer and sub_parts. Programmatic sweep result: **missing = NONE for all 10 sets × 8 questions** (80/80 entries present). Hand-check (brief: "Check by hand for the first 3 questions of each set you audit and state so"): first 3 questions of each set = 1(a), 1(b), 2(a) — hand-verified present for all 10 sets, e.g.:
- P2_SET_146 1(a): retained profit, bank loan, $450,000, $750,000, $1,200,000, casting — all present.
- P2_SET_146 1(b): casting, brake discs, 58%, $1,200,000, Denise Marlow, metal manufacturing — all present.
- P2_SET_146 2(a): autocratic leadership, 6%, CNC, absenteeism, 120,000, Denise Marlow — all present.
The remaining questions are covered by the programmatic sweep above plus the gatekeeper (which passed 40/40).

## 6. Uniqueness (brief point 6)

Sibling folders checked: paper2\sets\wave_01, paper2\sets\wave_02, paper2\sets\wave_03, paper2\waves\ (all JSON outputs). Scan result: **No duplicate scenario_ids or business initials anywhere.** Initials:
- P2_SET_146 → CPC; P2_SET_147 → BSW; P2_SET_148 → TSF; P2_SET_149 → MRT; P2_SET_150 → SFS; P2_SET_171 → DAC; P2_SET_172 → WDS; P2_SET_173 → BHT; P2_SET_174 → HCP; P2_SET_175 → CVO.
Each appears only within wave_02's set itself (no other set in wave_01/03/waves/ uses the same initials or scenario_id).

## 7. Appendix completeness (brief point 4)

- Main stems 110–145 words: CPC 120, BSW 111, TSF 112, MRT 121, SFS 118, DAC 115, WDS 114, BHT 117, HCP 116, CVO 122 — all in range (gatekeeper PASS).
- Named businesses with initials + legal structure + sector + workforce + leadership + capital cost + finance mix + fixed/variable costs + output + operational problem: all present in each main stem (read and confirmed).
- Appendix 1 ≥4 numerical metrics each: gatekeeper PASS (≥4 number strings in each).
- Appendix 2: six rows with canonical labels — liquidity sets (CPC) use Inventories / Trade receivables / Cash and cash equivalents / Current liabilities / Non-current assets / Capital employed; profitability sets (DAC, WDS, BHT, HCP, CVO) use Revenue / Cost of sales / Gross profit / Operating profit / Capital employed + 6th free row Interest payable. Gross profit = revenue − cost of sales in both years verified per set (see recalc section).
- Appendix 3: three external changes with percentages/figures in each set: gatekeeper PASS (≥3 percentage matches).

## 8. Verdict table

| Scenario ID | Verdict |
|---|---|
| P2_SET_146 | APPROVED_BY_TECH_AUD |
| P2_SET_147 | APPROVED_BY_TECH_AUD |
| P2_SET_148 | APPROVED_BY_TECH_AUD |
| P2_SET_149 | APPROVED_BY_TECH_AUD |
| P2_SET_150 | APPROVED_BY_TECH_AUD |
| P2_SET_171 | APPROVED_BY_TECH_AUD |
| P2_SET_172 | APPROVED_BY_TECH_AUD |
| P2_SET_173 | APPROVED_BY_TECH_AUD |
| P2_SET_174 | APPROVED_BY_TECH_AUD |
| P2_SET_175 | APPROVED_BY_TECH_AUD |

**Rationale:** gatekeeper PASS on the staged copies (10/10) and on the real dir (40/40); independent math recalculation matches the stated values for all sets; VAW sweep complete (missing = NONE; first 3 questions hand-checked); uniqueness confirmed across wave_01..03 + waves/; appendix completeness verified per brief point 4. No check failed ⇒ approval per brief: "Do not approve a set that fails any single check."
