import {
  AssessmentObjectivesBreakdown,
  DynamicScenario,
  EvaluationResult,
  QuestionRubric,
} from "../types";
import { evaluateEssayWithWebLLM } from "./webllm";

interface EvaluatorInput {
  questionTitle: string;
  questionPrompt: string;
  caseContext: string;
  marks: number;
  rubric: QuestionRubric;
  studentAnswer: string;
  webllmEngine?: any;
}

/**
 * Two-Pass Evaluation Engine
 * Strictly assesses student response against Cambridge 0264/0450 AO1-AO4 criteria
 */
export async function evaluateStudentEssay(
  input: EvaluatorInput
): Promise<EvaluationResult> {
  const { marks, rubric, studentAnswer, webllmEngine } = input;
  const answer = studentAnswer.trim();

  // Try WebLLM first if engine is passed and active
  if (webllmEngine) {
    try {
      const systemPrompt = `You are a strict Cambridge International Examinations (CIE) Business 0264 Senior Examiner.
Mark the candidate essay strictly against the provided AO1-AO4 mark scheme rubric.
Return ONLY valid JSON matching this schema:
{
  "totalScore": number,
  "ao1Score": number,
  "ao1Feedback": "string",
  "ao2Score": number,
  "ao2Feedback": "string",
  "ao3Score": number,
  "ao3Feedback": "string",
  "ao4Score": number,
  "ao4Feedback": "string",
  "strengths": ["string", "string"],
  "improvements": ["string", "string"],
  "examinerNotes": "string",
  "modelAnswerSnippet": "string"
}`;

      const userPrompt = `Question (${marks} marks): ${input.questionPrompt}
Context: ${input.caseContext}
Rubric Total: ${rubric.totalMarks} (AO1: ${rubric.ao1Max}, AO2: ${rubric.ao2Max}, AO3: ${rubric.ao3Max}, AO4: ${rubric.ao4Max})
Candidate Answer:
"""
${answer}
"""`;

      const responseText = await evaluateEssayWithWebLLM(
        webllmEngine,
        systemPrompt,
        userPrompt
      );

      if (responseText) {
        // Attempt to extract JSON from response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const ao1 = Math.min(rubric.ao1Max, Math.max(0, parsed.ao1Score || 0));
          const ao2 = Math.min(rubric.ao2Max, Math.max(0, parsed.ao2Score || 0));
          const ao3 = Math.min(rubric.ao3Max, Math.max(0, parsed.ao3Score || 0));
          const ao4 = Math.min(rubric.ao4Max, Math.max(0, parsed.ao4Score || 0));
          const total = Math.min(marks, Math.max(0, ao1 + ao2 + ao3 + ao4));

          return {
            totalScore: total,
            maxMarks: marks,
            percentage: Math.round((total / marks) * 100),
            aoBreakdown: {
              ao1: { score: ao1, max: rubric.ao1Max, feedback: parsed.ao1Feedback || "Demonstrated syllabus terminology." },
              ao2: { score: ao2, max: rubric.ao2Max, feedback: parsed.ao2Feedback || "Applied to case context." },
              ao3: { score: ao3, max: rubric.ao3Max, feedback: parsed.ao3Feedback || "Chain of reasoning developed." },
              ao4: { score: ao4, max: rubric.ao4Max, feedback: parsed.ao4Feedback || "Evaluative judgment provided." },
            },
            strengths: parsed.strengths || ["Engaged directly with question prompt."],
            improvements: parsed.improvements || ["Deepen chain of analysis."],
            examinerNotes: parsed.examinerNotes || "Marked using local WebLLM Qwen 2.5 0.5B.",
            modelAnswerSnippet: parsed.modelAnswerSnippet || rubric.sampleStrongPoint,
            isAiEvaluated: true,
            evaluatedAt: new Date().toISOString(),
          };
        }
      }
    } catch (e) {
      console.warn("WebLLM evaluation error, reverting to CIE Heuristic Examiner:", e);
    }
  }

  // Authoritative CIE Cambridge Heuristic Examiner
  return evaluateWithCieHeuristic(input);
}

/**
 * Deterministic Cambridge Examiner Rubric Evaluator
 */
function evaluateWithCieHeuristic(input: EvaluatorInput): EvaluationResult {
  const { questionPrompt, caseContext, marks, rubric, studentAnswer } = input;
  const rawText = studentAnswer.trim();
  const lowerText = rawText.toLowerCase();
  const wordCount = rawText ? rawText.split(/\s+/).length : 0;

  if (wordCount < 5) {
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
      examinerNotes: "Candidate response below minimum examinable threshold (under 5 words).",
      modelAnswerSnippet: rubric.sampleStrongPoint,
      isAiEvaluated: false,
      evaluatedAt: new Date().toISOString(),
    };
  }

  // 1. AO1 Knowledge Analysis
  // Check for business technical terms
  const businessVocab = [
    "profit", "cost", "revenue", "demand", "price", "market", "customer", "shareholder",
    "employee", "worker", "motivation", "efficiency", "productivity", "liquidity",
    "cash flow", "overdraft", "working capital", "scale", "economies of scale",
    "branding", "quality", "lean", "training", "recruitment", "stakeholder",
    "added value", "fixed cost", "variable cost", "break-even", "margin", "turnover",
    "partnership", "sole trader", "limited liability", "plc", "ltd", "exchange rate",
    "inflation", "tax", "tariff", "ethics", "sustainable", "export", "import"
  ];
  let ao1Matches = 0;
  businessVocab.forEach((term) => {
    if (lowerText.includes(term)) ao1Matches++;
  });

  let ao1Score = 0;
  let ao1Feedback = "";
  if (rubric.ao1Max > 0) {
    if (marks === 2) {
      if (wordCount >= 12 && ao1Matches >= 1) {
        ao1Score = 2;
        ao1Feedback = "Full textbook precision demonstrated with accurate business concept understanding.";
      } else if (wordCount >= 6) {
        ao1Score = 1;
        ao1Feedback = "Partial definition shown; lacks full formal textbook precision.";
      } else {
        ao1Score = 0;
        ao1Feedback = "Vague or colloquial definition; fails to identify formal syllabus concept.";
      }
    } else {
      const ratio = Math.min(1, (ao1Matches * 1.5 + (wordCount > 30 ? 1 : 0)) / (rubric.ao1Max * 2));
      ao1Score = Math.min(rubric.ao1Max, Math.max(1, Math.round(ratio * rubric.ao1Max)));
      ao1Feedback =
        ao1Score === rubric.ao1Max
          ? "Thorough syllabus knowledge with accurate business terminology throughout."
          : "Demonstrates relevant knowledge, but could incorporate more precise business terminology.";
    }
  }

  // 2. AO2 Application Analysis
  // Extract proper nouns or key terms from context
  let ao2Matches = 0;
  if (caseContext) {
    const contextWords = caseContext
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !["with", "from", "that", "this", "they", "have"].includes(w.toLowerCase()));
    
    contextWords.forEach((cw) => {
      if (lowerText.includes(cw.toLowerCase())) {
        ao2Matches++;
      }
    });
  }

  // Also check if prompt terms are used
  const hasNumbers = /\d+/.test(rawText);
  if (hasNumbers) ao2Matches += 2;

  let ao2Score = 0;
  let ao2Feedback = "";
  if (rubric.ao2Max > 0) {
    if (ao2Matches >= 4 || (ao2Matches >= 2 && hasNumbers)) {
      ao2Score = rubric.ao2Max;
      ao2Feedback = "Explicitly tailored to the specific business context, figures, and operational constraints.";
    } else if (ao2Matches >= 1) {
      ao2Score = Math.max(1, Math.min(rubric.ao2Max, Math.round(rubric.ao2Max * 0.5)));
      ao2Feedback = "General application to the business; could reference more specific case figures or product details.";
    } else {
      ao2Score = 0;
      ao2Feedback = "Generic textbook answer with little or no application to the named case study.";
    }
  }

  // 3. AO3 Analysis (Cause & Effect Chains)
  // Check for connective chains
  const causalConnectives = [
    "this leads to", "as a result", "consequently", "because of this", "therefore",
    "which means that", "enabling the business to", "this causes", "results in",
    "in turn", "which reduces", "which increases", "leading to", "so that",
    "impact on profit", "affects cash flow", "loss of customers", "lower costs"
  ];
  let causalCount = 0;
  causalConnectives.forEach((conn) => {
    if (lowerText.includes(conn)) causalCount++;
  });

  let ao3Score = 0;
  let ao3Feedback = "";
  if (rubric.ao3Max > 0) {
    const expectedCausal = rubric.ao3Max;
    if (causalCount >= expectedCausal && wordCount >= rubric.ao3Max * 25) {
      ao3Score = rubric.ao3Max;
      ao3Feedback = "Excellent analytical chains with clear explanation of causes, consequences, and business outcomes.";
    } else if (causalCount >= 1 || wordCount >= rubric.ao3Max * 15) {
      ao3Score = Math.max(1, Math.min(rubric.ao3Max, Math.round(rubric.ao3Max * 0.6)));
      ao3Feedback = "Basic analytical point made, but causal chain stops short before reaching final commercial impact.";
    } else {
      ao3Score = 0;
      ao3Feedback = "Descriptive rather than analytical; lacks causal connectives explaining 'this leads to...'.";
    }
  }

  // 4. AO4 Evaluation & Justification
  const evaluativePhrases = [
    "in conclusion", "recommend", "however", "on the other hand", "weighing up",
    "in the short term", "in the long term", "the deciding factor", "the best option",
    "despite the risk", "provided that", "depends on", "most important reason",
    "opportunity cost", "whereas option"
  ];
  let evalCount = 0;
  evaluativePhrases.forEach((ep) => {
    if (lowerText.includes(ep)) evalCount++;
  });

  let ao4Score = 0;
  let ao4Feedback = "";
  if (rubric.ao4Max > 0) {
    if (evalCount >= 3 && wordCount >= 150) {
      ao4Score = rubric.ao4Max;
      ao4Feedback = "High Level 3 evaluative judgment: balanced weighing of trade-offs followed by a fully justified decision.";
    } else if (evalCount >= 1 || wordCount >= 80) {
      ao4Score = Math.max(1, Math.min(rubric.ao4Max, Math.round(rubric.ao4Max * 0.5)));
      ao4Feedback = "Recommendation attempted, but relies on repetition of previous points rather than genuine weighing of trade-offs.";
    } else {
      ao4Score = 0;
      ao4Feedback = "No supported recommendation or evaluative judgment reached.";
    }
  }

  const totalScore = Math.min(marks, ao1Score + ao2Score + ao3Score + ao4Score);
  const percentage = Math.round((totalScore / marks) * 100);

  // Concrete Strengths & Improvement Points
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (ao1Score > 0) strengths.push("Accurately applied syllabus concepts and terminology.");
  if (ao2Score > 0) strengths.push("Directly embedded case study context and named factors.");
  if (ao3Score > 0) strengths.push("Demonstrated clear cause-and-effect reasoning linking actions to outcomes.");
  if (ao4Score > 0) strengths.push("Attempted balanced judgment with supported justification.");

  if (strengths.length === 0) strengths.push("Demonstrated willingness to tackle the question under exam conditions.");

  if (rubric.ao1Max > 0 && ao1Score < rubric.ao1Max) {
    improvements.push("Use more formal textbook definitions rather than everyday conversational phrasing.");
  }
  if (rubric.ao2Max > 0 && ao2Score < rubric.ao2Max) {
    improvements.push("Quote specific figures, product types, and operational context directly from the case study.");
  }
  if (rubric.ao3Max > 0 && ao3Score < rubric.ao3Max) {
    improvements.push("Extend your chain of analysis: explain the step-by-step mechanism (e.g. Action -> Worker motivation -> Productivity -> Average unit cost -> Profit).");
  }
  if (rubric.ao4Max > 0 && ao4Score < rubric.ao4Max) {
    improvements.push("Develop an explicit evaluative conclusion: explain WHY one option is superior to the alternative, taking into account the firm's financial limits.");
  }

  let examinerNotes = `CIE 0264/0450 Mark Scheme Assessment: Candidate earned ${totalScore}/${marks} marks (${percentage}%). `;
  if (percentage >= 80) examinerNotes += "Outstanding response demonstrating Grade A* mastery.";
  else if (percentage >= 65) examinerNotes += "Solid response showing strong Grade B/A examination technique.";
  else if (percentage >= 50) examinerNotes += "Clear Grade C benchmark; focus on deepening chains of analysis.";
  else examinerNotes += "Requires greater focus on Cambridge command words and syllabus terms.";

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
    modelAnswerSnippet: rubric.sampleStrongPoint,
    isAiEvaluated: false,
    evaluatedAt: new Date().toISOString(),
  };
}
