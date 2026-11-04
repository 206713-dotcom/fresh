// CIE Cambridge 0264 / 0450 Paper 1 Authentic Database (Sections 1, 2, 3, and 4)
// 80 Comprehensive Scenario Sets (20 Unit 1, 20 Unit 2, 20 Unit 3, 20 Unit 4) with 320 verified questions (2m, 4m, 6m, 8m)

import rawDatabase from "./paper1-database.json";

export interface Paper1MarkScheme {
  knowledge_max_2?: string[];
  application_max_2?: string[];
  analysis_max_2?: string[];
  evaluation_max_2?: string[];
}

export interface Paper1DeterministicRules {
  if_app_words_missing?: string;
  if_no_eval_word?: string;
}

export interface Paper1QwenMarkingKeys {
  valid_app_words: string[];
  deterministic_rules?: Paper1DeterministicRules;
}

export interface Paper1Question {
  part: "a" | "b" | "c" | "d";
  mark_value: 2 | 4 | 6 | 8;
  question_text: string;
  model_answer: string;
  mark_scheme: Paper1MarkScheme;
  qwen_marking_keys: Paper1QwenMarkingKeys;
}

export interface Paper1ScenarioSet {
  scenario_id: string;
  unit: string;
  scenario_stem: string;
  questions: Paper1Question[];
}

export const PAPER1_DATABASE: Paper1ScenarioSet[] = rawDatabase as Paper1ScenarioSet[];

export function getPaper1ScenariosByUnit(unitNum: 1 | 2 | 3 | 4): Paper1ScenarioSet[] {
  const matchStr = `Unit ${unitNum}`;
  return PAPER1_DATABASE.filter((s) => s.unit.includes(matchStr));
}

export function getPaper1ScenarioById(id: string): Paper1ScenarioSet | undefined {
  return PAPER1_DATABASE.find((s) => s.scenario_id === id);
}

export function getRandomPaper1Scenario(unitNum?: 1 | 2 | 3 | 4): Paper1ScenarioSet {
  const pool = unitNum ? getPaper1ScenariosByUnit(unitNum) : PAPER1_DATABASE;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] || PAPER1_DATABASE[0];
}
