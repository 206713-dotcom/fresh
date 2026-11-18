import assert from "node:assert/strict";
import {
  evaluatePaper2Answer,
  evaluateStudentEssay,
  scanPaper2CausalChains,
  evaluateDeterministicAo4,
  detectCaseContext,
  isPureVagueFillerAnswer,
  deduplicateRepeatedSentences,
  splitResponsePoints,
  hasClearBusinessConsequenceChain,
  looksLikeValidCambridgeKnowledgePoint,
} from "../src/lib/engine/evaluator";
import {
  extractJsonObjectString,
  parseChecklistResponse,
  parseParagraphAuditResponse,
  buildChecklistUserPrompt,
  buildParagraphAuditUserPrompt,
  evaluateEssayWebLLM,
  CAMBRIDGE_0264_SYSTEM_PROMPT,
  CAMBRIDGE_0264_PARAGRAPH_JSON_SCHEMA,
  completeParagraphAudit,
} from "../src/lib/engine/webllm";

const BCT_CASE_STEM =
  "BioCell Tech (BCT) is a private limited company that manufactures benchtop laboratory bioreactors for biopharmaceutical research institutes. BCT operates one high-precision assembly plant employing 30 bio-engineers and software technicians. Management plans to expand into industrial-scale single-use cell culture bioreactors, requiring an investment of $1,700,000 in stainless steel vessel machining centers and automated sensor calibration chambers. Managing Director Brian is evaluating whether to finance this expansion via venture capital investment or securing a 5-year bank loan. Under batch production, BCT's monthly operations generate fixed overheads of $40,000 and total variable costs of $120,000 while producing 200 bioreactor units at a $1,000 contract price. BCT faces quality challenges, as 4% of bioreactors fail thermal temperature-sensor calibration testing, requiring manual sensor re-alignment and recalibration. Statement of Financial Position (2025): Cash $0.1m, Bank Overdraft $0.5m, Trade Payables $0.7m, Inventory $1.1m, Trade Receivables $0.4m, Long-Term Bank Loan $1.7m.";

const BCT_1B_QUESTION =
  "Consider three market research methods BCT could use before launching industrial bioreactors: Direct technical interviews with pharmaceutical bioprocess directors, Analyzing rival laboratory equipment websites, or Exhibiting at international biotechnology trade fairs. Which method should BCT choose? Justify your recommendation.";

const BCT_1B_MODEL_ANSWER =
  "Direct technical interviews with bioprocess directors gather exact cell yield and sterilization specifications, though executive response times are long. Analyzing rival websites provides zero-cost data on competitor features, though it lacks direct client order feedback. Exhibiting at biotech trade fairs showcases bioreactor prototypes to global pharma directors, securing sales leads, though exhibition costs are high. Recommendation: Direct technical interviews with bioprocess directors are best because securing exact technical requirements directly from pharmaceutical clients is essential before investing $1,700,000 in single-use vessel machinery.";

const BCT_1B_VALID_APP_WORDS = [
  "industrial bioreactors",
  "$1,700,000 vessel machinery",
  "$1,000 price",
  "bioprocess directors",
  "200 units",
];

const BCT_1B_MARK_SCHEME = {
  level_1_1_to_4: "Outlines market research methods simply.",
  level_2_5_to_8: "Analyzes pros and cons of two or three research methods in context.",
  level_3_9_to_12:
    "Comprehensive evaluation of all three methods leading to a well-supported recommendation.",
};

// Complete 4-paragraph Paper 2 12-mark essay with cross-sentence causal reasoning and comparative Recommendation
const BCT_4_PARA_ESSAY_CROSS_SENTENCE = `Direct technical interviews with pharmaceutical bioprocess directors allow BCT to gather accurate qualitative primary research on sterilization and cell yield specifications before committing $1,700,000 to single-use bioreactor machinery, ensuring the new industrial bioreactors match client standards. However, this method is very time-consuming because arranging interviews with senior directors takes months. Since BCT only employs 30 bio-engineers, diverting engineers away could reduce output below 200 units/month and delay existing orders.

Analyzing rival laboratory equipment websites provides quick secondary market research at zero cash outlay, helping BCT benchmark competitor pricing against its $1,000 contract price without increasing $40,000 fixed overheads. Consequently, this preserves cash flow when BCT only holds $0.1m in cash. However, competitor websites cannot reveal bespoke technical requirements or likely bulk order demand, increasing failure risk if demand falls short.

Exhibiting at international biotechnology trade fairs lets BCT demonstrate bioreactor prototypes directly to global pharma buyers, generating qualified sales leads and boosting future revenue. However, international booth fees and travel expenses create high initial costs, which worsens BCT's tight working capital given its $0.5m bank overdraft and $0.7m trade payables.

Recommendation
BCT should choose Direct technical interviews with pharmaceutical bioprocess directors before committing $1,700,000 in machinery. Although executive interviews take time and pull some of the 30 bio-engineers away from 200 units/month production, securing exact client specifications prevents costly redesigns and protects long-term profit. Meanwhile, exhibiting at international trade fairs is too expensive given BCT only has $0.1m in cash alongside a $0.5m overdraft, whereas analyzing rival websites lacks direct feedback from bioprocess directors on industrial orders.`;

// 4-paragraph essay structured with 6 single-step reasons across 3 options (no multi-sentence chain needed) + Recommendation
const BCT_4_PARA_ESSAY_SIX_SINGLE_STEPS = `Direct technical interviews with bioprocess directors ensure accurate specifications for industrial bioreactors because clients state exact requirements. However, diverting 30 bio-engineers to interviews delays output below 200 units/month.

Analyzing rival websites saves cash because secondary research incurs minimal overheads compared to a $1,700,000 machinery commitment. However, rival websites fail to show bespoke client demand, which could lower future sales.

Exhibiting at trade fairs showcases bioreactor prototypes to pharma buyers, increasing potential sales leads. However, high exhibition costs worsen BCT's liquidity because cash is only $0.1m alongside a $0.5m overdraft.

Recommendation
BCT should choose Direct technical interviews with bioprocess directors. While interviews take longer, confirming specifications prevents failure before spending $1,700,000, whereas trade fairs are too expensive given $0.1m cash and $0.5m overdraft and rival websites lack client order feedback.`;

function createMockWebLLMEngine(tier: "0.6b", jsonPayload: Record<string, unknown>) {
  return {
    tier,
    modelId: "SemiLunarz/qwen3-0.6b-igcse-0264-onnx",
    chat: {
      completions: {
        create: async () => ({
          choices: [
            {
              message: {
                content: `<think>Internal reasoning should be stripped.</think>\n${JSON.stringify(
                  jsonPayload
                )}`,
              },
            },
          ],
        }),
      },
    },
  };
}

async function runTests() {
  console.log("Running Cambridge 0264 / 0450 Grading Regression Suite...");

  // 1. Verify cross-sentence two-step causal chain detection
  const crossScan = scanPaper2CausalChains(BCT_4_PARA_ESSAY_CROSS_SENTENCE);
  console.log("Cross-sentence scan:", crossScan);
  assert.ok(
    crossScan.validatedChains >= 2,
    `Expected >= 2 developed cross-sentence chains, got ${crossScan.validatedChains}`
  );
  assert.ok(
    crossScan.paragraphsWithValidatedChains >= 2,
    `Expected >= 2 option paragraphs with validated chains, got ${crossScan.paragraphsWithValidatedChains}`
  );

  // 2. Verify AO mark allocation preserved: AO1:2, AO2:3, AO3:4, AO4:3 = 12
  const detResult = await evaluatePaper2Answer({
    questionNumber: "1(b)",
    questionText: BCT_1B_QUESTION,
    markValue: 12,
    markScheme: BCT_1B_MARK_SCHEME,
    modelAnswer: BCT_1B_MODEL_ANSWER,
    validAppWords: BCT_1B_VALID_APP_WORDS,
    studentAnswer: BCT_4_PARA_ESSAY_CROSS_SENTENCE,
    caseMainStem: BCT_CASE_STEM,
  });
  console.log("Deterministic 4-para BCT result:", {
    total: detResult.totalScore,
    level: detResult.level,
    ao: {
      ao1: `${detResult.aoBreakdown.ao1.score}/${detResult.aoBreakdown.ao1.max}`,
      ao2: `${detResult.aoBreakdown.ao2.score}/${detResult.aoBreakdown.ao2.max}`,
      ao3: `${detResult.aoBreakdown.ao3.score}/${detResult.aoBreakdown.ao3.max}`,
      ao4: `${detResult.aoBreakdown.ao4?.score}/${detResult.aoBreakdown.ao4?.max}`,
    },
  });
  assert.equal(detResult.aoBreakdown.ao1.max, 2, "AO1 max must be 2");
  assert.equal(detResult.aoBreakdown.ao2.max, 3, "AO2 max must be 3");
  assert.equal(detResult.aoBreakdown.ao3.max, 4, "AO3 max must be 4");
  assert.equal(detResult.aoBreakdown.ao4?.max, 3, "AO4 max must be 3");
  assert.ok(detResult.level.includes("Level 3"), `Expected Level 3, got ${detResult.level}`);
  assert.equal(detResult.aoBreakdown.ao3.score, 3, `Expected strong Level 3 AO3 = 3/4, got ${detResult.aoBreakdown.ao3.score}`);
  assert.equal(detResult.aoBreakdown.ao4?.score, 2, `Expected strong Level 3 AO4 = 2/3 without mitigation, got ${detResult.aoBreakdown.ao4?.score}`);
  assert.equal(detResult.totalScore, 10, `Expected strong 4-para BCT essay to land at 10/12, got ${detResult.totalScore}`);

  // 3. Conservative Qwen 3 0.6B Anti-Halo paragraphs[] path (should NOT pull 4-para essay down to Level 2)
  const mock06B = createMockWebLLMEngine("0.6b", {
    question_type: "paper2_12m_b",
    paragraphs: [
      {
        paragraph_number: 1,
        role: "option",
        isolated_quote: "Direct technical interviews with pharmaceutical bioprocess directors...",
        k_score: 1,
        app_score: 1,
        an_score: 1,
        eval_score: 0,
        subtotal: 3,
        critique: "Strong P1.",
      },
      {
        paragraph_number: 2,
        role: "option",
        isolated_quote: "Analyzing rival laboratory equipment websites...",
        k_score: 0,
        app_score: 0,
        an_score: 0,
        eval_score: 0,
        subtotal: 0,
        critique: "Conservative AI under-score on P2.",
      },
    ],
    level_recommendation: "Level 2",
    overall_critique: "Applied primary and secondary research concepts to BCT.",
  });
  const res08B = await evaluatePaper2Answer({
    questionNumber: "1(b)",
    questionText: BCT_1B_QUESTION,
    markValue: 12,
    markScheme: BCT_1B_MARK_SCHEME,
    modelAnswer: BCT_1B_MODEL_ANSWER,
    validAppWords: BCT_1B_VALID_APP_WORDS,
    studentAnswer: BCT_4_PARA_ESSAY_CROSS_SENTENCE,
    caseMainStem: BCT_CASE_STEM,
    webllmEngine: mock06B,
  });
  console.log("0.6B path BCT result:", {
    total: res08B.totalScore,
    level: res08B.level,
    ao3: res08B.aoBreakdown.ao3.score,
    ao4: res08B.aoBreakdown.ao4?.score,
  });
  assert.ok(res08B.level.includes("Level 3"), `0.6B path expected Level 3, got ${res08B.level}`);
  assert.equal(res08B.totalScore, 10, `0.6B path expected 10/12, got ${res08B.totalScore}`);

  // 4. Full-credit Qwen 3 0.6B Anti-Halo paragraphs[] path
  const mockFullCredit = createMockWebLLMEngine("0.6b", {
    question_type: "paper2_12m_b",
    paragraphs: [
      {
        paragraph_number: 1,
        role: "option",
        isolated_quote: "Direct technical interviews...",
        k_score: 1,
        app_score: 1,
        an_score: 1,
        eval_score: 0,
        subtotal: 3,
        critique: "Strong K+App+An.",
      },
      {
        paragraph_number: 2,
        role: "option",
        isolated_quote: "Analyzing rival laboratory equipment websites...",
        k_score: 1,
        app_score: 1,
        an_score: 1,
        eval_score: 0,
        subtotal: 3,
        critique: "Strong K+App+An.",
      },
      {
        paragraph_number: 3,
        role: "option",
        isolated_quote: "Exhibiting at international biotechnology trade fairs...",
        k_score: 1,
        app_score: 1,
        an_score: 1,
        eval_score: 0,
        subtotal: 3,
        critique: "Strong K+App+An.",
      },
      {
        paragraph_number: 4,
        role: "conclusion",
        isolated_quote: "Recommendation BCT should choose Direct technical interviews...",
        k_score: 0,
        app_score: 0,
        an_score: 0,
        eval_score: 2,
        subtotal: 2,
        critique: "Comparative recommendation in context.",
      },
    ],
    level_recommendation: "Level 3",
    overall_critique: "Analyzed all three market research methods in BCT context.",
  });
  const resFullCredit = await evaluatePaper2Answer({
    questionNumber: "1(b)",
    questionText: BCT_1B_QUESTION,
    markValue: 12,
    markScheme: BCT_1B_MARK_SCHEME,
    modelAnswer: BCT_1B_MODEL_ANSWER,
    validAppWords: BCT_1B_VALID_APP_WORDS,
    studentAnswer: BCT_4_PARA_ESSAY_CROSS_SENTENCE,
    caseMainStem: BCT_CASE_STEM,
    webllmEngine: mockFullCredit,
  });
  console.log("Full-credit 0.6B path BCT result:", {
    total: resFullCredit.totalScore,
    level: resFullCredit.level,
    ao3: resFullCredit.aoBreakdown.ao3.score,
    ao4: resFullCredit.aoBreakdown.ao4?.score,
  });
  assert.ok(resFullCredit.level.includes("Level 3"), `Full-credit 0.6B path expected Level 3, got ${resFullCredit.level}`);
  assert.equal(resFullCredit.totalScore, 10, `Full-credit 0.6B path expected 10/12 without mitigation, got ${resFullCredit.totalScore}`);

  // 4b. Top-Band Paper 2 12-mark calibration:
  // Adding contextual mitigation in Recommendation unlocks AO4 = 3/3 -> 11/12 when option chains are single-step
  const BCT_11_OF_12_WITH_MITIGATION =
    BCT_4_PARA_ESSAY_SIX_SINGLE_STEPS +
    " To mitigate the delay to the 200 units/month assembly schedule, BCT can schedule interviews outside core assembly hours using two lead engineers, provided that calibration testing stays on schedule.";
  const res11 = await evaluatePaper2Answer({
    questionNumber: "1(b)",
    questionText: BCT_1B_QUESTION,
    markValue: 12,
    markScheme: BCT_1B_MARK_SCHEME,
    modelAnswer: BCT_1B_MODEL_ANSWER,
    validAppWords: BCT_1B_VALID_APP_WORDS,
    studentAnswer: BCT_11_OF_12_WITH_MITIGATION,
    caseMainStem: BCT_CASE_STEM,
  });
  console.log("12m Part (b) with mitigation (11/12) result:", {
    total: res11.totalScore,
    ao3: res11.aoBreakdown.ao3.score,
    ao4: res11.aoBreakdown.ao4?.score,
  });
  assert.equal(res11.aoBreakdown.ao3.score, 3, `Single-step option chains must stay at AO3 = 3/4, got ${res11.aoBreakdown.ao3.score}`);
  assert.equal(res11.aoBreakdown.ao4?.score, 3, `Mitigation in Recommendation must unlock AO4 = 3/3, got ${res11.aoBreakdown.ao4?.score}`);
  assert.equal(res11.totalScore, 11, `Expected 11/12 with mitigation + single-step option chains, got ${res11.totalScore}`);

  // 4c. Full 12/12 requires ALL option paragraphs having developed two-sided causal chains + mitigation
  const BCT_12_OF_12_ESSAY =
    BCT_4_PARA_ESSAY_CROSS_SENTENCE +
    " To mitigate the delay to the 200 units/month assembly schedule, BCT can schedule interviews outside core assembly hours using two lead engineers, provided that calibration testing stays on schedule.";
  const res12 = await evaluatePaper2Answer({
    questionNumber: "1(b)",
    questionText: BCT_1B_QUESTION,
    markValue: 12,
    markScheme: BCT_1B_MARK_SCHEME,
    modelAnswer: BCT_1B_MODEL_ANSWER,
    validAppWords: BCT_1B_VALID_APP_WORDS,
    studentAnswer: BCT_12_OF_12_ESSAY,
    caseMainStem: BCT_CASE_STEM,
  });
  console.log("12m Part (b) full two-sided + mitigation (12/12) result:", {
    total: res12.totalScore,
    ao3: res12.aoBreakdown.ao3.score,
    ao4: res12.aoBreakdown.ao4?.score,
  });
  assert.equal(res12.aoBreakdown.ao3.score, 4, `Full two-sided chains + mitigation must unlock AO3 = 4/4, got ${res12.aoBreakdown.ao3.score}`);
  assert.equal(res12.aoBreakdown.ao4?.score, 3, `Expected AO4 = 3/3, got ${res12.aoBreakdown.ao4?.score}`);
  assert.equal(res12.totalScore, 12, `Expected 12/12, got ${res12.totalScore}`);
  const res12ConclusionAudit = res12.paragraphAudits?.find((p) => p.role === "conclusion");
  assert.equal(
    res12ConclusionAudit?.eval_score,
    res12.aoBreakdown.ao4?.score,
    "12-mark conclusion paragraph audit must be synced with the final AO4 summary score"
  );

  // 5. Six single-step reasons across 3 options + comparative Recommendation -> AO3 = 3/4, Level 3 (10/12)
  const sixReasonsRes = await evaluatePaper2Answer({
    questionNumber: "1(b)",
    questionText: BCT_1B_QUESTION,
    markValue: 12,
    markScheme: BCT_1B_MARK_SCHEME,
    modelAnswer: BCT_1B_MODEL_ANSWER,
    validAppWords: BCT_1B_VALID_APP_WORDS,
    studentAnswer: BCT_4_PARA_ESSAY_SIX_SINGLE_STEPS,
    caseMainStem: BCT_CASE_STEM,
  });
  console.log("6 single-step reasons BCT result:", {
    total: sixReasonsRes.totalScore,
    level: sixReasonsRes.level,
    ao3: sixReasonsRes.aoBreakdown.ao3.score,
    ao4: sixReasonsRes.aoBreakdown.ao4?.score,
  });
  assert.ok(sixReasonsRes.aoBreakdown.ao3.score >= 3, `Expected AO3 >= 3, got ${sixReasonsRes.aoBreakdown.ao3.score}`);
  assert.ok((sixReasonsRes.aoBreakdown.ao4?.score ?? 0) >= 2, `Expected AO4 >= 2, got ${sixReasonsRes.aoBreakdown.ao4?.score}`);
  assert.ok(sixReasonsRes.level.includes("Level 3"), `Expected Level 3 for 6-reasons essay, got ${sixReasonsRes.level}`);
  assert.equal(sixReasonsRes.totalScore, 10, `Expected 10/12 for 6-reasons essay, got ${sixReasonsRes.totalScore}`);

  // 5b. Explicit 0 two-step chains + 6 separated single-step reasons across 3 options -> AO3 >= 3/4, Level 3
  const separatedSingleStepEssay = `Direct technical interviews involve speaking directly with pharmaceutical bioprocess directors. This ensures accurate sterilization specifications for industrial bioreactors. Also, the company employs 30 bio-engineers. Using engineers for interviews reduces output below 200 units/month.

Analyzing rival laboratory equipment websites is a secondary market research method. Studying competitor sites saves cash because secondary research avoids extra overheads. On the other hand, online pages are public summaries. Public summaries fail to show custom demand, lowering future sales.

Exhibiting at international biotechnology trade fairs lets BCT present prototypes globally. Demonstrating prototypes attracts buyers and boosts leads. Still, international travel has high fees. High booth fees strain liquidity given only $0.1m cash and a $0.5m overdraft.

Recommendation
BCT should choose Direct technical interviews with bioprocess directors before spending $1,700,000. Although interviews divert bio-engineers from 200 units/month output, securing accurate specifications prevents costly failure, whereas trade fairs are too expensive given $0.1m cash and $0.5m overdraft and rival websites lack client order feedback.`;

  const sepScan = scanPaper2CausalChains(separatedSingleStepEssay);
  console.log("Separated single-step scan:", sepScan);
  assert.ok(sepScan.singleStepReasons >= 4, `Expected >= 4 single-step reasons, got ${sepScan.singleStepReasons}`);
  const sepRes = await evaluatePaper2Answer({
    questionNumber: "1(b)",
    questionText: BCT_1B_QUESTION,
    markValue: 12,
    markScheme: BCT_1B_MARK_SCHEME,
    modelAnswer: BCT_1B_MODEL_ANSWER,
    validAppWords: BCT_1B_VALID_APP_WORDS,
    studentAnswer: separatedSingleStepEssay,
    caseMainStem: BCT_CASE_STEM,
  });
  console.log("Separated 6 single-step BCT result:", {
    total: sepRes.totalScore,
    level: sepRes.level,
    ao3: sepRes.aoBreakdown.ao3.score,
    ao4: sepRes.aoBreakdown.ao4?.score,
  });
  assert.ok(sepRes.aoBreakdown.ao3.score >= 3, `Expected AO3 >= 3 on 4+ single-step essay, got ${sepRes.aoBreakdown.ao3.score}`);
  assert.ok(sepRes.level.includes("Level 3"), `Expected Level 3, got ${sepRes.level}`);
  assert.equal(sepRes.totalScore, 10, `Expected 10/12, got ${sepRes.totalScore}`);

  // 6. AO4 with AO3 === 2 is NOT capped at 1/3
  const ao4WithAo3Two = evaluateDeterministicAo4({
    answer: BCT_4_PARA_ESSAY_CROSS_SENTENCE,
    marks: 12,
    ao2Score: 3,
    ao3Score: 2,
    effectiveAppWords: BCT_1B_VALID_APP_WORDS,
    caseContext: BCT_CASE_STEM,
  });
  assert.ok(
    ao4WithAo3Two.score >= 2,
    `AO4 with AO3=2 should be 2 or 3 (not capped at 1), got ${ao4WithAo3Two.score}`
  );

  // 7. Weak generic essay ("however" in para 1 + generic conclusion "it is the best way") MUST NOT reach Level 3
  const weakGenericEssay = `Direct technical interviews gather information from customers. However, interviews take time.

Rival websites can be viewed online easily.

Trade fairs cost money for booths.

Overall, direct technical interviews are the best way for BCT.`;
  const weakRes = await evaluatePaper2Answer({
    questionNumber: "1(b)",
    questionText: BCT_1B_QUESTION,
    markValue: 12,
    markScheme: BCT_1B_MARK_SCHEME,
    modelAnswer: BCT_1B_MODEL_ANSWER,
    validAppWords: BCT_1B_VALID_APP_WORDS,
    studentAnswer: weakGenericEssay,
    caseMainStem: BCT_CASE_STEM,
  });
  console.log("Weak generic essay result:", { total: weakRes.totalScore, level: weakRes.level });
  assert.ok(weakRes.totalScore <= 7, `Weak generic essay must stay <= 7/12, got ${weakRes.totalScore}`);
  assert.ok(!weakRes.level.includes("Level 3"), `Weak generic essay must not reach Level 3`);

  // 8. Pure company name-dropping ("BCT" / "BioCell Tech") earns 0 AO2
  const nameDropDetection = detectCaseContext("BCT and BioCell Tech should grow profits rapidly.", {
    validAppWords: BCT_1B_VALID_APP_WORDS,
    caseContext: BCT_CASE_STEM,
    ao2Max: 3,
  });
  assert.equal(nameDropDetection.foundWords.length, 0, "Company name-dropping alone must match 0 AO2 facts");

  // 9. Essay with good analysis but NO conclusion (AO4 = 0) capped at Level 2 (<= 8/12)
  const noConclusionEssay = BCT_4_PARA_ESSAY_CROSS_SENTENCE.split(/\n\s*\nRecommendation/i)[0];
  const noConcRes = await evaluatePaper2Answer({
    questionNumber: "1(b)",
    questionText: BCT_1B_QUESTION,
    markValue: 12,
    markScheme: BCT_1B_MARK_SCHEME,
    modelAnswer: BCT_1B_MODEL_ANSWER,
    validAppWords: BCT_1B_VALID_APP_WORDS,
    studentAnswer: noConclusionEssay,
    caseMainStem: BCT_CASE_STEM,
  });
  assert.ok(noConcRes.totalScore <= 8, `No-conclusion essay must cap at <= 8/12, got ${noConcRes.totalScore}`);

  // 10. 8-mark Paper 2 Part (a) calibration (Separate Paragraph Audit -> Level 1–3):
  // - 2+ paragraphs BOTH with strong K + App + detailed An -> Level 3 (7–8/8)
  // - P1 strong + P2 missing App & An (no halo spillover) -> Level 2 (4–6/8)
  // - Generic points with weak/missing App & An -> Level 1 (1–3/8)
  // - Duplicate paragraph -> 0 subtotal, caps total <= 4/8
  const p2EightMarkTwoParaEssay = `Venture capital provides equity funding without mandatory monthly interest charges. Since BCT already faces $40,000 monthly fixed overheads, avoiding debt repayments preserves working capital and protects profit margins on its 200 bioreactor units.

Furthermore, venture capitalists bring commercial connections with global biopharmaceutical manufacturers. Because BCT plans a $1,700,000 expansion into industrial bioreactors, these contacts help secure high-value supply contracts and increase future sales revenue.`;

  const p2EightMs = {
    knowledge_max_2: [
      "Equity funding / no mandatory interest",
      "Business expertise / industry contacts",
      "Large lump sum capital without collateral",
      "Shared business risk with investors",
    ],
  };
  const p2EightAppWords = [
    "$1,700,000 expansion",
    "industrial bioreactors",
    "venture capital",
    "$40,000 fixed costs",
    "200 bioreactor units",
    "30 bio-engineers",
    "4% defect rate",
  ];

  const p2EightTwoParaRes = await evaluatePaper2Answer({
    questionNumber: "1(a)",
    questionText:
      "Explain four advantages to BCT of securing venture capital to finance its $1,700,000 industrial bioreactor expansion.",
    markValue: 8,
    markScheme: p2EightMs,
    modelAnswer: "Four advantages applied to BCT with causal chains.",
    validAppWords: p2EightAppWords,
    studentAnswer: p2EightMarkTwoParaEssay,
    caseMainStem: BCT_CASE_STEM,
  });
  console.log("8m Paper 2 Part (a) 2+ strong K+App+detailed An -> Level 3:", {
    total: p2EightTwoParaRes.totalScore,
    level: p2EightTwoParaRes.level,
    ao: p2EightTwoParaRes.aoBreakdown,
    notes: p2EightTwoParaRes.examinerNotes,
  });
  assert.ok(
    p2EightTwoParaRes.level.includes("Level 3"),
    `2+ strong [K+App+detailed An] paragraphs in Paper 2 (a) expected Level 3, got ${p2EightTwoParaRes.level}`
  );
  assert.ok(
    p2EightTwoParaRes.totalScore >= 7 && p2EightTwoParaRes.totalScore <= 8,
    `Expected Level 3 score 7-8/8, got ${p2EightTwoParaRes.totalScore}`
  );
  assert.equal(
    p2EightTwoParaRes.aoBreakdown.ao1.score +
      p2EightTwoParaRes.aoBreakdown.ao2.score +
      p2EightTwoParaRes.aoBreakdown.ao3.score,
    p2EightTwoParaRes.totalScore,
    "AO sum must equal totalScore"
  );
  assert.equal(p2EightTwoParaRes.paragraphAudits?.length, 2, "Should audit 2 isolated paragraphs");

  // Level 2 (4–6): P1 is strong [K+App+detailed An], while P2 lacks App & An (ZERO halo spillover!)
  const p2EightMixedLevel2Essay = `Venture capital provides equity funding without mandatory monthly interest charges. Since BCT already faces $40,000 monthly fixed overheads, avoiding debt repayments preserves working capital and protects profit margins on its 200 bioreactor units.

In addition, equity investors provide strategic financial advice and shared business risk.`;
  const p2EightMixedRes = await evaluatePaper2Answer({
    questionNumber: "1(a)",
    questionText:
      "Explain four advantages to BCT of securing venture capital to finance its $1,700,000 industrial bioreactor expansion.",
    markValue: 8,
    markScheme: p2EightMs,
    modelAnswer: "Four advantages applied to BCT with causal chains.",
    validAppWords: p2EightAppWords,
    studentAnswer: p2EightMixedLevel2Essay,
    caseMainStem: BCT_CASE_STEM,
  });
  console.log("8m Paper 2 Part (a) P1 strong + P2 generic -> Level 2:", {
    total: p2EightMixedRes.totalScore,
    level: p2EightMixedRes.level,
    p2Audit: p2EightMixedRes.paragraphAudits?.[1],
  });
  assert.ok(
    p2EightMixedRes.level.includes("Level 2"),
    `P1 strong + P2 generic expected Level 2 (4-6), got ${p2EightMixedRes.level}`
  );
  assert.ok(
    p2EightMixedRes.totalScore >= 4 && p2EightMixedRes.totalScore <= 6,
    `Expected Level 2 score 4-6/8, got ${p2EightMixedRes.totalScore}`
  );
  assert.equal(p2EightMixedRes.paragraphAudits?.[1]?.app_score, 0, "P2 must NOT inherit App from P1");
  assert.equal(p2EightMixedRes.paragraphAudits?.[1]?.an_score, 0, "P2 must NOT inherit An from P1");

  // Level 1 (1–3): Generic points with weak/missing App and An
  const p2EightGenericLevel1Essay = `Venture capital raises equity funding without monthly interest charges.

Equity investors also offer useful business expertise and shared risk.`;
  const p2EightGenericRes = await evaluatePaper2Answer({
    questionNumber: "1(a)",
    questionText:
      "Explain four advantages to BCT of securing venture capital to finance its $1,700,000 industrial bioreactor expansion.",
    markValue: 8,
    markScheme: p2EightMs,
    modelAnswer: "Four advantages applied to BCT with causal chains.",
    validAppWords: p2EightAppWords,
    studentAnswer: p2EightGenericLevel1Essay,
    caseMainStem: BCT_CASE_STEM,
  });
  console.log("8m Paper 2 Part (a) generic -> Level 1:", {
    total: p2EightGenericRes.totalScore,
    level: p2EightGenericRes.level,
  });
  assert.ok(
    p2EightGenericRes.level.includes("Level 1"),
    `Generic P1+P2 expected Level 1 (1-3), got ${p2EightGenericRes.level}`
  );
  assert.ok(
    p2EightGenericRes.totalScore >= 1 && p2EightGenericRes.totalScore <= 3,
    `Expected Level 1 score 1-3/8, got ${p2EightGenericRes.totalScore}`
  );

  // Full 8/8 with 4 strong [K+App+detailed An] paragraphs
  const p2EightFullFourParaEssay = `${p2EightMarkTwoParaEssay}

Additionally, venture capital supplies a large lump sum of $1,700,000 without requiring BCT to pledge its high-precision assembly plant as collateral. Because no asset security is lost, BCT lowers insolvency risk if its 4% sensor defect rate delays deliveries.

Finally, sharing financial risk with venture capitalists gives Managing Director Brian confidence to invest in automated sensor calibration chambers. As a result, BCT's 30 bio-engineers reduce thermal calibration faults below 4%, boosting productivity and long-term profit.`;

  const p2EightFullRes = await evaluatePaper2Answer({
    questionNumber: "1(a)",
    questionText:
      "Explain four advantages to BCT of securing venture capital to finance its $1,700,000 industrial bioreactor expansion.",
    markValue: 8,
    markScheme: p2EightMs,
    modelAnswer: "Four distinct advantages of venture capital applied to BCT with causal chains.",
    validAppWords: p2EightAppWords,
    studentAnswer: p2EightFullFourParaEssay,
    caseMainStem: BCT_CASE_STEM,
  });
  console.log("8m Paper 2 Part (a) 4-para full result (8/8):", {
    total: p2EightFullRes.totalScore,
    level: p2EightFullRes.level,
    ao: p2EightFullRes.aoBreakdown,
  });
  assert.equal(p2EightFullRes.totalScore, 8, `Expected 8/8 for 4 full [K+App+detailed An] paragraphs, got ${p2EightFullRes.totalScore}`);
  assert.ok(p2EightFullRes.level.includes("Level 3"), "Expected Level 3 for 8/8");

  // Duplicate paragraph in Paper 2 8m gets 0 subtotal -> cannot reach Level 2 or 3
  const p2EightDupEssay = `Venture capital provides equity funding without mandatory monthly interest charges. Since BCT already faces $40,000 monthly fixed overheads, avoiding debt repayments preserves working capital and protects profit margins on its 200 bioreactor units.

Venture capital provides equity funding without mandatory monthly interest charges. Since BCT already faces $40,000 monthly fixed overheads, avoiding debt repayments preserves working capital and protects profit margins on its 200 bioreactor units.`;
  const p2EightDupRes = await evaluatePaper2Answer({
    questionNumber: "1(a)",
    questionText:
      "Explain four advantages to BCT of securing venture capital to finance its $1,700,000 industrial bioreactor expansion.",
    markValue: 8,
    markScheme: p2EightMs,
    modelAnswer: "Model",
    validAppWords: p2EightAppWords,
    studentAnswer: p2EightDupEssay,
    caseMainStem: BCT_CASE_STEM,
  });
  assert.equal(p2EightDupRes.paragraphAudits?.[1]?.is_duplicate, true, "Duplicate P2 must be flagged");
  assert.equal(p2EightDupRes.paragraphAudits?.[1]?.subtotal, 0, "Duplicate P2 must score 0 subtotal");
  assert.ok(p2EightDupRes.totalScore <= 4, `Duplicate P2 must cap total <= 4/8, got ${p2EightDupRes.totalScore}`);

  // Alias p2EightMarkEssay for Paper 1 8m tests below
  const p2EightMarkEssay = p2EightMarkTwoParaEssay;

  // 11. 8-mark Paper 1 Part (d) calibration:
  // - Strong Complete Answer (7/8): two sides + justified 'because' decision in context, without mitigation/contingency -> AO4 = 1/2
  // - Top-Band Full Marks (8/8): ALSO mitigates/manages chosen option's main drawback or states contextual contingency -> AO4 = 2/2
  const p1EightRubric = {
    totalMarks: 8,
    ao1Max: 2,
    ao2Max: 2,
    ao3Max: 2,
    ao4Max: 2,
    descriptors: {
      ao1: ["Knowledge of sources of finance"],
      ao2: ["Application to BCT"],
      ao3: ["Analysis"],
      ao4: ["Evaluation"],
    },
    indicativeContent: ["venture capital no interest", "equity dilution of control", "bank loan interest increases fixed costs"],
    sampleStrongPoint: "Venture capital avoids interest repayments.",
  };
  const p1EightRes = await evaluateStudentEssay({
    questionTitle: "Paper 1 Q4(d) (8 marks)",
    questionPrompt: "Do you think BCT should use venture capital rather than a bank loan? Justify your answer.",
    caseContext: BCT_CASE_STEM,
    marks: 8,
    rubric: p1EightRubric,
    studentAnswer:
      p2EightMarkEssay +
      "\n\nOverall, I recommend venture capital because avoiding interest on a $1,700,000 loan protects cash flow even though control is diluted.",
    validAppWords: ["$1,700,000", "$40,000", "200 bioreactor units"],
    modelAnswer: "Venture capital avoids monthly interest above $40,000 fixed overheads, although ownership control is shared.",
  });
  console.log("8m Paper 1 strong result (7/8):", {
    total: p1EightRes.totalScore,
    ao3: `${p1EightRes.aoBreakdown.ao3.score}/${p1EightRes.aoBreakdown.ao3.max}`,
    ao4: `${p1EightRes.aoBreakdown.ao4.score}/${p1EightRes.aoBreakdown.ao4.max}`,
    notes: p1EightRes.examinerNotes,
  });
  assert.equal(p1EightRes.aoBreakdown.ao1.score, 2, "8m Paper 1 expected full 2/2 AO1");
  assert.equal(p1EightRes.aoBreakdown.ao2.score, 2, "8m Paper 1 expected full 2/2 AO2");
  assert.equal(p1EightRes.aoBreakdown.ao3.score, 2, "8m Paper 1 expected full 2/2 AO3");
  assert.equal(p1EightRes.aoBreakdown.ao4.score, 1, "8m Paper 1 without mitigation/contingency expected 1/2 AO4");
  assert.equal(p1EightRes.totalScore, 7, `8m Paper 1 without mitigation expected 7/8, got ${p1EightRes.totalScore}`);
  assert.ok(
    p1EightRes.examinerNotes.includes(
      "Paragraph 1: 3/3 [K + App + An] · Paragraph 2: 3/3 [K + App + An] · Conclusion: 1/2 [Eval] → Total: 7/8"
    ),
    `Expected exact per-paragraph breakdown in examinerNotes, got: ${p1EightRes.examinerNotes}`
  );

  const p1EightFullRes = await evaluateStudentEssay({
    questionTitle: "Paper 1 Q4(d) (8 marks)",
    questionPrompt: "Do you think BCT should use venture capital rather than a bank loan? Justify your answer.",
    caseContext: BCT_CASE_STEM,
    marks: 8,
    rubric: p1EightRubric,
    studentAnswer:
      p2EightMarkEssay +
      "\n\nOverall, I recommend venture capital because avoiding interest on a $1,700,000 loan protects cash flow even though control is diluted. To overcome ownership dilution, Brian can retain a majority equity stake above 51%, provided that the venture capitalist accepts milestone-based governance.",
    validAppWords: ["$1,700,000", "$40,000", "200 bioreactor units"],
    modelAnswer: "Venture capital avoids monthly interest above $40,000 fixed overheads, although ownership control is shared.",
  });
  console.log("8m Paper 1 top-band result (8/8):", {
    total: p1EightFullRes.totalScore,
    ao3: `${p1EightFullRes.aoBreakdown.ao3.score}/${p1EightFullRes.aoBreakdown.ao3.max}`,
    ao4: `${p1EightFullRes.aoBreakdown.ao4.score}/${p1EightFullRes.aoBreakdown.ao4.max}`,
    notes: p1EightFullRes.examinerNotes,
  });
  assert.equal(p1EightFullRes.aoBreakdown.ao4.score, 2, "8m Paper 1 with mitigation/contingency expected 2/2 AO4");
  assert.equal(p1EightFullRes.totalScore, 8, `8m Paper 1 with mitigation expected 8/8, got ${p1EightFullRes.totalScore}`);
  assert.ok(
    p1EightFullRes.examinerNotes.includes(
      "Paragraph 1: 3/3 [K + App + An] · Paragraph 2: 3/3 [K + App + An] · Conclusion: 2/2 [Eval] → Total: 8/8"
    ),
    `Expected 8/8 per-paragraph breakdown in examinerNotes, got: ${p1EightFullRes.examinerNotes}`
  );

  // 11b. Strict Single-Paragraph Cap on Paper 1 8-mark:
  // Even with two full points AND a conclusion packed into 1 single paragraph, max score is strictly 3/8 (1 K + 1 App + 1 An, 0 Eval).
  const p1SingleParagraphPacked =
    p2EightMarkEssay.replace(/\n\s*\n+/g, " ") +
    " Overall, I recommend venture capital because avoiding interest on a $1,700,000 loan protects cash flow even though control is diluted. To overcome ownership dilution, Brian can retain a majority equity stake above 51%.";
  const p1SingleParaRes = await evaluateStudentEssay({
    questionTitle: "Paper 1 Q4(d) (8 marks)",
    questionPrompt: "Do you think BCT should use venture capital rather than a bank loan? Justify your answer.",
    caseContext: BCT_CASE_STEM,
    marks: 8,
    rubric: p1EightRubric,
    studentAnswer: p1SingleParagraphPacked,
    validAppWords: ["$1,700,000", "$40,000", "200 bioreactor units"],
    modelAnswer: "Venture capital avoids monthly interest above $40,000 fixed overheads, although ownership control is shared.",
  });
  console.log("8m Paper 1 single-paragraph packed result (3/8 cap):", {
    total: p1SingleParaRes.totalScore,
    ao: {
      ao1: p1SingleParaRes.aoBreakdown.ao1.score,
      ao2: p1SingleParaRes.aoBreakdown.ao2.score,
      ao3: p1SingleParaRes.aoBreakdown.ao3.score,
      ao4: p1SingleParaRes.aoBreakdown.ao4.score,
    },
    notes: p1SingleParaRes.examinerNotes,
  });
  assert.equal(p1SingleParaRes.aoBreakdown.ao1.score, 1, "Single-paragraph 8m answer capped at AO1 = 1");
  assert.equal(p1SingleParaRes.aoBreakdown.ao2.score, 1, "Single-paragraph 8m answer capped at AO2 = 1");
  assert.equal(p1SingleParaRes.aoBreakdown.ao3.score, 1, "Single-paragraph 8m answer capped at AO3 = 1");
  assert.equal(p1SingleParaRes.aoBreakdown.ao4.score, 0, "Single-paragraph 8m answer capped at AO4 = 0");
  assert.equal(p1SingleParaRes.totalScore, 3, `Single-paragraph 8m answer must be strictly capped at 3/8, got ${p1SingleParaRes.totalScore}`);
  assert.ok(
    p1SingleParaRes.examinerNotes.includes(
      "Paragraph 1: 3/3 [K + App + An] · Paragraph 2: 0/3 (missing second paragraph/point) · Conclusion: 0/2 (missing evaluation) → Total: 3/8"
    ),
    `Expected exact single-paragraph breakdown in examinerNotes, got: ${p1SingleParaRes.examinerNotes}`
  );

  // 11c. 2 body paragraphs without conclusion -> strictly 6/8 (3/3 + 3/3 + 0/2)
  const p1TwoParasNoConcRes = await evaluateStudentEssay({
    questionTitle: "Paper 1 Q4(d) (8 marks)",
    questionPrompt: "Do you think BCT should use venture capital rather than a bank loan? Justify your answer.",
    caseContext: BCT_CASE_STEM,
    marks: 8,
    rubric: p1EightRubric,
    studentAnswer: p2EightMarkEssay,
    validAppWords: ["$1,700,000", "$40,000", "200 bioreactor units"],
    modelAnswer: "Venture capital avoids monthly interest above $40,000 fixed overheads, although ownership control is shared.",
  });
  assert.equal(p1TwoParasNoConcRes.totalScore, 6, `2 body paragraphs without conclusion must score 6/8, got ${p1TwoParasNoConcRes.totalScore}`);
  assert.equal(p1TwoParasNoConcRes.aoBreakdown.ao4.score, 0, "Missing conclusion must score 0/2 AO4");

  // 11d. No cross-paragraph spillover: Paragraph 1 has 2 facts ($40,000 + 200 bioreactor units) + "however", Paragraph 2 has NO case facts, Conclusion is bare without context/weighing
  const p1NoSpilloverEssay = `Venture capital provides equity funding without mandatory monthly interest charges, however control is diluted. Since BCT already faces $40,000 monthly fixed overheads, avoiding debt repayments preserves working capital on its 200 bioreactor units.

Furthermore, venture capitalists bring commercial connections with global manufacturers, which increases future sales revenue.

Overall, I recommend venture capital.`;
  const p1NoSpillRes = await evaluateStudentEssay({
    questionTitle: "Paper 1 Q4(d) (8 marks)",
    questionPrompt: "Do you think BCT should use venture capital rather than a bank loan? Justify your answer.",
    caseContext: BCT_CASE_STEM,
    marks: 8,
    rubric: p1EightRubric,
    studentAnswer: p1NoSpilloverEssay,
    validAppWords: ["$1,700,000", "$40,000", "200 bioreactor units"],
    modelAnswer: "Venture capital avoids monthly interest above $40,000 fixed overheads, although ownership control is shared.",
  });
  assert.equal(p1NoSpillRes.aoBreakdown.ao2.score, 1, `Para 1 facts must NOT spill into Para 2 AO2; expected AO2 = 1/2, got ${p1NoSpillRes.aoBreakdown.ao2.score}`);
  assert.equal(p1NoSpillRes.aoBreakdown.ao4.score, 0, `Para 1 'however' must NOT spill into bare conclusion AO4; expected AO4 = 0/2, got ${p1NoSpillRes.aoBreakdown.ao4.score}`);
  assert.equal(p1NoSpillRes.totalScore, 5, `Expected 3/3 (P1) + 2/3 (P2 no App) + 0/2 (bare Conc) = 5/8, got ${p1NoSpillRes.totalScore}`);

  // 11e. Duplicate Paragraph 2 (Jaccard > 0.70 vs Paragraph 1) gets 0/3 for Paragraph 2
  const p1DuplicateP2Essay = `Venture capital provides equity funding without mandatory monthly interest charges. Since BCT already faces $40,000 monthly fixed overheads, avoiding debt repayments preserves working capital and protects profit margins on its 200 bioreactor units.

Venture capital provides equity funding without mandatory monthly interest charges. Since BCT already faces $40,000 monthly fixed overheads, avoiding debt repayments protects profit margins on its 200 bioreactor units.

Overall, I recommend venture capital because avoiding interest on a $1,700,000 loan protects cash flow.`;
  const p1DupP2Res = await evaluateStudentEssay({
    questionTitle: "Paper 1 Q4(d) (8 marks)",
    questionPrompt: "Do you think BCT should use venture capital rather than a bank loan? Justify your answer.",
    caseContext: BCT_CASE_STEM,
    marks: 8,
    rubric: p1EightRubric,
    studentAnswer: p1DuplicateP2Essay,
    validAppWords: ["$1,700,000", "$40,000", "200 bioreactor units"],
    modelAnswer: "Venture capital avoids monthly interest above $40,000 fixed overheads, although ownership control is shared.",
  });
  assert.equal(p1DupP2Res.aoBreakdown.ao1.score, 1, "Duplicate Paragraph 2 must NOT earn a 2nd AO1 mark");
  assert.equal(p1DupP2Res.totalScore, 4, `Expected 3/3 (P1) + 0/3 (duplicate P2) + 1/2 (Conc) = 4/8, got ${p1DupP2Res.totalScore}`);

  // 12. Paper 1 — 2-Mark, 4-Mark, and 6-Mark Strict Per-Segment Isolation Tests
  // 12a. Paper 1 2m ("Identify two...") -> 2 distinct points = 2/2, repeated or single point = 1/2
  const p1TwoRubric = {
    totalMarks: 2,
    ao1Max: 2,
    ao2Max: 0,
    ao3Max: 0,
    ao4Max: 0,
    descriptors: { ao1: ["Knowledge"], ao2: [], ao3: [], ao4: [] },
    indicativeContent: ["economies of scale", "division of labor", "lower unit cost", "higher efficiency"],
    sampleStrongPoint: "1. Lower unit costs through bulk buying. 2. Higher worker productivity from specialization.",
  };
  const p1TwoFullRes = await evaluateStudentEssay({
    questionTitle: "Paper 1 Q1(a) (2 marks)",
    questionPrompt: "Identify two benefits of growth for BCT.",
    caseContext: BCT_CASE_STEM,
    marks: 2,
    rubric: p1TwoRubric,
    studentAnswer: "1. Economies of scale lower unit costs. 2. Specialization increases worker efficiency.",
    validAppWords: [],
    modelAnswer: "1. Economies of scale. 2. Specialization.",
    indicativeKnowledgePoints: ["economies of scale", "specialization", "efficiency", "unit costs"],
  });
  assert.equal(p1TwoFullRes.totalScore, 2, `Paper 1 2m distinct points expected 2/2, got ${p1TwoFullRes.totalScore}`);

  const p1TwoDupRes = await evaluateStudentEssay({
    questionTitle: "Paper 1 Q1(a) (2 marks)",
    questionPrompt: "Identify two benefits of growth for BCT.",
    caseContext: BCT_CASE_STEM,
    marks: 2,
    rubric: p1TwoRubric,
    studentAnswer: "1. Economies of scale lower unit costs. 2. Economies of scale lower unit costs.",
    validAppWords: [],
    modelAnswer: "1. Economies of scale. 2. Specialization.",
    indicativeKnowledgePoints: ["economies of scale", "specialization", "efficiency", "unit costs"],
  });
  assert.equal(p1TwoDupRes.totalScore, 1, `Paper 1 2m duplicate point must cap at 1/2, got ${p1TwoDupRes.totalScore}`);

  // 12a-ii. 2-mark definition = pure knowledge (K:0-2 only, no App/An/Eval display/logic).
  const p1DefineRes = await evaluateStudentEssay({
    questionTitle: "Paper 1 Q1(a) (2 marks)",
    questionPrompt: "Define what is meant by a private limited company (Ltd).",
    caseContext: BCT_CASE_STEM,
    marks: 2,
    rubric: {
      totalMarks: 2,
      // Deliberately advertise AO2/AO3/AO4 to prove they are forced off for a 2-mark definition.
      ao1Max: 2,
      ao2Max: 1,
      ao3Max: 1,
      ao4Max: 1,
      descriptors: { ao1: ["Definition"], ao2: [], ao3: [] },
      indicativeContent: ["shares sold to friends/family and not on stock exchange", "limited liability"],
      sampleStrongPoint: "A private limited company cannot sell shares publicly and gives owners limited liability.",
    },
    studentAnswer:
      "A business that can sell shares to friends and family but not in the stock exchange. The owners have limited liability over their investments.",
    validAppWords: [],
    modelAnswer: "A private limited company cannot sell shares publicly and gives owners limited liability.",
  });
  assert.equal(p1DefineRes.totalScore, 2, `2-mark definition example must score 2/2, got ${p1DefineRes.totalScore}`);
  assert.equal(p1DefineRes.aoBreakdown.ao1.score, 2, "2-mark definition must award K:2");
  assert.equal(p1DefineRes.aoBreakdown.ao2.max, 0, "2-mark definition must never display/require AO2 Application");
  assert.equal(p1DefineRes.aoBreakdown.ao3.max, 0, "2-mark definition must never display/require AO3 Analysis");
  assert.equal(p1DefineRes.aoBreakdown.ao4.max, 0, "2-mark definition must never display/require AO4 Evaluation");
  assert.equal(p1DefineRes.paragraphAudits?.[0]?.app_score, 0, "2-mark definition paragraph card must have App:0");
  assert.equal(p1DefineRes.paragraphAudits?.[0]?.max_subtotal, 2, "2-mark definition paragraph card must show K out of 2 only");

  // 12b. Paper 1 4m (2 + 2 = 4) -> Single point capped at 2/4; Point 2 missing App = 3/4; Full = 4/4
  const p1FourRubric = {
    totalMarks: 4,
    ao1Max: 2,
    ao2Max: 2,
    ao3Max: 0,
    ao4Max: 0,
    descriptors: { ao1: ["Knowledge"], ao2: ["Application"], ao3: [], ao4: [] },
    indicativeContent: ["equity funding no interest", "commercial contacts", "bank loan interest"],
    sampleStrongPoint: "Reason 1: No interest charges on $40,000 overheads.",
  };
  const p1FourFullRes = await evaluateStudentEssay({
    questionTitle: "Paper 1 Q1(b) (4 marks)",
    questionPrompt: "Explain two advantages to BCT of venture capital.",
    caseContext: BCT_CASE_STEM,
    marks: 4,
    rubric: p1FourRubric,
    studentAnswer:
      "Reason 1: Venture capital avoids mandatory interest charges on BCT's $40,000 monthly fixed overheads. Reason 2: Investors provide commercial contacts to launch industrial bioreactors.",
    validAppWords: ["$40,000", "industrial bioreactors", "$1,700,000"],
    modelAnswer: "Full 4m model",
    indicativeKnowledgePoints: ["equity funding avoids interest", "investors provide commercial contacts"],
  });
  assert.equal(p1FourFullRes.totalScore, 4, `Paper 1 4m both [K+App] expected 4/4, got ${p1FourFullRes.totalScore}`);

  const p1FourNoAppInP2Res = await evaluateStudentEssay({
    questionTitle: "Paper 1 Q1(b) (4 marks)",
    questionPrompt: "Explain two advantages to BCT of venture capital.",
    caseContext: BCT_CASE_STEM,
    marks: 4,
    rubric: p1FourRubric,
    studentAnswer:
      "Reason 1: Venture capital avoids mandatory interest charges on BCT's $40,000 monthly fixed overheads and 200 units. Reason 2: Investors provide useful expertise and business contacts.",
    validAppWords: ["$40,000", "industrial bioreactors", "$1,700,000", "200 units"],
    modelAnswer: "Full 4m model",
    indicativeKnowledgePoints: ["equity funding avoids interest", "expertise and business contacts"],
  });
  assert.equal(p1FourNoAppInP2Res.totalScore, 3, `Paper 1 4m missing App in Point 2 expected 3/4, got ${p1FourNoAppInP2Res.totalScore}`);

  const p1FourSinglePointRes = await evaluateStudentEssay({
    questionTitle: "Paper 1 Q1(b) (4 marks)",
    questionPrompt: "Explain two advantages to BCT of venture capital.",
    caseContext: BCT_CASE_STEM,
    marks: 4,
    rubric: p1FourRubric,
    studentAnswer:
      "Venture capital avoids mandatory interest charges on BCT's $40,000 monthly fixed overheads and 200 units.",
    validAppWords: ["$40,000", "industrial bioreactors", "$1,700,000", "200 units"],
    modelAnswer: "Full 4m model",
    indicativeKnowledgePoints: ["equity funding avoids interest"],
  });
  assert.equal(p1FourSinglePointRes.totalScore, 2, `Paper 1 4m single point must cap at 2/4, got ${p1FourSinglePointRes.totalScore}`);

  // 12c. Paper 1 6m (3 + 3 = 6) -> Single paragraph capped at 3/6; Para 2 K-only = 4/6; Full = 6/6
  const p1SixRubric = {
    totalMarks: 6,
    ao1Max: 2,
    ao2Max: 2,
    ao3Max: 2,
    ao4Max: 0,
    descriptors: { ao1: ["K"], ao2: ["App"], ao3: ["An"], ao4: [] },
    indicativeContent: ["equity funding no interest", "commercial contacts"],
    sampleStrongPoint: "Benefit 1...",
  };
  const p1SixFullRes = await evaluateStudentEssay({
    questionTitle: "Paper 1 Q1(c) (6 marks)",
    questionPrompt: "Explain two benefits to BCT of venture capital.",
    caseContext: BCT_CASE_STEM,
    marks: 6,
    rubric: p1SixRubric,
    studentAnswer: p2EightMarkTwoParaEssay,
    validAppWords: ["$1,700,000", "$40,000", "200 bioreactor units", "industrial bioreactors"],
    modelAnswer: "Full 6m model",
    indicativeKnowledgePoints: ["equity funding without interest", "commercial connections"],
  });
  assert.equal(p1SixFullRes.totalScore, 6, `Paper 1 6m both [K+App+An] expected 6/6, got ${p1SixFullRes.totalScore}`);

  const p1SixKOnlyP2Res = await evaluateStudentEssay({
    questionTitle: "Paper 1 Q1(c) (6 marks)",
    questionPrompt: "Explain two benefits to BCT of venture capital.",
    caseContext: BCT_CASE_STEM,
    marks: 6,
    rubric: p1SixRubric,
    studentAnswer: `Venture capital provides equity funding without mandatory monthly interest charges. Since BCT already faces $40,000 monthly fixed overheads, avoiding debt repayments preserves working capital and protects profit margins on its 200 bioreactor units.

Furthermore, venture capitalists bring valuable expertise and business contacts.`,
    validAppWords: ["$1,700,000", "$40,000", "200 bioreactor units", "industrial bioreactors"],
    modelAnswer: "Full 6m model",
    indicativeKnowledgePoints: ["equity funding without interest", "expertise and business contacts"],
  });
  assert.equal(p1SixKOnlyP2Res.totalScore, 4, `Paper 1 6m Para 2 K-only expected 4/6, got ${p1SixKOnlyP2Res.totalScore}`);

  const p1SixSingleParaRes = await evaluateStudentEssay({
    questionTitle: "Paper 1 Q1(c) (6 marks)",
    questionPrompt: "Explain two benefits to BCT of venture capital.",
    caseContext: BCT_CASE_STEM,
    marks: 6,
    rubric: p1SixRubric,
    studentAnswer: p2EightMarkTwoParaEssay.replace(/\n\s*\n+/g, " "),
    validAppWords: ["$1,700,000", "$40,000", "200 bioreactor units", "industrial bioreactors"],
    modelAnswer: "Full 6m model",
    indicativeKnowledgePoints: ["equity funding without interest", "commercial connections"],
  });
  assert.equal(p1SixSingleParaRes.totalScore, 3, `Paper 1 6m single paragraph must cap at 3/6, got ${p1SixSingleParaRes.totalScore}`);

  // 13. splitResponsePoints, vague filler, deduplication, and Anti-Halo Paragraph Audit JSON + Arithmetic Immunity Tests
  const splitLabeled = splitResponsePoints(
    "Benefit 1: Higher productivity in the factory. Benefit 2: Lower unit costs from bulk buying."
  );
  assert.equal(splitLabeled.length, 2, `Expected splitResponsePoints to split inline Benefit labels into 2, got ${splitLabeled.length}`);
  assert.ok(!splitLabeled[0].startsWith("Benefit 1:"), "Point label prefix should be stripped");

  assert.equal(isPureVagueFillerAnswer("It saves money and customers will be happy."), true);
  const dedup = deduplicateRepeatedSentences(
    "Buying in bulk lowers unit cost for the firm. Buying in bulk lowers unit cost."
  );
  assert.equal(dedup.duplicateCount, 1, "Duplicate near-identical sentence should be flagged");

  // 13a. Verify schema & system prompt requirements
  assert.ok(
    CAMBRIDGE_0264_SYSTEM_PROMPT.includes("Cambridge IGCSE Business (0264)"),
    "System prompt must specify Cambridge IGCSE Business (0264)"
  );
  assert.ok(
    CAMBRIDGE_0264_SYSTEM_PROMPT.includes("isolated_quote") &&
      CAMBRIDGE_0264_SYSTEM_PROMPT.includes("COMPLETE VACUUM"),
    "System prompt must enforce isolated_quote & vacuum evaluation"
  );
  assert.ok(
    !("total_score" in CAMBRIDGE_0264_PARAGRAPH_JSON_SCHEMA.properties),
    "JSON schema must NOT include total_score so AI never computes final sums"
  );

  // 13b. parseParagraphAuditResponse strips <think> AND overrides hallucinated AI subtotal math
  const rawWithWrongSubtotal = `<think>Hidden thinking tokens...</think>
  {
    "question_type": "paper1_6m",
    "paragraphs": [
      {
        "paragraph_number": 1,
        "role": "body_point",
        "isolated_quote": "Para 1 text",
        "k_score": 1,
        "app_score": 1,
        "an_score": 1,
        "eval_score": 5,
        "subtotal": 99,
        "critique": "Good"
      },
      {
        "paragraph_number": 2,
        "role": "body_point",
        "isolated_quote": "Para 2 text",
        "k_score": 1,
        "app_score": 0,
        "an_score": 0,
        "eval_score": 0,
        "subtotal": 3,
        "critique": "Missing App/An"
      }
    ],
    "overall_critique": "Develop P2."
  }`;
  const twoParagraphs = "Lower costs improve margins.\n\nLocal suppliers reduce delivery delays.";
  const compact = '{"paragraphs":[[1,1,0,1,0,"Use a case fact"],[2,1,1,0,0,"Explain the effect on sales"]]}';
  const compactAudit = parseParagraphAuditResponse(`${compact}\n{"extra":"trailing output"}`, "paper1_6m", twoParagraphs);
  assert.equal(compactAudit.paragraphs[1].isolated_quote, "Local suppliers reduce delivery delays.");
  assert.equal(compactAudit.paragraphs[1].subtotal, 2);
  const singleTupleAudit = parseParagraphAuditResponse('{"paragraphs":[[1,1,0,1,0,"Use a case fact"]]}', "paper1_6m", twoParagraphs);
  assert.equal(singleTupleAudit.paragraphs.length, 1, "Partial Qwen response must parse with its single valid tuple");
  assert.equal(singleTupleAudit.paragraphs[0].paragraph_number, 1);
  assert.equal(singleTupleAudit.paragraphs[0].k_score, 1);
  const parsedAudit = parseParagraphAuditResponse(rawWithWrongSubtotal, "paper1_6m");
  assert.equal(parsedAudit.paragraphs[0].eval_score, 0, "eval_score must clamp to 0 for paper1_6m");
  assert.equal(parsedAudit.paragraphs[0].subtotal, 3, "subtotal must be recomputed in TS (1+1+1+0 = 3)");
  assert.equal(parsedAudit.paragraphs[1].subtotal, 1, "subtotal must be recomputed in TS (1+0+0+0 = 1), overriding AI '3'");

  // 13b-ii. Model omitted the closing "]" before the final "}" — auto-close and parse cleanly
  const missingArrayBracket = '{ "paragraphs": [ [1,1,0,0,0,"Add a specific case detail"] }';
  const repairedAudit = parseParagraphAuditResponse(
    missingArrayBracket,
    "paper1_6m",
    "Venture capital funds growth because investors bring expertise and contacts."
  );
  assert.equal(repairedAudit.paragraphs[0].k_score, 1, "k_score must be 1 after auto-closing the missing ]");
  assert.equal(repairedAudit.paragraphs[0].critique, "Add a specific case detail");
  assert.equal(repairedAudit.paragraphs[0].subtotal, 1, "subtotal must be recomputed in TS (1+0+0+0 = 1)");

  // 13b-iii. Multi-paragraph answer with heading-only lines and a single Qwen tuple:
  // header slots score 0 with no inference, substantive slots are re-audited/backfilled.
  const headingHeavyAnswer = [
    "Advantage 1",
    "Venture capital funds growth because investors bring contacts and expertise.",
    "Disadvantage 2 (1/2 marks)",
    "The bank loan charges interest which raises monthly costs for the factory.",
  ].join("\n\n");
  const headingSegments = splitResponsePoints(headingHeavyAnswer);
  assert.equal(headingSegments.length, 4, `Expected 4 split segments, got ${JSON.stringify(headingSegments)}`);
  const headerSeeded = parseParagraphAuditResponse(
    '{"paragraphs":[[2,1,1,1,0,"Case fact applied"]]}',
    "paper1_6m",
    headingHeavyAnswer
  );
  assert.equal(headerSeeded.paragraphs.length, 1, "A single tuple must no longer throw; it yields one row");
  assert.equal(headerSeeded.paragraphs[0].k_score, 1);
  // Deterministic backfill path (no engine): headers zeroed, every slot filled, totals recomputed in TS
  const deterministicHydrated = await completeParagraphAudit({
    paragraphAudit: headerSeeded,
    studentAnswer: headingHeavyAnswer,
    questionType: "paper1_6m",
    questionText: "Explain advantages and disadvantages of venture capital to BCT.",
    markValue: 6,
    markSchemeText: "K 1 + App 1 + An 1 per point",
    caseContextSummary: "BCT manufactures bioreactors for pharma labs.",
    targetAppKeywords: ["venture capital"],
  });
  assert.equal(deterministicHydrated.paragraphs.length, 4, "Every split segment must get a paragraph row");
  assert.equal(deterministicHydrated.paragraphs[0].subtotal, 0, "Header 'Advantage 1' must score 0");
  assert.equal(deterministicHydrated.paragraphs[2].subtotal, 0, "Header 'Disadvantage 2 (1/2 marks)' must score 0");
  assert.equal(deterministicHydrated.paragraphs[0].critique, "Section header — 0 marks (no substantive 0264 content inside this line).");
  assert.equal(deterministicHydrated.paragraphs[1].k_score, 1, "Qwen's tuple for paragraph 2 must be kept");
  assert.ok(
    deterministicHydrated.paragraphs[3].critique.startsWith("Deterministic CIE 0264 paragraph audit"),
    "Paragraph 4 must be backfilled deterministically when Qwen returns nothing for it"
  );
  const hydratedTotal = deterministicHydrated.paragraphs.reduce((s, p) => s + p.subtotal, 0);
  assert.ok(hydratedTotal >= deterministicHydrated.paragraphs[1].subtotal, "Totals must be recomputed from completed rows");
  // Per-paragraph Qwen loop path (mock engine returns a full tuple per call): no slot is left deterministic
  const singleTupleMock = createMockWebLLMEngine("0.6b", {
    question_type: "paper1_6m",
    paragraphs: [[1, 1, 1, 1, 0, "K+App+An credited"]],
  });
  const perParagraphHydrated = await completeParagraphAudit({
    engine: singleTupleMock,
    paragraphAudit: headerSeeded,
    studentAnswer: headingHeavyAnswer,
    questionType: "paper1_6m",
    questionText: "Explain advantages and disadvantages of venture capital to BCT.",
    markValue: 6,
    markSchemeText: "K 1 + App 1 + An 1 per point",
    caseContextSummary: "BCT manufactures bioreactors for pharma labs.",
    targetAppKeywords: ["venture capital"],
  });
  assert.equal(perParagraphHydrated.paragraphs.length, 4, "Per-paragraph Qwen loop must complete all slots");
  assert.equal(perParagraphHydrated.paragraphs[0].subtotal, 0, "Header 'Advantage 1' scores 0 without inference");
  assert.equal(perParagraphHydrated.paragraphs[2].subtotal, 0, "Header 'Disadvantage 2 (1/2 marks)' scores 0 without inference");
  assert.equal(perParagraphHydrated.paragraphs[3].k_score, 1, "Paragraph 4 must receive a Qwen tuple from the per-paragraph loop");

  // Legacy parseChecklistResponse backwards compatibility with paragraphs[] output
  const legacyCompat = parseChecklistResponse(rawWithWrongSubtotal);
  assert.equal(legacyCompat.ao1_point1, true);
  assert.equal(legacyCompat.ao1_point2, true);
  assert.equal(legacyCompat.ao3_chain1, true);
  assert.equal(legacyCompat.ao3_chain2, false);

  // 13c. evaluateEssayWebLLM computes Paper 1 marks strictly via sum(p.subtotal)
  const mockArithmeticBug = createMockWebLLMEngine("0.6b", {
    question_type: "paper1_8m",
    total_score: 8,
    paragraphs: [
      {
        paragraph_number: 1,
        role: "option",
        isolated_quote: "P1",
        k_score: 1,
        app_score: 1,
        an_score: 1,
        eval_score: 0,
        subtotal: 8, // wrong
        critique: "P1 strong.",
      },
      {
        paragraph_number: 2,
        role: "option",
        isolated_quote: "P2",
        k_score: 1,
        app_score: 0,
        an_score: 0,
        eval_score: 0,
        subtotal: 3, // wrong
        critique: "P2 generic.",
      },
      {
        paragraph_number: 3,
        role: "conclusion",
        isolated_quote: "P3",
        k_score: 0,
        app_score: 0,
        an_score: 0,
        eval_score: 1,
        subtotal: 2, // wrong
        critique: "P3 partial.",
      },
    ],
  });
  const webllmOut = await evaluateEssayWebLLM({
    essayText: "P1\n\nP2\n\nP3",
    examQuestion: "Test 8m",
    markScheme: "Test rubric",
    maxMarks: 8,
    paper: 1,
    engine: mockArithmeticBug,
  });
  assert.equal(
    webllmOut.marks_awarded,
    5,
    `evaluateEssayWebLLM must sum recomputed subtotals (3+1+1=5), ignoring AI total_score=8; got ${webllmOut.marks_awarded}`
  );

  // 13d. Anti-Halo Clamping in evaluateStudentEssay: even if Qwen suffers halo effect and awards P2 App+An for a generic sentence, evaluator clamps P2 to K-only (1/3)
  const haloInfectedAiEngine = createMockWebLLMEngine("0.6b", {
    question_type: "paper1_8m",
    paragraphs: [
      {
        paragraph_number: 1,
        role: "option",
        isolated_quote:
          "Venture capital provides equity funding without mandatory monthly interest charges. Since BCT already faces $40,000 monthly fixed overheads, avoiding debt repayments preserves working capital on its 200 bioreactor units.",
        k_score: 1,
        app_score: 1,
        an_score: 1,
        eval_score: 0,
        subtotal: 3,
        critique: "Strong P1.",
      },
      {
        paragraph_number: 2,
        role: "option",
        isolated_quote: "Furthermore, venture capitalists provide useful expertise.",
        k_score: 1,
        app_score: 1, // halo!
        an_score: 1, // halo!
        eval_score: 0,
        subtotal: 3, // halo!
        critique: "AI wrongly carried over halo from P1.",
      },
      {
        paragraph_number: 3,
        role: "conclusion",
        isolated_quote:
          "Overall, I recommend venture capital rather than a bank loan because avoiding interest on the $1,700,000 investment protects cash flow when fixed overheads are $40,000.",
        k_score: 0,
        app_score: 0,
        an_score: 0,
        eval_score: 2,
        subtotal: 2,
        critique: "Justified comparison in case context.",
      },
    ],
  });
  const antiHaloP1Res = await evaluateStudentEssay({
    questionTitle: "Paper 1 Q4(d) (8 marks)",
    questionPrompt: "Do you think BCT should use venture capital rather than a bank loan? Justify your answer.",
    caseContext: BCT_CASE_STEM,
    marks: 8,
    rubric: p1EightRubric,
    studentAnswer: `Venture capital provides equity funding without mandatory monthly interest charges. Since BCT already faces $40,000 monthly fixed overheads, avoiding debt repayments preserves working capital on its 200 bioreactor units.

Furthermore, venture capitalists provide useful expertise.

Overall, I recommend venture capital rather than a bank loan because avoiding interest on the $1,700,000 investment protects cash flow when fixed overheads are $40,000.`,
    validAppWords: ["$1,700,000", "$40,000", "200 bioreactor units"],
    modelAnswer: "Model",
    webllmEngine: haloInfectedAiEngine,
  });
  console.log("Anti-Halo P1 8m Clamping Test:", {
    total: antiHaloP1Res.totalScore,
    audits: antiHaloP1Res.paragraphAudits?.map((p) => `${p.paragraph_number}:${p.subtotal}/${p.max_subtotal}`),
  });
  assert.equal(antiHaloP1Res.paragraphAudits?.[0]?.subtotal, 3, "P1 should get 3/3");
  assert.equal(antiHaloP1Res.paragraphAudits?.[1]?.subtotal, 1, "Generic P2 must be clamped to 1/3 [K only] despite halo AI JSON");
  assert.equal(antiHaloP1Res.paragraphAudits?.[2]?.subtotal, 2, "Conclusion with rejected-option comparison in context should get 2/2");
  assert.equal(antiHaloP1Res.totalScore, 6, `Total must equal sum(3 + 1 + 2) = 6, got ${antiHaloP1Res.totalScore}`);

  // 13e. Conclusion repeating P1 gets 0/2
  const repeatConcRes = await evaluateStudentEssay({
    questionTitle: "Paper 1 Q4(d) (8 marks)",
    questionPrompt: "Do you think BCT should use venture capital rather than a bank loan? Justify your answer.",
    caseContext: BCT_CASE_STEM,
    marks: 8,
    rubric: p1EightRubric,
    studentAnswer: `Venture capital provides equity funding without mandatory monthly interest charges. Since BCT already faces $40,000 monthly fixed overheads, avoiding debt repayments preserves working capital on its 200 bioreactor units.

Furthermore, venture capitalists bring commercial connections with global biopharmaceutical manufacturers for $1,700,000 industrial bioreactors, increasing future revenue.

In conclusion, venture capital provides equity funding without mandatory monthly interest charges because avoiding debt repayments preserves working capital on its $40,000 overheads and 200 bioreactor units.`,
    validAppWords: ["$1,700,000", "$40,000", "200 bioreactor units", "industrial bioreactors"],
    modelAnswer: "Model",
  });
  assert.equal(repeatConcRes.paragraphAudits?.[2]?.is_duplicate, true, "Conclusion repeating P1 must be flagged duplicate");
  assert.equal(repeatConcRes.paragraphAudits?.[2]?.subtotal, 0, "Conclusion repeating P1 must score 0/2");
  assert.equal(repeatConcRes.aoBreakdown.ao4.score, 0, "AO4 must be 0/2 when conclusion repeats P1");

  // 13f. Paper 2 12-mark Halo Rejection: Option 1 & 2 strong, Option 3 generic (no App/An) + Conclusion -> Level 2 (<= 8)
  const p2TwelveMissingOpt3App = `Direct technical interviews with bioprocess directors ensure accurate specifications for industrial bioreactors because clients state exact requirements. However, diverting 30 bio-engineers delays output below 200 units/month.

Analyzing rival websites saves cash because secondary research avoids $1,700,000 commitments. However, rival websites fail to show custom client demand, lowering future sales.

Trade fairs attract customers.

Recommendation
BCT should choose Direct technical interviews because confirming specifications prevents failure before spending $1,700,000, whereas trade fairs cost too much and websites lack order feedback.`;
  const p2TwelveHaloCapRes = await evaluatePaper2Answer({
    questionNumber: "1(b)",
    questionText: BCT_1B_QUESTION,
    markValue: 12,
    markScheme: BCT_1B_MARK_SCHEME,
    modelAnswer: BCT_1B_MODEL_ANSWER,
    validAppWords: BCT_1B_VALID_APP_WORDS,
    studentAnswer: p2TwelveMissingOpt3App,
    caseMainStem: BCT_CASE_STEM,
  });
  assert.ok(!p2TwelveHaloCapRes.level.includes("Level 3"), `Missing App/An on Option 3 must prevent Level 3, got ${p2TwelveHaloCapRes.level}`);
  assert.ok(p2TwelveHaloCapRes.totalScore <= 8, `Missing App/An on Option 3 must cap at <= 8/12, got ${p2TwelveHaloCapRes.totalScore}`);
  const haloConclusionAudit = p2TwelveHaloCapRes.paragraphAudits?.find((p) => p.role === "conclusion");
  if (haloConclusionAudit) {
    assert.equal(
      haloConclusionAudit.eval_score,
      p2TwelveHaloCapRes.aoBreakdown.ao4?.score,
      "12-mark conclusion Eval badge must match the Level-gated AO4 summary score"
    );
  }

  // 13g. buildParagraphAuditUserPrompt respects concise prompt and includes structured schema fields
  const shortPrompt = buildParagraphAuditUserPrompt({
    questionType: "paper2_12m_b",
    questionText: "Test question",
    markValue: 12,
    markSchemeText: "- AO1: Test",
    studentAnswer: "Test answer",
  });
  assert.ok(!shortPrompt.includes("BioCell Tech"), "Prompt without caseContextSummary should NOT inject stem");
  assert.ok(shortPrompt.includes("isolated_quote"), "Prompt must request isolated_quote");
  assert.ok(!shortPrompt.includes('"total_score"'), "Prompt must not ask for total_score");
  const compatPrompt = buildChecklistUserPrompt({
    questionText: "Test question",
    markValue: 12,
    markSchemeText: "- AO1: Test",
    studentAnswer: "Test answer",
  });
  assert.ok(compatPrompt.includes("paragraphs"), "Compat prompt builder must emit paragraphs schema");

  // 14. Regression: grading-bug fixes (generous K, strict An, anti-repetition).
  // 14a. ANY valid 0264 concept earns K immediately, even a short single sentence.
  assert.equal(
    looksLikeValidCambridgeKnowledgePoint("Another benefit is continuity of existence"),
    true,
    "Short single-sentence 0264 benefit must earn K"
  );
  assert.equal(
    looksLikeValidCambridgeKnowledgePoint("It helps the business"),
    false,
    "Pure vague filler must not earn K"
  );

  // 14b. An requires a real business consequence, not connective "yapping".
  const yappingAn = hasClearBusinessConsequenceChain(
    "Venture capital is a source of finance. This means it is a benefit because it is good for the business and therefore it is an advantage."
  );
  assert.equal(yappingAn.passed, false, "Restatement without a business consequence must not earn An");
  const realAn = hasClearBusinessConsequenceChain(
    "Bulk buying lowers unit costs, therefore profit margins rise."
  );
  assert.equal(realAn.passed, true, "Clear cause-and-effect chain with a business consequence must earn An");

  // 14c. Repeated syllabus point in a later paragraph earns K:0/App:0/An:0.
  const repeatedPointRes = await evaluateStudentEssay({
    questionTitle: "Paper 1 Q4(d) (8 marks)",
    questionPrompt: "Do you think BCT should use venture capital rather than a bank loan? Justify your answer.",
    caseContext: BCT_CASE_STEM,
    marks: 8,
    rubric: p1EightRubric,
    studentAnswer: `Venture capital provides equity funding without mandatory monthly interest charges. Since BCT already faces $40,000 monthly fixed overheads, avoiding debt repayments preserves working capital and protects profit margins.

A further benefit of venture capital is that it provides equity capital with no mandatory interest charges. This avoids debt repayments and therefore preserves working capital and protects profit margins.

Overall, I recommend venture capital because avoiding interest on the $1,700,000 loan protects cash flow even though control is diluted.`,
    validAppWords: ["$1,700,000", "$40,000", "200 bioreactor units"],
    modelAnswer: "Model",
  });
  assert.equal(
    repeatedPointRes.paragraphAudits?.[1]?.subtotal,
    0,
    "Paraphrased repeat of Paragraph 1 must score 0 for K, App and An"
  );
  assert.equal(
    repeatedPointRes.paragraphAudits?.[1]?.is_duplicate,
    true,
    "Paraphrased repeat must be flagged as a duplicate point"
  );
  assert.match(
    repeatedPointRes.paragraphAudits?.[1]?.critique ?? "",
    /repeat|already credited|Anti-Repetition/i,
    "Critique must explicitly explain the withheld repetition mark"
  );

  console.log("ALL GRADING REGRESSION TESTS PASSED!");
}

runTests().catch((err) => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});
