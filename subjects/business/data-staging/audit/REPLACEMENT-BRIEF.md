# Replacement Agent Brief — Cambridge IGCSE Business (0264) MCQ repair

Workspace root: `C:/Users/jayde/Documents/GitHub/fresh/subjects/business`

## File scope
Edit ONLY the wave JSON files assigned to you. Do NOT edit any bank `.ts` file, any other wave file, any assignment file, or this brief. Do NOT run the gatekeeper — the main agent runs it after all four agents finish.

## Input
Each assigned wave file is a JSON array of exactly 500 `MCQItem` objects at `data-staging/audit/waves/wave-XX.json`.
For each wave, read `data-staging/audit/waves/assignments/wave-XX-defects.json`. It lists EXACTLY the ids you must regenerate, with `gatekeeper_errors`, `audit_rejects`, and `duplicate_keeper`.

## Task
For every listed id, replace the item IN PLACE at the SAME array index with a brand-new, scenario-based, 0264-compliant MCQ. Keep `id`, `questionNumber`, `section`, `unit`, and `chapter` EXACTLY as in the original (same unit and chapter). Fix every listed defect.
- If `duplicate_keeper` is an id other than itself, the new stem must differ genuinely from that keeper's stem (different business, product, numbers, or context). Global stem uniqueness is mandatory.
- If `duplicate_keeper` equals the id itself, keep the stem only if no other defect requires changing it.

## Exact schema (all keys required, no extras)
`id`, `section`, `unit`, `chapter`, `questionNumber`, `question`, `options {A,B,C,D}`, `correctOption` ("A"|"B"|"C"|"D"), `correctAnswer`, `questionType: "MCQ"`, `explanation {correct_reason, distractor_reasons {A,B,C,D}}`.
- `options[correctOption]` must equal `correctAnswer` character-for-character; four distinct options.
- `correct_reason` >=20 chars and specific.
- Each wrong-option reason >=20 chars and explains WHY THAT distractor is wrong.
- `distractor_reasons[correctOption]` must equal `correct_reason` verbatim (never "Correct selection.").

## Approved 0264 topics by chapter (use only the item's own chapter)
1.1 needs/wants/scarcity/opportunity cost, factors of production, specialisation/division of labour, adding value. 1.2 primary/secondary/tertiary sectors, industrialisation/de-industrialisation, private vs public sector. 1.3 entrepreneurs, business plans, government start-up support, measuring size, internal/organic growth, horizontal/forward vertical/backward vertical integration, problems of growth, business failure. 1.4 sole trader, partnership, Ltd, Plc, franchise, joint venture, liability, public corporations. 1.5 objectives (survival/growth/profit/market share/social enterprise), stakeholders and conflicts, private/public sector objectives.
2.1 motivation, Maslow, Taylor, Herzberg, financial rewards (wage, salary, piece-rate, bonus, commission, profit sharing, share ownership), non-financial (job enrichment, rotation, teamworking, training, promotion). 2.2 organisation charts, hierarchy, span of control, chain of command, tall/flat, delayering, management roles, delegation, autocratic/democratic/laissez-faire leadership, trade unions. 2.3 job analysis/description/person specification/advertisement, internal vs external recruitment, application forms/CVs/interviews/testing, part-time vs full-time, induction/on-the-job/off-the-job training, downsizing, dismissal vs redundancy, employment law, minimum wage. 2.4 effective communication, verbal/written/visual/electronic methods, barriers and remedies.
3.1 role of marketing, consumer spending patterns, competitive markets, mass vs niche, segmentation. 3.2 primary/secondary research, questionnaires/interviews/focus groups/observation, government statistics/internet/reports/internal records, RANDOM and QUOTA sampling ONLY, data accuracy/presentation. 3.3 Product/Price/Place/Promotion: new product development, brand image, packaging, product life cycle, extension strategies; cost-plus/competitive/penetration/skimming/promotional/dynamic pricing; conceptual price-elastic vs inelastic only, NO PED formula; direct/retailer/wholesaler/agent channels, e-commerce; informative vs persuasive advertising, sales promotion, personal selling, PR/sponsorship, social media/viral marketing. 3.4 marketing strategy, legal controls over marketing, entering foreign markets, licensing, international franchising, localising.
4.1 production vs productivity, labour-intensive/capital-intensive, lean production (7 wastes, Kaizen, JIT, cell production), inventory levels, job/batch/flow production. 4.2 mechanisation, automation, CAD, CAM, 3D printing, EPOS, contactless payments, AI chatbots. 4.3 renewable energy, fewer natural resources, less waste, reusing/recycling, environmentally friendly products/packaging. 4.4 fixed/variable/total/average costs, economies/diseconomies of scale, contribution, break-even, margin of safety, break-even charts. 4.5 quality control vs assurance, TQM. 4.6 location factors, legal controls/trade blocs, relocating abroad.
5.1 start-up/working/capital expenditure finance, internal sources, external sources (shares, loans, overdrafts, trade credit, leasing, hire purchase, microfinance, crowdfunding, venture capital, grants, debt factoring), factors affecting choice (purpose, amount, legal form, control, existing loans/debt). 5.2 cash flow forecasts, inflows/outflows/net cash flow/balances, short-term cash flow solutions, profit vs cash, limitations. 5.3 statement of profit or loss, revenue, cost of sales, gross profit, overheads, tax, dividends, retained profit. 5.4 statement of financial position, assets, liabilities, working capital, net assets, capital employed, shareholders' equity. 5.5 profitability vs liquidity, GP margin, profit margin, ROCE, current/acid-test ratio, users and limitations.
6.1 business cycle, government economic objectives, taxes/spending/interest rates. 6.2 externalities, sustainable development, pressure groups, legal controls, ethics. 6.3 globalisation, tariffs/quotas, MNCs, exchange rate appreciation/depreciation effects.

## Blacklist — never include anywhere in an item
Boston Matrix, cash cow, cash dog, star product, problem child, question mark, stratified/systematic/cluster/convenience/snowball sampling, push/pull strategy, Ansoff, Porter, 7 Ps, physical evidence, PED formula calculation, McGregor, Theory X/Y, Vroom, expectancy theory, Mayo, Hawthorne, Adams equity, McClelland, Mintzberg, Belbin, Tuckman, paternalistic leadership, hard/soft HRM, zero-hours contract, SWOT, PEST, PESTLE, core competencies, critical path, CPA, network diagram, decision tree, expected monetary value/EMV, EOQ, buffer inventory, gearing, inventory/stock turnover, receivables days, payables days, NPV, IRR, payback period, ARR, conglomerate, 0450, Examiner guidance, mark schemes penalise.

## Quality and validation
Realistic business scenario plus clear question stem; exactly one defensible key; correct arithmetic for any numeric item; vary company names, products, locations, figures and phrasing so no two stems are identical. Preserve array order and exactly 500 items per wave. Validate each edited file with `python -m json.tool <file> > /dev/null` before finishing.

Final message (under 200 words): count regenerated per wave and any ids you could not fix.
