# SYL-AUD-11 audit log — Wave 01

Scope: GEN-03 (P2_SET_111–115) and GEN-07 (P2_SET_131–135). Protocol: adversarial line-by-line per SYL-AUD brief; syllabus_rules.md (2027–2029 whitelist/blacklist + Paper 2 rules) used as authority.

Readiness gate: folder `paper2\sets\wave_01` was empty at start. Polled every 45 s (20 max). Files materialised incrementally (131 first at check 3; all 10 present and JSON-parseable at check 16, ~11 min after start). All 10 audited; none NOT_READY.

Global observations (apply to all 10 sets):
- No pure-definition questions found; no blacklisted ratio/costing/strategy-framework terms found other than the two spotted below; part (a) questions are applied and name the business; 1(b) uses 3 options / 2(b) 2 options / 4(b) names three external changes with figures and judges the greatest impact; level-response mark schemes present for all (b) parts; `knowledge_max_2`/`application_analysis_max_6` for 8-mark (a) parts; `working_marks` for 3(a); ratio arithmetic in 3(b) is internally correct in all 10 sets (GPM/PM/ROCE for 131–135; current/acid test for 111–115); break-even arithmetic correct everywhere.
- However, every set presents fabricated quantitative claims in the 4(b) model answer (invented wage bases / materials-cost shares / affected-staff counts that appear nowhere in the insert and are not computed from it), and several sets repeat this in 1(b)/3(b). Syllabus rule 9 (every figure must originate in the insert or be computed) and audit check 6 (any fact absent from the insert and not derivable ⇒ REJECT) therefore fail for every set. Where only isolated flaws exist they are quoted below; "if in doubt, REJECT" applies throughout.
- Word counts (model_answer, whitespace-delimited) are reported per set; several 8-mark (a) answers fall below the required 150 words, and some 12-mark (b) answers below 250 words. Question 3(a) top-level `model_answer` is a ~50-word summary in all sets, but the `sub_parts` carry the substance (197–240 words total); not counted as a rejection ground.

| Set | Verdict |
|-----|---------|
| P2_SET_111 | REJECTED — fabricated figures in 4(b) ("$23,000 average salary", "$14 of the $24"), invented "event-styling contracts" (×3) and false claim "receivables grew faster than cash" in 3(b); invented demographic "25-44 buyers" in 1(b); 8-mark answers under 150 words |
| P2_SET_112 | REJECTED — fabricated figures in 4(b) ("average wage bill of around $1.6 million (about $26,000 per worker)", "about 70% of it ($6.30)"); 8-mark answers under 150 words; 12-mark 2(b) under 250 words |
| P2_SET_113 | REJECTED — invented demographic ("members skew toward families and older buyers") in 1(b); invented receivables composition ("local farm invoices and cooperative wholesale accounts") in 3(b); fabricated input-cost share ("around $1.85–$2.00 of it") in 4(b); 8-mark answers under 150 words; stray non-English token "abonnement" in 4(a) |
| P2_SET_114 | REJECTED — blacklist-adjacent discounting terminology in 4(b) ("the discount rate HHW and its investors apply to the three new stores' future cash flows"); fabricated "wage bill of roughly $4.4 million" and "roughly $9.75 of it" in 4(b); invented demographic skew in 1(b); 8-mark answers under 150 words |
| P2_SET_115 | REJECTED — working-capital-cycle terminology in 3(b) ("before its cash conversion cycle is proven"); invented "wholesale partners" in 3(b); fabricated "hourly wage base of roughly $260,000" and "roughly $4.60 of it" in 4(b); 8-mark 2(a) under 150 words |
| P2_SET_131 | REJECTED — invented causal claim in 3(b) ("reflecting the ten-year bank loan funding the Millbrook branch" — loan is only planned); fabricated "perhaps 45 staff" and "roughly $16.00 of the $28.00" in 4(b); invented demographic in 1(b); 4(a) under 150 words; 2(b) under 250 words |
| P2_SET_132 | REJECTED — question 2(b) premise invents "36 practitioners" (not in insert; insert's figure is 33 fixed-term staff); invented causal claim in 3(b) ("reflecting the ten-year bank loan for the Riverside nursery" — loan only planned); fabricated "perhaps 90 staff" and "roughly $4.50 a unit" in 4(b); 2(a) under 150 words; 2(b) under 250 words |
| P2_SET_133 | REJECTED — invented "working-capital facilities and leases", "perhaps 25 people" and "roughly $7.50 of the $12.00" in 4(b); EPS terminology beyond Paper 2 whitelist in 1(a); 1(a)/2(a)/4(a) under 150 words; 2(b) under 250 words |
| P2_SET_134 | REJECTED — invented causal claim in 3(b) ("reflecting the ten-year bank loan for the Eastvale hub" — loan only planned); fabricated "perhaps 120 of MCC's 210 carers" and "if they account for roughly $2.00 a unit" in 4(b); invented external mechanisms ("discharge planners", "commissioner … contracts") in 1(b)/4(a) |
| P2_SET_135 | REJECTED — invented causal claim in 3(b) ("reflecting the hire-purchase agreement on teaching technology"); fabricated "tutor agency cover for roughly $180,000 a year of sessions plus software licensing of around $35,000 a year" (>50% of the whole $350,000 revenue) and "perhaps 8 support staff" in 4(b) |

## Error log (rejected sets only)

### P2_SET_111
- Rule 6/9 (hallucinated figures, not in insert, not derivable): questions[7].model_answer (4(b)) — "At an average of around $23,000 a year, the wage bill is about $644,000; a 5.9% rise adds roughly $38,000 a year" ($23,000 average salary appears nowhere in the insert); "materials representing roughly $14 of that $24, a 9.8% rise adds close to $1.37 a unit, or about $26,000 a year on 19,000 units".
- Rule 6 (invented fact, repeated ×3): questions[5].model_answer (3(b)) — "trade receivables ($90,000 to $120,000, reflecting event-styling contracts)"; "watch event-styling payment terms and avoid over-stocking winter ranges"; "VF should maintain tighter credit control on event-styling contracts". No event-styling business exists in the insert.
- Rule 6 (arithmetic contradiction with insert figures): questions[5].model_answer (3(b)) — "receivables grew faster than cash" is false: receivables $90k→$120k = +33.3%; cash $100k→$150k = +50.0%.
- Rule 6 (invented demographic): questions[1].model_answer (1(b)) — "readership skews away from VF's core 25-44 buyers" (no age range in insert); questions[6].model_answer (4(a)) — "to younger buyers drawn by sustainable-fabric messaging" (likewise no age data in insert).
- Rule 8 (word count): 2(a) model_answer = 139 words; 4(a) = 141 words (< 150 required for 8-mark). 3(a) top-level summary = 50 words (sub_parts substantive).
- Noted, not primary: 3(b) ratio workings and break-even arithmetic are correct; (b) parts all address required options and end with justified recommendation; level schemes present.

### P2_SET_112
- Rule 6/9: questions[7].model_answer (4(b)) — "An average wage bill of around $1.6 million (about $26,000 per worker) rises by roughly $78,000 a year" (no wage data in insert; $1.6 million is projected onto 62 staff without basis); "Assuming about 70% of it ($6.30) is exposed to the 10.6% rise, that adds roughly $0.67 per pair, or about $37,000 a year on 55,000 units" (materials share invented; conditional phrasing does not make it insert-derived).
- Rule 6: questions[5].model_answer (3(b)) — "$380,000 of trade receivables from sellers on settlement terms" (receivables counterparty/terms never stated in insert).
- Rule 8: 1(a) = 129 words; 2(a) = 126 words; 4(a) = 142 words (< 150); 2(b) = 238 words (< 250 for 12-mark).
- Noted: main-stem "returns abuse has reached 6.8% of orders" vs appendix_1 "Returns were 11% of orders" is a subset relationship, not treated as contradiction; ratio and break-even workings correct; both 12-mark option sets correctly discussed with justified decisions.

### P2_SET_113
- Rule 6 (invented demographic): questions[1].model_answer (1(b)) — "GBO's members skew toward families and older buyers who may not follow bloggers daily" (insert contains no age/family profile).
- Rule 6 (invented composition): questions[5].model_answer (3(b)) — "trade receivables from $60,000 to $75,000 (local farm invoices and cooperative wholesale accounts)" (receivables composition not in insert; no wholesale accounts described).
- Rule 6/9: questions[7].model_answer (4(b)) — "The annual wage bill is therefore modest (roughly $5,000–$10,000 extra a year, heavier in December)" (unsourced); "around $1.85–$2.00 of it [the $2.20 variable cost]. A 11.2% rise adds roughly $0.22 per unit — about $17,000 a year on 78,000 units" (input-cost share invented).
- Rule 8: 1(a) = 136 words; 2(a) = 137 words; 4(a) = 144 words (< 150).
- Quality/standard English: questions[6].model_answer (4(a)) — "members pay abonnement in advance of delivery" (French token in an English-language model answer).
- Noted: 3(b) ratios (1.76/1.96/0.95/1.21) and break-even (60,000 units; margin of safety 18,000) correct; cooperative/democratic leadership content otherwise applied.

### P2_SET_114
- Rule 1 (blacklisted terminology): questions[7].model_answer (4(b)) — "slightly raises the discount rate HHW and its investors apply to the three new stores' future cash flows" — discounted-cash-flow/discounting vocabulary applied to investment appraisal; out of Paper 2 syllabus (blacklist: "discounting").
- Rule 6/9: questions[7].model_answer (4(b)) — "A wage bill of roughly $4.4 million a year rises by about $269,000 after the 6.1% increase" (no wage-bill figure anywhere in insert; $269,000 = 6.1% × $4.4m is computed from an invented base); "roughly $9.75 of it [the $13 variable cost]. A 9.6% rise adds close to $0.94 a unit, or about $101,000 a year on 108,000 units" (materials share invented). "5,850 extra baskets a year (at $46)" is internally consistent but riding on the invented wage bill.
- Rule 6 (invented demographic): questions[1].model_answer (1(b)) — "skew toward younger audiences under-represents HHW's core family furniture buyers".
- Rule 6 (tense/structure): questions[2].question_text (2(a)) — "when managing 210 staff across fifteen stores" — fifteen stores do not exist yet (twelve trading; three merely planned, financed by the proposed share issue/loan). Also "financed stock timber, steel and textiles ahead of opening" (3(b)) presents speculation as fact.
- Rule 8: 1(a) = 141 words; 2(a) = 129 words (< 150).
- Noted: 3(b) ratios (1.77/1.91/0.95/1.07) correct; 4(a) is applied; (b) parts satisfy option-coverage and justified-decision requirements.

### P2_SET_115
- Rule 1 (out-of-syllabus terminology): questions[5].model_answer (3(b)) — "valuable while the store is generating its first customers and before its cash conversion cycle is proven." — working-capital/cash-conversion-cycle concept (blacklist: working capital cycle / cash operating cycle), used to appraise the 2025 position.
- Rule 6: questions[5].model_answer (3(b)) — "as some influencer and wholesale partners pay on terms" (no wholesale partners exist in the insert; VB is a pure-player online brand).
- Rule 6/9: questions[7].model_answer (4(b)) — "On an hourly wage base of roughly $260,000 a year, the 6.3% rise adds about $16,400 a year" (no hourly wage base in insert); "roughly $4.60 of it is spent on raw ingredients and jars. A 10.8% rise adds close to $0.50 per unit, or about $22,000 a year on 44,000 units" (materials share invented).
- Rule 8: 2(a) = 143 words (< 150).
- Quality: questions[0].model_answer (1(a)) — duplicated phrase "boosting credibility with landlords and landlords' lenders", echoed later as "letting agents and their lenders"; "strengthens the balance sheet with new equity" is vacuous (retained profit is also equity).
- Noted: 3(b) ratios (1.58/1.93/0.75/1.02) correct; 1(a)/1(b)/2(b) applied and grounded (54% aged 18-34, 72% influencer discovery, 13% returns abuse).

### P2_SET_131
- Rule 6 (invented causation): questions[5].model_answer (3(b)) — "Interest payable rose from $35,000 to $44,000, reflecting the ten-year bank loan funding the Millbrook branch." — the Millbrook branch and its loan are only planned ("It plans to invest $1,200,000 … financed by a $700,000 ten-year bank loan"); the insert does not state the loan was drawn, nor that it caused the rise.
- Rule 6/9: questions[7].model_answer (4(b)) — "perhaps 45 staff are affected. On a $13.47 hourly base for roughly 2,000 hours a year, the increase is about $1,860 per affected worker, or roughly $84,000 a year across 45 staff" (staff count and hours unsourced); "Materials and laboratory fees account for roughly $16.00 of the $28.00 variable cost; a 9.6% rise adds about $1.54 a unit. At 96,000 units a year that is roughly $147,000 a year" (materials share invented).
- Rule 6 (invented demographic): questions[1].model_answer (1(b)) — "useful for reaching older patients with private dental plans who do not use social media".
- Rule 8: 4(a) = 146 words (< 150); 2(b) = 236 words (< 250 for 12-mark).
- Noted: appendix_2 is a P&L/capital-employed extract and the GPM/PM/ROCE calculation demand matches the paper design; figures check out (40→45%, 15→20%, 15→18%); ROCE 18.0% correctly derived; cost-of-sales share 60.0%→55.0% verified; no blacklist hits.

### P2_SET_132
- Rule 6/9 (invented figure in the question itself): questions[3].question_text (2(b)) — "BNG must train 36 practitioners on the new forest-school curriculum wanted by Riverside parents." — 36 appears nowhere in the insert; insert's comparable figure is "33 of 132 staff are on fixed-term contracts". Computed consequence quoted: "36 staff at $29,520 in total" ($820 × 36).
- Rule 6 (invented causation): questions[5].model_answer (3(b)) — "Interest payable rose from $22,000 to $30,000, reflecting the ten-year bank loan for the Riverside nursery." — planned loan; causation absent from insert.
- Rule 6/9: questions[7].model_answer (4(b)) — "perhaps 90 staff are affected. On a $13.01 hourly base for roughly 2,000 hours a year, the increase is about $1,725 per affected worker, or about $155,000 a year across 90 staff" (staff count/hours unsourced); "if they account for roughly $4.50 a unit, a 10.8% rise adds about $0.49 per unit. At 90,000 units a year that is about $43,700" (materials share invented).
- Rule 8: 2(a) = 143 words (< 150); 2(b) = 213 words (< 250 for 12-mark).
- Noted: GPM/PM/ROCE arithmetic correct (35→40%, 15→20%, 12.5→15.0%); $29,520 and 19,600-unit margin of safety internally consistent; (b) option coverage correct.

### P2_SET_133
- Rule 6/9: questions[7].model_answer (4(b)) — "lifts costs on RVH's working-capital facilities and leases, though the $2,400,000 expansion is financed by a $1,500,000 share issue and $900,000 retained profit rather than new debt" (no working-capital facilities or leases described in insert); "only entry-level kennel, cleaning and junior reception staff — perhaps 25 people — are affected. On $13.26 an hour for about 2,000 hours a year, the rise is roughly $1,720 per affected worker, about $43,000 a year" (staff count/hours unsourced); "Pharmaceuticals and pet food account for roughly $7.50 of the $12.00 variable cost per unit; an 11.2% rise adds about $0.84 per unit. At 80,000 units a year that is roughly $67,000 a year" (materials share invented).
- Whitelist-plausibility flag: questions[0].model_answer (1(a)) — "watching earnings per share" — EPS is not in the Unit 1–4 Paper 2 whitelist and is plc-corporate-finance territory; out of scope for IGCSE Paper 2 even for a listed company.
- Rule 8: 1(a) = 149 words; 2(a) = 143 words; 4(a) = 144 words (< 150); 2(b) = 223 words (< 250 for 12-mark).
- Noted: GPM/PM/ROCE arithmetic correct (40→45%, 15→20%, 12.5→16.0%); interest payable stated without false attribution; break-even (72,000 units; margin of safety 8,000) correct.

### P2_SET_134
- Rule 6 (invented causation): questions[5].model_answer (3(b)) — "Interest payable rose from $20,000 to $28,000, reflecting the ten-year bank loan for the Eastvale hub." — planned loan; causation absent from insert.
- Rule 6/9: questions[7].model_answer (4(b)) — "perhaps 120 of MCC's 210 carers cluster near the minimum wage. On a $13.31 hourly base for roughly 2,000 hours a year, the increase is about $2,020 per affected worker, or roughly $242,000 a year across 120 carers — almost matching 2025 operating profit of $306,000" (staff count/hours unsourced); "if they account for roughly $2.00 a unit, a 9.3% rise adds about $0.19 per unit. At 120,000 units a year that is about $22,400" (materials share invented).
- Rule 6 (invented external mechanisms): questions[1].model_answer (1(b)) — "referral partners such as discharge planners"; questions[6].model_answer (4(a)) — "commissioner confidence in awarding Eastvale contracts" / "future commissioner contracts" / question_text (2(b) context) — no care commissioners or discharge-planner partnerships exist in the insert.
- Rule 8: no failures (2(b) = 265; all 8-mark parts ≥ 155).
- Noted: GPM/PM/ROCE arithmetic correct (35→40%, 12→15%, 14.4→17.0%); "22 years of local trust since 2004" is insert-derived; break-even (90,000 units) correct.

### P2_SET_135
- Rule 6 (invented causation): questions[5].model_answer (3(b)) — "Interest payable rose from $9,000 to $13,000, reflecting the hire-purchase agreement on teaching technology." — the $120,000 hire purchase is part of the planned Northgate financing ("plans to invest $380,000 … financed by a $120,000 hire-purchase agreement"); causation absent from insert.
- Rule 6/9 (fabricated bases, internally implausible): questions[7].model_answer (4(b)) — "BTP relies on tutor agency cover for roughly $180,000 a year of sessions plus software licensing of around $35,000 a year. An 8.8% rise adds about $15,800 on agency cover and roughly $3,100 on licensing — about $18,900 a year" ($180k ≈ 51% of the entire $350,000 revenue; both figures invented); "perhaps 8 support staff (reception, admin, facilities) are affected. On $13.42 an hour for about 2,000 hours a year, the increase is about $1,850 per affected worker, or roughly $14,800 a year" (staff count/hours unsourced).
- Rule 8: no failures (2(b) = 261; all parts within tolerance, 4(a) = 152).
- Noted: GPM/PM/ROCE arithmetic correct (55→58%, 15→18%, 18→21%); "25,000 tuition units at $14.00" exactly reconciles to $350,000 revenue (genuine internal check); break-even (12,000 units; margin of safety 13,000) correct; hire-purchase terminology itself is syllabus-permitted.

Stimulus-auditability summary (check 9): in ALL 10 sets, every headline ratio (GPM/PM/ROCE or current/acid test) is computed correctly from Appendix 2 and every headline worked example uses insert figures. Unexplained/fabricated figures are limited to the 4(b) estimation chains quoted above, plus the isolated items called out per set; none of them is licensed by the insert, and none is derivable from it (the inserts carry no wage-bill, hourly-hours, materials-share or staff-count breakdowns).

Overall: 10 REJECTED, 0 APPROVED, 0 NOT_READY. Per the brief, no verdict was softened; rejecting sets that fail "every figure originates in the insert or is computed from it" is the binding rule, not discretion.
