export type SyllabusCode = "0264" | "0450";

export type MarkTier = 2 | 4 | 6 | 8 | 12;

export type PaperNumber = 1 | 2;

export interface AssessmentObjectivesBreakdown {
  ao1: { score: number; max: number; feedback: string }; // Knowledge
  ao2: { score: number; max: number; feedback: string }; // Application
  ao3: { score: number; max: number; feedback: string }; // Analysis
  ao4: { score: number; max: number; feedback: string }; // Evaluation
}

export interface QuestionRubric {
  totalMarks: number;
  ao1Max: number;
  ao2Max: number;
  ao3Max: number;
  ao4Max: number;
  descriptors: {
    ao1: string[];
    ao2: string[];
    ao3: string[];
    ao4?: string[];
  };
  indicativeContent: string[];
  sampleStrongPoint: string;
}

export interface Blueprint {
  id: string;
  name: string;
  marks: MarkTier;
  paper: PaperNumber | "both";
  unit: string;
  commandWord: string;
  description: string;
  aoFocus: string;
  templateFormat: string;
  rubric: QuestionRubric;
}

export interface DynamicScenario {
  id: string;
  blueprintId: string;
  marks: MarkTier;
  paper: PaperNumber;
  title: string;
  unit: string;
  businessName: string;
  industry: string;
  businessType: string;
  scenarioContext: string;
  dataPoints: Record<string, string | number>;
  questionPrompt: string;
  rubric: QuestionRubric;
}

export interface RuleEnforcementResult {
  appWordsRequired: string[];
  appWordsFound: string[];
  appWordsPassed: boolean;
  ao2CappedToZero: boolean;
  evalWordRequired?: boolean;
  evalWordsFound?: string[];
  evalWordPassed?: boolean;
  ao4CappedToZero?: boolean;
  ruleNotes: string[];
}

export interface ManualOverrideData {
  isOverridden: boolean;
  originalScore: number;
  newScore: number;
  reason: string;
  bodApplied: boolean;
  overriddenAt: string;
  customBreakdown?: {
    ao1: number;
    ao2: number;
    ao3: number;
    ao4: number;
  };
}

export interface EvaluationResult {
  totalScore: number;
  maxMarks: number;
  percentage: number;
  aoBreakdown: AssessmentObjectivesBreakdown;
  strengths: string[];
  improvements: string[];
  examinerNotes: string;
  modelAnswerSnippet: string;
  isAiEvaluated: boolean;
  evaluatedAt: string;
  ruleEnforcement?: RuleEnforcementResult;
  manualOverride?: ManualOverrideData;
}

export interface StudentSubmissionRecord {
  id: string;
  questionId: string;
  questionTitle: string;
  marks: number;
  paper: number;
  syllabus: string;
  unit: string;
  studentAnswer: string;
  wordCount: number;
  timeSpentSeconds: number;
  result: EvaluationResult;
  timestamp: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  unit: string;
  syllabusRef: string;
  exampleContext: string;
  examAdvice: string;
  formula?: string;
  commonMistake?: string;
}

export interface DailyQuizQuestion {
  id: string;
  term: string;
  correctDefinition: string;
  options: string[];
  unit: string;
  examAdvice: string;
}

export interface EconsGlossaryTerm {
  id: string;
  term: string;
  definition: string;
  unit: string;
  diagramName?: string;
  formula?: string;
  examAdvice: string;
}

export interface UserPreferences {
  activeSubject: "business" | null;
  theme: "light" | "dark";
  lastMarkTier: MarkTier;
  timerEnabled: boolean;
  modelType: "instant" | "webllm";
  lastQuizDate?: string;
  lastQuizScore?: number;
}

