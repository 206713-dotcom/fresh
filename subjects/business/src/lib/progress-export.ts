import { downloadProgressCsv } from "../../../progress-csv.js";
import { DETAILED_0264_SYLLABUS } from "./data/detailed-syllabus-0264";
import { ALL_LESSONS } from "./data/interactive-lessons";
import { loadSyllabusRatings, getStudyCoins } from "./cookies";
import { loadLessonProgress } from "./lessons-progress";
import { loadBossWrongQuestions } from "./boss-battle";
import type { StudentSubmissionRecord } from "./types";

export function exportBusinessProgress(submissions: StudentSubmissionRecord[]): void {
  const rows: Array<Array<string | number>> = [
    ["Study Coins", "Balance", getStudyCoins(), "", "", ""],
    ["Quick Quiz", "MCQs completed", localStorage.getItem("ecbiz_mcq_completed") || "0", "", "", ""],
  ];
  for (const record of submissions) {
    rows.push(["Exam practice", record.questionId, record.result.totalScore + "/" + record.result.maxMarks,
      record.studentAnswer, record.questionTitle + "\n" + JSON.stringify(record.result), record.timestamp]);
  }
  const ratings = loadSyllabusRatings();
  for (const section of DETAILED_0264_SYLLABUS) {
    for (const topic of section.topics) {
      for (const subtopic of topic.subtopics) {
        for (const point of subtopic.bulletPoints) {
          rows.push(["Syllabus checklist", point.id, ratings[point.id] || "Unrated", "", point.text, ""]);
        }
      }
    }
  }
  const lessons = loadLessonProgress();
  for (const lesson of ALL_LESSONS) {
    const progress = lessons[lesson.id];
    if (progress) rows.push(["Interactive lesson", lesson.id, progress.rating, "", lesson.title, progress.completedAt]);
  }
  for (const record of Object.values(loadBossWrongQuestions())) {
    rows.push(["Boss Battle review", record.id, record.missCount + " misses", "",
      record.question + "\nAnswer: " + record.correctAnswer, new Date(record.lastMissedAt).toISOString()]);
  }
  for (const key of Object.keys(localStorage).sort()) {
    if (key.startsWith("ecbiz_draft_") || key.startsWith("ecbiz_p2_answers_")) {
      rows.push(["Answer draft", key, "In progress", localStorage.getItem(key) || "", "", ""]);
    }
  }
  downloadProgressCsv("Business Studies", rows);
}
