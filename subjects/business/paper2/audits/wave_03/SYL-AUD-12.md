# SYL-AUD-12 audit log — Wave 03
| Set | Verdict |
|-----|---------|
| P2_SET_196 | REJECTED — 4(b): invented figure "roughly $26 per guest-night" (component decomposition of the $48 variable cost; not in the insert) |
| P2_SET_197 | REJECTED — 4(b): invented "1,200 paid hours per staff member a year"; invented "$6 of materials" split of the $9 variable cost |
| P2_SET_198 | REJECTED — 4(b): invented "roughly 45 kitchen porters and cleansers", "each working about 1,800 hours a year", "$24 per room-night equivalent" |
| P2_SET_199 | REJECTED — 4(b): invented "Roughly 40 staff at or near minimum wage", "each working about 1,800 hours a year", "roughly $15,000–$18,000/year" |
| P2_SET_200 | REJECTED — 4(b): invented "each working about 1,100 seasonal hours a year"; "roughly $7,800" |
| P2_SET_216 | REJECTED — 4(b): invented "around 40 production staff" (insert: workforce of 85); invented "assume roughly 70% ($5.25) is materials" split of the $7.50 variable cost |
| P2_SET_217 | REJECTED — 4(b): component decomposition of the $10.50 variable cost ("around 40% of the $10.50 variable cost ($4.20)") |
| P2_SET_218 | REJECTED — 4(b): invented figure "$44,000 a year" (inconsistent with $310,000 annual interest at 0.75% ≈ $2,325) |
| P2_SET_219 | REJECTED — 4(b): component decomposition of the $128 variable cost ("Timber is roughly 70% of the $128 variable cost (about $90)"; no insert basis) |
| P2_SET_220 | REJECTED — 4(b): invented "each working about 1,100 seasonal hours a year"; "roughly $7,800" |

## Error log (rejected sets only)
### P2_SET_196
- Rule: stim — invented figure (component decomposition of variable cost, excluded from syllabus-blacklist list); quote: "roughly $26 per guest-night"; location: questions[7].model_answer

### P2_SET_197
- Rule: stim — invented figure/assumption; quote: "At roughly 1,200 paid hours per staff member a year, the 5.9% uplift adds roughly $17,100 a year across the team" and "$6 of materials" of the $9 variable cost; location: questions[7].model_answer

### P2_SET_198
- Rule: stim — invented figures/assumptions; quote: "Roughly 45 kitchen porters and cleansers at or near minimum wage, each working about 1,800 hours a year" and "$24 per room-night equivalent"; location: questions[7].model_answer

### P2_SET_199
- Rule: stim — invented figures/assumptions; quote: "Roughly 40 staff at or near minimum wage, each working about 1,800 hours a year" and energy "roughly $15,000 to $18,000 a year"; location: questions[7].model_answer

### P2_SET_200
- Rule: stim — invented figures/assumptions; quote: "Roughly 10 minimum-wage staff, each working about 1,100 seasonal hours a year" and "roughly $7,800 across those roles"; location: questions[7].model_answer

### P2_SET_216
- Rule: stim — invented figures/assumptions; quote: "For around 40 production staff" and "assume roughly 70% ($5.25) is materials" of the $7.50 variable cost; location: questions[7].model_answer

### P2_SET_217
- Rule: stim — invented component decomposition of variable cost; quote: "say fuel and consumables represent around 40% of the $10.50 variable cost ($4.20)"; location: questions[7].model_answer

### P2_SET_218
- Rule: stim — invented figure (contradicts insert); quote: "adds roughly $44,000 a year" — inconsistent with $310,000 annual interest × 0.75% ≈ $2,325; location: questions[7].model_answer

### P2_SET_219
- Rule: stim — invented component decomposition of variable cost; quote: "Timber is roughly 70% of the $128 variable cost (about $90)"; location: questions[7].model_answer

### P2_SET_220
- Rule: stim — invented figures/assumptions; quote: "Roughly 10 minimum-wage staff, each working about 1,100 seasonal hours a year" and "roughly $7,800 across those roles"; location: questions[7].model_answer
