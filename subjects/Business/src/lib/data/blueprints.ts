import { Blueprint, DynamicScenario, MarkTier, PaperNumber } from "../types";

export const BLUEPRINTS: Blueprint[] = [
  // 1. Blueprint 1 (2 Marks, AO1 Knowledge): Exact Term Definition
  {
    id: "bp-2m-def",
    name: "01. Term Definition & Formal Conception",
    marks: 2,
    paper: "both",
    unit: "Unit 1: Understanding business activity",
    commandWord: "Define / Explain what is meant by",
    description: "Assesses precise knowledge (AO1) of a key syllabus business concept with zero ambiguity.",
    aoFocus: "AO1 Knowledge (2 marks)",
    templateFormat: "Define [Business Term / Concept].",
    rubric: {
      totalMarks: 2,
      ao1Max: 2,
      ao2Max: 0,
      ao3Max: 0,
      ao4Max: 0,
      descriptors: {
        ao1: [
          "2 marks: Clear and accurate formal textbook definition containing core technical components.",
          "1 mark: Partial understanding or vague colloquial definition lacking key terminology.",
          "0 marks: Inaccurate, circular, or no creditworthy response.",
        ],
        ao2: [],
        ao3: [],
      },
      indicativeContent: [
        "State precise technical definition.",
        "Include qualifying operational characteristics or purpose.",
      ],
      sampleStrongPoint: "Clear recognition of technical terms without colloquialisms or circular definitions.",
    },
  },

  // 2. Blueprint 2 (2 Marks, AO1 + AO2): Direct Calculation & Working
  {
    id: "bp-2m-calc",
    name: "02. Financial & Operational Quantitative Calculation",
    marks: 2,
    paper: "both",
    unit: "Unit 5: Financial information and decisions",
    commandWord: "Calculate",
    description: "Tests quantitative numeracy (AO1/AO2) using financial figures, unit formulas, and operations.",
    aoFocus: "AO1 Knowledge (1 mark) + AO2 Application (1 mark)",
    templateFormat: "Calculate [Metric] for [Business Name] using the data provided. Show your working.",
    rubric: {
      totalMarks: 2,
      ao1Max: 1,
      ao2Max: 1,
      ao3Max: 0,
      ao4Max: 0,
      descriptors: {
        ao1: ["1 mark: Correct mathematical formula or correct intermediate working steps shown."],
        ao2: ["1 mark: Correct numerical answer with appropriate units (e.g., $, %, units)."],
        ao3: [],
      },
      indicativeContent: [
        "Write standard Cambridge formula.",
        "Substitute provided scenario values accurately.",
        "State final value with currency symbol or unit of measurement.",
      ],
      sampleStrongPoint: "Accurate formula and arithmetic with correct follow-through.",
    },
  },

  // 3. Blueprint 3 (4 Marks, AO1 + AO2): Dual Contextual Factor Outline
  {
    id: "bp-4m-outline",
    name: "03. Dual Factor Contextual Outline",
    marks: 4,
    paper: "both",
    unit: "Unit 2: People in business",
    commandWord: "Outline two",
    description: "Requires identifying two separate points (AO1) and applying each directly to the case context (AO2).",
    aoFocus: "AO1 Knowledge (2 marks) + AO2 Application (2 marks)",
    templateFormat: "Outline two [reasons / effects / methods] of [Event / Strategy] on [Business Name].",
    rubric: {
      totalMarks: 4,
      ao1Max: 2,
      ao2Max: 2,
      ao3Max: 0,
      ao4Max: 0,
      descriptors: {
        ao1: ["1 mark for each relevant reason/method identified (maximum 2 marks)."],
        ao2: ["1 mark for each point developed in the specific context of the named business (maximum 2 marks)."],
        ao3: [],
      },
      indicativeContent: [
        "Point 1: State knowledge point clearly.",
        "Application 1: Connect directly to the specific product, workforce, or industry of the case.",
        "Point 2: State second distinct knowledge point.",
        "Application 2: Contextualise using specific data or operational circumstance.",
      ],
      sampleStrongPoint: "Two distinct points, each explicitly tied to facts from the scenario.",
    },
  },

  // 4. Blueprint 4 (4 Marks, AO1 Knowledge): Four-Point Knowledge Enumeration
  {
    id: "bp-4m-list",
    name: "04. Four-Point Knowledge & Factor Enumeration",
    marks: 4,
    paper: 1,
    unit: "Unit 3: Marketing",
    commandWord: "Identify four / State four",
    description: "Evaluates breadth of syllabus knowledge (AO1) across 4 distinct, non-overlapping points.",
    aoFocus: "AO1 Knowledge (4 marks)",
    templateFormat: "Identify four [reasons / advantages / stages / uses] of [Concept / Activity].",
    rubric: {
      totalMarks: 4,
      ao1Max: 4,
      ao2Max: 0,
      ao3Max: 0,
      ao4Max: 0,
      descriptors: {
        ao1: ["1 mark per creditworthy, distinct point identified up to a maximum of 4."],
        ao2: [],
        ao3: [],
      },
      indicativeContent: [
        "Provide 4 distinct, valid points without repetitive paraphrasing.",
      ],
      sampleStrongPoint: "Crisp enumeration of four syllabus-compliant factors.",
    },
  },

  // 5. Blueprint 5 (6 Marks, AO1 + AO2 + AO3): Balanced Advantage & Disadvantage Analysis
  {
    id: "bp-6m-analyse",
    name: "05. Balanced Analytical Examination (Pro & Con)",
    marks: 6,
    paper: "both",
    unit: "Unit 4: Operations management",
    commandWord: "Explain one advantage and one disadvantage",
    description: "Tests balanced analysis: 1 advantage and 1 disadvantage, each with contextual application and developed chain of analysis.",
    aoFocus: "AO1 Knowledge (2 marks) + AO2 Application (2 marks) + AO3 Analysis (2 marks)",
    templateFormat: "Explain one advantage and one disadvantage to [Business Name] of [Strategy / Operational Change].",
    rubric: {
      totalMarks: 6,
      ao1Max: 2,
      ao2Max: 2,
      ao3Max: 2,
      ao4Max: 0,
      descriptors: {
        ao1: ["1 mark for identifying a valid advantage; 1 mark for identifying a valid disadvantage."],
        ao2: ["1 mark for applying the advantage to the case; 1 mark for applying the disadvantage to the case."],
        ao3: ["1 mark for analyzing the consequence of the advantage; 1 mark for analyzing the disadvantage."],
      },
      indicativeContent: [
        "Advantage: Knowledge -> Applied to specific business -> Chain of reasoning ('This leads to... which results in...').",
        "Disadvantage: Knowledge -> Applied to specific business -> Chain of reasoning ('However, this causes... leading to...').",
      ],
      sampleStrongPoint: "Clear causal connective words (e.g. 'therefore', 'consequently', 'as a result').",
    },
  },

  // 6. Blueprint 6 (6 Marks, AO1 + AO2 + AO3 + AO4): Comparative Recommendation
  {
    id: "bp-6m-eval",
    name: "06. Comparative Strategic Choice & Recommendation",
    marks: 6,
    paper: 1,
    unit: "Unit 3: Marketing",
    commandWord: "Compare two and recommend one",
    description: "Compares two alternative options for a firm and delivers a supported recommendation based on context.",
    aoFocus: "AO1 Knowledge (1 mark) + AO2 Application (1 mark) + AO3 Analysis (2 marks) + AO4 Evaluation (2 marks)",
    templateFormat: "Compare two [methods / strategies] for [Business Name] to [Objective], then recommend which option is better.",
    rubric: {
      totalMarks: 6,
      ao1Max: 1,
      ao2Max: 1,
      ao3Max: 2,
      ao4Max: 2,
      descriptors: {
        ao1: ["1 mark: Identification of relevant strategies/methods."],
        ao2: ["1 mark: Application to the specific firm context."],
        ao3: ["2 marks: Developed analysis comparing both methods."],
        ao4: ["2 marks: Justified recommendation choosing one option over the other with context."],
      },
      indicativeContent: [
        "Analyze Option 1 in context.",
        "Analyze Option 2 in context.",
        "Deliver clear recommendation stating WHY the chosen option is superior given the specific business constraint.",
      ],
      sampleStrongPoint: "A balanced comparison followed by a justified recommendation based on the business's budget/time constraints.",
    },
  },

  // 7. Blueprint 7 (8 Marks, Paper 1, AO1 - AO4): Evaluative Strategic Discussion
  {
    id: "bp-8m-p1-eval",
    name: "07. Paper 1 Evaluative Discussion & Justified Decision",
    marks: 8,
    paper: 1,
    unit: "Unit 6: External influences on business activity",
    commandWord: "Discuss / Weigh up and decide",
    description: "Comprehensive 8-mark Paper 1 question requiring analysis of both perspectives and a fully justified conclusion.",
    aoFocus: "AO1 (2 marks) + AO2 (2 marks) + AO3 (2 marks) + AO4 (2 marks)",
    templateFormat: "Discuss whether [Business Name] should [Strategic Action]. Justify your decision.",
    rubric: {
      totalMarks: 8,
      ao1Max: 2,
      ao2Max: 2,
      ao3Max: 2,
      ao4Max: 2,
      descriptors: {
        ao1: ["2 marks: Sound knowledge of both potential benefits and risks."],
        ao2: ["2 marks: Detailed contextual application to the firm's market and operational data."],
        ao3: ["2 marks: Multi-step analytical chains illustrating cause and effect."],
        ao4: ["2 marks: Justified final judgment weighing short-term costs against long-term competitiveness."],
      },
      indicativeContent: [
        "Section 1: Arguments in favour with developed analysis.",
        "Section 2: Counterarguments / risks with developed analysis.",
        "Section 3: Evaluative conclusion with reasoned justification.",
      ],
      sampleStrongPoint: "Evaluative weighing: 'While in the short run... in the long run... particularly because the business is in Country X...'",
    },
  },

  // 8. Blueprint 8 (8 Marks, Paper 2, AO1 + AO2 + AO3): Case Study 2 Pros & 2 Cons
  {
    id: "bp-8m-p2-case",
    name: "08. Paper 2 In-Depth 4-Point Case Study Analysis",
    marks: 8,
    paper: 2,
    unit: "Unit 1: Understanding business activity",
    commandWord: "Explain two advantages and two disadvantages",
    description: "Rigorous Paper 2 format: 2 advantages and 2 disadvantages to the case-study business, strictly applied to insert facts.",
    aoFocus: "AO1 Knowledge (2 marks) + AO2 Application (2 marks) + AO3 Analysis (4 marks)",
    templateFormat: "Explain two advantages and two disadvantages for [Business Name] of [Ownership / Location / Policy].",
    rubric: {
      totalMarks: 8,
      ao1Max: 2,
      ao2Max: 2,
      ao3Max: 4,
      ao4Max: 0,
      descriptors: {
        ao1: ["2 marks: Identification of two distinct advantages and two distinct disadvantages."],
        ao2: ["2 marks: Direct reference to data, staff, customers, or financial facts from the case study."],
        ao3: ["4 marks: 1 mark for each analytical development explaining the commercial impact on the business."],
      },
      indicativeContent: [
        "Advantage 1: Point -> Case Fact -> Impact on profit/operations.",
        "Advantage 2: Point -> Case Fact -> Impact on market standing.",
        "Disadvantage 1: Point -> Case Fact -> Impact on costs/delays.",
        "Disadvantage 2: Point -> Case Fact -> Impact on risks/management.",
      ],
      sampleStrongPoint: "Richly contextualised with specific numbers, employee counts, or product lines from the scenario.",
    },
  },

  // 9. Blueprint 9 (12 Marks, Paper 2, AO1 - AO4): Strategic Dilemma & Level 3 Judgment
  {
    id: "bp-12m-p2-eval",
    name: "09. Paper 2 High-Stakes Strategic Dilemma (Option A vs B)",
    marks: 12,
    paper: 2,
    unit: "Unit 3: Marketing",
    commandWord: "Consider Option A and Option B, then recommend which option should be chosen",
    description: "Signature 12-mark CIE Paper 2 case essay: balanced Level 1, 2, and 3 evaluation of two strategic business avenues with a justified decision.",
    aoFocus: "AO1 (2 marks) + AO2 (2 marks) + AO3 (4 marks) + AO4 (4 marks)",
    templateFormat: "Consider the advantages and disadvantages of Option 1 and Option 2 for [Business Name]. Recommend which option [Owner / Board] should choose. Justify your answer.",
    rubric: {
      totalMarks: 12,
      ao1Max: 2,
      ao2Max: 2,
      ao3Max: 4,
      ao4Max: 4,
      descriptors: {
        ao1: ["Level 1 (1-2 marks): Simple points or definitions of the options without application."],
        ao2: ["Level 2 (3-6 marks): Points applied to the case study with simple analysis."],
        ao3: ["Level 2 high (7-8 marks): Good analytical chains developed for BOTH options in context."],
        ao4: ["Level 3 (9-12 marks): Balanced analysis of BOTH options PLUS a fully justified recommendation explaining why the chosen option is superior and why the rejected option is less suitable."],
      },
      indicativeContent: [
        "Comprehensive analysis of Option 1: commercial viability, financial implications, operational hurdles.",
        "Comprehensive analysis of Option 2: revenue upside, competitive response, risk profile.",
        "Evaluative Justification: Explicit comparison weighing key trade-offs, financial limits, and business goals.",
      ],
      sampleStrongPoint: "Explains not just why the chosen option wins, but explicitly why the alternative is rejected given the firm's working capital.",
    },
  },

  // 10. Blueprint 10 (12 Marks, Paper 2, AO1 - AO4): Financial & Turnaround Crisis Evaluation
  {
    id: "bp-12m-p2-crisis",
    name: "10. Paper 2 Financial Liquidity & Operational Turnaround",
    marks: 12,
    paper: 2,
    unit: "Unit 5: Financial information and decisions",
    commandWord: "Evaluate whether [Strategy X] is the best method to solve [Problem]",
    description: "Evaluates recovery strategies when a business faces liquidity crises, rising unit costs, or falling ROCE.",
    aoFocus: "AO1 (2 marks) + AO2 (2 marks) + AO3 (4 marks) + AO4 (4 marks)",
    templateFormat: "Evaluate whether [Proposed Solution] is the best way for [Business Name] to improve its [cash flow / profitability / productivity]. Recommend your decision.",
    rubric: {
      totalMarks: 12,
      ao1Max: 2,
      ao2Max: 2,
      ao3Max: 4,
      ao4Max: 4,
      descriptors: {
        ao1: ["2 marks: Knowledge of working capital, liquidity, and operational remedies."],
        ao2: ["2 marks: Application to the cash-flow figures and operational bottlenecks."],
        ao3: ["4 marks: Analysis of immediate cash relief vs longer-term customer goodwill or supplier relations."],
        ao4: ["4 marks: Evaluative judgment evaluating dependency on external factors (interest rates, supplier terms)."],
      },
      indicativeContent: [
        "Examine Proposed Solution in depth with causal consequences.",
        "Examine at least one credible alternative (e.g., factoring, delayed payables, leaseback).",
        "Reach a definitive conclusion with contextual justification.",
      ],
      sampleStrongPoint: "Synthesises numerical indicators (negative closing balance, debt ratios) with qualitative stakeholder risks.",
    },
  },
];

interface BusinessProfile {
  name: string;
  type: string;
  industry: string;
  workforce: string;
  context: string;
  metrics: Record<string, string | number>;
}

// Rich Cambridge Case Context Blueprints for dynamic generation
const SAMPLE_BUSINESS_PROFILES: BusinessProfile[] = [
  {
    name: "Apex AeroTech (AAT)",
    type: "Private Limited Company (Ltd)",
    industry: "High-precision commercial drone manufacturing",
    workforce: "140 specialised engineers and technicians",
    context: "AAT produces commercial mapping drones and exports 70% of output to emerging agricultural markets. With international expansion, demand has surged 45%, but the firm faces a $320,000 cash deficit next quarter.",
    metrics: {
      "Annual Revenue": "$4.2m",
      "Export Share": "70%",
      "Current Staff": "140",
      "Deficit Forecast": "$320,000",
      "Unit Average Cost": "$1,450",
    },
  },
  {
    name: "Velvet Bean Confectionery (VBC)",
    type: "Private Limited Company (Ltd)",
    industry: "Artisan organic chocolate and confectionery",
    workforce: "65 production workers and 12 retail staff",
    context: "VBC manufactures premium bean-to-bar chocolates sold through 8 owned boutique cafes and upscale department stores. A 20% spike in cocoa commodity prices has eroded gross profit margins from 38% to 24%.",
    metrics: {
      "Weekly Output": "25,000 bars",
      "Cocoa Cost Increase": "+20%",
      "Gross Margin": "24% (down from 38%)",
      "Retail Price": "$6.50 per 100g bar",
      "Wholesale Price": "$4.10",
    },
  },
  {
    name: "NovaBrite Solar (NBS)",
    type: "Public Limited Company (Plc)",
    industry: "Renewable residential solar panel fabrication",
    workforce: "1,200 factory workers and 300 installation contractors",
    context: "NBS manufactures rooftop photovoltaic panels. The government of Country Y has just announced a reduction in solar subsidies, while the domestic currency has appreciated by 12% against the dollar.",
    metrics: {
      "Currency Appreciation": "+12%",
      "Imported Raw Cells": "55% of total inputs",
      "Domestic Market Share": "34%",
      "ROCE": "14.2%",
      "Employee Turnover": "18%",
    },
  },
  {
    name: "Komorebi Boutique Hotels (KBH)",
    type: "Partnership",
    industry: "Eco-tourism boutique hospitality and dining",
    workforce: "85 hospitality employees across 4 coastal lodges",
    context: "KBH operates luxury eco-lodges. Customer reviews cite excellent service, but occupancy drops to 32% during the 4-month rainy season, causing severe liquidity shortages.",
    metrics: {
      "Peak Occupancy": "94%",
      "Off-Peak Occupancy": "32%",
      "Average Room Rate": "$280/night",
      "Monthly Fixed Costs": "$65,000",
      "Current Ratio": "0.85:1",
    },
  },
  {
    name: "Triton Marine Logistics (TML)",
    type: "Private Limited Company (Ltd)",
    industry: "Intermodal port container transport and cold chain",
    workforce: "210 truck drivers and logistics coordinators",
    context: "TML moves perishable food exports between regional farms and the deepwater container terminal. Drivers belong to a vocal trade union currently threatening industrial action over overtime pay.",
    metrics: {
      "Fleet Size": "75 refrigerated trucks",
      "Fuel Share of Costs": "42%",
      "Union Membership": "82%",
      "On-Time Delivery Rate": "97.4%",
    },
  },
];

/**
 * Generate a dynamic scenario from a blueprint
 */
export function generateScenario(
  blueprintId?: string,
  targetMarks?: MarkTier,
  targetPaper?: PaperNumber
): DynamicScenario {
  let blueprint = BLUEPRINTS.find((b) => b.id === blueprintId);
  if (!blueprint) {
    let candidates = BLUEPRINTS.filter((b) => {
      const markMatch = targetMarks ? b.marks === targetMarks : true;
      const paperMatch = targetPaper
        ? b.paper === "both" || b.paper === targetPaper
        : true;
      return markMatch && paperMatch;
    });

    // If no candidate matched both paper and mark, preserve the requested mark tier above all else
    if (candidates.length === 0 && targetMarks) {
      candidates = BLUEPRINTS.filter((b) => b.marks === targetMarks);
    }

    blueprint =
      candidates[Math.floor(Math.random() * candidates.length)] || BLUEPRINTS[0];
  }

  // Pick random business profile
  const profile =
    SAMPLE_BUSINESS_PROFILES[
      Math.floor(Math.random() * SAMPLE_BUSINESS_PROFILES.length)
    ];

  // Build tailored question prompt
  let prompt = "";
  if (blueprint.marks === 2) {
    if (blueprint.id === "bp-2m-calc") {
      prompt = `Using the operational figures for ${profile.name}, calculate the total weekly variable costs when producing at full capacity. Show your working and state the units.`;
    } else {
      prompt = `Define what is meant by the term added value, and explain one way ${profile.name} could increase it.`;
    }
  } else if (blueprint.marks === 4) {
    if (blueprint.id === "bp-4m-outline") {
      prompt = `Outline two effects of the recent external economic conditions on ${profile.name}'s export performance.`;
    } else {
      prompt = `Identify four reasons why clear business objectives are commercially important to the management of ${profile.name}.`;
    }
  } else if (blueprint.marks === 6) {
    if (blueprint.id === "bp-6m-analyse") {
      prompt = `Explain one advantage and one disadvantage to ${profile.name} of adopting lean production techniques to reduce unit costs.`;
    } else {
      prompt = `Compare on-the-job training and off-the-job training for ${profile.name}'s new technical staff, and recommend which method is more suitable.`;
    }
  } else if (blueprint.marks === 8) {
    if (blueprint.paper === 1 || blueprint.id === "bp-8m-p1-eval") {
      prompt = `Discuss whether ${profile.name} should convert its business organisation into a Public Limited Company (Plc) to fund its next stage of expansion. Justify your decision.`;
    } else {
      prompt = `Explain two advantages and two disadvantages for ${profile.name} of holding high buffer inventories of raw components.`;
    }
  } else {
    // 12 marks
    if (blueprint.id === "bp-12m-p2-crisis") {
      prompt = `Evaluate whether negotiating longer trade credit with suppliers or obtaining a bank overdraft is the best method for ${profile.name} to overcome its short-term liquidity deficit. Reach a justified conclusion.`;
    } else {
      prompt = `Consider Option 1 (investing $450,000 into automated production robotics) and Option 2 (outsourcing component manufacturing to a foreign subcontractor in Country Z). Recommend which strategic option ${profile.name} should choose. Justify your answer.`;
    }
  }

  const paperNum: PaperNumber =
    blueprint.paper === "both" ? targetPaper || 1 : blueprint.paper;

  return {
    id: `dyn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    blueprintId: blueprint.id,
    marks: blueprint.marks,
    paper: paperNum,
    title: `${blueprint.marks}-Mark Examination Question (${blueprint.name})`,
    unit: blueprint.unit,
    businessName: profile.name,
    industry: profile.industry,
    businessType: profile.type,
    scenarioContext: profile.context,
    dataPoints: profile.metrics,
    questionPrompt: prompt,
    rubric: blueprint.rubric,
  };
}
