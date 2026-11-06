// CIE Cambridge 0264 / 0450 Paper 2 Authentic Case Study Database
// 100 Comprehensive Case Studies (P2_SET_01 to P2_SET_100) with 800 authentic 8m & 12m questions,
// full mark schemes, level criteria (Level 1, 2, 3), and appendices 1, 2, and 3.

import rawP2Database from "./paper2-database.json";

export interface Paper2AppendixTable {
  title?: string;
  headers?: string[];
  rows?: (string | number)[][];
}

export interface Paper2CaseStudyInsert {
  main_stem: string;
  appendix_1_marketing_ops: string | any;
  appendix_2_financial_data: string | Paper2AppendixTable | any;
  appendix_3_external_environment: string | any;
}

export interface Paper2QuestionMarkScheme {
  knowledge_max_2?: string[];
  application_analysis_max_6?: string[];
  level_1_1_to_4?: string;
  level_2_5_to_8?: string;
  level_3_9_to_12?: string;
  [key: string]: any;
}

export interface Paper2Question {
  number: string; // "1(a)", "1(b)", "2(a)", "2(b)", "3(a)", "3(b)", "4(a)", "4(b)"
  mark_value: 8 | 12;
  question_text: string;
  model_answer: string;
  mark_scheme: Paper2QuestionMarkScheme;
  qwen_marking_keys: {
    valid_app_words: string[];
  };
}

export interface Paper2Scenario {
  scenario_id: string;
  unit: string;
  case_study_insert: Paper2CaseStudyInsert;
  questions: Paper2Question[];
}

export const PAPER2_DATABASE: Paper2Scenario[] = rawP2Database as Paper2Scenario[];

export function getPaper2ScenarioById(id: string): Paper2Scenario | undefined {
  return PAPER2_DATABASE.find((s) => s.scenario_id === id);
}

export function getRandomPaper2Scenario(): Paper2Scenario {
  const randomIndex = Math.floor(Math.random() * PAPER2_DATABASE.length);
  return PAPER2_DATABASE[randomIndex] || PAPER2_DATABASE[0];
}
