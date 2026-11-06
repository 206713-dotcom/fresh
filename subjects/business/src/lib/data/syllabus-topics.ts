export interface SyllabusTopic {
  code: string; // e.g. "5.1"
  title: string; // e.g. "Business finance: needs and sources"
  sectionCode: string; // e.g. "5"
  sectionTitle: string; // e.g. "Financial information and decisions"
  keyConcepts: string[];
  commandWordEmphasis: string[];
  sampleQuestionsCount: number;
}

export interface SyllabusSection {
  code: string;
  title: string;
  description: string;
  consolidationDocUrl?: string;
  topics: SyllabusTopic[];
}

export const SYLLABUS_SECTIONS: SyllabusSection[] = [
  {
    code: "1",
    title: "1. Understanding business activity",
    description: "Core purpose of business, scarcity, added value, classification, enterprise, legal forms, and objectives.",
    consolidationDocUrl: "https://docs.google.com/document/d/1vhY8qBmVvCjDHAq8BbR1SblXaNw8lv5hrxvEcioENOw/edit?tab=t.0",
    topics: [
      {
        code: "1.1",
        title: "1.1 Business activity",
        sectionCode: "1",
        sectionTitle: "Understanding business activity",
        keyConcepts: ["Needs vs Wants", "Scarcity & Opportunity Cost", "Factors of Production", "Specialisation", "Added Value"],
        commandWordEmphasis: ["Define", "State", "Explain", "Calculate"],
        sampleQuestionsCount: 8,
      },
      {
        code: "1.2",
        title: "1.2 Classification of businesses",
        sectionCode: "1",
        sectionTitle: "Understanding business activity",
        keyConcepts: ["Primary, Secondary, Tertiary sectors", "De-industrialisation", "Public vs Private Sector", "Mixed economy"],
        commandWordEmphasis: ["State", "Outline", "Explain"],
        sampleQuestionsCount: 6,
      },
      {
        code: "1.3",
        title: "1.3 Enterprise, business growth and size",
        sectionCode: "1",
        sectionTitle: "Understanding business activity",
        keyConcepts: ["Entrepreneur characteristics", "Business plans", "Measuring business size", "Internal vs External growth", "Mergers & Takeovers"],
        commandWordEmphasis: ["Identify", "Explain", "Discuss"],
        sampleQuestionsCount: 9,
      },
      {
        code: "1.4",
        title: "1.4 Types of business organisation",
        sectionCode: "1",
        sectionTitle: "Understanding business activity",
        keyConcepts: ["Sole trader", "Partnerships", "Private limited company (Ltd)", "Public limited company (Plc)", "Franchises", "Joint ventures", "Limited liability"],
        commandWordEmphasis: ["Outline", "Explain", "Recommend", "Evaluate"],
        sampleQuestionsCount: 12,
      },
      {
        code: "1.5",
        title: "1.5 Business objectives and stakeholder objectives",
        sectionCode: "1",
        sectionTitle: "Understanding business activity",
        keyConcepts: ["SMART objectives", "Survival, Profit, Growth, Market Share, CSR", "Internal & External stakeholders", "Stakeholder conflicts"],
        commandWordEmphasis: ["Identify", "Explain", "Evaluate"],
        sampleQuestionsCount: 8,
      },
    ],
  },
  {
    code: "2",
    title: "2. People in business",
    description: "Worker motivation, management structures, recruitment, selection, training, and workplace communication.",
    consolidationDocUrl: "https://docs.google.com/document/d/1CPrZbJA-8uhA_tP45FKHjo3pWFHPYnE2q7zL--IYPT8/edit?tab=t.0",
    topics: [
      {
        code: "2.1",
        title: "2.1 Motivating employees",
        sectionCode: "2",
        sectionTitle: "People in business",
        keyConcepts: ["Taylor scientific management", "Maslow hierarchy", "Herzberg hygiene vs motivators", "Financial rewards (wages, piece rate, commission, bonus)", "Non-financial rewards (job rotation, enrichment, enlargement)"],
        commandWordEmphasis: ["Explain", "Compare", "Recommend"],
        sampleQuestionsCount: 11,
      },
      {
        code: "2.2",
        title: "2.2 Organisation and management",
        sectionCode: "2",
        sectionTitle: "People in business",
        keyConcepts: ["Organisational hierarchy", "Span of control", "Chain of command", "Delayering", "Delegation", "Autocratic, Democratic, Laissez-faire leadership", "Trade unions"],
        commandWordEmphasis: ["Outline", "Explain", "Discuss"],
        sampleQuestionsCount: 10,
      },
      {
        code: "2.3",
        title: "2.3 Recruitment, selection and training",
        sectionCode: "2",
        sectionTitle: "People in business",
        keyConcepts: ["Job analysis, description, specification", "Internal vs External recruitment", "Selection methods", "Induction, On-the-job, Off-the-job training", "Redundancy vs Dismissal", "Employment law"],
        commandWordEmphasis: ["Explain", "Recommend", "Evaluate"],
        sampleQuestionsCount: 12,
      },
      {
        code: "2.4",
        title: "2.4 Internal and external communication",
        sectionCode: "2",
        sectionTitle: "People in business",
        keyConcepts: ["Communication channels", "One-way vs Two-way communication", "Verbal, Written, Visual methods", "Barriers to communication & remedies"],
        commandWordEmphasis: ["Identify", "Explain", "Outline"],
        sampleQuestionsCount: 7,
      },
    ],
  },
  {
    code: "3",
    title: "3. Marketing",
    description: "Customer focus, market research, marketing mix (Product, Price, Place, Promotion), and marketing strategy.",
    consolidationDocUrl: "https://docs.google.com/document/d/1Qc3OYlT0VTAUUckaefMS7ynq3h41SvmqpdaZZBf_yWM/edit?tab=t.0",
    topics: [
      {
        code: "3.1",
        title: "3.1 Marketing, competition and the customer",
        sectionCode: "3",
        sectionTitle: "Marketing",
        keyConcepts: ["Market orientation vs Product orientation", "Market share", "Mass marketing vs Niche marketing", "Market segmentation (age, gender, income, geographic)"],
        commandWordEmphasis: ["Define", "Explain", "Discuss"],
        sampleQuestionsCount: 9,
      },
      {
        code: "3.2",
        title: "3.2 Market research",
        sectionCode: "3",
        sectionTitle: "Marketing",
        keyConcepts: ["Primary research (questionnaires, interviews, focus groups, observation)", "Secondary research (internal, government, reports)", "Quantitative vs Qualitative data", "Sampling reliability"],
        commandWordEmphasis: ["Explain", "Evaluate", "Recommend"],
        sampleQuestionsCount: 11,
      },
      {
        code: "3.3",
        title: "3.3 Marketing mix - Product",
        sectionCode: "3",
        sectionTitle: "Marketing",
        keyConcepts: ["Product Life Cycle (introduction, growth, maturity, decline)", "Extension strategies", "Boston Matrix (Star, Cash Cow, Dog, Problem Child)", "Branding and brand loyalty", "Packaging functions"],
        commandWordEmphasis: ["Explain", "Discuss", "Analyse"],
        sampleQuestionsCount: 10,
      },
      {
        code: "3.4",
        title: "3.4 Marketing mix - Price",
        sectionCode: "3",
        sectionTitle: "Marketing",
        keyConcepts: ["Cost-plus pricing", "Penetration pricing", "Price skimming", "Competitive pricing", "Promotional pricing", "Dynamic pricing", "Price elasticity of demand (PED)"],
        commandWordEmphasis: ["Define", "Calculate", "Recommend"],
        sampleQuestionsCount: 12,
      },
      {
        code: "3.5",
        title: "3.5 Marketing mix - Place",
        sectionCode: "3",
        sectionTitle: "Marketing",
        keyConcepts: ["Distribution channels (direct, retailer, wholesaler, agent)", "E-commerce advantages & disadvantages", "Logistics and transport"],
        commandWordEmphasis: ["Explain", "Recommend"],
        sampleQuestionsCount: 8,
      },
      {
        code: "3.6",
        title: "3.6 Marketing mix - Promotion",
        sectionCode: "3",
        sectionTitle: "Marketing",
        keyConcepts: ["Above-the-line advertising (TV, radio, newspapers, digital)", "Below-the-line sales promotions (BOGOF, coupons, sponsorship, PR)", "Target demographic reach"],
        commandWordEmphasis: ["Outline", "Evaluate", "Discuss"],
        sampleQuestionsCount: 9,
      },
      {
        code: "3.7",
        title: "3.7 Marketing strategy",
        sectionCode: "3",
        sectionTitle: "Marketing",
        keyConcepts: ["Cohesive marketing mix", "Entering new foreign markets", "Legal controls on marketing and consumer protection"],
        commandWordEmphasis: ["Evaluate", "Justify"],
        sampleQuestionsCount: 7,
      },
    ],
  },
  {
    code: "4",
    title: "4. Operations management",
    description: "Production methods, costs, scale, break-even analysis, quality assurance, and site location decisions.",
    consolidationDocUrl: "https://docs.google.com/document/d/141lWIHYvK53CSvJDF9SfmAjYvqRA0MKgX_-ixOUT58A/edit?tab=t.0",
    topics: [
      {
        code: "4.1",
        title: "4.1 Production of goods and services",
        sectionCode: "4",
        sectionTitle: "Operations management",
        keyConcepts: ["Job production", "Batch production", "Flow / Mass production", "Lean production", "Kaizen (continuous improvement)", "Just-In-Time (JIT)", "Cell production", "Automation & robotics"],
        commandWordEmphasis: ["Compare", "Explain", "Recommend"],
        sampleQuestionsCount: 10,
      },
      {
        code: "4.2",
        title: "4.2 Costs, scale of production and break-even",
        sectionCode: "4",
        sectionTitle: "Operations management",
        keyConcepts: ["Fixed costs", "Variable costs", "Total cost", "Average cost per unit", "Internal economies of scale (purchasing, technical, financial, managerial)", "Diseconomies of scale", "Break-even chart, formula & margin of safety"],
        commandWordEmphasis: ["Define", "Calculate", "Analyse"],
        sampleQuestionsCount: 14,
      },
      {
        code: "4.3",
        title: "4.3 Achieving quality production",
        sectionCode: "4",
        sectionTitle: "Operations management",
        keyConcepts: ["Quality control (inspection at end)", "Quality assurance (checks at each stage)", "Total Quality Management (TQM)", "Customer satisfaction and waste reduction"],
        commandWordEmphasis: ["Explain", "Compare", "Discuss"],
        sampleQuestionsCount: 8,
      },
      {
        code: "4.4",
        title: "4.4 Location decisions",
        sectionCode: "4",
        sectionTitle: "Operations management",
        keyConcepts: ["Factors influencing manufacturing location (raw materials, transport, labour, rent, power)", "Factors influencing service location (customers, competition, technology)", "Relocating abroad"],
        commandWordEmphasis: ["Outline", "Evaluate", "Recommend"],
        sampleQuestionsCount: 9,
      },
    ],
  },
  {
    code: "5",
    title: "5. Financial information and decisions",
    description: "Sources of business finance, cash-flow forecasting, working capital, income statements, balance sheets, and ratio analysis.",
    consolidationDocUrl: "https://docs.google.com/document/d/1PdKDA-jKsDHv-ndiCXo4Ema7J-YQwkOznqjDIYWDlIs/edit?tab=t.0",
    topics: [
      {
        code: "5.1",
        title: "5.1 Business finance: needs and sources",
        sectionCode: "5",
        sectionTitle: "Financial information and decisions",
        keyConcepts: [
          "Start-up capital vs expansion capital",
          "Capital expenditure (fixed assets) vs Revenue expenditure (daily costs)",
          "Internal sources: Retained profit, Sale of assets, Owner savings",
          "External sources: Bank overdraft, Bank loan, Ordinary share issue, Trade credit, Leasing, Hire purchase, Debentures, Venture capital, Government grants",
          "Factors affecting choice: Amount, Duration, Cost/interest, Gearing risk, Control loss"
        ],
        commandWordEmphasis: ["Define", "Outline", "Explain", "Evaluate", "Recommend"],
        sampleQuestionsCount: 16,
      },
      {
        code: "5.2",
        title: "5.2 Cash-flow forecasting and working capital",
        sectionCode: "5",
        sectionTitle: "Financial information and decisions",
        keyConcepts: [
          "Difference between cash and profit",
          "Cash inflows, Cash outflows, Net cash flow",
          "Opening balance + Net cash flow = Closing balance",
          "Working capital cycle (Current Assets – Current Liabilities)",
          "Cash flow problems and insolvency",
          "Remedies: Overdraft, Factoring, Delay payables, Speed up receivables, Reduce inventory, Postpone capital spending"
        ],
        commandWordEmphasis: ["Define", "Calculate", "Explain", "Evaluate"],
        sampleQuestionsCount: 15,
      },
      {
        code: "5.3",
        title: "5.3 Income statements",
        sectionCode: "5",
        sectionTitle: "Financial information and decisions",
        keyConcepts: ["Revenue", "Cost of sales", "Gross profit", "Expenses / Overheads", "Profit for the year (net profit)", "Retained profit", "Uses of income statements by stakeholders"],
        commandWordEmphasis: ["Calculate", "Explain", "Analyse"],
        sampleQuestionsCount: 11,
      },
      {
        code: "5.4",
        title: "5.4 Statement of financial position",
        sectionCode: "5",
        sectionTitle: "Financial information and decisions",
        keyConcepts: ["Non-current assets (tangible & intangible)", "Current assets (inventory, receivables, cash)", "Current liabilities (trade payables, overdraft)", "Non-current liabilities (bank loans)", "Working capital", "Capital employed"],
        commandWordEmphasis: ["Define", "Calculate", "Explain"],
        sampleQuestionsCount: 10,
      },
      {
        code: "5.5",
        title: "5.5 Analysis of accounts and ratio analysis",
        sectionCode: "5",
        sectionTitle: "Financial information and decisions",
        keyConcepts: [
          "Profitability ratios: Gross profit margin (%), Net profit margin (%), Return on Capital Employed / ROCE (%)",
          "Liquidity ratios: Current ratio (Current Assets / Current Liabilities), Acid test ratio ((Current Assets – Inventory) / Current Liabilities)",
          "Interpreting ratio trends 2024 vs 2025",
          "Limitations of financial statements"
        ],
        commandWordEmphasis: ["Calculate", "Analyse", "Evaluate"],
        sampleQuestionsCount: 14,
      },
    ],
  },
  {
    code: "6",
    title: "6. External influences on business activity",
    description: "Economic climate, government policy, inflation, interest rates, environmental issues, ethics, and globalisation.",
    topics: [
      {
        code: "6.1",
        title: "6.1 Economic issues",
        sectionCode: "6",
        sectionTitle: "External influences on business activity",
        keyConcepts: [
          "Business cycle (growth, boom, recession, recovery)",
          "Inflation and impact on costs and prices",
          "Unemployment and wage levels",
          "Economic growth (GDP)",
          "Government economic policies: Fiscal policy (taxes, government spending), Monetary policy (interest rates), Supply-side policies"
        ],
        commandWordEmphasis: ["Explain", "Discuss", "Evaluate"],
        sampleQuestionsCount: 12,
      },
      {
        code: "6.2",
        title: "6.2 Environmental and ethical issues",
        sectionCode: "6",
        sectionTitle: "External influences on business activity",
        keyConcepts: [
          "Social responsibility and sustainable development",
          "Externalities (external costs vs external benefits)",
          "Pressure groups and boycotts",
          "Ethical dilemmas: child labour, fair wages, animal testing, pollution",
          "Cost vs benefit of green packaging and renewable operations"
        ],
        commandWordEmphasis: ["Outline", "Explain", "Discuss"],
        sampleQuestionsCount: 10,
      },
      {
        code: "6.3",
        title: "6.3 Business and the international economy",
        sectionCode: "6",
        sectionTitle: "External influences on business activity",
        keyConcepts: [
          "Globalisation opportunities & threats",
          "Multinational companies (MNCs) impacts on host countries",
          "Free trade vs Protectionism: Tariffs, Quotas, Subsidies",
          "Exchange rate appreciation (SPICED: Stronger Pound Imports Cheaper Exports Dearer)",
          "Exchange rate depreciation (WPIDEC: Weaker Pound Imports Dearer Exports Cheaper)"
        ],
        commandWordEmphasis: ["Explain", "Evaluate", "Recommend"],
        sampleQuestionsCount: 11,
      },
    ],
  },
];

export function getTopicsForSection(sectionCode: string): SyllabusTopic[] {
  const section = SYLLABUS_SECTIONS.find((s) => s.code === sectionCode);
  return section ? section.topics : [];
}

export function getAllTopics(): SyllabusTopic[] {
  return SYLLABUS_SECTIONS.flatMap((s) => s.topics);
}

export function getTopicByCode(topicCode: string): SyllabusTopic | undefined {
  return getAllTopics().find((t) => t.code === topicCode);
}
