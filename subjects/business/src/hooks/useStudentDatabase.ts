import { useCallback, useEffect, useState } from "react";
import { APPS_SCRIPT_URL, requestScript } from "../lib/appsScript";
import { getSession } from "../lib/auth";

export interface StudentRecord {
  access_code: string;
  student_id: string;
  name: string;
  coins: number;
  streak: number;
  time_spent_sec: number;
  mcq_completed: number;
  mcq_errors: unknown[];
  two_mark_scores: number[];
  four_mark_scores: number[];
  six_mark_scores: number[];
  eight_mark_scores: number[];
  twelve_mark_scores: number[];
  missed_marks_breakdown: unknown[];
  topical_log: Record<string, unknown>;
  recommended_focus: string;
  [key: string]: unknown;
}

function createInitialStudent(accessCode: string, name: string): StudentRecord {
  return {
    access_code: accessCode,
    student_id: accessCode,
    name,
    coins: 0,
    streak: 0,
    time_spent_sec: 0,
    mcq_completed: 0,
    mcq_errors: [],
    two_mark_scores: [],
    four_mark_scores: [],
    six_mark_scores: [],
    eight_mark_scores: [],
    twelve_mark_scores: [],
    missed_marks_breakdown: [],
    topical_log: {},
    recommended_focus: "General Review",
  };
}

export function useStudentDatabase() {
  const session = getSession();
  const username = session?.code ?? undefined;
  const fullName = session?.name || username || "Student";

  const [studentData, setStudentData] = useState<StudentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch the student row from the Google Sheet
  const loadStudentData = useCallback(async () => {
    if (!username) return;

    setIsLoading(true);
    const fallback = createInitialStudent(username, fullName);
    const token = getSession()?.token;

    if (!APPS_SCRIPT_URL || !token) {
      setStudentData((current) => current ?? fallback);
      setIsLoading(false);
      return;
    }

    const result = await requestScript<StudentRecord>(
      `${APPS_SCRIPT_URL}?action=student&token=${encodeURIComponent(token)}`
    );

    if (result.success && result.data) {
      setStudentData(result.data);
    } else if (result.success) {
      // New student: no row yet.
      setStudentData(fallback);
    } else {
      console.error("Error loading data from Google Sheet:", result.error);
      setStudentData((current) => current ?? fallback);
    }

    setIsLoading(false);
  }, [username, fullName]);

  useEffect(() => {
    if (username) {
      void loadStudentData();
    }
  }, [username, loadStudentData]);

  // 2. Save updated scores/progress to the Google Sheet
  const saveStudentProgress = useCallback(
    async (updatedFields: Partial<StudentRecord>) => {
      if (!username) return;

      const current = studentData ?? createInitialStudent(username, fullName);

      const fullPayload: StudentRecord = {
        ...current,
        ...updatedFields,
        access_code: username,
        student_id: username,
        name: fullName,
      };

      // Optimistic update so the UI responds immediately.
      setStudentData(fullPayload);

      const token = getSession()?.token;
      if (!APPS_SCRIPT_URL || !token) {
        console.warn("Not signed in — progress was not saved to Google Sheets.");
        return;
      }

      const result = await requestScript(APPS_SCRIPT_URL, {
        method: "POST",
        // text/plain avoids a CORS preflight, which Apps Script cannot answer.
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ ...fullPayload, action: "student", token }),
      });

      if (!result.success) {
        console.error("Error saving data to Google Sheet:", result.error);
      }
    },
    [studentData, username, fullName]
  );

  return {
    isReady: !!username,
    username,
    studentData,
    isLoading,
    saveStudentProgress,
    reloadStudentData: loadStudentData,
  };
}
