# Generation brief — EXPANSION PHASE 2: 600 -> final database target
> Supersedes the earlier 240->600 plan. This phase adds **600 NEW sets** to the
> existing 600-set database, reaching **1,200 total (200 per unit)**.

Target after this phase:
- Unit 1: 200 sets -> new P1_U1_SET_101..SET_200 (100 NEW)
- Unit 2: 200 sets -> new P1_U2_SET_101..SET_200 (100 NEW)
- Unit 3: 200 sets -> new P1_U3_SET_101..SET_200 (100 NEW)
- Unit 4: 200 sets -> new P1_U4_SET_101..SET_200 (100 NEW)
- Unit 5: 200 sets -> new P1_U5_SET_101..SET_200 (100 NEW)
- Unit 6: 200 sets -> new P1_U6_SET_101..SET_200 (100 NEW)

Current master DB is already at 600/100-per-section and gatekeeper-clean.

## Non-negotiable rules (read SPEC.md FIRST — unchanged)
1. Schema/gatekeeper per SPEC.md: exactly 2 paragraphs separated by \n\n; 120-155 words; >=3 quantitative figures; exact AO-tag counts (b: 2k+2app; c: 2k+2app+2an; d: 2k+2app+2an+2eval); 5-9 verbatim valid_app_words per part b/c/d (case-insensitive substrings of YOUR OWN stem); part d starts with "Do you think"/"Consider"; deterministic_rules in part d; complete mark_scheme sections; command words per part; valid_app_words=[] and ends with [2] for part a.
2. Uniqueness: every stem MUST differ from all 600 existing sets. Check `data-staging/existing-stem-openings.txt` (600 entries) and `existing-business-names.txt` (323 names) — first 80 characters of your stem must differ from every entry, and your business names must not collide with any in that list or with concurrent wave-2 files.
3. Blacklist in SPEC.md applies everywhere. Sampling only random/quota; ratios only GPM/profit margin/ROCE/current ratio/acid test; no investment appraisal/gearing/payback; no PED formula; promotion without push/pull framing; PED conceptual only.
4. All arithmetic MUST be correct: recompute revenue/costs/profits/break-even/margin of safety/working capital/capital employed/ratios/cash-flow balances; if you claim X% change, figures must show it.
5. Output: single JSON array of exactly 10 sets written to YOUR staging file; validate until PASS:
   cd C:\Users\jayde\Documents\GitHub\fresh && node subjects/business/scripts/validate-paper1.mjs <file>
6. Uniqueness conventions: invented Country X businesses, plausible figures, distinct industry mix; vary openers; do NOT reuse part-a define terms twice within your own batch.
7. part-a definitions MAY reuse syllabus define-terms from across the database (whitelist is exhausted at this volume) — but the exact wording should differ if possible, and NEVER define the same term twice within your own batch.
8. Every set: genuine two-option dilemma, part d weighs BOTH options with stem figures, justified position.

## Allocation — 10 agents per unit, 10 sets each, 6 reused theme buckets (2 agents per bucket)

### Unit 1 — P1_U1_SET_101..200
- GEN-U1-A1 (101-110): sector change & added value — manufacturing transition (mills, plants); how to add value
- GEN-U1-A2 (111-120): sector change & added value — farms/fisheries/quarries primary-to-secondary dilemmas
- GEN-U1-B1 (121-130): factors of production & division of labour — construction/logistics fleets
- GEN-U1-B2 (131-140): factors of production & division of labour — food prep/garment/print
- GEN-U1-C1 (141-150): private vs public sector — public corporations vs privatisation; local services
- GEN-U1-C2 (151-160): stakeholders & objectives — conflicts; why objectives change; social enterprise
- GEN-U1-D1 (161-170): start-ups & government support — grants, training, tax incentives, premises; why businesses fail
- GEN-U1-D2 (171-180): business plans, entrepreneur characteristics; why established businesses fail
- GEN-U1-E1 (181-190): business types — sole trader/partnership/Ltd/Plc; franchises; joint ventures
- GEN-U1-E2 (191-200): limited liability, size measurement & its limitations; growth vs staying small; integration types

### Unit 2 — P1_U2_SET_101..200
Theme buckets (A-F) mirror U1: motivation in operations, financial vs non-financial rewards, organisation/structure/delegation, leadership & unions/communication, recruitment/selection, training/workforce/legal controls.

### Unit 3 — P1_U3_SET_101..200
Promotion & marketing mix, PLC/extension, price/pricing methods, place/distribution/e-commerce, market research/segmentation, international markets & marketing strategy.

### Unit 4 — P1_U4_SET_101..200
Production methods/lean; technology; costs & break-even; scale economies/diseconomies; quality; location/inventories.

### Unit 5 — P1_U5_SET_101..200
Sources of finance (internal then external); cash-flow forecasting & working capital; income statement/SoFP; ratio analysis (only the five); stakeholders & accounts.

### Unit 6 — P1_U6_SET_101..200
Business cycle & government policy; interest rates & macro effects; environment & ethics; globalisation & MNCs; exchange rates; tariffs/quotas/trade blocs.

## Workflow per generator
Read SPEC.md → existing-stem-openings.txt + existing-business-names.txt → draft 10 sets → arithmetic self-check → app-word verbatim check → write file → validate to PASS → report IDs + gatekeeper line + honest residuals.
