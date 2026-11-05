export interface FinanceExamQuestion {
  id: string;
  questionNumber: string; // "Question 1(a)", "Question 1(b)", etc.
  topicRef: "5.1" | "5.2";
  topicTitle: string;
  marks: 8 | 12;
  subParts?: {
    label: string;
    marks: number;
    text: string;
  }[];
  commandWord: string;
  prompt: string;
  context: string;
  aoTarget: string;
  rubric: {
    ao1Max: number;
    ao2Max: number;
    ao3Max: number;
    ao4Max: number;
    indicativePoints: string[];
    sampleModelAnswer: string;
  };
  tableData?: {
    headers: string[];
    rows: { metric: string; m1: string; m2: string; m3: string; isInput?: boolean }[];
  };
}

export interface FinancePaper2CaseInsert {
  businessName: string;
  businessType: string;
  industry: string;
  annualOutput: string;
  unitPrice: string;
  narrativeBackground: string;
  operationalContext: string;
  financialHighlights: { label: string; value: string; detail: string }[];
  appendix1CashFlow: {
    title: string;
    headers: string[];
    rows: { item: string; m1: string; m2: string; m3: string; isCalculated?: boolean }[];
    notes: string[];
  };
  appendix2Memo: {
    from: string;
    to: string;
    date: string;
    subject: string;
    body: string;
  };
  appendix3Terms: {
    title: string;
    options: { name: string; terms: string; risk: string }[];
  };
  applicationHooks: string[];
}

export interface FinanceExamSpec {
  id: string;
  title: string;
  paperName: string;
  syllabus: string;
  topicsCovered: string[];
  totalMarks: number;
  timeAllowedMinutes: number;
  caseInsert: FinancePaper2CaseInsert;
  questions: FinanceExamQuestion[];
}

export const FINANCE_EXAM_PAPER_2_SPEC: FinanceExamSpec = {
  id: "cie-business-finance-p2-5-1-5-2",
  title: "CIE Business 0264 — Paper 2 Finance Examination",
  paperName: "Paper 2 Case Study (Topics 5.1 & 5.2)",
  syllabus: "Cambridge IGCSE 0264",
  topicsCovered: [
    "5.1 Business finance: needs and sources (Internal vs External, Bank loans, Shares, Debtors)",
    "5.2 Cash-flow forecasting and working capital (Cash vs profit, Cash flow tables, Liquidity remedies)",
  ],
  totalMarks: 40,
  timeAllowedMinutes: 45,
  caseInsert: {
    businessName: "Vanguard Craft Instruments (VCI)",
    businessType: "Private Limited Company (Ltd)",
    industry: "Handcrafted & Precision Concert Guitars",
    annualOutput: "1,440 guitars / year (120 guitars / month)",
    unitPrice: "$1,400 retail price ($900 wholesale to music shops)",
    narrativeBackground: `Vanguard Craft Instruments (VCI) was founded 6 years ago by two master luthiers, Elena Rostova and David Chen. Originally run as an equal partnership, the founders incorporated VCI as a Private Limited Company (Ltd) 3 years ago to obtain limited liability and protect their personal assets. Elena and David each own 50% of the ordinary voting shares.

VCI designs and handcrafts acoustic and semi-acoustic guitars using aged tone-woods (spruce, maple, and rosewood). The company has earned an international reputation for acoustic resonance, supplying 45 boutique music retailers in Country X and exporting 25% of its guitars to Country Z. 

Due to a recent endorsement by a renowned recording artist, export orders from Country Z have surged by 50%. To satisfy this demand, VCI must expand its workshop by purchasing an automated computer-controlled CNC tone-wood carving machine costing $180,000. However, rapid growth has placed acute strain on working capital, pushing VCI into an alarming cash-flow deficit.`,

    operationalContext: `Workshop and Staffing Data:
• VCI operates one workshop employing 18 skilled woodworking artisans earning an average of $22 per hour.
• Production is currently batch-crafted: skilled workers manually carve and sand each guitar body.
• The proposed $180,000 CNC machine will automate precision rough-carving, doubling capacity to 240 guitars per month while reducing wood scrap waste by 35%.
• Retained profit currently held in VCI's bank reserve totals $45,000.

Credit Terms Mismatch:
• Credit terms given to retailers: Music stores are allowed 60 days to pay invoices after receiving guitars.
• Credit terms demanded by timber suppliers: Rare tone-wood suppliers in North America demand settlement strictly within 30 days.
• Because timber must be purchased and seasoned two months before guitar completion, VCI suffers a severe 90-day working capital lag.`,

    financialHighlights: [
      { label: "CNC Machine Capital Cost", value: "$180,000", detail: "Required for export expansion" },
      { label: "Current Retained Profit", value: "$45,000", detail: "Accumulated cash reserves" },
      { label: "Monthly Output & Wholesale Price", value: "120 units @ $900", detail: "Monthly wholesale revenue ~$108k" },
      { label: "Existing Overdraft Limit", value: "$10,000", detail: "Currently drawn to $8,000 at 14% APR" },
      { label: "Month 3 Forecast Closing Deficit", value: "-$12,000", detail: "Breaches existing overdraft limit by $2,000" },
      { label: "Retailer Receivables Outstanding", value: "$85,000", detail: "60-day credit extended to shops" },
    ],

    appendix1CashFlow: {
      title: "Appendix 1: Extract from VCI's Q3 Cash-Flow Forecast (July – September, all in $000)",
      headers: ["Cash Flow Item ($000)", "Month 1 (July)", "Month 2 (August)", "Month 3 (September)"],
      rows: [
        { item: "Cash Inflow: Cash guitar sales & retailer invoice receipts", m1: "$35", m2: "$42", m3: "$30" },
        { item: "Cash Outflow: Tone-wood purchases (30-day supplier credit)", m1: "$18", m2: "$26", m3: "$22" },
        { item: "Cash Outflow: Artisan wages ($22/hr)", m1: "$8", m2: "$12", m3: "$12" },
        { item: "Cash Outflow: Workshop rent, power, insurance & overheads", m1: "$4", m2: "$10", m3: "$10" },
        { item: "Total Cash Outflows", m1: "$30", m2: "$48", m3: "$44" },
        { item: "Net Cash Flow (Inflows minus Outflows)", m1: "+$5", m2: "[ (a)(i) ? ]", m3: "[ (a)(i) ? ]", isCalculated: true },
        { item: "Opening Bank Balance", m1: "$3", m2: "$8", m3: "[ (a)(ii) ? ]" },
        { item: "Closing Bank Balance (Opening plus Net)", m1: "$8", m2: "[ (a)(ii) ? ]", m3: "[ (a)(ii) ? ]", isCalculated: true },
      ],
      notes: [
        "VCI currently has an agreed bank overdraft facility of $10,000.",
        "Month 2 outflows increased due to bulk timber purchases for the Country Z export run.",
        "In Month 3, retail customer receipts dropped to $30k because several retailers delayed settlement.",
      ],
    },

    appendix2Memo: {
      from: "Marcus Vance, Finance Director",
      to: "Elena Rostova & David Chen, Joint Managing Directors",
      date: "18 October 2026",
      subject: "URGENT: Liquidity Bottleneck & Financing Options for $180k CNC Machine",
      body: `Elena and David,

Our Q3 cash forecast indicates that without immediate management action, our bank balance will plunge to -$12,000 at the end of September. This breaches our current $10,000 bank overdraft limit. The commercial bank has warned that cheques will be dishonoured if we exceed $10,000 without prior authorization.

At the same time, we must finalize the funding method for the $180,000 CNC tone-wood machine. We have three proposals:
1. Commercial Bank Loan: City Commercial Bank will lend us $180,000 over 5 years at 7.0% fixed annual interest. The monthly repayment will be $3,564. The bank requires a legal charge over our workshop premises.
2. Retained Profit ($45,000) plus Bank Overdraft: Use all our $45,000 cash reserves and borrow the remaining $135,000 via overdraft.
3. Private Angel Equity: SoundWave Ventures has offered $180,000 in cash in exchange for a 25% shareholding and a seat on our board of directors.

Please review these options so we can present our decision at the upcoming board meeting.`,
    },

    appendix3Terms: {
      title: "Appendix 3: Summary Comparison of Funding Proposals for $180,000 Machine",
      options: [
        {
          name: "5-Year Fixed Bank Loan",
          terms: "$180,000 principal at 7.0% fixed interest over 60 months ($3,564/month).",
          risk: "Requires legal charge on workshop. Repayments compulsory regardless of guitar sales.",
        },
        {
          name: "Retained Profit + Bank Overdraft",
          terms: "$45,000 internal cash reserve used immediately; $135,000 borrowed on short-term overdraft.",
          risk: "Depletes 100% of emergency cash buffers. High 14% interest rate; bank can recall on 24hr notice.",
        },
        {
          name: "Private Angel Equity (SoundWave)",
          terms: "$180,000 injected in cash for 25% ordinary equity shares + 1 board seat.",
          risk: "Founders' ownership diluted from 50/50 to 37.5/37.5/25. Loss of full artistic independence.",
        },
      ],
    },

    applicationHooks: [
      "VCI is an Ltd with 2 founding luthiers (Elena & David) owning 50% each",
      "Current output: 120 guitars/month selling wholesale at $900 each",
      "$180,000 capital cost for automated CNC tone-wood carving machine",
      "Retained profit available: $45,000 (accumulated past trading reserves)",
      "Bank loan terms: 5 years, 7% fixed interest, $3,564/month, secured on workshop",
      "Angel investor (SoundWave) offers $180k for 25% equity and board seat",
      "Credit terms mismatch: 60 days given to shops vs 30 days allowed by timber suppliers",
      "Q3 forecast: Month 2 Net Cash Flow is -$6,000; Month 3 Net Cash Flow is -$14,000",
      "Month 3 closing bank balance drops to -$12,000 (breaches $10,000 overdraft limit by $2,000)",
      "18 skilled artisans earning $22/hour ($12,000 monthly wage bill)",
      "Tonewood suppliers require rare aged spruce; credit delays could stop deliveries",
    ],
  },

  questions: [
    {
      id: "p2-fe-q1a",
      questionNumber: "Question 1(a)",
      topicRef: "5.1",
      topicTitle: "5.1 Business finance: needs and sources",
      marks: 8,
      commandWord: "Explain two internal and two external sources of finance",
      prompt:
        "Explain two internal sources and two external sources of finance that VCI could consider to fund its ongoing operations and workshop equipment.",
      context: "VCI is evaluating how to fund its general business operations without excessive risk.",
      aoTarget: "AO1 Knowledge (2m) + AO2 Application (2m) + AO3 Analysis (4m)",
      rubric: {
        ao1Max: 2,
        ao2Max: 2,
        ao3Max: 4,
        ao4Max: 0,
        indicativePoints: [
          "Internal Source 1: Retained profit (AO1) — Reinvesting from VCI's $45,000 cash reserves from selling 120 guitars/month (AO2), incurring zero interest and zero debt obligations (AO3).",
          "Internal Source 2: Sale of redundant workshop assets (AO1) — Selling surplus manual saws, wood planers, or obsolete workshop tooling (AO2) to raise immediate liquidity without interest (AO3).",
          "External Source 1: Bank loan (AO1) — Borrowing from City Commercial Bank at 7% fixed interest (AO2), providing structured multi-year capital with predictable $3,564 monthly payments (AO3).",
          "External Source 2: Issuing new ordinary shares (AO1) — Selling 25% equity to private angel SoundWave Ventures (AO2), raising non-repayable equity that eliminates debt servicing strain (AO3).",
        ],
        sampleModelAnswer:
          "Internal Source 1 (Retained Profit): VCI can use part of the $45,000 in past accumulated trading profits from selling its 120 monthly guitars. This requires no interest repayments, maintaining high profit margins.\nInternal Source 2 (Sale of Redundant Assets): VCI could sell off obsolete manual woodworking machinery and spare workshop fixtures. This immediately releases tied-up capital with zero debt obligations.\nExternal Source 1 (Bank Loan): VCI could obtain a 5-year fixed loan from City Commercial Bank at 7% interest. This provides the full capital upfront for the $180,000 CNC machine, allowing repayments to be spread out predictably over 60 months.\nExternal Source 2 (Issuing Ordinary Shares): VCI could issue new equity shares to an angel investor like SoundWave Ventures. Unlike a loan, equity never has to be repaid and does not incur monthly interest charges, preserving working capital.",
      },
    },
    {
      id: "p2-fe-q1b",
      questionNumber: "Question 1(b)",
      topicRef: "5.1",
      topicTitle: "5.1 Business finance: needs and sources",
      marks: 12,
      commandWord: "Evaluate three sources and recommend with justification",
      prompt:
        "VCI requires $180,000 to purchase the automated CNC tone-wood machine. Consider the following three sources of finance:\n• Option 1: A 5-year commercial bank loan at 7.0% fixed interest\n• Option 2: Using all $45,000 retained profits plus a $135,000 bank overdraft\n• Option 3: Issuing ordinary shares for 25% equity to SoundWave Ventures\n\nRecommend which source of finance VCI should choose. Justify your answer.",
      context: "Refer to the narrative, Appendix 2, and Appendix 3.",
      aoTarget: "AO1 Knowledge (2m) + AO2 Application (2m) + AO3 Analysis (4m) + AO4 Evaluation (4m)",
      rubric: {
        ao1Max: 2,
        ao2Max: 2,
        ao3Max: 4,
        ao4Max: 4,
        indicativePoints: [
          "Analyse Option 1 (Bank Loan): 7% fixed rate provides predictable $3,564 monthly payments over 60 months; interest is tax-deductible; founders keep 100% ownership. However, creates compulsory debt servicing and requires workshop as collateral security.",
          "Analyse Option 2 (Retained profit + Overdraft): Avoids share dilution, but completely wipes out VCI's $45,000 emergency buffer and borrows $135,000 at high 14% overdraft rates; bank can demand repayment in 24 hours, creating severe insolvency risk alongside the existing -$12,000 Q3 deficit.",
          "Analyse Option 3 (Angel Equity): $180,000 is permanent capital with no debt repayments, relieving cash-flow pressure. However, dilutes Elena and David's 50/50 control to 37.5% each, and the angel receives 25% of all future profits and a board seat, risking conflict over guitar craftsmanship.",
          "Evaluative Justification: Option 1 (Bank Loan) is recommended. Doubling guitar capacity to 240 units/month generates ample revenue to easily cover the $3,564 monthly payment. Overdraft is too hazardous for long-term machinery, and equity permanently surrenders 25% control over a boutique business.",
        ],
        sampleModelAnswer:
          "Option 1 (Bank Loan) matches the long-term nature of capital expenditure (matching principle). The 7% fixed rate guarantees predictable $3,564 monthly repayments over 5 years. Crucially, Elena and David retain 100% ownership and artistic independence. Once the $180,000 CNC machine is fully paid off, all increased profits from the 50% export surge belong entirely to the founders. The main drawback is that the loan is secured against the workshop, creating foreclosure risk if VCI defaults.\n\nOption 2 (Retained Profit + Overdraft) is financially dangerous. Depleting all $45,000 in cash leaves VCI with zero liquidity cushion during a period when Month 3 closing cash is already negative (-$12,000). Furthermore, funding fixed capital with a $135,000 overdraft violates the matching principle: overdrafts have high variable interest (14%) and can be recalled on 24 hours' notice, causing sudden bankruptcy.\n\nOption 3 (Angel Equity) provides $180,000 without debt repayments, which immediately shields VCI's fragile cash flow. However, surrendering a 25% equity stake permanently dilutes the founders from 50% each to 37.5%, meaning they lose sole control. SoundWave Ventures will demand dividend payouts and may push for mass-production over handcrafted luthier quality.\n\nRecommendation: VCI should choose Option 1 (Bank Loan). Because export demand in Country Z is expanding by 50% and the CNC machine doubles monthly output to 240 guitars, VCI's monthly wholesale revenue will exceed $180,000, easily absorbing the $3,564 loan repayments. Surrendering 25% permanent equity is an excessive price for a temporary capital purchase, while using an overdraft invites insolvency.",
      },
    },
    {
      id: "p2-fe-q2a",
      questionNumber: "Question 2(a)",
      topicRef: "5.2",
      topicTitle: "5.2 Cash-flow forecasting and working capital",
      marks: 8,
      subParts: [
        { label: "(i)", marks: 2, text: "Calculate the Net Cash Flow for Month 2 (August) and Month 3 (September). Show your working." },
        { label: "(ii)", marks: 2, text: "Calculate the Closing Bank Balance for Month 2 and Month 3." },
        { label: "(iii)", marks: 4, text: "Explain two reasons why VCI forecasts a profitable trading quarter but suffers a negative cash balance in Month 3." },
      ],
      commandWord: "Calculate and Explain",
      prompt:
        "Refer to the Cash-Flow Forecast extract in Appendix 1:\n(i) Calculate the Net Cash Flow for Month 2 (August) and Month 3 (September). [2 marks]\n(ii) Calculate the Closing Bank Balance for Month 2 and Month 3. [2 marks]\n(iii) Explain two reasons why VCI expects to earn an accounting profit on guitar sales but experiences an overdrawn cash balance in Month 3. [4 marks]",
      context: "Refer to Appendix 1 and operational data.",
      tableData: {
        headers: ["Cash Flow Item ($000)", "Month 1 (July)", "Month 2 (August)", "Month 3 (September)"],
        rows: [
          { metric: "Cash Inflows (Guitar sales cash & receipts)", m1: "$35", m2: "$42", m3: "$30" },
          { metric: "Cash Outflows (Tone-wood, wages, overheads)", m1: "$30", m2: "$48", m3: "$44" },
          { metric: "Net Cash Flow (Inflows minus Outflows)", m1: "+$5", m2: "[ (i) ? ]", m3: "[ (i) ? ]", isInput: true },
          { metric: "Opening Bank Balance", m1: "$3", m2: "$8", m3: "[ (ii) ? ]" },
          { metric: "Closing Bank Balance (Opening plus Net)", m1: "$8", m2: "[ (ii) ? ]", m3: "[ (ii) ? ]", isInput: true },
        ],
      },
      aoTarget: "AO1 Knowledge (2m) + AO2 Application (4m) + AO3 Analysis (2m)",
      rubric: {
        ao1Max: 2,
        ao2Max: 4,
        ao3Max: 2,
        ao4Max: 0,
        indicativePoints: [
          "(i) Net Cash Flow Month 2 = Inflows ($42k) – Outflows ($48k) = -$6,000 (negative $6k). Net Cash Flow Month 3 = Inflows ($30k) – Outflows ($44k) = -$14,000 (negative $14k).",
          "(ii) Closing Bank Balance Month 2 = Opening ($8k) + Net (-$6k) = +$2,000 ($2k). Month 3 Opening = $2k; Closing Balance Month 3 = Opening ($2k) + Net (-$14k) = -$12,000 (overdraft deficit of ($12,000)).",
          "(iii) Reason 1 (Credit terms mismatch): VCI allows retailers 60 days of credit, so revenue and accounting profit are booked when guitars are delivered, but actual cash receipts are delayed. Reason 2 (Upfront cash outflows for inventory): VCI had to pay cash upfront within 30 days for $26k of rare tonewood in Month 2 to prepare for the Country Z export run before any customer cash was banked.",
        ],
        sampleModelAnswer:
          "(i) Net Cash Flow Calculations:\n• Month 2 (August): $42,000 (Inflows) – $48,000 (Outflows) = -$6,000 (Deficit of $6,000)\n• Month 3 (September): $30,000 (Inflows) – $44,000 (Outflows) = -$14,000 (Deficit of $14,000)\n\n(ii) Closing Bank Balance Calculations:\n• Month 2: Opening Balance $8,000 + Net Cash Flow (-$6,000) = $2,000\n• Month 3: Opening Balance $2,000 + Net Cash Flow (-$14,000) = -$12,000 (Overdrawn by $12,000)\n\n(iii) Two Reasons for the Discrepancy Between Profit and Cash:\n1. Timing of Credit Sales: Profit is recognized when guitars are invoiced to music stores at $900 wholesale. However, VCI grants 60-day credit terms, meaning $85,000 in revenue remains locked in trade receivables, delaying cash inflow.\n2. Upfront Cash Outflows for Raw Tone-wood: In Month 2, VCI purchased $26,000 of rare spruce and maple for export orders. Tone-wood suppliers allow only 30-day terms, forcing immediate cash drain before customer payments arrived.",
      },
    },
    {
      id: "p2-fe-q2b",
      questionNumber: "Question 2(b)",
      topicRef: "5.2",
      topicTitle: "5.2 Cash-flow forecasting and working capital",
      marks: 12,
      commandWord: "Evaluate two solutions and recommend with justification",
      prompt:
        "In Month 3, VCI forecasts a closing bank balance of -$12,000, which exceeds its current $10,000 bank overdraft limit. The directors are considering two solutions to solve this liquidity deficit:\n• Solution 1: Negotiate a temporary extension of its bank overdraft limit from $10,000 to $25,000.\n• Solution 2: Delay payments to its tone-wood and guitar component suppliers by an additional 60 days (extending supplier credit from 30 days to 90 days).\n\nEvaluate Solution 1 and Solution 2. Recommend which solution VCI should implement. Justify your answer.",
      context: "Refer to narrative background and Appendix 1.",
      aoTarget: "AO1 Knowledge (2m) + AO2 Application (2m) + AO3 Analysis (4m) + AO4 Evaluation (4m)",
      rubric: {
        ao1Max: 2,
        ao2Max: 2,
        ao3Max: 4,
        ao4Max: 4,
        indicativePoints: [
          "Evaluate Solution 1 (Overdraft extension to $25,000): Provides immediate buffer covering the -$12,000 deficit and leaves $13,000 headroom; interest is only paid on the drawn amount; maintains supplier goodwill. However, bank charges high interest rates (14% APR) and can demand immediate repayment.",
          "Evaluate Solution 2 (Delaying supplier payments to 90 days): Zero direct interest cost; immediately preserves $22k-$26k in cash per month. However, tone-wood suppliers may place VCI on credit stop, refuse to deliver rare spruce and rosewood, halting guitar production and ruining customer contracts.",
          "Synthesis & Justified Recommendation: Solution 1 (Overdraft extension) is overwhelmingly superior. Craft guitars cannot be made without premium timber; alienating specialist suppliers will halt the entire factory. Because the -$12,000 deficit is purely temporary (caused by 60-day retailer credit), cash will flood in once August receivables arrive, clearing the overdraft quickly.",
        ],
        sampleModelAnswer:
          "Solution 1 (Overdraft limit extended to $25,000) offers quick and flexible emergency liquidity. It immediately covers the -$12,000 September deficit and provides a $13,000 safety cushion. Interest is charged only on the exact daily overdrawn balance. Because VCI has $85,000 in trade receivables due from music retailers in October, the overdraft is a temporary bridge that will be cleared as soon as customer payments arrive. The downside is that overdraft interest rates are high (14%), and the bank could technically demand repayment on short notice.\n\nSolution 2 (Delaying supplier payments by 60 days) preserves approximately $22,000 in monthly cash outflows with zero bank interest charges. However, this strategy carries catastrophic operational risks. Premium acoustic guitars depend entirely on specialised tone-wood suppliers for rare Sitka spruce and rosewood. If VCI unilaterally postpones payments to 90 days, timber merchants may cancel deliveries, demand cash on delivery (COD), or charge penalty rates. Without timber, VCI's 18 artisans cannot assemble guitars, causing export order cancellations from Country Z.\n\nRecommendation: VCI should adopt Solution 1 (extend the bank overdraft to $25,000). Maintaining supplier trust is critical for a high-end craftsman business where material quality is the core selling point. The overdraft interest expense of a few hundred dollars is negligible compared to the thousands of dollars in lost wholesale sales if guitar production ceases due to a timber boycott.",
      },
    },
  ],
};
