import { MCQ_BANK_1 } from "./mcq-bank-section1";
import { MCQ_BANK_2 } from "./mcq-bank-section2";
import { MCQ_BANK_3 } from "./mcq-bank-section3";
import { MCQ_BANK_4 } from "./mcq-bank-section4";
import { MCQ_BANK_5 } from "./mcq-bank-section5";
import { MCQ_BANK_6 } from "./mcq-bank-section6";

export interface MCQItem {
  id: string;
  section: string;
  unit: string;
  chapter: string;
  questionNumber: string;
  question: string;
  options: Record<string, string>;
  correctOption: string;
  correctAnswer: string;
  questionType: string;
  explanation?: any;
}

export const MCQ_BANK: MCQItem[] = [
  ...MCQ_BANK_1,
  ...MCQ_BANK_2,
  ...MCQ_BANK_3,
  ...MCQ_BANK_4,
  ...MCQ_BANK_5,
  ...MCQ_BANK_6,
];
