# SYL-AUD-11 audit log — Wave 02

| Set | Verdict |
|-----|---------|
| P2_SET_151 | REJECTED — 4(b): invented component decomposition of NGF's $14.50 variable cost into "$9.30 goods"; unstated 2,080-hour year / headcount of minimum-wage staff for the 6.2% wage rise; invented "$0.20 per parcel / $11,000" fuel figures |
| P2_SET_152 | REJECTED — 4(b): invented figures — "($13.00 × 2,080 hours × 5.6%)", totalling about $76,000 a year — unstated 2,080-hour year + pay-equals-minimum assumption |
| P2_SET_153 | REJECTED — 4(b): invented component decomposition of TRO's $27.50 variable cost into "roughly $16.50"; unstated 2,080-hour year for the wage rise; invented diesel figures ("$0.20–$0.30 per shipment across 9,400 weekly cartons") |
| P2_SET_154 | REJECTED — Blacklist (Rule 1): "discounting" and "value chain" |
| P2_SET_155 | REJECTED — 4(b): invented figures — "(0.77 × 2,080 hours)" headcount/hours for 28 staff; invented "roughly 60% of cost of sales, about $726,000" decomposition |
| P2_SET_171 | REJECTED — 4(b): invented figures — "On 26 eligible staff averaging 1,950 hours, the current wage cost is about 26 × $12.60 × 1,950 = $639,000"; invented "roughly 60% of cost of sales, about $726,000" decomposition |
| P2_SET_172 | REJECTED — 4(b): invented assumptions — "about 13,500 one-hour lessons a year", "$0.80 per lesson-hour" (→ "$10,800 a year"); invented fuel figures ("estimated 240,000 miles", "about $50,000 a year") |
| P2_SET_173 | REJECTED — 4(b): invented figures — "20 eligible staff averaging 1,950 hours, the current wage bill is about 20 × $12.80 × 1,950 = $499,000"; invented "say $18,000 a year" rent |
| P2_SET_174 | REJECTED — 4(b): invented figures — "15 eligible staff averaging 1,950 hours, the current wage bill is about 15 × $12.55 × 1,950 = $367,000"; invented "say $400,000 of own-choice sales" |
| P2_SET_175 | REJECTED — 4(b): invented figures — "24 eligible staff averaging 1,900 hours, the current wage bill is about 24 × $12.40 × 1,900 = $565,000"; invented "the imported share is roughly $370,000; a 13.8% rise adds about $51,000 a year" |

## Error log (rejected sets only)

### P2_SET_151
- Rule: 4(b) — invented component decomposition of variable cost (Rule 5; 2026-11-19 ruling: invented/unstated figures ⇒ REJECT); quote: "The goods portion of NGF's $14.50 variable cost is roughly $9.30, so a 5.4% rise adds about $0.50 on each of the 55,000 units — around $27,600 a year."; location: questions[7].model_answer (4(b))
- Rule: 4(b) — unstated 2,080-hour year and headcount of minimum-wage staff / pay-equals-minimum assumption; quote: "With a workforce of 60, mainly warehouse and store staff, the wage bill rises by roughly $1,730 per full-time employee a year ($13.42 × 2,080 hours × 6.2%), totalling about $104,000 across the business."; location: questions[7].model_answer (4(b))
- Rule: 4(b) — invented figures; quote: "The 8.0% fuel surcharge adds roughly $0.20 per parcel, or about $11,000 a year."; location: questions[7].model_answer (4(b))

### P2_SET_152
- Rule: 4(b) — invented figures; quote: "For PRB's 48 employees, a 5.6% rise adds roughly $1,580 per worker a year ($13.00 × 2,080 hours × 5.6%), totalling about $76,000 a year."; location: questions[7].model_answer (4(b))

### P2_SET_153
- Rule: 4(b) — invented component decomposition of variable cost; quote: "The goods portion of TRO's $27.50 variable cost is roughly $16.50, so a 9.6% rise adds about $1.58 per unit; at 40,000 units a year that is around $63,000, cutting contribution per unit from $17.50 toward $15.90..."; location: questions[7].model_answer (4(b))
- Rule: 4(b) — unstated 2,080-hour year + pay-equals-minimum assumption for the wage rise; quote: "With 85 employees, the smallest rise in a decade adds only about $520 per full-time employee a year (0.25 × 2,080 hours), roughly $44,200 across the workforce."; location: questions[7].model_answer (4(b))
- Rule: 4(b) — invented figures; quote: "The 11.0% diesel rise adds perhaps $0.20–$0.30 per shipment across 9,400 weekly cartons — material but much smaller than the textile increase."; location: questions[7].model_answer (4(b))

### P2_SET_154
- Rule: Blacklist (Rule 1) — term "discounting"; quote: "heavier discounting" (insert, case_study_insert.appendix_3_external_environment, "with value retailers reporting falling footfall and heavier discounting."); location: case_study_insert.appendix_3_external_environment
- Rule: Blacklist (Rule 1) — term "discounting"; quote: "creating huge waste for a business already discounting 24% of its units." (insert-vs-answer gap: insert says "24% of units were sold at discounted mark-down prices"); location: questions[1].model_answer (1(b))
- Rule: Blacklist (Rule 1) — term "value chain"; quote: "give FLF instant national stature against larger value chains."; location: questions[1].model_answer (1(b))
- Rule: Blacklist (Rule 1) — term "discounting"; quote: "Weak demand means FLF cannot simply raise prices to recover fabric costs — it must keep discounting to clear, eroding contribution further."; location: questions[7].model_answer (4(b))

### P2_SET_155
- Rule: 4(b) — invented figures / unstated assumptions; quote: "For 28 mainly retail and workshop staff, the rise adds about $830 per full-time employee a year (0.77 × 2,080 hours), totalling roughly $23,200"; location: questions[7].model_answer (4(b))
- Rule: 4(b) — invented component decomposition (LSP has no cost-of-sales figure in the insert; "60%" split invented); quote: "Consumables and retail skincare make up roughly 60% of cost of sales, about $726,000 in 2025."; location: questions[7].model_answer (4(b))

### P2_SET_171
- Rule: 4(b) — invented figures / headcount, hours and pay-equals-minimum assumption; quote: "On 26 eligible staff averaging 1,950 hours, the current wage cost is about 26 × $12.60 × 1,950 = $639,000; a 5.8% rise adds roughly $37,000 a year - over twelve times the interest impact - arriving just as the second suite adds headcount and certification duties."; location: questions[7].model_answer (4(b))
- Rule: 4(b) — invented component decomposition of cost of sales; quote: "Consumables and retail skincare make up roughly 60% of cost of sales, about $726,000 in 2025. An 11.5% rise adds approximately $83,500 a year."; location: questions[7].model_answer (4(b))

### P2_SET_172
- Rule: 4(b) — invented assumptions; quote: "Instructors deliver about 13,500 one-hour lessons a year. The 6.5% rise adds about $0.80 per lesson-hour on the pre-rise rate of $12.30, or roughly $10,800 a year across 13,500 lesson-hours, plus knock-on pay pressure for office staff."; location: questions[7].model_answer (4(b))
- Rule: 4(b) — invented fuel figures; quote: "Teaching cars cover an estimated 240,000 miles a year across eight schools. If fuel spend is about $50,000 a year, a 13.5% rise adds roughly $6,750 annually"; location: questions[7].model_answer (4(b))

### P2_SET_173
- Rule: 4(b) — invented figures / headcount, hours, pay-equals-minimum; quote: "BHT employs 52 people and its support and delivery staff are paid around the minimum. On 20 eligible staff averaging 1,950 hours, the current wage bill is about 20 × $12.80 × 1,950 = $499,000; a 6.0% rise adds approximately $30,000 a year"; location: questions[7].model_answer (4(b))
- Rule: 4(b) — invented figures; quote: "Centre rents hurt fixed-location competitors far more than BHT's home-and-online model, where BHT carries only a small admin lease — say $18,000 a year, adding roughly $1,566 if renewed."; location: questions[7].model_answer (4(b))

### P2_SET_174
- Rule: 4(b) — invented figures / headcount, hours, pay-equals-minimum; quote: "HCP's counter, delivery and admin teams include many near-minimum-wage roles. On 15 eligible staff averaging 1,950 hours, the current wage bill is about 15 × $12.55 × 1,950 = $367,000; a 6.4% rise adds roughly $23,500 a year"; location: questions[7].model_answer (4(b))
- Rule: 4(b) — invented figures; quote: "say $400,000 of own-choice sales — a 10.5% rise adds roughly $42,000 a year"; location: questions[7].model_answer (4(b))

### P2_SET_175
- Rule: 4(b) — invented figures / headcount, hours, pay-equals-minimum; quote: "CVO's retail, reception and frame-styling teams include many near-minimum-wage roles. On 24 eligible staff averaging 1,900 hours, the current wage bill is about 24 × $12.40 × 1,900 = $565,000; a 6.1% rise adds roughly $34,500 a year"; location: questions[7].model_answer (4(b))
- Rule: 4(b) — invented component decomposition of cost of sales; quote: "Imported lens material inflation (13.8%): Imported lenses and frames are the largest cost of sales component — on a $1,053,000 cost of sales base, the imported share is roughly $370,000; a 13.8% rise adds about $51,000 a year."; location: questions[7].model_answer (4(b))
