export interface Paper2Appendix {
  id: string;
  title: string;
  type: "memo" | "financial_table" | "market_data" | "feedback" | "article";
  content: string;
  dataRows?: { label: string; col2024?: string; col2025?: string; note?: string }[];
}

export interface Paper2QuestionPart {
  id: string;
  partNumber: string; // "1(a)", "1(b)", etc.
  marks: 2 | 4 | 8 | 12;
  commandWord: string;
  topicCode: string; // e.g. "1.4", "3.2", "5.5"
  questionText: string;
  aoFocus: string;
  rubric: {
    ao1Max: number;
    ao2Max: number;
    ao3Max: number;
    ao4Max: number;
    indicativeContent: string[];
    sampleStrongAnswer: string;
  };
}

export interface Paper2CaseStudy {
  id: string;
  businessName: string;
  syllabus: "0264" | "0450";
  year: number;
  session: string;
  title: string;
  industry: string;
  businessType: string;
  overviewSummary: string;
  backgroundStory: string;
  operationsAndWorkforce: string;
  marketAndStrategy: string;
  financialHighlights: {
    label: string;
    value: string;
    changeOrContext: string;
  }[];
  appendices: Paper2Appendix[];
  applicationHooks: string[];
  questions: Paper2QuestionPart[];
}

export const OFFICIAL_2027_SPECIMEN_PAPER_2: Paper2CaseStudy = {
  id: "0264-2027-specimen-p2",
  businessName: "Tasty Treats (TT)",
  syllabus: "0264",
  year: 2027,
  session: "2027 Specimen Examination",
  title: "Tasty Treats (TT) — Cambridge 0264 Specimen Paper 2 Case Study Insert",
  industry: "Boutique Cafe Chain & Specialty Luxury Desserts",
  businessType: "Private Limited Company (Ltd)",
  overviewSummary:
    "Tasty Treats (TT) operates 50 cafes across Country X selling premium handcrafted cakes, desserts, and artisan coffees. The board is now finalising plans to invest $500,000 into opening Cafe #51 in the high-density commercial district of New Town, while grappling with sudden liquidity deterioration, staff motivation issues, and new macroeconomic shifts.",
  backgroundStory: `Tasty Treats (TT) was founded ten years ago by two university friends as an equal partnership. Six years later, after reaching 20 retail outlets, the partners converted TT into a Private Limited Company (Ltd) to protect personal wealth and raise equity capital from three angel investors. Today, TT owns and operates 50 cafes across Country X. The founders remain majority shareholders and serve as Managing Director and Operations Director.

TT has built a reputation for high-quality, premium desserts (such as Belgian chocolate ganache tortes and artisan fruit tarts) prepared offsite by a central bakery and delivered daily to each cafe. Cafe customers are predominantly middle-to-high income professionals and families seeking a relaxed, luxury dining experience. 

The directors have approved an ambitious plan to open TT's 51st cafe in New Town, a rapidly growing commercial centre. This flagship site requires an initial capital investment of $500,000 for premises lease, commercial espresso machinery, temperature-controlled display refrigeration, and interior decoration. The directors must decide how to conduct market research in New Town, how to staff the site, and how to finance the project amidst tightening bank credit.`,

  operationsAndWorkforce: `Each TT cafe operates 7 days a week, from 08:00 to 20:00. The proposed New Town cafe will require 1 full-time cafe manager (annual salary $42,000) and 10 hourly cafe assistants. 

Current Operational & Cost Data for TT cafes:
• Each dessert is purchased from TT's central wholesale supplier at a variable cost of $4.00 each.
• Desserts are sold to retail cafe customers at an average selling price of $8.00 each.
• Average weekly fixed overhead costs per cafe (rent, business rates, insurance, depreciation of fixtures): $1,000.
• Total weekly variable costs per cafe: $20,000 when operating at current average volume of 5,000 desserts sold per week.

Human Resources and Staff Retention Challenges:
• Cafe assistants are paid $14.00 per hour. Country X's legal statutory minimum wage is $12.00 per hour.
• Despite above-minimum pay, TT's employee turnover across its 50 cafes reached 22% last year (industry average is 15%).
• Exit interviews reveal that staff feel their work is repetitive and that store managers give little recognition.
• The Human Resources Manager has proposed two motivational initiatives:
  - Initiative 1: An 'Employee of the Month' scheme for each cafe, giving the winning worker public recognition and a $20 voucher for TT desserts.
  - Initiative 2: 'Job Enrichment', redesigning assistant roles so they take responsibility for inventory orders, visual merchandising, and customer complaint resolution.`,

  marketAndStrategy: `Competitor and Marketing Context in New Town:
New Town has three established boutique coffee houses and two franchise dessert parlours. To understand customer preferences, TT is evaluating three research methods:
1. Analysing competitor websites and social media channels for pricing, menu offerings, and promotional campaigns.
2. Organising two focus groups composed of local New Town office workers and university students.
3. Conducting physical observational research outside competing cafes to record footfall, peak visiting times, and customer age demographics.

Environmental Packaging Strategy:
TT currently distributes takeaway cakes and hot beverages in single-use plastic containers and plastic-lined cups. In response to consumer pressure groups, TT is considering switching all 50 cafes to 100% biodegradable and recyclable cardboard packaging. This will increase packaging costs by $0.25 per customer order but will align TT with growing green consumerism.`,

  financialHighlights: [
    { label: "Number of Active Cafes", value: "50 cafes", changeOrContext: "Cafe #51 planned for New Town ($500k capital cost)" },
    { label: "Weekly Dessert Sales per Cafe", value: "5,000 units", changeOrContext: "Average retail price: $8.00 / dessert" },
    { label: "Purchase Cost from Supplier", value: "$4.00 / unit", changeOrContext: "Total weekly variable costs: $20,000" },
    { label: "Weekly Fixed Costs per Cafe", value: "$1,000", changeOrContext: "Rent, manager salary allocation, rates" },
    { label: "2024 Current Ratio", value: "3.0 : 1", changeOrContext: "Very strong liquidity position" },
    { label: "2024 Acid Test Ratio", value: "1.0 : 1", changeOrContext: "Healthy cash & receivables coverage" },
    { label: "2025 Bank Overdraft", value: "$5.0 million", changeOrContext: "Up from $0 in 2024; high interest charges" },
    { label: "2025 Current Assets vs Liabilities", value: "$12.0m vs $8.0m", changeOrContext: "Current ratio plummeted to 1.5:1; Acid test dropped to 0.5:1" },
  ],

  appendices: [
    {
      id: "app-1",
      title: "Appendix 1: Extract from TT's Statement of Financial Position (at 31 March 2024 and 31 March 2025)",
      type: "financial_table",
      content: "Official balance sheet comparison for Tasty Treats Ltd (all figures in millions of dollars $m).",
      dataRows: [
        { label: "Non-current assets (cafes, equipment)", col2024: "$25.0m", col2025: "$28.0m", note: "Increased due to cafe refurbishments" },
        { label: "Inventories (ingredients, beverages, packaging)", col2024: "$10.0m", col2025: "$8.0m", note: "Reduced inventory holding" },
        { label: "Trade receivables (credit card payments pending)", col2024: "$3.0m", col2025: "$1.5m", note: "Faster processing times" },
        { label: "Cash and cash equivalents", col2024: "$2.0m", col2025: "$2.5m", note: "Modest increase in cash at bank" },
        { label: "Total Current Assets", col2024: "$15.0m", col2025: "$12.0m", note: "Decreased by $3.0m" },
        { label: "Trade payables (owed to central bakery supplier)", col2024: "$5.0m", col2025: "$3.0m", note: "Suppliers demanded shorter credit terms" },
        { label: "Bank overdraft (short-term borrowing)", col2024: "$0.0m", col2025: "$5.0m", note: "Substantial short-term debt incurred" },
        { label: "Total Current Liabilities", col2024: "$5.0m", col2025: "$8.0m", note: "Increased by $3.0m" },
        { label: "Non-current liabilities (long-term bank loans)", col2024: "$2.0m", col2025: "$3.0m", note: "Fixed 5-year commercial bank loan" },
      ],
    },
    {
      id: "app-2",
      title: "Appendix 2: Memorandum from Operations Director to Board",
      type: "memo",
      content: `TO: Board of Directors, Tasty Treats Ltd
FROM: Marcus Vance, Operations Director
DATE: 14 October 2026
SUBJECT: Operational Metrics and Staffing for New Town Cafe

Opening Cafe #51 in New Town will give us access to 45,000 potential daily customers. However, our reliance on the central commercial bakery means that quality must remain flawless. 

Our current cost breakdown for each dessert remains:
• Purchase price from bakery: $4.00
• Selling price to consumer: $8.00
• Weekly fixed overhead per shop: $1,000
• Typical weekly volume: 5,000 desserts

We need to decide immediately whether to issue written employment contracts to all 10 incoming cafe assistants in New Town. While our competitor in New Town uses zero-hours contracts without formal paperwork, our HR Manager believes contracts will significantly curb our 22% labour turnover.`,
    },
    {
      id: "app-3",
      title: "Appendix 3: Economic Forecast Report for Country X",
      type: "article",
      content: `The Central Bank and Ministry of Finance of Country X have released three major economic policy adjustments following a period of economic slowdown:

1. Personal Income Tax: Standard rate cut from 25% down to 20% to stimulate consumer disposable spending.
2. Business Corporation Tax: Tax on company profits increased from 24% up to 26% to fund infrastructure upgrades.
3. Monetary Policy & Interest Rates: Benchmark central bank interest rate reduced from 5.0% down to 3.5% to encourage business capital investment.`,
    },
  ],

  applicationHooks: [
    "50 existing cafes operating 7 days/week; planning Cafe #51 in New Town",
    "Capital expenditure of $500,000 required for the New Town location",
    "Desserts cost $4.00 each from bakery and sell for $8.00 (5,000 sold/week)",
    "Weekly fixed costs of $1,000 vs weekly variable costs of $20,000",
    "10 cafe assistants and 1 manager paid $14/hour (minimum wage $12/hour)",
    "High labour turnover of 22% compared to industry average 15%",
    "Employee of the month voucher ($20) vs job enrichment autonomy",
    "Balance sheet: Current ratio deteriorated from 3:1 (2024) to 1.5:1 (2025)",
    "Acid test dropped from 1:1 down to 0.5:1 due to $5m bank overdraft",
    "Government policy: Income tax cut 25%->20%, Profit tax raised 24%->26%, Interest rates cut 5%->3.5%",
    "Packaging cost increase of $0.25 per order for biodegradable alternatives",
  ],

  questions: [
    {
      id: "0264-SP27-P2-Q1A",
      partNumber: "Question 1(a)",
      marks: 8,
      commandWord: "Explain two advantages and two disadvantages",
      topicCode: "1.4",
      questionText:
        "Explain two advantages and two disadvantages for Tasty Treats (TT) of operating as a private limited company (Ltd) rather than a partnership.",
      aoFocus: "AO1 Knowledge (2m) + AO2 Application (2m) + AO3 Analysis (4m)",
      rubric: {
        ao1Max: 2,
        ao2Max: 2,
        ao3Max: 4,
        ao4Max: 0,
        indicativeContent: [
          "Advantage 1: Limited liability protects personal assets of the two founding owners and 3 angel investors.",
          "Advantage 2: Ability to sell shares privately to trusted investors to raise the $500,000 needed for the New Town cafe without loss of control to the public.",
          "Disadvantage 1: Financial accounts must be filed with the company registrar, allowing competing cafes in New Town to view TT's $5m overdraft and profit margins.",
          "Disadvantage 2: Cannot sell shares on the public stock exchange, restricting total equity capital compared to a Plc.",
        ],
        sampleStrongAnswer:
          "Operating as an Ltd grants limited liability to the two original partners and 3 angel investors. If the $500,000 New Town cafe were to fail and TT defaulted on its debts, the founders' personal homes and savings would be legally protected up to the amount invested in their shares. Furthermore, TT can issue shares privately to targeted investors to fund Cafe #51 without risking a hostile public takeover. However, TT must disclose annual financial statements, exposing its $5m bank overdraft and 0.5:1 acid test ratio to local New Town cafe rivals.",
      },
    },
    {
      id: "0264-SP27-P2-Q1B",
      partNumber: "Question 1(b)",
      marks: 12,
      commandWord: "Evaluate three methods and recommend",
      topicCode: "3.2",
      questionText:
        "Consider the following three ways TT could research potential products and customer demand for its proposed new cafe in New Town: \n• Competitor websites and social media\n• Focus groups of local residents and workers\n• Observing customers outside competing New Town cafes\n\nRecommend which method TT should choose. Justify your answer.",
      aoFocus: "AO1 Knowledge (2m) + AO2 Application (2m) + AO3 Analysis (4m) + AO4 Evaluation (4m)",
      rubric: {
        ao1Max: 2,
        ao2Max: 2,
        ao3Max: 4,
        ao4Max: 4,
        indicativeContent: [
          "Evaluate competitor websites: Inexpensive and fast secondary research; reveals menu prices ($8 vs rival prices) and promotions, but offers no insight into customer dissatisfaction.",
          "Evaluate focus groups: Rich qualitative primary research directly with New Town professionals; provides detailed taste feedback on Belgian chocolate desserts, but is expensive to coordinate and sample sizes are small.",
          "Evaluate observation: Objective quantitative primary data on footfall outside New Town cafes and peak hours, but cannot reveal why customers choose competitors.",
          "Justified Recommendation: Weigh costs against depth; focus groups are best because opening a $500,000 luxury cafe requires deep qualitative knowledge of flavour preferences.",
        ],
        sampleStrongAnswer:
          "Analysing competitor websites provides cheap secondary data on rival cake menus and whether they charge above or below TT's $8.00 dessert price, but reveals nothing about unmet customer desires. Observation outside New Town cafes gives factual footfall numbers to estimate whether TT can reach its 5,000 weekly dessert target, yet cannot explain taste preferences. Focus groups are the most valuable method for TT: spending $500,000 on Cafe #51 is a massive capital risk, and focus groups allow TT to gather in-depth qualitative feedback on whether affluent New Town professionals will pay $8 for Belgian chocolate pastries. In conclusion, focus groups are recommended because product differentiation is TT's core competitive advantage.",
      },
    },
    {
      id: "0264-SP27-P2-Q2A",
      partNumber: "Question 2(a)",
      marks: 8,
      commandWord: "Explain two benefits",
      topicCode: "2.3",
      questionText:
        "Explain two benefits to Tasty Treats (TT) of providing written employment contracts to the 10 new cafe assistants in New Town.",
      aoFocus: "AO1 Knowledge (2m) + AO2 Application (2m) + AO3 Analysis (4m)",
      rubric: {
        ao1Max: 2,
        ao2Max: 2,
        ao3Max: 4,
        ao4Max: 0,
        indicativeContent: [
          "Benefit 1: Legal compliance and avoidance of industrial tribunal disputes over the $14.00 hourly wage, shift rotas (08:00 to 20:00), or holiday entitlements.",
          "Benefit 2: Reduces high 22% employee turnover by providing job security and clear job expectations, reassuring staff who previously felt unrecognised.",
        ],
        sampleStrongAnswer:
          "First, written contracts provide legal certainty regarding wage rates and working hours. Since TT operates 7 days a week from 08:00 to 20:00, contracts formally define shift expectations and the $14/hour pay rate. This prevents misunderstandings, reducing costly legal disputes. Second, written contracts can help TT curb its high 22% labour turnover. Formal contracts give the 10 assistants a sense of security and clear employment status compared to competitor zero-hours contracts, fostering higher employee commitment and lowering recruitment costs.",
      },
    },
    {
      id: "0264-SP27-P2-Q2B",
      partNumber: "Question 2(b)",
      marks: 12,
      commandWord: "Compare two methods and recommend with justification",
      topicCode: "2.1",
      questionText:
        "Consider the following two methods TT could use to motivate its cafe assistants:\n• An 'Employee of the Month' award with a $20 dessert voucher\n• Job enrichment (delegating inventory ordering and customer service resolution)\n\nRecommend which method TT should implement. Justify your answer.",
      aoFocus: "AO1 Knowledge (2m) + AO2 Application (2m) + AO3 Analysis (4m) + AO4 Evaluation (4m)",
      rubric: {
        ao1Max: 2,
        ao2Max: 2,
        ao3Max: 4,
        ao4Max: 4,
        indicativeContent: [
          "Analyse Employee of the Month: Offers public recognition (Maslow esteem needs), but a $20 dessert voucher has negligible value to staff already earning $14/hr, and only rewards one worker while demotivating the other 9.",
          "Analyse Job Enrichment: Redesigns work to provide higher-order responsibility (Herzberg motivators); assistants order bakery inventory and handle complaints, alleviating boredom and tackling the root cause of the 22% turnover.",
          "Justified Recommendation: Job enrichment is decisively superior because staff already earn above minimum wage; non-financial autonomy directly addresses exit interview feedback.",
        ],
        sampleStrongAnswer:
          "The Employee of the Month scheme provides recognition, which satisfies Maslow's esteem needs. However, a $20 voucher for desserts is minimal for workers earning $14/hour, and selecting one winner among 10 assistants each month risks breeding jealousy among the 9 unrewarded staff. By contrast, job enrichment applies Herzberg's motivators by delegating inventory ordering for 5,000 weekly desserts and customer care to all assistants. This directly solves exit interview complaints that duties are monotonous. Therefore, job enrichment is recommended because it enhances autonomy across the entire workforce, sustainably reducing TT's 22% turnover rate.",
      },
    },
    {
      id: "0264-SP27-P2-Q3A",
      partNumber: "Question 3(a)(i-iii)",
      marks: 8,
      commandWord: "Calculate and State",
      topicCode: "4.2",
      questionText:
        "Refer to the operational data in Appendix 2:\n(i) Calculate the weekly average total cost per dessert for a typical TT cafe. Show your working. [2 marks]\n(ii) Calculate the variable cost per dessert. Show your working. [2 marks]\n(iii) State four business uses of this unit cost information for the directors of TT. [4 marks]",
      aoFocus: "AO1 Knowledge (2m) + AO2 Application (4m) + AO3 Analysis (2m)",
      rubric: {
        ao1Max: 2,
        ao2Max: 4,
        ao3Max: 2,
        ao4Max: 0,
        indicativeContent: [
          "(i) Total Weekly Cost = Fixed Cost ($1,000) + Variable Cost ($20,000) = $21,000. Average Total Cost = $21,000 / 5,000 desserts = $4.20 per dessert.",
          "(ii) Variable Cost per dessert = $20,000 / 5,000 = $4.00 per dessert (or given directly as purchase price).",
          "(iii) Uses: 1. Setting profitable retail selling prices (ensuring price > $4.20); 2. Calculating break-even output; 3. Evaluating supplier price negotiations for bakery batches; 4. Making budgeting forecasts for the New Town cafe.",
        ],
        sampleStrongAnswer:
          "(i) Total cost = $1,000 fixed + $20,000 variable = $21,000. Average total cost = $21,000 / 5,000 = $4.20 per dessert.\n(ii) Variable cost per dessert = $20,000 / 5,000 = $4.00 per dessert.\n(iii) Four business uses: 1. Price setting (guaranteeing TT's $8.00 price delivers a $3.80 unit profit margin); 2. Calculating break-even quantity for Cafe #51; 3. Benchmarking bakery supplier costs; 4. Preparing annual profit budgets.",
      },
    },
    {
      id: "0264-SP27-P2-Q3B",
      partNumber: "Question 3(b)",
      marks: 12,
      commandWord: "Analyse and Evaluate with accounting ratios",
      topicCode: "5.5",
      questionText:
        "Using the financial data in Appendix 1, analyse whether TT's financial position became better or worse between 31 March 2024 and 31 March 2025. Support your answer with suitable accounting ratio calculations.",
      aoFocus: "AO1 Knowledge (2m) + AO2 Application (2m) + AO3 Analysis (4m) + AO4 Evaluation (4m)",
      rubric: {
        ao1Max: 2,
        ao2Max: 2,
        ao3Max: 4,
        ao4Max: 4,
        indicativeContent: [
          "Calculate 2025 Current Ratio: Current Assets ($12.0m) / Current Liabilities ($8.0m) = 1.5 : 1 (dropped sharply from 3.0 : 1 in 2024).",
          "Calculate 2025 Acid Test Ratio: (Current Assets $12.0m – Inventories $8.0m) / Current Liabilities $8.0m = $4.0m / $8.0m = 0.5 : 1 (halved from 1.0 : 1 in 2024).",
          "Analyse causes: Incurred a massive $5m bank overdraft to finance cafe refurbishments, increasing current liabilities from $5m to $8m while inventory fell from $10m to $8m.",
          "Evaluative Judgment: TT's liquidity has worsened alarmingly; with an acid test of 0.5:1, TT possesses only 50 cents of liquid assets for every dollar of immediate debt, jeopardising the $500,000 New Town expansion.",
        ],
        sampleStrongAnswer:
          "In 2024, TT's liquidity was exceptionally secure with a Current Ratio of 3:1 and an Acid Test of 1:1. By 31 March 2025, Current Assets fell from $15m to $12m while Current Liabilities surged from $5m to $8m. Consequently, TT's 2025 Current Ratio fell to 1.5:1 ($12m / $8m). Crucially, the 2025 Acid Test ratio plummeted to 0.5:1 (($12m - $8m inventory) / $8m). This represents a severe liquidity deterioration caused directly by a $5m bank overdraft taken to fund $3m in non-current asset expansions. With only $0.50 of liquid cash and receivables per $1.00 of short-term debt, TT faces grave insolvency risk if the bank demands immediate overdraft repayment. In conclusion, TT's financial health has deteriorated significantly, making commercial loans for Cafe #51 difficult to secure.",
      },
    },
    {
      id: "0264-SP27-P2-Q4A",
      partNumber: "Question 4(a)",
      marks: 8,
      commandWord: "Explain one advantage and one disadvantage",
      topicCode: "6.2",
      questionText:
        "Explain one advantage and one disadvantage to Tasty Treats (TT) of switching to 100% recyclable or reusable packaging across all 50 of its cafes.",
      aoFocus: "AO1 Knowledge (2m) + AO2 Application (2m) + AO3 Analysis (4m)",
      rubric: {
        ao1Max: 2,
        ao2Max: 2,
        ao3Max: 4,
        ao4Max: 0,
        indicativeContent: [
          "Advantage: Enhances brand reputation and customer loyalty among environmentally conscious cafe diners, shielding TT from pressure group boycotts and justifying the $8.00 luxury price point.",
          "Disadvantage: Adds $0.25 to packaging costs per order, which across 5,000 weekly desserts per cafe (250,000 orders weekly across 50 cafes) increases weekly expenses by $62,500, further squeezing margins during a period of high overdraft debt.",
        ],
        sampleStrongAnswer:
          "An advantage is enhanced brand image among affluent cafe customers. Adopting biodegradable cardboard packaging differentiates TT from competitors in New Town, attracting ethical consumers and justifying the premium $8.00 price tag. A major disadvantage is increased operational costs. An extra $0.25 per takeaway dessert across 50 cafes selling 5,000 desserts weekly equals $62,500 in additional weekly expenses. At a time when TT has a $5m overdraft and tight 0.5:1 acid test liquidity, this cost escalation could severely harm net profit margins.",
      },
    },
    {
      id: "0264-SP27-P2-Q4B",
      partNumber: "Question 4(b)",
      marks: 12,
      commandWord: "Assess three economic factors and judge the most significant",
      topicCode: "6.1",
      questionText:
        "Refer to Appendix 3. Assess how each of the following government economic policy changes in Country X may affect Tasty Treats (TT):\n• Lower personal income tax (25% down to 20%)\n• Higher tax on business profits (24% up to 26%)\n• Lower interest rates (5.0% down to 3.5%)\n\nJudge which economic change is likely to have the most significant effect on TT. Justify your decision.",
      aoFocus: "AO1 Knowledge (2m) + AO2 Application (2m) + AO3 Analysis (4m) + AO4 Evaluation (4m)",
      rubric: {
        ao1Max: 2,
        ao2Max: 2,
        ao3Max: 4,
        ao4Max: 4,
        indicativeContent: [
          "Income tax cut (25%->20%): Increases disposable income; luxury desserts are income-elastic, so demand for TT's $8 cakes and coffees will rise across all 50 cafes.",
          "Profit tax rise (24%->26%): Reduces retained profit available to finance the $500,000 New Town cafe or pay down the $5m overdraft.",
          "Interest rate cut (5%->3.5%): Substantially reduces monthly interest repayments on TT's $5m overdraft and $3m bank loan, improving cash flow.",
          "Evaluative Judgment: Lower interest rates are the most significant because TT holds $8m in combined overdraft and bank borrowings; interest savings provide immediate liquidity relief to rescue its 0.5:1 acid test ratio.",
        ],
        sampleStrongAnswer:
          "Cutting personal income tax to 20% expands disposable income. Because TT's $8 desserts are luxury goods with high income elasticity of demand, customer footfall in New Town and existing cafes will rise, lifting sales revenue. Conversely, raising corporation tax to 26% reduces after-tax retained profit, restricting internal funds for the $500,000 New Town investment. However, lowering interest rates from 5% to 3.5% has the most immediate structural impact: TT carries a huge $5m overdraft and a $3m bank loan ($8m total debt). A 1.5% rate cut slashes TT's debt servicing costs by tens of thousands of dollars annually, directly relieving its precarious 0.5:1 acid test liquidity. Therefore, the interest rate reduction is the most significant factor because survival hinges on controlling finance costs.",
      },
    },
  ],
};

export const OTHER_PAPER2_CASE_STUDIES: Paper2CaseStudy[] = [
  {
    id: "abp-2026-p2",
    businessName: "Apex Bio-Pharmaceuticals (ABP)",
    syllabus: "0264",
    year: 2026,
    session: "Mock Exam Case Study",
    title: "Apex Bio-Pharmaceuticals (ABP) — Automated Lab Expansion Case Study",
    industry: "Pharmaceutical Diagnostic Testing & Medical Equipment",
    businessType: "Public Limited Company (Plc)",
    overviewSummary:
      "Apex Bio-Pharmaceuticals (ABP) operates diagnostic testing laboratories. It is considering a $1.2m investment in automated AI diagnostic robotics vs hiring 25 specialised laboratory technicians, whilst facing rising regulatory hurdles and tight liquidity.",
    backgroundStory:
      "ABP was founded 15 years ago and became a Plc 5 years ago. It supplies 60 regional hospitals with diagnostic blood test analysis. Demand has grown 35% annually, but test turnaround bottlenecks have caused hospital complaints.",
    operationsAndWorkforce:
      "ABP employs 180 laboratory staff. Staff turnover is 11%, but wages for specialised technicians have risen 14% this year due to national labour shortages. Option 1 involves purchasing four robotic testing analyzers at $300,000 each. Option 2 involves hiring 25 technicians on 3-year contracts.",
    marketAndStrategy:
      "ABP operates in a regulated oligopoly with two major multinational competitors. Hospital procurement teams prioritize test precision and turnaround speed over lowest price.",
    financialHighlights: [
      { label: "Annual Revenue", value: "$18.5m", changeOrContext: "+12% YoY" },
      { label: "Net Profit Margin", value: "8.4%", changeOrContext: "Down from 11.2%" },
      { label: "Current Ratio", value: "1.25 : 1", changeOrContext: "Adequate" },
      { label: "Capital Expenditure Needed", value: "$1,200,000", changeOrContext: "For robotics or staff training" },
    ],
    appendices: [
      {
        id: "abp-app1",
        title: "Appendix 1: Cost & Throughput Comparison",
        type: "financial_table",
        content: "Operational comparison between Robotic Automation vs Expanded Human Technician Workforce.",
        dataRows: [
          { label: "Initial Capital Cost", col2024: "$1,200,000", col2025: "$150,000 (recruitment)" },
          { label: "Annual Operating Cost", col2024: "$80,000 (maintenance)", col2025: "$850,000 (salaries)" },
          { label: "Error Rate / Precision", col2024: "0.02%", col2025: "0.85%" },
          { label: "Daily Sample Capacity", col2024: "12,000 samples", col2025: "7,500 samples" },
        ],
      },
    ],
    applicationHooks: [
      "180 lab technicians supplying 60 regional hospitals",
      "Option 1: $1.2m automated robotics (0.02% error rate, 12,000 capacity)",
      "Option 2: 25 new technicians ($850k annual salary, 0.85% error rate)",
      "Hospital contracts depend on 24-hour turnaround speed",
      "Net profit margin squeezed from 11.2% to 8.4%",
    ],
    questions: [
      {
        id: "abp-q1a",
        partNumber: "Question 1(a)",
        marks: 8,
        commandWord: "Explain two factors",
        topicCode: "4.1",
        questionText: "Explain two factors ABP should consider before introducing robotic automation to replace human lab analysis.",
        aoFocus: "AO1 (2m) + AO2 (2m) + AO3 (4m)",
        rubric: {
          ao1Max: 2,
          ao2Max: 2,
          ao3Max: 4,
          ao4Max: 0,
          indicativeContent: ["Capital cost vs payback period", "Redundancy and trade union resistance", "Technical breakdown risk"],
          sampleStrongAnswer: "Capital cost of $1.2m must be weighed against ABP's declining profit margins...",
        },
      },
      {
        id: "abp-q1b",
        partNumber: "Question 1(b)",
        marks: 12,
        commandWord: "Evaluate Option 1 vs Option 2 and recommend",
        topicCode: "4.1",
        questionText: "Consider Option 1 (investing $1.2m in robotic automation) and Option 2 (hiring 25 lab technicians). Recommend which option ABP should choose. Justify your answer.",
        aoFocus: "AO1 (2m) + AO2 (2m) + AO3 (4m) + AO4 (4m)",
        rubric: {
          ao1Max: 2,
          ao2Max: 2,
          ao3Max: 4,
          ao4Max: 4,
          indicativeContent: ["Evaluate robotics throughput and 0.02% precision", "Evaluate technician flexibility and lower initial capital", "Justified decision based on hospital quality criteria"],
          sampleStrongAnswer: "Option 1 robotics is recommended because hospital diagnostic accuracy is paramount...",
        },
      },
    ],
  },
];

export function getAllPaper2CaseStudies(): Paper2CaseStudy[] {
  return [OFFICIAL_2027_SPECIMEN_PAPER_2, ...OTHER_PAPER2_CASE_STUDIES];
}
