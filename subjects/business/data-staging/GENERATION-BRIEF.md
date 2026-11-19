# Generation brief — 360 NEW 0264 Paper 1 sets (database 240 -> 600, 100 per section)

Target distribution (final database must contain exactly):
- Unit 1 (Understanding Business Activity): 100 sets -> new P1_U1_SET_41..SET_100 (60 NEW)
- Unit 2 (People in Business):              100 sets -> new P1_U2_SET_41..SET_100 (60 NEW)
- Unit 3 (Marketing):                       100 sets -> new P1_U3_SET_41..SET_100 (60 NEW)
- Unit 4 (Operations Management):            100 sets -> new P1_U4_SET_41..SET_100 (60 NEW)
- Unit 5 (Financial Information and Decisions): 100 sets -> new P1_U5_SET_41..SET_100 (60 NEW)
- Unit 6 (External Influences on Business Activity): 100 sets -> new P1_U6_SET_41..SET_100 (60 NEW)

## Non-negotiable rules (full spec in SPEC.md — read it FIRST)
1. Per SPEC.md schema and gatekeeper: exactly 2 paragraphs separated by `\n\n`, 120–155 words, >=3 figures, exact AO-tag counts (b: 2k+2app; c: 2k+2app+2an; d: 2k+2app+2an+2eval), 5–9 verbatim valid_app_words per part b/c/d (case-insensitive substrings of YOUR OWN stem), part d starts with "Do you think"/"Consider", deterministic_rules in part d, complete mark_scheme sections, command words per part, valid_app_words=[] for part a, model_answer for part a ends with [2].
2. **Uniqueness**: every stem must differ from EVERY existing set in the database. Read `subjects/business/data-staging/existing-stem-openings.txt` and `existing-business-names.txt`; choose DIFFERENT business names, industries, founders, countries. The first 80 characters of your stem MUST differ from every existing stem and from the other new sets in this wave. Do not reuse a business name that already exists anywhere in the database.
3. Blacklist (SPEC.md) applies everywhere. ONLY 0264 whitelist topics. Sampling only random/quota; ratios only GPM/profit margin/ROCE/current ratio/acid test; no investment appraisal/gearing/payback/ARR/NPV; no PED formula; promotion without push/pull framing; PED conceptual only.
4. All arithmetic MUST be correct: recompute everything you write (revenue, costs, profit, break-even, margin of safety, working capital, capital employed, ratios, cash-flow balances, percentages, pay rises, wastage). If you claim "profit rose X%", the figures must show it.
5. Output: a single JSON **array** of your assigned sets, written to YOUR staging file (see assignment list). The file must parse: `node -e "JSON.parse(require('fs').readFileSync('<file>','utf8'))"`.
6. Vary part-a definitions across your own batch: do NOT define the same term twice within your batch; also check the master DB (`node -e "..."` grep for your candidate term in subjects/business/src/lib/data/paper1-database.json) before choosing.
7. Vary stem openers: avoid starting two stems with the same phrase; avoid "A <adj> <product> operates as a..." boilerplate more than twice in your batch.
8. Numbers must be plausible: revenue, staff, prices, market share, growth; Country X currency $.
9. Every set contains a genuine dilemma with at least two options, and part d must weigh BOTH options and take a justified position with stem figures.
10. After writing your file, run the gatekeeper: `cd C:\Users\jayde\Documents\GitHub\fresh && node subjects/business/scripts/validate-paper1.mjs <file>` — fix EVERY reported error until it prints "PASS". Also run a uniqueness sweep yourself: no two stems in your file share the same first 80 characters (the file-level gate checks this).

## Batch assignments & theme seeds (6 generators per unit, ~10 sets each)
> IDs: e.g. GEN-U1-A owns P1_U1_SET_41..SET_50 exclusively. Do not overlap.

### Unit 1 (+60) — P1_U1_SET_41..100
- GEN-U1-A (IDs 41–50): sector change & added value — primary/secondary/tertiary businesses (farming, fishing, quarrying, forestry, food/drink manufacturing, steel, textiles); added value calculation context; how to increase value; sector restructuring (industrialisation/de-industrialisation).
- GEN-U1-B (IDs 51–60): factors of production, specialisation & division of labour; scarcity & opportunity cost; land/labour/capital/enterprise decisions; productivity vs efficiency in small firms.
- GEN-U1-C (IDs 61–70): private vs public sector & mixed economies; stakeholder groups & why objectives conflict; why objectives change (survival→growth→profit→market share→social enterprise/service to community); public corporations.
- GEN-U1-D (IDs 71–80): entrepreneurs & start-ups — characteristics of successful entrepreneurs; contents of a business plan and how it helps; why/how governments support start-ups (grants, training, tax incentives, low-cost premises); why new & established businesses fail; records of successful start-ups.
- GEN-U1-E (IDs 81–90): types of business organisation — sole trader vs partnership vs Ltd vs Plc decisions; franchises; joint ventures; unincorporated vs incorporated; unlimited vs limited liability; public sector units.
- GEN-U1-F (IDs 91–100): measuring & growing business size — number of employees/value of output/value of sales/value of capital employed & LIMITATIONS; internal (organic) vs external growth (horizontal, forward vertical, backward vertical); problems of growth & how overcome; why some businesses remain small; measuring small firms.

### Unit 2 (+60) — P1_U2_SET_41..100
- GEN-U2-A (IDs 41–50): motivation in manufacturing/operations — Maslow, Taylor's scientific management, Herzberg two-factor (hygiene/motivators); contextualised to factories/production lines.
- GEN-U2-B (IDs 51–60): financial rewards vs non-financial motivation (wage/time rate, salary, piece rate, bonus, commission, profit sharing, share ownership; job enrichment, rotation, teamworking, training, promotion) in retail/services/hospitality.
- GEN-U2-C (IDs 61–70): organisation & structure — hierarchy, span of control, chain of command; tall vs flat structures, advantages/disadvantages, delayering; management roles (planning/organising/coordinating/commanding/controlling); delegation pros/cons.
- GEN-U2-D (IDs 71–80): leadership & unions — autocratic, democratic, laissez-faire ONLY; when each suits; trade unions (what they are; effects of membership: collective bargaining, industrial action, health & safety focus).
- GEN-U2-E (IDs 81–90): recruitment & selection — job analysis, job description, person specification, job advertisement; internal vs external recruitment; selection methods (forms, CVs, interviews, testing/assessment); part-time vs full-time.
- GEN-U2-F (IDs 91–100): training & communication & workforce changes — induction/on-the-job/off-the-job training; importance of training; downsizing; dismissal vs redundancy; factors in redundancy decisions; legal minimum wage & unfair dismissal; effective communication, methods (verbal/written/visual/electronic/IT), barriers & how to overcome.

### Unit 3 (+60) — P1_U3_SET_41..100
- GEN-U3-A (IDs 41–50): product & PLC — product life cycle (development/introduction/growth/maturity/saturation/decline), extension strategies, costs/benefits of developing new products, brand image & loyalty, role of packaging.
- GEN-U3-B (IDs 51–60): price — cost-plus, competitive, penetration, price skimming, promotional, dynamic pricing; price-elastic vs price-inelastic demand (concept only, NO formula) and pricing decisions.
- GEN-U3-C (IDs 61–70): promotion — aims; advertising informative/persuasive; sales promotion (price reductions, gifts, BOGOF, competitions, POS displays, free samples); personal selling; PR/sponsorship; social media & viral marketing; technology & the promotional mix; legal controls (misleading promotion, faulty goods, weights & measures).
- GEN-U3-D (IDs 71–80): place & e-commerce — channels of distribution (direct/retailer/wholesaler/agent); opportunities & threats of e-commerce for businesses & consumers; choosing distribution for goods vs services.
- GEN-U3-E (IDs 81–90): market research & segmentation — primary vs secondary; questionnaires/interviews/focus groups/observation; government statistics/internet/reports/internal records; random & quota sampling ONLY; accuracy factors; presentation of results; market-orientated businesses; demographic/geographic/income/age/gender/lifestyle segments; mass vs niche marketing; changing customer spending patterns & responding to competition.
- GEN-U3-F (IDs 91–100): marketing abroad & strategy — entering new markets abroad (opportunities, problems, methods: joint ventures, licensing, international franchising, localising); recommending a marketing strategy; role of marketing; legal controls over marketing; maintaining customer loyalty.

### Unit 4 (+60) — P1_U4_SET_41..100
- GEN-U4-A (IDs 41–50): production methods & lean — job/batch/flow production; kaizen; just-in-time (JIT); cell production; benefits of lean production.
- GEN-U4-B (IDs 51–60): technology in production — automation, mechanisation, CAD, CAM, CIM, EPOS; how technology has changed production; productivity vs production; managing resources effectively.
- GEN-U4-C (IDs 61–70): costs & break-even — fixed/variable/total/average costs; break-even output = Fixed Costs/(Price − Variable cost/unit); margin of safety = Actual − Break-even; interpreting break-even charts; limitations of break-even analysis. VERIFY ALL ARITHMETIC.
- GEN-U4-D (IDs 71–80): scale — purchasing/marketing/financial/managerial/technical economies of scale; diseconomies of scale (poor communication, low morale, slow decision-making).
- GEN-U4-E (IDs 81–90): quality — why quality is important; quality control vs quality assurance; Total Quality Management (TQM); quality vs productivity trade-offs.
- GEN-U4-F (IDs 91–100): location & inventories — location factors for manufacturing/service/retail business; legal controls & trade blocs on location; relocating abroad to another country; why businesses hold inventories; costs of holding inventories.

### Unit 5 (+60) — P1_U5_SET_41..100
- GEN-U5-A (IDs 41–50): finance needs & internal sources — start-up capital, working capital, capital expenditure; retained profit, sale of existing assets, owners' savings; short-term vs long-term; factors influencing choice.
- GEN-U5-B (IDs 51–60): external finance — issue of shares, bank loans, debentures, factoring of debts, grants/subsidies, micro-finance, crowdfunding; pros/cons; choosing between sources.
- GEN-U5-C (IDs 61–70): cash-flow forecasting & working capital — interpreting/amending/completing simple forecasts (inflows, outflows, net cash flow, opening/closing balance); overcoming short-term cash-flow problems (overdraft, delaying supplier payments, debtors paying faster, delaying capital expenditure); importance of cash; working capital = CA − CL. VERIFY ALL ARITHMETIC.
- GEN-U5-D (IDs 71–80): income statement & statement of financial position — revenue, cost of sales, gross profit, expenses, net profit, retained profit; profit vs cash; non-current assets/current assets/liabilities/capital employed/shareholders' equity.
- GEN-U5-E (IDs 81–90): profitability & liquidity ratios — GPM, profit margin, ROCE, current ratio, acid test ratio ONLY. VERIFY ALL ARITHMETIC (multiply by 100 correctly).
- GEN-U5-F (IDs 91–100): stakeholders & accounts — why/how stakeholders use final accounts (owners, managers, employees, lenders/banks, suppliers, government, shareholders); uses & limitations of ratio analysis; ratio comparisons over time.

### Unit 6 (+60) — P1_U6_SET_41..100
- GEN-U6-A (IDs 41–50): business cycle & government policy — growth/boom/recession/slump; government economic objectives; how changes in government spending and taxation affect business activity (income tax, corporation tax, VAT/indirect tax, import tariffs).
- GEN-U6-B (IDs 51–60): interest rates & macro effects — effects of rising/falling interest rates on business & consumers; effects of changes in employment, inflation and economic growth (GDP) on business activity.
- GEN-U6-C (IDs 61–70): environment & ethics — environmental impacts of business; externalities (external costs/benefits); sustainable development; environmental pressures & opportunities; legal controls over environmental impact; ethical issues & conflict between profit and ethics.
- GEN-U6-D (IDs 71–80): globalisation & MNCs — reasons for globalisation; opportunities & threats globalisation creates; multinational companies: benefits to the business; impact on stakeholders/host country; controlling MNCs.
- GEN-U6-E (IDs 81–90): exchange rates — appreciation (stronger currency) and depreciation (weaker currency) effects on exporters & importers; exchange-rate fluctuation risks for multinationals.
- GEN-U6-F (IDs 91–100): tariffs, quotas & trade blocs — import tariffs & import quotas; effects on domestic industry and consumers; trade blocs and their role in location/market access decisions; evaluating whether to trade/relocate abroad (opportunities vs problems); legal controls in international trade context.

## Workflow per generator
1. Read SPEC.md fully; read existing-stem-openings.txt and existing-business-names.txt.
2. Draft your 10 sets; verify arithmetic; verify app words verbatim; verify AO tags; verify uniqueness vs the existing database and vs your own batch.
3. Write the JSON array to your assigned file in `subjects/business/data-staging/gen/`.
4. Run the gatekeeper on your file until PASS: `node subjects/business/scripts/validate-paper1.mjs <file>`.
5. Report: IDs created + gatekeeper result (+ any honest residual issues).
