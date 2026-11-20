# TECH-AUD-15 — Tier 2B Schema/Math/Grounding Audit — Wave 01 (GEN-03 P2_SET_111–115, GEN-06 P2_SET_126–130)

**Auditor:** TECH-AUD-15 (Tier 2B schema/math/grounding) | **Date:** 2026-11-19 | **Method:** brief `paper2/prompts/tech_auditor_brief.md`
**Staged dir:** `C:\Users\jayde\AppData\Local\Temp\opencode\techaud15` (copies of the 10 assigned sets only)
**Files audited (SHA-256, unchanged between staging and report):**

| File | SHA-256 |
|---|---|
| P2_SET_111 | 2356539189FEB4C0BF76A59FF681A08C8933EAFD4480BDAD3807A5F0C37384E2 |
| P2_SET_112 | 957D6AFF1B679B11D53120278DDAEE47F1DF7A63F58A27E0770B93B984604DF3 |
| P2_SET_113 | EC711602E31C4201DE087722946F9D66FD013E6FCD22CD829A5021E4D9F60701 |
| P2_SET_114 | EB99A248CEB7337A8FC41709FD3AB0EB7575D0490DA482E315464410940E9E6C |
| P2_SET_115 | 3699BC177DA062C041CCE32F45B41E0AF06D196E28344A8688BE936BFF3BB4B5 |
| P2_SET_126 | C46EFD4ACF60A039C3435A7D7EBAEE4B346B453C5F33468F2AE1D78633FF0850 |
| P2_SET_127 | BE3A0B4B35BF2BA9B5D8C62CDC5B76D004F355BFD67E5A60E15BA02FC46691D3 |
| P2_SET_128 | 94A45B6FDC92491387A6797623E00ACA793664F0CD2B943DEDED92F1626D8CC8 |
| P2_SET_129 | 06E110967D6558299E9502F2EFCB9FE518E19505017F57C65162EEA9420D757F |
| P2_SET_130 | 33FE0D0444298AF60FD3E560DAF57E75B159940B3E218F7839CF975D8C44ADE1 |

## 0. Readiness gate
All 10 assigned files were MISSING at audit start (wave_01 contained only P2_SET_116). A background poll (10 min) found all 10 present by attempt 10 (~9:45 PM). All 10 parse as UTF-8 JSON (`json.load` OK ×10). No set is NOT_READY.

**Live-editing note (material):** GEN-03/GEN-06 were still writing while the audit ran. `P2_SET_115` was re-saved at 21:44:52, `P2_SET_126` at 21:44:15, `P2_SET_127` at 21:44:28. The first gatekeeper pass (21:44) flagged a real defect in P2_SET_115 (`4(a): valid_app_word 'refillable' not found verbatim in case_study_insert`). The generator then edited 115; re-staging + re-running shows that defect GONE (115 now PASS). The current on-disk state (hashes above, stable for the whole audit) is what is audited and reported below. The other 9 sets were not edited during the audit (hashes match staging copies throughout).

## 1. Gatekeeper runs (verbatim)

### 1a. Staged run on the 10 assigned sets (per brief §1)
Path: `--sets-dir C:\Users\jayde\AppData\Local\Temp\opencode\techaud15`

```
==============================================================================
GATEKEEPER REPORT  |  checked 10 set(s)
==============================================================================
[FAIL] P2_SET_111  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud15\P2_SET_111.json)
    ERROR: business initials 'VF' already used by set P2_SET_111
    ERROR: scenario_id 'P2_SET_111' already used in P2_SET_111.json
[FAIL] P2_SET_112  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud15\P2_SET_112.json)
    ERROR: business initials 'SL' already used by set P2_SET_112
    ERROR: scenario_id 'P2_SET_112' already used in P2_SET_112.json
[FAIL] P2_SET_113  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud15\P2_SET_113.json)
    ERROR: business initials 'GBO' already used by set P2_SET_113
    ERROR: scenario_id 'P2_SET_113' already used in P2_SET_113.json
[FAIL] P2_SET_114  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud15\P2_SET_114.json)
    ERROR: business initials 'HHW' already used by set P2_SET_114
    ERROR: scenario_id 'P2_SET_114' already used in P2_SET_114.json
[FAIL] P2_SET_115  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud15\P2_SET_115.json)
    ERROR: business initials 'VB' already used by set P2_SET_115
    ERROR: scenario_id 'P2_SET_115' already used in P2_SET_115.json
[FAIL] P2_SET_126  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud15\P2_SET_126.json)
    ERROR: business initials 'HDP' already used by set P2_SET_126
    ERROR: scenario_id 'P2_SET_126' already used in P2_SET_126.json
[FAIL] P2_SET_127  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud15\P2_SET_127.json)
    ERROR: business initials 'KMS' already used by set P2_SET_127
    ERROR: scenario_id 'P2_SET_127' already used in P2_SET_127.json
[FAIL] P2_SET_128  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud15\P2_SET_128.json)
    ERROR: business initials 'CEP' already used by set P2_SET_128
    ERROR: scenario_id 'P2_SET_128' already used in P2_SET_128.json
[FAIL] P2_SET_129  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud15\P2_SET_129.json)
    ERROR: business initials 'SGC' already used by set P2_SET_129
    ERROR: scenario_id 'P2_SET_129' already used in P2_SET_129.json
[FAIL] P2_SET_130  (C:\Users\jayde\AppData\Local\Temp\opencode\techaud15\P2_SET_130.json)
    ERROR: business initials 'MAS' already used by set P2_SET_130
    ERROR: scenario_id 'P2_SET_130' already used in P2_SET_130.json
==============================================================================
Sets passed: 0/10   |   failed: 10
```
**Interpretation (not concealed):** every one of these 10 errors is a self-reference artefact of checking *copies* while the originals remain in `paper2/sets/wave_01` — the gatekeeper's uniqueness scan (which only excludes files under `--sets-dir`) matches each copy against its own original. They cite the same file (e.g. "already used by set P2_SET_111" when checking the staged copy of P2_SET_111). These are NOT duplicate-initial collisions. The staged run contains NO other errors for these 10 sets.

*(Earlier first staged run / first wave_01 run — before the in-progress generator fix — additionally printed: `[FAIL] P2_SET_115 … ERROR: 4(a): valid_app_word 'refillable' not found verbatim in case_study_insert`. That defect is absent from the audited state.)*

### 1b. Authoritative run on `paper2/sets/wave_01` (originals in place, uniqueness scan across `paper2/sets` ∩ `waves/`)
```
[PASS] P2_SET_111  (…\wave_01\P2_SET_111.json)
[PASS] P2_SET_112  (…\wave_01\P2_SET_112.json)
[PASS] P2_SET_113  (…\wave_01\P2_SET_113.json)
[PASS] P2_SET_114  (…\wave_01\P2_SET_114.json)
[PASS] P2_SET_115  (…\wave_01\P2_SET_115.json)
[PASS] P2_SET_126  (…\wave_01\P2_SET_126.json)
[PASS] P2_SET_127  (…\wave_01\P2_SET_127.json)
[PASS] P2_SET_128  (…\wave_01\P2_SET_128.json)
[PASS] P2_SET_129  (…\wave_01\P2_SET_129.json)
[PASS] P2_SET_130  (…\wave_01\P2_SET_130.json)
```
(full report: `checked 39 set(s) … Sets passed: 35/39 | failed: 4` — the 4 failures are P2_SET_131, P2_SET_132, P2_SET_133, P2_SET_136/137/138/139/140-class 2(b)/4(a) valid_app_words, all OTHER generators' sets, not mine; unrelated to this audit. A further run showed P2_SET_108's earlier cross-wave initials clash vs P2_SET_146 also resolved. My 10 sets PASS in this mode.)

## 2. Per-set recalculation (independent, by hand)

Tolerance: ratios ±0.06, margins/percents ±0.75, money ±0.51 or rel 0.6%. "BE" = break-even output = FC ÷ (SP−VC). "ATC" = FC/output + VC. "MoS" = output − BE. "LP" = output ÷ workforce. Liquidity rows: Inventories/Trade receivables/Cash → CA; CR = CA/CL; Acid = (CA−Inv)/CL. Profitability rows: GP = Rev−CoS; GPM = GP/Rev; PM = OP/Rev; ROCE = OP/CE.

### P2_SET_111 (Velvet Finch, VF — liquidity set)
Stem: FC $216,000; VC $24.00; SP $42.00; output 19,000; workforce 28.
- Contribution = 42.00 − 24.00 = **$18.00** ✓ (model answer (ii) $18.00)
- BE = 216,000 ÷ 18.00 = **12,000 units** ✓ (model answer (i))
- MoS = 19,000 − 12,000 = **7,000** ✓ (used in (iii) + VAW "7,000")
- ATC = 216,000/19,000 + 24 = 11.37 + 24 = **$35.37** ✓ ($11.37 + $24 stated in (iii) point 4)
- LP = 19,000/28 ≈ 678.6 ✓
- App 2: CA24 = 260+90+100 = $450k → **CR24 = 450/235 = 1.91** ✓ | CA25 = 295+120+150 = $565k → **CR25 = 565/260 = 2.17** ✓ | **Acid24 = (450−260)/235 = 190/235 = 0.81** ✓ | **Acid25 = (565−295)/260 = 270/260 = 1.04** ✓
- 3(b) summary lines: `Current Ratio 2024 = 1.91 : 1`, `Current Ratio 2025 = 2.17 : 1`, `Acid Test Ratio 2024 = 0.81 : 1`, `Acid Test Ratio 2025 = 1.04 : 1` — all match ✓. Detailed workings consistent, no "current ratio" wording outside labelled lines.
- Extra check (iii) point 2: 10% sale at $37.80 → contribution 37.80−24 = 13.80 ✓; point 4: unit cost $35.37 ✓.

### P2_SET_112 (Sole Ledger, SL — liquidity set)
Stem: FC $480,000; VC $9.00; SP $21.00; output 55,000; workforce 62.
- Contribution = 21.00 − 9.00 = **$12.00** ✓
- BE = 480,000 ÷ 12.00 = **40,000** ✓ (in 3(a)(i) note & VAWs)
- MoS (asked in (i)) = 55,000 − 40,000 = **15,000** ✓ (model answer 15,000)
- ATC = 480,000/55,000 + 9.00 = 8.73 + 9.00 = **$17.73** ✓
- LP = 55,000/62 ≈ **887** ✓
- App 2: CA24 = 410+310+150 = $870k → **CR24 = 870/430 = 2.02** ✓ | CA25 = 455+380+60 = $895k → **CR25 = 895/505 = 1.77** ✓ | **Acid24 = (870−410)/430 = 460/430 = 1.07** ✓ | **Acid25 = (895−455)/505 = 440/505 = 0.87** ✓
- 3(b) summary: 2.02/1.77, 1.07/0.87 — match ✓.

### P2_SET_113 (Greenbasket Organics, GBO — liquidity set)
Stem: FC $198,000; VC $2.20; SP $5.50; output 78,000; workforce 34.
- Contribution = 5.50 − 2.20 = **$3.30** ✓
- BE = 198,000 ÷ 3.30 = **60,000** ✓
- MoS (asked in (ii)) = 78,000 − 60,000 = **18,000** ✓
- ATC = 198,000/78,000 + 2.20 = 2.54 + 2.20 = **$4.74** ✓
- LP = 78,000/34 ≈ **2,294** ✓
- App 2: CA24 = 85+60+40 = $185k → **CR24 = 185/105 = 1.76** ✓ | CA25 = 105+75+95 = $275k → **CR25 = 275/140 = 1.96** ✓ | **Acid24 = (185−85)/105 = 100/105 = 0.95** ✓ | **Acid25 = (275−105)/140 = 170/140 = 1.21** ✓
- 3(b) summary: 1.76/1.96, 0.95/1.21 — match ✓.

### P2_SET_114 (Hartwell Homewares, HHW — liquidity set)
Stem: FC $1,050,000; VC $13.00; SP $25.50; output 108,000; workforce 210.
- Contribution = 25.50 − 13.00 = **$12.50** ✓
- BE = 1,050,000 ÷ 12.50 = **84,000** ✓
- MoS = 108,000 − 84,000 = **24,000** ✓
- ATC = 1,050,000/108,000 + 13 = 9.72 + 13 = **$22.72** ✓
- LP = 108,000/210 ≈ **514** ✓
- App 2: CA24 = 520+380+230 = $1,130k → **CR24 = 1,130/640 = 1.77** ✓ | CA25 = 640+430+380 = $1,450k → **CR25 = 1,450/760 = 1.91** ✓ | **Acid24 = (1,130−520)/640 = 610/640 = 0.95** ✓ | **Acid25 = (1,450−640)/760 = 810/760 = 1.07** ✓
- 3(b) summary: 1.77/1.91, 0.95/1.07 — match ✓.

### P2_SET_115 (Velvette Beauty, VB — liquidity set)
Stem: FC $270,000; VC $7.00; SP $16.00; output 44,000; workforce 38.
- Contribution = 16.00 − 7.00 = **$9.00** ✓
- BE = 270,000 ÷ 9.00 = **30,000** ✓
- MoS (asked in (i)) = 44,000 − 30,000 = **14,000** ✓
- ATC = 270,000/44,000 + 7 = 6.14 + 7 = **$13.14** ✓
- LP = 44,000/38 ≈ **1,158** ✓
- App 2: CA24 = 150+45+90 = $285k → **CR24 = 285/180 = 1.58** ✓ | CA25 = 210+60+175 = $445k → **CR25 = 445/230 = 1.93** ✓ | **Acid24 = (285−150)/180 = 135/180 = 0.75** ✓ | **Acid25 = (445−210)/230 = 235/230 = 1.02** ✓
- 3(b) summary: 1.58/1.93, 0.75/1.02 — match ✓.
- Audited-state VAW check: the previously failing `refillable` entry is gone; 4(a) VAWs now `["packaging input costs","$34.60","54%","13%","$21,000","10.8%"]`, all verbatim in insert ✓.

### P2_SET_126 (Hartley Digital Payroll, HDP — profitability set)
Stem: FC $220,000; VC $7.20; SP $12.70; output 60,000; workforce 38.
- Contribution = 12.70 − 7.20 = **$5.50** ✓
- BE = 220,000 ÷ 5.50 = **40,000** ✓
- MoS = 60,000 − 40,000 = **20,000** ✓
- ATC = 220,000/60,000 + 7.20 = 3.67 + 7.20 = **$10.87** ✓
- LP = 60,000/38 ≈ **1,579** ✓
- App 2: GP24 = 1,480−890 = 590 ✓ | GP25 = 1,860−1,085 = 775 ✓
- **GPM24 = 590/1,480 = 39.9%** ✓ | **GPM25 = 775/1,860 = 41.7%** ✓ | **PM24 = 222/1,480 = 15.0%** ✓ | **PM25 = 326/1,860 = 17.5%** ✓ | **ROCE24 = 222/2,220 = 10.0%** ✓ | **ROCE25 = 326/2,480 = 13.1%** ✓
- 3(b): revenue growth 25.7% (1,480→1,860 ✓), interest $16k→$27k ✓ — as stated.

### P2_SET_127 (Kestrel Managed IT Services, KMS — profitability set)
Stem: FC $300,000; VC $26.50; SP $36.50; output 40,000; workforce 64.
- Contribution = 36.50 − 26.50 = **$10.00** ✓
- BE = 300,000 ÷ 10.00 = **30,000** ✓
- MoS = 40,000 − 30,000 = **10,000** ✓
- ATC = 300,000/40,000 + 26.50 = 7.50 + 26.50 = **$34.00** ✓
- LP = 40,000/64 = **625** ✓
- App 2: GP24 = 2,150−1,290 = 860 ✓ | GP25 = 2,640−1,520 = 1,120 ✓
- **GPM24 = 860/2,150 = 40.0%** ✓ | **GPM25 = 1,120/2,640 = 42.4%** ✓ | **PM24 = 344/2,150 = 16.0%** ✓ | **PM25 = 528/2,640 = 20.0%** ✓ | **ROCE24 = 344/1,760 = 19.5%** ✓ | **ROCE25 = 528/2,200 = 24.0%** ✓
- (iii) derivations elsewhere OK: 4% discount → $35.04, contribution $8.54 ✓; unit cost $34.00 ✓; $32,000 (16×$2,000) ✓; op profit +53.5% ✓; revenue +22.8% ✓; CE +25.0% ✓.
- **DEFECT (math fail):** 3(a)(iii) point 2 model answer: *"a 4% volume discount to $35.04, which would still leave $8.54 contribution and **46,000 units needed to cover fixed costs**"*. Units to cover $300,000 fixed costs at $8.54 contribution = 300,000 ÷ 8.54 = **35,129 units**, not 46,000 (off by ~31%; 46,000 × 8.54 = $392,840). Even the charitable reading (units needed to hold constant contribution of $400,000) gives 46,838, not 46,000. Break-even-family derivation in a model answer, exceeding tolerance by an order of magnitude. Not caught by the gatekeeper (it checks only 3(a)(i)/(ii)).

### P2_SET_128 (Clearwater e-Learning Partners, CEP — profitability set)
Stem: FC $180,000; VC $4.90; SP $9.70; output 60,000; workforce 27.
- Contribution = 9.70 − 4.90 = **$4.80** ✓
- BE = 180,000 ÷ 4.80 = **37,500** ✓
- MoS = 60,000 − 37,500 = **22,500** ✓
- ATC = 180,000/60,000 + 4.90 = 3.00 + 4.90 = **$7.90** ✓
- LP = 60,000/27 ≈ **2,222** ✓
- App 2: GP24 = 980−539 = 441 ✓ | GP25 = 1,310−705 = 605 ✓
- **GPM24 = 441/980 = 45.0%** ✓ | **GPM25 = 605/1,310 = 46.2%** ✓ | **PM24 = 147/980 = 15.0%** ✓ | **PM25 = 262/1,310 = 20.0%** ✓ | **ROCE24 = 147/820 = 17.9%** ✓ | **ROCE25 = 262/1,050 = 25.0%** ✓
- (iii) checks: 8% discount to $8.92 → contribution $4.02 ✓; CE growth $230k ✓; op profit +78.2% ✓; revenue +33.7% ✓.

### P2_SET_129 (Sentinel Gate Cyber, SGC — profitability set)
Stem: FC $540,000; VC $40.00; SP $52.00; output 60,000; workforce 88.
- Contribution = 52.00 − 40.00 = **$12.00** ✓
- BE = 540,000 ÷ 12.00 = **45,000** ✓
- MoS = 60,000 − 45,000 = **15,000** ✓
- ATC = 540,000/60,000 + 40.00 = 9.00 + 40.00 = **$49.00** ✓
- LP = 60,000/88 ≈ **682** ✓
- App 2: GP24 = 3,400−1,700 = 1,700 ✓ | GP25 = 4,150−1,975 = 2,175 ✓
- **GPM24 = 1,700/3,400 = 50.0%** ✓ | **GPM25 = 2,175/4,150 = 52.4%** ✓ | **PM24 = 510/3,400 = 15.0%** ✓ | **PM25 = 705/4,150 = 17.0%** ✓ | **ROCE24 = 510/3,000 = 17.0%** ✓ | **ROCE25 = 705/3,750 = 18.8%** ✓
- (iii) checks: 5% discount → $49.40, contribution $9.40 ✓; CISSP 12×$2,400 = $28,800 ✓; op profit +38.2% ✓; revenue +22.1% ✓; CE +25.0% (+$750k) ✓.

### P2_SET_130 (Mosaic App Studio, MAS — profitability set)
Stem: FC $175,000; VC $8.50; SP $18.50; output 25,000; workforce 24.
- Contribution = 18.50 − 8.50 = **$10.00** ✓
- BE = 175,000 ÷ 10.00 = **17,500** ✓
- MoS = 25,000 − 17,500 = **7,500** ✓ (≥5,000 floor)
- ATC = 175,000/25,000 + 8.50 = 7.00 + 8.50 = **$15.50** ✓
- LP = 25,000/24 ≈ **1,042** ✓
- App 2: GP24 = 720−396 = 324 ✓ | GP25 = 940−500 = 440 ✓
- **GPM24 = 324/720 = 45.0%** ✓ | **GPM25 = 440/940 = 46.8%** ✓ | **PM24 = 108/720 = 15.0%** ✓ | **PM25 = 188/940 = 20.0%** ✓ | **ROCE24 = 108/600 = 18.0%** ✓ | **ROCE25 = 188/800 = 23.5%** ✓
- (iii) checks: 5% discount → $17.58, contribution $9.08 ✓; op profit +74.1% ✓; revenue +30.6% ✓; CE +33.3% ✓.

## 3. Structural / appendix / grounding / marking checks (all 10, independent of gatekeeper)
- **Top-level keys** exactly `scenario_id, unit, case_study_insert, questions` ✓ ×10; `unit = "Paper 2 Case Study"` ✓ ×10.
- **Insert keys** exactly the 4 required ✓ ×10. **Stem word counts** (whitespace tokens): 111:118, 112:127, 113:120, 114:114, 115:125, 126:129, 127:129, 128:124, 129:133, 130:128 — all within 110–145 ✓. Each stem contains: `<Name> (<INI>)`, legal structure, sector, `workforce of N`, leadership style, expansion decision with exact $ capital cost, financing choices, `fixed costs of $X a year`, `variable cost of $Y a unit`, `selling price of $Z`, `produces N units`, operational/HR problem, named founder ✓ (verified by read).
- **Break-even wholeness/≤2dp** ✓ all 10 (whole numbers). **Contribution ≥ $3** ✓ (min $3.30). **MoS ≥ 5,000** ✓ (min 7,500).
- **Appendix 1**: ≥120 chars ✓ ×10; numeric metrics found: 111:13, 112:14, 113:15, 114:13, 115:16, 126:16, 127:12, 128:9, 129:14, 130:12 — all ≥4 ✓. Names/types valid (Market Research Summary / Operations Log / Quality & Waste Report / Advertisement Extract) ✓.
- **Appendix 2**: keys exactly `title, headers, rows` ✓; headers exactly `["Financial Metric","2024","2025"]` ✓; 6 rows ✓; title carries `$ … '000` ✓; liquidity titles = Statement of Financial Position ✓ (111–115), profitability titles = Statement of Profit or Loss and Capital employed data ✓ (126–130); canonical row labels present ✓ (liquidity: Inventories/Trade receivables/Cash and cash equivalents/Current liabilities/Non-current assets/Capital employed; profitability: Revenue/Cost of sales/Gross profit/Operating profit/Capital employed + Interest payable 6th row). **GP = Rev − CoS exact, both years** ✓ ×5 profitability sets. Row values parse numeric ✓.
- **Appendix 3**: ≥80 chars ✓ ×10; percentage figures found: 111:6, 112:5, 113:6, 114:6, 115:6, 126:6, 127:6, 128:6, 129:6, 130:6 — all ≥3, and three distinct external changes each ✓.
- **8 questions** in order 1(a)…4(b) ✓ ×10; marks 8/12/8/12/8/12/8/12, total 80 ✓ ×10; `3(a)` sub_parts (i) 2m / (ii) 2m / (iii) 4m, keys exactly `part, marks, question_text, model_answer` ✓ ×10; mark_scheme keys exact per part type (`knowledge_max_2`/`application_analysis_max_6` for part (a); `level_1_1_to_4`/`level_2_5_to_8`/`level_3_9_to_12` for part (b); `working_marks` only for 3(a)) ✓ ×10; question keys exact ✓ ×10.
- **Part (a) contains business initials** ✓ ×10 (all four (a)-questions each); **(b) questions match `Which … Justify your …`** ✓ ×10 (1(b)/2(b)/4(b) each; 3(b) exempt by design and ends "Justify your answer."); 3(a) sub-parts (i)/(ii) contain a canonical recalculable phrase (break-even output / margin of safety / contribution per unit) ✓ ×10.
- **Deterministic grounding (hand-checked, first 3 questions of every set, per brief §5)** — all `valid_app_words` (5–8 per question) appear verbatim case-insensitively in the combined insert (or insert+model_answer for 3(a)/3(b)):
  - 111 1(a): retained profit/bank loan/$330,000/$450,000/second boutique/$216,000 ✓; 1(b): second boutique/58%/47%/$74/34%/e-commerce ✓; 2(a): laissez-faire/flat organisational structure/workforce of 28/inventory shrinkage/4.6%/$74 ✓
  - 112 1(a): share issue/$600,000/bank loan/$950,000/workforce of 62/returns abuse ✓; 1(b): 61%/78%/authentication hub/verified-seller/$19/9,400 ✓; 2(a): autocratic leadership/returns abuse/6.8%/9,400/3.1%/hierarchical structure ✓
  - 113 1(a): member share capital/bank loan/$240,000/$640,000/cooperative/farm-box ✓; 1(b): home-delivery/71%/66%/farm-box/$28.40/cooperative ✓; 2(a): democratic leadership/flat structure/seasonal staffing/workforce of 34/28/7.5% ✓
  - 114 1(a): share issue/bank loan/$1,200,000/$650,000/$1,850,000/labour turnover ✓; 1(b): share issue/$1,850,000/57%/workforce of 210/8.1/footfall ✓; 2(a): hierarchical structure/democratic leadership/workforce of 210/labour turnover/41%/twelve ✓
  - 115 1(a): venture capital/retained profit/$440,000/$920,000/$480,000/flagship store ✓; 1(b): influencer/72%/54%/$21,000/flagship store/900 ✓; 2(a): autocratic leadership/flat structure/workforce of 38/$920,000/$34.60/flagship store ✓
  - 126 1(a): retained profit/bank loan/$270,000/$450,000/$720,000/version-2 payroll platform ✓; 1(b): LinkedIn/68%/57%/version-2 payroll platform/$720,000/520/41% ✓; 2(a): democratic leadership/developer poaching/14%/workforce of 38/$1,150/60,000 ✓
  - 127 1(a): venture capital/retained profit/$980,000/$600,000/security operations centre/$380,000 ✓; 1(b): security operations centre/healthcare/$980,000/28 named hospital trusts/99.1%/64/640 monitored devices ✓; 2(a): autocratic leadership/remote-work communication breakdowns/99.1%/workforce of 64/3,860/5.6 hours ✓
  - 128 1(a): overdraft/$180,000/$540,000/retained profit/$360,000/$9.70 ✓; 1(b): offline mobile mode/1,950/94%/66%/$540,000/subscriber churn is 9%/320 ✓; 2(a): laissez-faire leadership/subscriber churn is 9%/workforce of 27/320/66%/4.3/5 ✓
  - 129 1(a): share issue/$500,000/$900,000/retained profit/$400,000/public limited company ✓; 1(b): energy sector/$900,000/12,400/96%/9 of 27/control hub/24/7 SOC ✓; 2(a): democratic leadership/absenteeism to 8%/12,400/workforce of 88/14 minutes/96% ✓
  - 130 1(a): hire purchase/$250,000/$600,000/retained profit/$350,000/workstations and servers ✓; 1(b): second studio/$600,000/700/59%/46%/9.5 weeks/4.6/5 ✓; 2(a): democratic leadership/defect rates/client complaints about release delays/workforce of 24/14 active contracts/4.6/5 ✓
- **Independent substring sweep across ALL 8 questions (not just first 3)**: a from-scratch check (case-insensitive substring; combined insert for 1(a)–4(b); insert+model_answer+sub_parts for 3(a)/3(b)) found **zero missing `valid_app_words` entries in any of the 10 sets**.
- **Marking keys**: 5–8 entries, all non-empty strings ✓ ×10 (counts: 111: 6/6/6/6/7/7/6/6; 112: 6/6/6/6/7/7/6/6; 113: 6/6/6/6/7/7/6/6; 114: 6/6/6/6/7/7/6/6; 115: 6/6/6/6/7/7/6/6; 126: 6/7/6/6/8/8/6/7; 127: 6/7/6/6/8/8/6/8; 128: 6/7/6/6/8/8/6/7; 129: 6/7/6/6/8/8/6/8; 130: 6/7/6/6/8/8/6/7 — order 1(a),1(b),2(a),2(b),3(a),3(b),4(a),4(b)). No invented values beyond the insert/model answers ✓.

## 4. Uniqueness
Inventories scanned: `paper2/sets/wave_01/*.json` (39–40 files present during audit), `paper2/sets/wave_02/*.json` (25 files present during audit), `paper2/waves/*.json` (empty), `paper2/prompts/example_set.json` (exemplar, P2_SET_101, LFF). **No sibling generator folders exist elsewhere in `paper2/`** (scripts / prompts / audits / sets / waves only). The gatekeeper's recursive initials scan across all of `paper2/sets` + `waves/` passes my 10 sets.

- My initials: VF, SL, GBO, HHW, VB, HDP, KMS, CEP, SGC, MAS — **no duplicates** anywhere in the scanned tree; none equal the exemplar LFF.
- Whole business names unique ✓. Noted **near-name collisions** (different names, different initials, NOT duplicates): `Kestrel Managed IT Services` (mine, 127, KMS) vs `Kestrel Precision Engineering` (106, KPE); `Hartwell Homewares` (mine, 114, HHW) vs `Hartwell Modular Homes` (137, HMH) vs `Hartwell Community Pharmacy` (wave_02, 174, HCP); `Hartley Digital Payroll` (mine, 126, HDP) vs the Hartwell family; `Sentinel Gate Cyber` (mine, 129, SGC) vs `Sentinel Flow Systems` (wave_02, 150, SFS); `Clearwater e-Learning Partners` (128) shares "Alderney" only as a place word with Alderney Dental Group (131). Names and initials remain distinct; flagging for the wave lead's awareness, not a failure.
- wave_02 contains my assigned set IDs 126–130? **No** — my assignments live only in wave_01; no ID clashes (wave_02 holds 141–175).

## 5. Verdict table

| Set | Gatekeeper (wave_01 mode) | Independent recalc | Grounding (all Q + first-3 hand check) | Structure/appendices | Uniqueness | **Verdict** |
|---|---|---|---|---|---|---|
| P2_SET_111 | PASS | PASS (all figures) | PASS | PASS | PASS | **APPROVED_BY_TECH_AUD** |
| P2_SET_112 | PASS | PASS | PASS | PASS | PASS | **APPROVED_BY_TECH_AUD** |
| P2_SET_113 | PASS | PASS | PASS | PASS | PASS | **APPROVED_BY_TECH_AUD** |
| P2_SET_114 | PASS | PASS | PASS | PASS | PASS | **APPROVED_BY_TECH_AUD** |
| P2_SET_115 | PASS (post-fix) | PASS | PASS (post-fix) | PASS | PASS | **APPROVED_BY_TECH_AUD** |
| P2_SET_126 | PASS | PASS | PASS | PASS | PASS | **APPROVED_BY_TECH_AUD** |
| P2_SET_127 | PASS | **FAIL** — 3(a)(iii) claims 46,000 units cover fixed costs at $8.54 contribution; correct = 300,000 ÷ 8.54 ≈ 35,129 (>tolerance) | PASS | PASS | PASS | **REJECTED** |
| P2_SET_128 | PASS | PASS | PASS | PASS | PASS | **APPROVED_BY_TECH_AUD** |
| P2_SET_129 | PASS | PASS | PASS | PASS | PASS | **APPROVED_BY_TECH_AUD** |
| P2_SET_130 | PASS | PASS | PASS | PASS | PASS | **APPROVED_BY_TECH_AUD** |

## 6. Notes for the wave lead
1. P2_SET_115 was edited mid-audit by its generator (21:44:52) to fix a real `valid_app_words` failure (`refillable` → `packaging input costs`). Approved only for the current on-disk state (hash `3699BC…BB4B5`); if it is edited again before combine, re-run the gate.
2. P2_SET_115, P2_SET_126, P2_SET_127 mtimes are later than other sets; the generator may still be in its fix loop. No set was approved against a state other than the hashes in section 0.
3. P2_SET_127 rejection is surgical: every mandated check passes; the single defect is one wrong derived figure inside the 3(a)(iii) model answer. Fix = replace "46,000 units needed to cover fixed costs" with ≈35,129 units (or rephrase to the constant-contribution interpretation: ≈46,838, and reword accordingly). Relatedly, if the constant-contribution reading was intended, it must say so explicitly.
4. Near-name collisions listed in §4 are informational.
5. No `waves/0264_Paper_2_Wave_01.json` exists yet; combine has not been run. Do not combine until P2_SET_127 is fixed and P2_SET_115's stability is confirmed.
6. Staging-copy gatekeeper output (§1a) shows only self-reference artefacts; the brief's staging procedure as written double-counts originals. Recommend future briefs use `--sets-dir` on the wave directory itself (as §1b) or a staging dir *with the originals removed*.
