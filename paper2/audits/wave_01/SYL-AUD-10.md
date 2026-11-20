# SYL-AUD-10 audit log — Wave 01

Scope: GEN-02 sets P2_SET_106–110 (liquidity Appendix 2) and GEN-06 sets P2_SET_126–130 (profitability Appendix 2).
Method: JSON parse check (node), mechanical scans (blacklist tokens, (b)-pattern, mark-scheme keys, pure-definition scan, word counts via whitespace tokenization), then line-by-line manual audit of every string field against the insert. Snapshot audited at ~13:47–13:49 UTC; all 10 files confirmed byte-identical to the audited copies afterwards (SHA-256 re-hash). Note: files 106/108/109/126/127 were still being written during the first readiness pass; the readiness gate passed at ~13:44 UTC and the final audit used the settled on-disk content (re-audited 106 after it changed).

| Set | Verdict |
|-----|---------|
| P2_SET_106 | APPROVED_BY_SYL_AUD |
| P2_SET_107 | APPROVED_BY_SYL_AUD |
| P2_SET_108 | APPROVED_BY_SYL_AUD |
| P2_SET_109 | REJECTED — model answer word counts below brief floor (2(b), 12 marks, = 238 words; ≥250 required); see P2_SET_109 error log |
| P2_SET_110 | REJECTED — model answer word counts below brief floor (1(a)=140, 2(a)=136, 4(a)=149 of 150 required for 8-mark; 1(b)=247, 2(b)=224 of 250 required for 12-mark); see P2_SET_110 error log |
| P2_SET_126 | REJECTED — hallucinated case fact: "churn below 9%" appears in 3(b) model answer but churn is absent from the insert (9% figure matches P2_SET_128's CEP context); see P2_SET_126 error log |
| P2_SET_127 | REJECTED — 4(a) model answer = 146 words (<150); and erroneous/unexplained figure "46,000 units needed" in 3(a)(iii) point 2 (correct ≈ 35,100); see P2_SET_127 error log |
| P2_SET_128 | REJECTED — model answer word counts below brief floor (1(a)=144, 2(a)=143, 4(a)=146; all <150); see P2_SET_128 error log |
| P2_SET_129 | REJECTED — model answer word counts below brief floor (1(a)=141, 2(a)=142, 4(a)=142 of 150; 2(b)=237 of 250); see P2_SET_129 error log |
| P2_SET_130 | REJECTED — model answer word counts below brief floor (1(a)=132, 2(a)=133, 4(a)=142 of 150); plus literal blacklist token "regression" ("weak regression coverage") in 2(a) — QA sense, not econometrics, flagged for rewording; see P2_SET_130 error log |

All 10 sets: 8 questions, mark totals 80, 3(a) sub-parts 2/2/4 marks, correct mark-scheme keys throughout (knowledge_max_2/application_analysis_max_6 for (a); level_1_1_to_4/level_2_5_to_8/level_3_9_to_12 for (b) and 3(b); working_marks for 3(a)). No pure-definition questions in any set. All 1(b) answers discuss all three options in case context, end with a justified recommendation and name the rejected options; all 2(b) answers discuss both options and justify a decision. All (b) questions use the Consider…Which…Justify pattern. Ratios required for both years in 3(b); justified judgement present (profitability variants P2_SET_126–130 correctly use GPM/PM/ROCE — all whitelisted ratios; GEN-02 sets use current/acid ratios — verified recomputed correctly:
- 106: 1.40/1.60, 0.93/1.25 ✓ (2024 CA=$630k, 2025 CA=$680k)
- 107: 1.25/1.39, 0.73/0.97 ✓ (1,200/960; 1,250/900)
- 108: 1.50/1.74, 1.00/1.34 ✓ (285/190; 305/175)
- 109: 1.42/1.67, 0.88/1.18 ✓ (370/260; 375/225)
- 110: 1.40/1.54, 0.90/1.14 ✓ (730/520; 770/500)
- 126: GPM 39.9→41.7, PM 15.0→17.5, ROCE 10.0→13.1 ✓
- 127: GPM 40.0→42.4, PM 16.0→20.0, ROCE 19.5→24.0 ✓
- 128: GPM 45.0→46.2, PM 15.0→20.0, ROCE 17.9→25.0 ✓
- 129: GPM 50.0→52.4, PM 15.0→17.0, ROCE 17.0→18.8 ✓
- 130: GPM 45.0→46.8, PM 15.0→20.0, ROCE 18.0→23.5 ✓

## Approved sets — notes (not grounds for rejection)

### P2_SET_106 (KPE, precision engineering — liquidity)
- Word counts: 1(a)=155, 2(a)=156, 4(a)=181, 1(b)=284, 2(b)=255, 3(b)=261, 4(b)=280 — all meet floors.
- Applied (a): 1(a) names KPE + CNC machining cell + bank loan (no digits, but initials/product present ✓). 2(a) "KPE's defect rate… 4.6%" ✓. 4(a) "…for KPE of introducing ISO 9001 quality assurance for its valve production" ✓ (ISO 9001 quoted in insert App1).
- Stimulus auditability: every figure traces to insert or is computed (BE 40,000 = 540,000÷13.50 ✓; MoS 8,000 ✓; $27,600 = 24×$1,150 ✓; $6,000/yr interest = 0.75%×$800k ✓; acid/current 3(b) verified ✓; $29.75/unit cost ✓; $11.90 after 5% cut from $30.40 ✓). Framed hypotheticals, accepted per house style: "If the lowest-paid 30 operatives… each gains about $1,340… roughly $40,000" (106 Q4(b)); "at roughly $10 of materials per valve… about $0.96… roughly $46,000" (106 Q4(b)). Proposal quantity "two senior operators" (2(b)) acceptable.
- Flags (fix on next pass): 1(b) model answer "a major international oil and gas or water-treatment exhibition" — stray "water-treatment" flourish not in insert (discuss only the oil & gas exhibition as asked). 2(b) typo "costs far less tha $27,600". "water-treatment" and typo are cosmetic.
- No blacklist tokens; no pure definitions; mark scheme keys correct; 80 marks total.

### P2_SET_107 (AAC, automotive components — liquidity)
- Word counts: 1(a)=163, 2(a)=158, 4(a)=168, 1(b)=261, 2(b)=271, 3(b)=266, 4(b)=296 — all meet floors.
- Stimulus auditability: $2.3M/$1.2M/$1.1M relocation ✓ insert; $14,400? no — 2(b) uses "$1,400 per employee; for 25 welders that is $35,000" — **"25 welders" is not in the insert and not derivable** (insert gives turnover 14% in welding dept., no headcount). Flagged, not rejecting on rule 6: it is a modelling illustration (not an asserted case condition, not contradicting the insert, decision-relevant content otherwise insert-grounded); house style uses this device. Recommend adding "assume/if" framing on next pass. Same class: "If the lowest-paid 45 operatives… roughly $61,200" (4(b), framed ✓), "roughly $6 of materials per assembly… roughly $100,800" (4(b), framed ✓). Proposal/plan quantities accept.
- 1(a) names AAC + share issue + relocation ✓ applied. 2(a) "14%…welders" ✓. 4(a) "relocating its press shop to the new industrial park" ✓ (insert context).
- Ratios recomputed ✓. No blacklist tokens. Note: founder "Priya Raman" is reused across sets (107 AAC and 126 HDP) — cross-set naming overlap, outside this audit's reject grounds; flagged for orchestrator/gatekeeper.

### P2_SET_108 (APC, packaging — liquidity)
- Word counts: 1(a)=167, 2(a)=162, 4(a)=170, 1(b)=262, 2(b)=262, 3(b)=266, 4(b)=302 — all meet floors.
- Stimulus auditability: 3(a) break-even 100,000 = 310,000÷3.10 ✓; $3.25 = 3.10+0.15 ✓; unit cost $3.04 = 1.94+1.10 ✓; 3(b) verified ✓; "$14,400 for the 18" = 18×$800 ✓; 4(b) interest $4,500 = 0.75%×$600k ✓; wage "each full-time member up $1,300… across 50 floor members that is roughly $65,000" — **"50 floor members" is unframed** (insert says only "Most of APC's 60 members work on the floor"); flagged, not rejecting (unlike "churn" in 126, this states no false case condition and is bounded by "most of 60"; recommend "assume 50" framing). "Pulp dominates… at roughly $0.70 per box… roughly $15,800" (framed ✓; computed $15,456, stated ~2% loose — flag). "more than four times the input-cost increase" ✓ consistent.
- 3(b) "inventories of $70,000 must still cover just-in-time delivery promises of 2.4 days lead time" — passing phrase only, not JIT theory/calculation; syllabus scope "just-in-time? (avoid complex)" not breached (no marks depend on JIT). Flag for rewording anyway.
- Applied (a) ✓ all three (2(a) 11%/$26,000; 4(a) 100% recycled materials — in insert App1). No blacklist tokens (just-in-time phrase noted). Ratios recomputed ✓.

## Error log (rejected sets only)

### P2_SET_109
- Rule: 8 (model answer word counts — 12-mark part below floor); questions[3].model_answer (2(b), location: questions[3].model_answer).
- Quote (opening + word count): "On-the-job training: Training beside the new jacquard loom is directly relevant to MTT's exact weave programs…" = **238 words** (whitespace tokenization), floor is 250 for 12-mark parts. Sub-count check with alphanumeric-token counting gives 246 — still below floor.
- Everything else in the set passed (blacklist clean; no pure definitions; applied (a) ✓; (b) pattern ✓; levels ✓; ratios recomputed ✓ 1.42/1.67/0.88/1.18; estimates framed, e.g. "at roughly $4.50 per unit", "If the lowest-paid 25 operatives"; figures audit-traced). Fix: expand 2(b) to ≥250 words. Borderline passes to watch: 3(b)=251, 4(a)=152.

### P2_SET_110
- Rule: 8 (model answer word counts — five parts below floor); locations questions[0], questions[2], questions[6], questions[1], questions[3] model_answer.
- Quotes/counts: 1(a) ("VEL plans to finance part of its surface-mount…") = **140** (<150); 2(a) ("VEL cannot recruit enough…") = **136**; 4(a) ("…installing robotic pick-and-place machines…") = **149** (just under 150); 1(b) = **247**; 2(b) = **224** (<250). 3(b)=259 ✓, 4(b)=270 ✓, 3(a)(iii)=158 ✓.
- Rule 5 content was otherwise satisfied (1(b) discusses three options, justified recommendation with journals/exhibition rejected; 2(b) decides on-the-job vs off-the-job with rejection explained; ISO 14001/ISO 9001 context quoted from insert ✓; "8.4% growth in smart-home appliance spending" traced to Appendix 3 ✓; ratios recomputed ✓ 1.40/1.54/0.90/1.14).
- Notes: 3(b) uses passing phrase "just-in-time supply against 6% of orders delayed" (no JIT calculation/theory — flag for rewording). 4(a) "The robots cost $1,100,000" conflates the whole $1.1M assembly-line investment with the pick-and-place robots alone — should attribute $1.1M to the SMT lines. 1(a) applied ✓ (VEL + share issue). Counter-check floors: even the most generous alternative counting (alphanumeric tokens) leaves 4(a) <150 and the 12-mark parts <250.

### P2_SET_126
- Rule: 6 (hallucinated / cross-contaminated case fact); location: questions[5].model_answer (3(b)).
- Quote: "Residual concerns: interest payable nearly doubled from $16,000 to $27,000, and **2025 performance depends on holding churn below 9% after the v2 launch**; if the $720,000 project overshoots budget…" — "churn" appears nowhere in the insert (grep: 0 occurrences in case_study_insert). The "9%" churn figure is the CEP/Clearwater e-Learning value from P2_SET_128's insert ("subscriber churn is 9%") — wrong-business contamination. Contradicted by and absent from 126's own insert; not derivable.
- Everything else passed (blacklist clean; applied (a) ✓ — 1(a)/2(a)/4(a) all name HDP + figures; (b) pattern/levels/keys ✓; ratios recomputed ✓ GPM 39.9→41.7, PM 15.0→17.5, ROCE 10.0→13.1; framed estimates ok, e.g. "roughly 9 of the 38 employees", "an estimate based on hosting fees within the cost base", "roughly $20,160"). Fix: delete/replace the churn sentence with a HDP-grounded risk (e.g. labour turnover 14%, uptime 99.2% slippage).
- Note: founder "Priya Raman" also used in P2_SET_107 (AAC) — cross-set naming overlap; flagged for orchestrator. Interest figures $16k→$27k are Appendix 2 values ✓ used correctly.

### P2_SET_127
- Rule: 8 (word floor) and rules 6/9 (unexplained, erroneous figure); locations questions[6].model_answer (4(a)) and questions[4].sub_parts[2].model_answer (3(a)(iii) point 2).
- Quote 1 (rule 8): "Advantage: Built-in quality assurance prevents errors before tickets close instead of catching them afterwards…" = **146 words** (<150 for 8-mark).
- Quote 2 (rules 6/9 + arithmetic): "modelling for example a 4% volume discount to $35.04, which would still leave $8.54 contribution and **46,000 units needed to cover fixed costs**" — $300,000 ÷ $8.54 ≈ **35,100 units**, not 46,000; the 46,000 figure is absent from the insert, not derivable, and arithmetically wrong. (-$26.50 variable cost → $8.54 ✓ so the discount/contribution legs are fine; only the units figure fails.)
- Everything else passed (blacklist clean; applied (a): 2(a)/4(a) applied though 2(a) has no digits — "remote-work communication breakdowns… across three regions" names insert context ✓ acceptable; 1(a)/2(b)/4(a) applied ✓; ratios recomputed ✓ GPM 40.0→42.4, PM 16.0→20.0, ROCE 19.5→24.0; "8.6% SME outsourced IT growth" traced to App3 ✓; "6.9% technology input-cost rise" traced to App3 ✓; framed estimates ok, e.g. "roughly 30 of the 64 employees", "if KMS pays roughly $120,000 a year", "$32,000 for 16 chosen engineers" — proposal quantity, flagged).
- Note: shares "Kestrel" prefix + founder "Daniel Okafor" with P2_SET_106 (Kestrel Precision Engineering / Daniel Okafor) — cross-set overlap; flagged for orchestrator. "1 external senior hire" — proposal quantity, fine.

### P2_SET_128
- Rule: 8 (word floor); locations questions[0] (1(a)), questions[2] (2(a)), questions[6] (4(a)) model_answer.
- Quotes/counts: 1(a) ("An overdraft is flexible — CEP only draws what it needs…") = **144**; 2(a) ("Laissez-faire leadership gives skilled course writers…") = **143**; 4(a) ("Free micro-courses strengthen CEP's reputation…") = **146** — all <150. 1(b)=280 ✓, 2(b)=258 ✓, 3(b)=272 ✓, 4(b)=312 ✓.
- Content otherwise clean (blacklist clean; profitability 3(b) GPM 45.0→46.2 / PM 15.0→20.0 / ROCE 17.9→25.0 recomputed ✓; applied (a): 1(a) ✓, 2(a) ✓ (9%/27/66%), 4(a) names CEP but the "charity partnership → free micro-courses to low-income learners" initiative is invented wholesale — flagged as evaluative-hypothetical (acceptable as an exam "what-if", but note no insert anchor: recommend grounding or explicitly framing it); 3(a) break-even 37,500 = 180,000÷4.80 ✓; $7.90 unit cost ✓; framed estimates ok, e.g. "roughly 8 of 27 employees… near $220,000… about $15,600", "roughly 55% of variable cost… about $0.29 per unit… about $17,500… roughly 6%").

### P2_SET_129
- Rule: 8 (word floor); locations questions[0] (1(a)), questions[2] (2(a)), questions[6] (4(a)), questions[3] (2(b)) model_answer.
- Quotes/counts: 1(a) ("A share issue raises $500,000 without creating fixed monthly repayments…") = **141**; 2(a) ("Democratic leadership gives SOC analysts a voice…") = **142**; 4(a) ("A four-day week attacks the root cause of the 8% absenteeism…") = **142** — all <150. 2(b) ("On-the-job shadowing and mentoring…") = **237** <250. 1(b)=274 ✓, 3(b)=277 ✓, 4(b)=296 ✓.
- Content otherwise clean (blacklist clean — note 3(b) judgement that minimum-wage rise has greatest impact is a defensible, insert-grounded judgement, unlike other sets, fine; ratios recomputed ✓ GPM 50.0→52.4, PM 15.0→17.0, ROCE 17.0→18.8 — "operating profit grew 38.2% on 22.1% revenue growth" ✓ 195/510=38.2%, 750/3,400=22.1% ✓; applied (a) ✓; framed estimates ok, e.g. "roughly 22 of the 88 employees… near $615,000… about $41,200" — checked 6.7%×615,000=$41,205 ✓; "if SGC's… premiums run near $260,000 a year… about $32,500" ✓ derived; "potentially adding $60,000 or more" flagged as estimate, ok; proposal quantities ok).
- Note: 4(a) "four-day week for SOC analysts" — invented proposal, accepted as evaluative hypothetical (no insert anchor) but flagged, same class as 128.

### P2_SET_130
- Rule: 8 (word floor); locations questions[0] (1(a)), questions[2] (2(a)), questions[6] (4(a)) model_answer; plus literal blacklist token in questions[2].model_answer.
- Quotes/counts: 1(a) ("Hire purchase spreads the cost of the workstations and servers…") = **132**; 2(a) ("Democratic leadership gives MAS's 24 members a real voice…") = **133**; 4(a) ("Renewable power and recycled workstations…") = **142** — all <150. 1(b)=283 ✓, 2(b)=252 ✓, 3(b)=280 ✓, 4(b)=304 ✓.
- Mechanical blacklist hit (brief: one hit ⇒ REJECTED, quote): questions[2].model_answer — "Member-led retrospectives expose root causes of store-submission defects — for example **weak regression coverage** or rushed accessibility checks…" — literal token "regression". Context is QA/test-coverage language ("regression coverage" = regression testing), not econometric trend regression (the blacklisted forecasting technique), so it is unlikely to mean an out-of-syllabus theory; still flagged exactly as scanned and must be reworded (e.g. "weak test coverage") to pass a literal token scan.
- Content otherwise clean (profitability 3(b) recomputed ✓ GPM 45.0→46.8, PM 15.0→20.0, ROCE 18.0→23.5; "operating profit rose 74% on 30.6% revenue growth" ✓ 80/108=74.1%, 220/720=30.6% ✓; BE 17,500 = 175,000÷10.00 ✓; unit cost $15.50 ✓; $17.58/$9.08 discount modelling ✓ 18.50×0.95=17.575; batch vs flow production — both whitelisted production types ✓; "If MAS spends about $150,000 a year on hardware… roughly $17,250" ✓ derived; "$1,875 a year" = 0.75%×$250,000 ✓; applied (a) ✓; ratios, levels, keys all correct).

## Cross-set observations for the orchestrator (informational; not reject grounds)
- Founder names reused across sets: "Priya Raman" (107 AAC, 126 HDP), "Daniel Okafor" (106 KPE, 127 KMS); "Kestrel" prefix (106 Kestrel Precision Engineering, 127 Kestrel Managed IT Services). Gatekeeper should check cross-wave initials/scenario-id uniqueness as documented.
- Systemic word-count shortfall: every 8-mark (a) model answer in 128/129/130 and several 12-mark answers sit just under the floors (131–149 / 224–249). Generators should target ~165/260+ words with margin.
- Recurring house-style device: modelling counts woven into evaluative answers ("If the lowest-paid N operatives…", "at roughly $X of materials…"). Acceptable when explicitly framed; unframed instances flagged above (107 "25 welders" ×2; 108 "50 floor members"; 127 "46,000 units" — the last wrong anyway). Recommend all such quantities carry "assume/if/roughly" markers.
