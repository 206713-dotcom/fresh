# SYL-AUD-12 audit log — Wave 02
| Set | Verdict |
|-----|---------|
| P2_SET_156 | REJECTED — 4(b): invented figures (near-minimum headcount 40/64; implied 2,000h = $56,000; invented variable-cost decomposition "ingredients around half of $46") |
| P2_SET_157 | REJECTED — 4(b): invented figures (near-minimum headcount 70/120; implied 2,000h = $108,500; invented material share $1,200,000) |
| P2_SET_158 | REJECTED — 4(b): invented figures (near-minimum headcount 12/28; implied 2,000h = $13,900; invented unit-cost decomposition "a third of $18") |
| P2_SET_159 | REJECTED — 4(b): invented figures (near-minimum headcount 30/52; implied 2,000h = $42,000; invented decomposition "half of $9") |
| P2_SET_160 | REJECTED — 4(b): invented figures (near-minimum headcount 12/23; implied 2,000h = $15,800) |
| P2_SET_176 | REJECTED — 4(b): invented figures (near-minimum headcount ~30/46; implied 2,000h = $39,900; invented decomposition "45% of $5.10") |
| P2_SET_177 | REJECTED — 4(b): invented figures ($23,050 assumed average wage; invented fuel decomposition "30% of $8.40") |
| P2_SET_178 | REJECTED — 4(b): invented figures ($22,900 assumed average annual wage; invented decomposition "55% of $9.00") |
| P2_SET_179 | REJECTED — 4(b): invented figures (invented near-minimum headcount 60/120; invented steel-and-scrap share $17) |
| P2_SET_180 | REJECTED — 4(b): invented figures (overdraft $40,000; wage bill $480,000) |

## Error log (rejected sets only)
### P2_SET_156
- Rule: invented/unstated figures in 4(b) — headcount of minimum-wage staff, implied 2,000h years, component decomposition of variable cost; location: questions[7].model_answer
- Quote: "If, for illustration, 40 of the 64 staff are near the minimum, the extra $0.70 per hour costs about $56,000 a year — a recurring hit equal to roughly a quarter of fixed costs, landing exactly when the pavilion opens and new staff are hired."
- Quote: "If, for illustration, ingredients are around half the unit cost (about $23), a 9.6% rise adds about $2.20 per cover; across 15,000 units that is roughly $33,000 a year."

### P2_SET_157
- Rule: invented/unstated figures in 4(b) — headcount of minimum-wage staff, implied 2,000h years, invented material share; location: questions[7].model_answer
- Quote: "If, for illustration, 70 staff are near the minimum, that is about $108,500 a year — recurring, unavoidable and landing exactly as 30 new apartments add service demand; housekeeping turnover at 22% makes wage dissatisfaction especially corrosive."
- Quote: "at an illustrative 50% material share ($1,200,000), an 8.3% rise adds about $100,000 once — painful but one-off, and partly hedged if SBA purchased materials early or renegotiated supplier contracts before winter."

### P2_SET_158
- Rule: invented/unstated figures in 4(b) — headcount of minimum-wage staff, implied 2,000h years, invented unit-cost decomposition; location: questions[7].model_answer
- Quote: "If, for illustration, 12 of the 28 staff are near the minimum, the extra $0.58 per hour costs about $13,900 a year — absorbable by the flat democratic team through rotas and the off-peak turnover savings of 19%."
- Quote: "If, for illustration, transport and fuel represent about a third of the unit cost ($6), a 10.2% rise adds about $0.61 per unit — roughly $8,500 a year — recurring, unavoidable and likely to drift upward with safety-equipment inflation (+7.4%)."

### P2_SET_159
- Rule: invented/unstated figures in 4(b) — headcount of minimum-wage staff, implied 2,000h years, invented unit-cost decomposition; location: questions[7].model_answer
- Quote: "If, for illustration, 30 of the 52 staff are near it, the extra $0.70 per hour costs roughly $42,000 a year — a meaningful recurring bite out of the $6 contribution per unit."
- Quote: "If, for illustration, half the unit cost is produce ($4.50), an 11.3% rise adds about $0.51 per unit — roughly $23,000 a year at 45,000 units."

### P2_SET_160
- Rule: invented/unstated figures in 4(b) — headcount of minimum-wage staff, implied 2,000h years; location: questions[7].model_answer
- Quote: "If, for illustration, 12 of the 23 staff earn near the minimum, the extra $0.66 per hour costs about $15,800 a year."

### P2_SET_176
- Rule: invented/unstated figures in 4(b) — headcount of minimum-wage staff, implied 2,000h years, invented variable-cost decomposition; location: questions[7].model_answer
- Quote: "If around 30 of GSQ's 46 staff earn near the current minimum, the extra $0.55 per hour is about $39,900 a year (30 × $11.47 × 2,000 hours × 5.5% ≈ $37,850, plus supervisory knock-ons)"
- Quote: "Even if they represent about 45% of that cost (≈ $2.30), an 8.6% rise adds about $0.20 per unit, or roughly $14,900 a year on 75,000 units, compounding with the 6.3% defect rate that already forces expensive reprocessing."

### P2_SET_177
- Rule: invented/unstated figures in 4(b) — invented average wage ($23,050), invented fuel decomposition; location: questions[7].model_answer
- Quote: "a 1.5% rise adds roughly $11,400 a year if all staff earn near the current rate (33 × $23,050 × 1.5% ≈ $11,400)"
- Quote: "If fuel is roughly 30% of the $8.40 variable cost (≈ $2.52), a 14.9% rise adds about $0.38 per unit — roughly $15,100 a year on 40,000 units, before any reburning multiplier on faulty batches."

### P2_SET_178
- Rule: invented/unstated figures in 4(b) — invented average annual wage ($22,900), invented decomposition; location: questions[7].model_answer
- Quote: "a 3.0% rise adds roughly $19,900 a year (29 × $22,900 average annual wage × 3.0% ≈ $19,900)"
- Quote: "If cork bark, resin and freight represent about 55% of variable cost (≈ $4.95), a 10.6% rise adds about $0.52 per unit — roughly $23,600 a year on 45,000 units, compounding with the 5.8% contamination rate that turns premium bark into waste."

### P2_SET_179
- Rule: invented/unstated figures in 4(b) — invented near-minimum headcount, invented steel share; location: questions[7].model_answer
- Quote: "If 60 staff earn near the current minimum, roughly $82,000 a year before knock-ons"
- Quote: "A 10.2% rise on even a $17 steel-and-scrap share adds about $1.73 per unit; at 120,000 units that is roughly $208,000 a year before any hedging, equivalent to over 20% of operating profit."

### P2_SET_180
- Rule: invented/unstated figures in 4(b) — invented overdraft, invented wage bill; location: questions[7].model_answer
- Quote: "On $40,000 of average overdraft, the rise adds about $200 a year — negligible beside $160,000 fixed costs and $80,000 interest payable."
- Quote: "With 21 staff, mainly cutting-bay and welding crew, a 4.0% rise costs roughly $19,000 a year on a $480,000 wage bill, plus knock-ons for experienced hands."
