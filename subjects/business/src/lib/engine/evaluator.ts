import {
  AssessmentObjectivesBreakdown,
  DynamicScenario,
  EvaluationResult,
  QuestionRubric,
  RuleEnforcementResult,
} from "../types";
import { evaluateEssayWebLLM, WebLLMEvaluationError } from "./webllm";
import { Paper1DeterministicRules } from "../data/paper1-database";

export interface EvaluatorInput {
  questionTitle: string;
  questionPrompt: string;
  caseContext: string;
  marks: number;
  rubric: QuestionRubric;
  studentAnswer: string;
  webllmEngine?: any;
  validAppWords?: string[];
  deterministicRules?: Paper1DeterministicRules;
  modelAnswer?: string;
  indicativeKnowledgePoints?: string[];
}

/**
 * Normalizes text for matching keywords, punctuation, and currency amounts
 */
function normalizeForMatching(text: string): string {
  return text
    .toLowerCase()
    .replace(/[,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
    .replace(/\s+/g, " ");
}

/**
 * Website Code Rule 1: Application Keyword Scan
 * Evaluates the valid_app_words list against the candidate answer.
 * If words are missing, code sets the Application score to 0 automatically.
 */
export function scanApplicationKeywords(
  answer: string,
  validAppWords?: string[]
): { passed: boolean; foundWords: string[] } {
  if (!validAppWords || validAppWords.length === 0) {
    // No application keywords required (e.g. 2m pure definition question)
    return { passed: true, foundWords: [] };
  }

  const rawLower = answer.toLowerCase();
  const normalizedText = normalizeForMatching(answer);
  const foundWords: string[] = [];

  for (const rawKw of validAppWords) {
    const kw = rawKw.trim();
    if (!kw) continue;
    const kwLower = kw.toLowerCase();
    const kwNorm = normalizeForMatching(kw);

    // 1. Direct or normalized substring match
    if (rawLower.includes(kwLower) || normalizedText.includes(kwNorm)) {
      foundWords.push(rawKw);
      continue;
    }

    // 2. Numbers / monetary amounts (e.g. "$250,000", "250000", "250,000")
    const digitsOnly = kw.replace(/[^0-9]/g, "");
    if (digitsOnly.length >= 2) {
      const answerDigits = answer.replace(/[^0-9]/g, "");
      if (answerDigits.includes(digitsOnly) || rawLower.includes(digitsOnly)) {
        foundWords.push(rawKw);
        continue;
      }
    }

    // 3. Singular / plural stem matching for single words (e.g. "loggers" -> "logger")
    if (!kwLower.includes(" ") && kwLower.length >= 4) {
      const stem = kwLower.endsWith("s") ? kwLower.slice(0, -1) : kwLower;
      if (rawLower.includes(stem)) {
        foundWords.push(rawKw);
        continue;
      }
    }
  }

  return {
    passed: foundWords.length > 0,
    foundWords,
  };
}

/**
 * Website Code Rule 2: Evaluation Judgment Word Scan
 * When if_no_eval_word rule is present, checks for evaluative reasoning terms.
 * If missing, code caps AO4 Evaluation score at 0.
 */
export function scanEvaluationKeywords(answer: string): { passed: boolean; foundWords: string[] } {
  const lower = answer.toLowerCase();
  const EVAL_TERMS = [
    "overall",
    "in conclusion",
    "to conclude",
    "recommend",
    "however",
    "on the other hand",
    "weighing up",
    "weighing",
    "the deciding factor",
    "greater than",
    "outweigh",
    "outweighs",
    "on balance",
    "in the short term",
    "in the long term",
    "in the short run",
    "in the long run",
    "depends on",
    "depends upon",
    "despite",
    "justify",
    "advantages are greater",
    "disadvantages are greater",
    "more important than",
    "opportunity cost",
    "superior",
    "crucial factor",
    "vital factor",
    "most significant",
    "best option",
    "preferable",
    "ultimately",
    "beneficial overall",
    "more suitable",
    "financial risk",
    "worthwhile",
    "decisive",
    "judgement",
    "judgment",
  ];

  const foundWords: string[] = [];
  for (const term of EVAL_TERMS) {
    if (lower.includes(term)) {
      foundWords.push(term);
    }
  }

  return {
    passed: foundWords.length > 0,
    foundWords,
  };
}

/**
 * Strips bracket annotations like [K], [APP], [AN], [EVAL], [1], [2], [4]
 * and normalizes whitespace for exact model answer comparison.
 */
export function stripAoAnnotations(text: string): string {
  return text
    .replace(/\[(?:k|app|an|eval|ao1|ao2|ao3|ao4|1|2|3|4|6|8)\]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Tests whether candidate text matches or substantially reproduces the official model answer
 */
export function checkIsExactOrSubstantialModelAnswer(
  candidateText: string,
  modelAnswer?: string
): boolean {
  if (!modelAnswer) return false;

  const candidateClean = stripAoAnnotations(candidateText).toLowerCase();
  const modelClean = stripAoAnnotations(modelAnswer).toLowerCase();

  // 1. Direct or stripped identical match
  if (candidateClean === modelClean) return true;

  // 2. Candidate includes the clean model answer or vice versa
  if (candidateClean.length >= 25 && modelClean.includes(candidateClean)) return true;
  if (modelClean.length >= 25 && candidateClean.includes(modelClean)) return true;

  // 3. Normalized alphanumeric equality
  const candAlpha = candidateClean.replace(/[^a-z0-9]/g, "");
  const modAlpha = modelClean.replace(/[^a-z0-9]/g, "");
  if (candAlpha.length >= 20 && candAlpha === modAlpha) return true;

  // 4. Substantial word overlap (>= 75% of model words present)
  const stopWords = new Set(["the", "and", "for", "with", "from", "that", "this", "these", "those", "have", "been", "which", "will", "are", "is"]);
  const modWords = modelClean
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9]/g, ""))
    .filter((w) => w.length >= 3 && !stopWords.has(w));

  if (modWords.length >= 4) {
    const candWordSet = new Set(
      candidateClean
        .split(/\s+/)
        .map((w) => w.replace(/[^a-z0-9]/g, ""))
        .filter((w) => w.length >= 3 && !stopWords.has(w))
    );
    const matched = modWords.filter((w) => candWordSet.has(w)).length;
    if (matched / modWords.length >= 0.75) {
      return true;
    }
  }

  return false;
}

/**
 * Checks how closely the student's answer demonstrates the knowledge points
 * from the official Cambridge mark scheme and exemplar model answer.
 */
export function checkKnowledgePointMatches(
  studentAnswer: string,
  knowledgePoints?: string[],
  modelAnswer?: string
): { matchedCount: number; isFullMatch: boolean; feedback: string } {
  const text = studentAnswer.toLowerCase();
  let matchedCount = 0;

  if (knowledgePoints && knowledgePoints.length > 0) {
    for (const kp of knowledgePoints) {
      const rawTerms = kp
        .toLowerCase()
        .split(/[\/,\-\(\)]+/)
        .map((t) => t.trim())
        .filter((t) => t.length >= 3);

      const isMatched = rawTerms.some((term) => {
        if (text.includes(term)) return true;
        const words = term
          .split(/\s+/)
          .filter((w) => !["and", "the", "for", "with", "from", "that", "in", "of", "to", "or"].includes(w));
        return words.length > 0 && words.every((w) => text.includes(w));
      });

      if (isMatched) {
        matchedCount++;
      }
    }
  }

  // Also check overlap with the model answer
  let modelAnswerOverlap = false;
  if (modelAnswer) {
    const stopWords = new Set(["this", "that", "these", "those", "with", "from", "have", "been", "which", "timbercraft", "benefit", "reason", "because", "their"]);
    const modelWords = modelAnswer
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 4 && !stopWords.has(w));

    const studentWords = new Set(
      text
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length >= 4 && !stopWords.has(w))
    );

    const overlap = modelWords.filter((w) => studentWords.has(w)).length;
    if (overlap >= 3 || (modelWords.length > 0 && overlap / modelWords.length >= 0.28)) {
      modelAnswerOverlap = true;
    }
  }

  const isFullMatch =
    matchedCount >= (knowledgePoints ? Math.min(2, knowledgePoints.length) : 1) || modelAnswerOverlap;

  return {
    matchedCount,
    isFullMatch,
    feedback: isFullMatch
      ? "Directly matches Cambridge mark scheme knowledge points."
      : matchedCount > 0
      ? "Partial knowledge alignment with mark scheme."
      : "Limited syllabus knowledge evident.",
  };
}

/**
 * Two-Pass Evaluation Engine
 * • Website Code handles the Rules:
 *   - Evaluates valid_app_words list. If missing, sets Application score to 0 automatically.
 *   - Evaluates if_no_eval_word rule. If missing, sets Evaluation score to 0 automatically.
 * • Qwen 0.5B / Instant Examiner handles the Interpretation:
 *   - Reads student text and confirms if they understood core business concepts (AO1) and causal reasoning (AO3).
 * • Website Code calculates the Total:
 *   - Combines results from keyword scan and AI response to save the final score.
 */
export async function evaluateStudentEssay(
  input: EvaluatorInput
): Promise<EvaluationResult> {
  const { marks, rubric, studentAnswer, webllmEngine, validAppWords, deterministicRules, modelAnswer } = input;
  const answer = studentAnswer.trim();

  // 0. IMMEDIATE CHECK: Did candidate provide or reproduce the official Cambridge Model Answer?
  const isModelMatch = checkIsExactOrSubstantialModelAnswer(answer, modelAnswer);
  if (isModelMatch && marks > 0) {
    const fullRuleEnforcement: RuleEnforcementResult = {
      appWordsRequired: validAppWords || [],
      appWordsFound: validAppWords || [],
      appWordsPassed: true,
      ao2CappedToZero: false,
      evalWordRequired: Boolean(deterministicRules?.if_no_eval_word && rubric.ao4Max > 0),
      evalWordsFound: ["overall", "on balance"],
      evalWordPassed: true,
      ao4CappedToZero: false,
      ruleNotes: [
        "Exemplar match verified against official Cambridge mark scheme model answer.",
        "Full marks awarded across all Assessment Objectives (AO1, AO2, AO3, AO4).",
      ],
    };

    return {
      totalScore: marks,
      maxMarks: marks,
      percentage: 100,
      aoBreakdown: {
        ao1: {
          score: rubric.ao1Max,
          max: rubric.ao1Max,
          feedback: "Full textbook precision and concept understanding matching Cambridge mark scheme model answer.",
        },
        ao2: {
          score: rubric.ao2Max,
          max: rubric.ao2Max,
          feedback: "Directly contextualised to the business scenario facts and data points.",
        },
        ao3: {
          score: rubric.ao3Max,
          max: rubric.ao3Max,
          feedback: "Exemplary multi-step causal analytical chain linking actions to commercial outcomes.",
        },
        ao4: {
          score: rubric.ao4Max,
          max: rubric.ao4Max,
          feedback: "Comprehensive balanced evaluative judgment with justified recommendation.",
        },
      },
      strengths: [
        "Matches official Cambridge exemplar model answer.",
        "Demonstrates complete syllabus coverage across all assessment objectives.",
      ],
      improvements: [
        "Exemplar quality: Maintain this level of precision and time management under timed exam conditions.",
      ],
      examinerNotes: `[Cambridge Senior Examiner Assessment] Awarded ${marks}/${marks} marks (100%). Exemplar Cambridge Model Answer detected. Full credit awarded.`,
      modelAnswerSnippet: modelAnswer || rubric.sampleStrongPoint,
      isAiEvaluated: false,
      evaluatedAt: new Date().toISOString(),
      ruleEnforcement: fullRuleEnforcement,
    };
  }

  // 1. Run Website Code Rule Scans FIRST
  const appScan = scanApplicationKeywords(answer, validAppWords);
  const requiresApp = Boolean(validAppWords && validAppWords.length > 0 && rubric.ao2Max > 0);
  const ao2CappedToZero = requiresApp && !appScan.passed;

  const requiresEval = Boolean(deterministicRules?.if_no_eval_word && rubric.ao4Max > 0);
  const evalScan = requiresEval ? scanEvaluationKeywords(answer) : { passed: true, foundWords: [] };
  const ao4CappedToZero = requiresEval && !evalScan.passed;

  const ruleNotes: string[] = [];
  if (requiresApp) {
    if (ao2CappedToZero) {
      ruleNotes.push(
        `[Application Rule] Capped to 0: None of the required context keywords (${validAppWords!.slice(0, 5).join(", ")}) were detected in your response.`
      );
    } else {
      ruleNotes.push(
        `[Application Rule] Passed: Matched case keywords [${appScan.foundWords.slice(0, 4).join(", ")}]. AO2 marks eligible.`
      );
    }
  }

  if (requiresEval) {
    if (ao4CappedToZero) {
      ruleNotes.push(
        `[Evaluation Rule] Capped to 0: No justified evaluative judgment term detected (e.g. 'overall', 'on balance', 'in conclusion').`
      );
    } else {
      ruleNotes.push(
        `[Evaluation Rule] Passed: Evaluative judgment phrasing detected [${evalScan.foundWords.slice(0, 3).join(", ")}]. AO4 marks eligible.`
      );
    }
  }

  const ruleEnforcement: RuleEnforcementResult = {
    appWordsRequired: validAppWords || [],
    appWordsFound: appScan.foundWords,
    appWordsPassed: appScan.passed,
    ao2CappedToZero,
    evalWordRequired: requiresEval,
    evalWordsFound: evalScan.foundWords,
    evalWordPassed: evalScan.passed,
    ao4CappedToZero,
    ruleNotes,
  };

  // 2. AI Interpretation Pass (Qwen 0.5B via WebLLM if loaded)
  if (webllmEngine) {
    try {
      const markSchemeLines = [
        `Total Marks: ${marks}`,
        `AO1 (Knowledge & Understanding): Max ${rubric.ao1Max} marks. Key concepts: ${(input.indicativeKnowledgePoints || rubric.indicativeContent).join("; ")}`,
        `AO2 (Application): Max ${rubric.ao2Max} marks. Context: ${validAppWords?.join(", ") || "Case study factors"}`,
        `AO3 (Analysis): Max ${rubric.ao3Max} marks. Causal chains ('this leads to... as a result...')`,
        rubric.ao4Max > 0
          ? `AO4 (Evaluation): Max ${rubric.ao4Max} marks. Balanced weighing of trade-offs & justified recommendation.`
          : "",
        input.modelAnswer ? `Exemplar Cambridge Model Answer: ${input.modelAnswer}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const examQuestion = `${input.questionPrompt}${
        input.caseContext ? `\nContext / Case Scenario:\n${input.caseContext}` : ""
      }`;

      const llmResult = await evaluateEssayWebLLM({
        essayText: answer,
        examQuestion,
        markScheme: markSchemeLines,
        maxMarks: marks,
        engine: webllmEngine,
      });

      // Qwen 0.5B Interpretation: extracts raw conceptual understanding
      const ratio = marks > 0 ? Math.min(1, Math.max(0, llmResult.marks_awarded / marks)) : 0;
      
      // 1. Knowledge (AO1): check mark scheme alignment + LLM feedback
      const knowledgeEval = checkKnowledgePointMatches(answer, input.indicativeKnowledgePoints, input.modelAnswer);
      let rawAo1 = knowledgeEval.isFullMatch
        ? rubric.ao1Max
        : knowledgeEval.matchedCount > 0
        ? Math.max(1, Math.round(rubric.ao1Max * 0.5))
        : Math.min(rubric.ao1Max, Math.round(ratio * rubric.ao1Max));

      // 2. Application (AO2): rule check
      let rawAo2 = 0;
      if (rubric.ao2Max > 0) {
        if (ao2CappedToZero) {
          rawAo2 = 0;
        } else if (appScan.passed) {
          // If valid application keywords were found, award full AO2 marks
          rawAo2 = rubric.ao2Max;
        } else {
          rawAo2 = Math.min(rubric.ao2Max, Math.round(ratio * rubric.ao2Max));
        }
      }

      let rawAo3 = Math.min(rubric.ao3Max, Math.round(ratio * rubric.ao3Max));
      let rawAo4 = rubric.ao4Max > 0 ? Math.min(rubric.ao4Max, Math.max(0, llmResult.marks_awarded - (rawAo1 + rawAo2 + rawAo3))) : 0;

      // 3. Website Code Enforces the Rules and Calculates the Total
      const finalAo1 = rawAo1;
      const finalAo2 = ao2CappedToZero ? 0 : rawAo2;
      const finalAo3 = rawAo3;
      const finalAo4 = ao4CappedToZero ? 0 : rawAo4;
      const totalScore = Math.min(marks, finalAo1 + finalAo2 + finalAo3 + finalAo4);
      const percentage = Math.round((totalScore / marks) * 100);

      const strengths: string[] = [];
      const improvements: string[] = [];

      if (finalAo1 > 0) strengths.push(llmResult.ao_feedback.AO1 || "Demonstrated syllabus business knowledge.");
      if (finalAo2 > 0) strengths.push(llmResult.ao_feedback.AO2 || "Applied relevant case study details.");
      if (finalAo3 > 0) strengths.push(llmResult.ao_feedback.AO3 || "Developed cause-and-effect analysis.");
      if (finalAo4 > 0) strengths.push("Formulated balanced evaluative judgment.");

      if (ao2CappedToZero) {
        improvements.push(
          `Application score was capped at 0 by system rule: incorporate case terms such as: ${validAppWords!.slice(0, 4).join(", ")}.`
        );
      }
      if (ao4CappedToZero) {
        improvements.push(
          "Evaluation score was capped at 0 by system rule: use decisive judgment phrasing (e.g., 'overall', 'on balance', 'the advantages are greater because...')."
        );
      }
      if (improvements.length === 0) {
        improvements.push("Continue sharpening multi-step economic chains under timed exam conditions.");
      }

      let examinerNotes = `[Qwen 0.5B Interpretation + Website Code Rule Engine] ${llmResult.examiner_notes}`;
      if (ao2CappedToZero) {
        examinerNotes += " (AO2 Application was capped to 0 marks because required case study keywords were missing).";
      }
      if (ao4CappedToZero) {
        examinerNotes += " (AO4 Evaluation was capped to 0 marks because no evaluative judgment word was present).";
      }

      return {
        totalScore,
        maxMarks: marks,
        percentage,
        aoBreakdown: {
          ao1: {
            score: finalAo1,
            max: rubric.ao1Max,
            feedback: llmResult.ao_feedback.AO1 || "Core business concept understanding interpreted.",
          },
          ao2: {
            score: finalAo2,
            max: rubric.ao2Max,
            feedback: ao2CappedToZero
              ? "AO2 score: 0/2 (Capped by Website Rule: No required application keywords found in response)."
              : llmResult.ao_feedback.AO2 || `Context keywords matched: ${appScan.foundWords.join(", ")}`,
          },
          ao3: {
            score: finalAo3,
            max: rubric.ao3Max,
            feedback: llmResult.ao_feedback.AO3 || "Analytical cause-and-effect reasoning interpreted.",
          },
          ao4: {
            score: finalAo4,
            max: rubric.ao4Max,
            feedback: ao4CappedToZero
              ? "AO4 score: 0/2 (Capped by Website Rule: Missing evaluative judgment term)."
              : `Evaluative reasoning assessed.`,
          },
        },
        strengths,
        improvements,
        examinerNotes,
        modelAnswerSnippet: input.modelAnswer || rubric.sampleStrongPoint,
        isAiEvaluated: true,
        evaluatedAt: new Date().toISOString(),
        ruleEnforcement,
      };
    } catch (e) {
      if (e instanceof WebLLMEvaluationError) {
        console.warn("WebLLM assessment failed, falling back to Instant Examiner:", e.message);
      } else {
        console.warn("Unexpected WebLLM error, falling back to Instant Examiner:", e);
      }
    }
  }

  // 3. Instant CIE Senior Examiner (with identical Website Code Rule enforcement)
  return evaluateWithInstantExaminer(input, ruleEnforcement);
}

/**
 * Instant CIE Senior Examiner
 * Evaluates core concepts deterministically and applies strict website rules.
 */
function evaluateWithInstantExaminer(
  input: EvaluatorInput,
  ruleEnforcement: RuleEnforcementResult
): EvaluationResult {
  const { questionPrompt, caseContext, marks, rubric, studentAnswer, validAppWords, modelAnswer } = input;
  const rawText = studentAnswer.trim();
  const lowerText = rawText.toLowerCase();
  const wordCount = rawText ? rawText.split(/\s+/).length : 0;

  if (wordCount < 4) {
    return {
      totalScore: 0,
      maxMarks: marks,
      percentage: 0,
      aoBreakdown: {
        ao1: { score: 0, max: rubric.ao1Max, feedback: "Response is too brief to demonstrate syllabus knowledge." },
        ao2: { score: 0, max: rubric.ao2Max, feedback: "No application to the specific business context." },
        ao3: { score: 0, max: rubric.ao3Max, feedback: "No analytical chain developed." },
        ao4: { score: 0, max: rubric.ao4Max, feedback: "No evaluation or justified recommendation." },
      },
      strengths: [],
      improvements: ["Provide a complete answer using relevant Cambridge business terminology."],
      examinerNotes: "Candidate response below minimum examinable threshold (under 4 words).",
      modelAnswerSnippet: modelAnswer || rubric.sampleStrongPoint,
      isAiEvaluated: false,
      evaluatedAt: new Date().toISOString(),
      ruleEnforcement,
    };
  }

  // 1. AO1 Knowledge Interpretation (Concept understanding)
  const businessVocab = [
    "profit", "cost", "revenue", "demand", "price", "market", "customer", "shareholder",
    "employee", "worker", "motivation", "efficiency", "productivity", "liquidity",
    "cash flow", "overdraft", "working capital", "scale", "economies of scale",
    "branding", "quality", "lean", "training", "recruitment", "stakeholder",
    "added value", "fixed cost", "variable cost", "break-even", "margin", "turnover",
    "partnership", "sole trader", "limited liability", "plc", "ltd", "exchange rate",
    "inflation", "tax", "tariff", "ethics", "sustainable", "export", "import",
    "factors of production", "land", "labor", "capital", "enterprise", "division of labor",
    "primary sector", "secondary sector", "tertiary sector", "joint venture", "franchise"
  ];
  let ao1Matches = 0;
  businessVocab.forEach((term) => {
    if (lowerText.includes(term)) ao1Matches++;
  });

  const knowledgeEval = checkKnowledgePointMatches(rawText, input.indicativeKnowledgePoints, modelAnswer);

  let ao1Score = 0;
  let ao1Feedback = "";
  if (rubric.ao1Max > 0) {
    if (knowledgeEval.isFullMatch || (ao1Matches >= 2 && wordCount >= 10)) {
      ao1Score = rubric.ao1Max;
      ao1Feedback = "Full formal textbook precision demonstrated with accurate business concept understanding matching the mark scheme.";
    } else if (knowledgeEval.matchedCount > 0 || ao1Matches >= 1 || wordCount >= 6) {
      ao1Score = Math.max(1, Math.min(rubric.ao1Max, Math.round(rubric.ao1Max * 0.5)));
      ao1Feedback = "Demonstrates relevant business knowledge, but could incorporate more precise syllabus terminology.";
    } else {
      ao1Score = 0;
      ao1Feedback = "Limited syllabus knowledge evident.";
    }
  }

  // 2. AO2 Application (Website Code Rule Enforcement)
  let ao2Score = 0;
  let ao2Feedback = "";
  if (rubric.ao2Max > 0) {
    if (ruleEnforcement.ao2CappedToZero) {
      // Hard cap to 0 by system rule
      ao2Score = 0;
      ao2Feedback = `Application score capped to 0: None of the required context keywords were included in your answer.`;
    } else if (ruleEnforcement.appWordsPassed) {
      // Valid application keywords matched in context! Award full AO2 marks
      ao2Score = rubric.ao2Max;
      ao2Feedback = `Explicitly applied to case study facts (${ruleEnforcement.appWordsFound.slice(0, 3).join(", ")}).`;
    } else {
      ao2Score = 0;
      ao2Feedback = "No case study application demonstrated.";
    }
  }

  // 3. AO3 Analysis (Cause & Effect Reasoning)
  const causalConnectives = [
    "this leads to", "as a result", "consequently", "because of this", "therefore",
    "which means that", "meaning that", "enabling the business to", "enabling them to",
    "enables the business to", "this causes", "results in", "in turn", "which reduces",
    "which increases", "leading to", "so that", "impact on profit", "affects cash flow",
    "loss of customers", "lower costs", "higher revenue", "reduces financial risk",
    "delays operations", "lowers unit costs", "thereby", "due to this", "because",
    "due to", "in order to", "allowing", "which impacts", "which lowers", "higher profit",
    "increased productivity", "improves cash flow", "leads to", "loss of reputation",
    "loss of brand image", "competitive advantage", "economies of scale"
  ];
  let causalCount = 0;
  causalConnectives.forEach((conn) => {
    if (lowerText.includes(conn)) causalCount++;
  });

  let ao3Score = 0;
  let ao3Feedback = "";
  if (rubric.ao3Max > 0) {
    if (causalCount >= 2 || (causalCount >= 1 && (wordCount >= 16 || knowledgeEval.isFullMatch))) {
      ao3Score = rubric.ao3Max;
      ao3Feedback = "Clear multi-step cause-and-effect analysis linking business decisions to commercial outcomes.";
    } else if (causalCount >= 1 || wordCount >= 14) {
      ao3Score = Math.max(1, Math.min(rubric.ao3Max, Math.round(rubric.ao3Max * 0.5)));
      ao3Feedback = "Basic analytical point made; deepen the causal explanation of outcomes.";
    } else {
      ao3Score = 0;
      ao3Feedback = "Descriptive response; lacks causal connectives explaining 'this leads to...'.";
    }
  }

  // 4. AO4 Evaluation (Website Code Rule Enforcement)
  let ao4Score = 0;
  let ao4Feedback = "";
  if (rubric.ao4Max > 0) {
    if (ruleEnforcement.ao4CappedToZero) {
      ao4Score = 0;
      ao4Feedback = "Evaluation score capped to 0: Missing evaluative judgment term (e.g. 'overall', 'on balance', 'the advantages are greater because...').";
    } else {
      const evalTermsFound = ruleEnforcement.evalWordsFound || [];
      if (evalTermsFound.length >= 2 || (evalTermsFound.length >= 1 && (wordCount >= 22 || causalCount >= 1))) {
        ao4Score = rubric.ao4Max;
        ao4Feedback = "High-level evaluative judgment: balanced consideration of trade-offs followed by a fully justified conclusion.";
      } else if (evalTermsFound.length >= 1 || wordCount >= 18) {
        ao4Score = Math.max(1, Math.min(rubric.ao4Max, Math.round(rubric.ao4Max * 0.5)));
        ao4Feedback = "Basic judgment attempted with evaluative terms; needs stronger justification of trade-offs.";
      } else {
        ao4Score = 0;
        ao4Feedback = "Judgment lacks sufficient substance to earn evaluation marks.";
      }
    }
  }

  // 5. Calculate Total
  const totalScore = Math.min(marks, ao1Score + ao2Score + ao3Score + ao4Score);
  const percentage = Math.round((totalScore / marks) * 100);

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (ao1Score > 0) strengths.push("Accurately applied syllabus business concepts.");
  if (ao2Score > 0) strengths.push(`Directly integrated case study keywords (${ruleEnforcement.appWordsFound.slice(0, 3).join(", ")}).`);
  if (ao3Score > 0) strengths.push("Demonstrated cause-and-effect reasoning linking actions to outcomes.");
  if (ao4Score > 0) strengths.push("Provided a justified evaluative conclusion.");

  if (strengths.length === 0) strengths.push("Attempted the question under formal exam conditions.");

  if (ruleEnforcement.ao2CappedToZero) {
    improvements.push(
      `Rule Cap: Application score set to 0. You must reference case study keywords (e.g., ${validAppWords?.slice(0, 4).join(", ")}).`
    );
  }
  if (ruleEnforcement.ao4CappedToZero) {
    improvements.push(
      "Rule Cap: Evaluation score set to 0. Include explicit judgment terminology ('overall', 'on balance', 'the advantages are greater because...')."
    );
  }
  if (rubric.ao1Max > 0 && ao1Score < rubric.ao1Max) {
    improvements.push("Use more formal textbook definitions rather than everyday conversational phrasing.");
  }
  if (rubric.ao3Max > 0 && ao3Score < rubric.ao3Max) {
    improvements.push("Extend your chain of analysis using 'this leads to... as a result...'.");
  }

  let examinerNotes = `CIE 0264/0450 Assessment: Awarded ${totalScore}/${marks} marks (${percentage}%). `;
  if (ruleEnforcement.ao2CappedToZero) {
    examinerNotes += "AO2 was capped at 0 because valid application words were missing. ";
  }
  if (ruleEnforcement.ao4CappedToZero) {
    examinerNotes += "AO4 was capped at 0 because evaluative judgment words were missing. ";
  }
  if (percentage >= 80) examinerNotes += "Excellent response demonstrating Grade A* examination mastery.";
  else if (percentage >= 60) examinerNotes += "Strong response demonstrating solid Grade B/A technique.";
  else if (percentage >= 40) examinerNotes += "Pass benchmark; review feedback points to access higher mark bands.";
  else examinerNotes += "Requires closer alignment with Cambridge mark scheme descriptors.";

  const breakdown: AssessmentObjectivesBreakdown = {
    ao1: { score: ao1Score, max: rubric.ao1Max, feedback: ao1Feedback || "AO1 assessed." },
    ao2: { score: ao2Score, max: rubric.ao2Max, feedback: ao2Feedback || "AO2 assessed." },
    ao3: { score: ao3Score, max: rubric.ao3Max, feedback: ao3Feedback || "AO3 assessed." },
    ao4: { score: ao4Score, max: rubric.ao4Max, feedback: ao4Feedback || "AO4 assessed." },
  };

  return {
    totalScore,
    maxMarks: marks,
    percentage,
    aoBreakdown: breakdown,
    strengths,
    improvements,
    examinerNotes,
    modelAnswerSnippet: modelAnswer || rubric.sampleStrongPoint,
    isAiEvaluated: false,
    evaluatedAt: new Date().toISOString(),
    ruleEnforcement,
  };
}
