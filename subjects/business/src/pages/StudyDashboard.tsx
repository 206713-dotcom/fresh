import { useEffect, useState } from "react";
import {
  useStudentDatabase,
  type StudentRecord,
} from "../hooks/useStudentDatabase";
import { clearSession, getSession } from "../lib/auth";

type ScoreKey =
  | "two_mark_scores"
  | "four_mark_scores"
  | "six_mark_scores"
  | "eight_mark_scores"
  | "twelve_mark_scores";

export default function StudyDashboard() {
  const [session] = useState(() => getSession());
  const { isReady, username, studentData, isLoading, saveStudentProgress } =
    useStudentDatabase();

  // Protect this page: signed-out students go to the sign-in page.
  useEffect(() => {
    if (!getSession()) {
      window.location.replace("/sign-in");
    }
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen bg-[#f6f4ed] flex items-center justify-center text-[#57534E]">
        Redirecting to sign in…
      </div>
    );
  }

  if (!isReady || isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f4ed] flex items-center justify-center text-[#57534E]">
        Loading study data…
      </div>
    );
  }

  // Example handler called after the student completes a practice question.
  const handleQuestionSubmit = (scoreAchieved: number, maxMarks: number) => {
    const scoreKey: ScoreKey =
      maxMarks === 2
        ? "two_mark_scores"
        : maxMarks === 4
          ? "four_mark_scores"
          : maxMarks === 6
            ? "six_mark_scores"
            : maxMarks === 8
              ? "eight_mark_scores"
              : "twelve_mark_scores";

    const updates: Partial<StudentRecord> = {
      coins: (studentData?.coins || 0) + 10,
      time_spent_sec: (studentData?.time_spent_sec || 0) + 90,
    };

    updates[scoreKey] = [
      ...(Array.isArray(studentData?.[scoreKey])
        ? (studentData?.[scoreKey] as number[])
        : []),
      scoreAchieved,
    ];

    void saveStudentProgress(updates);
  };

  const handleSignOut = () => {
    clearSession();
    window.location.replace("/sign-in");
  };

  const completedQuestions =
    (studentData?.two_mark_scores?.length || 0) +
    (studentData?.four_mark_scores?.length || 0) +
    (studentData?.six_mark_scores?.length || 0) +
    (studentData?.eight_mark_scores?.length || 0) +
    (studentData?.twelve_mark_scores?.length || 0);

  return (
    <div className="min-h-screen bg-[#f6f4ed] text-[#192e28]">
      <header className="border-b border-[#d4d9cf] bg-[#fffefa]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <a
            href="/"
            className="text-sm font-semibold text-[#8B1E1E] hover:underline"
          >
            ← Back to EcBiz
          </a>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-sm font-semibold text-[#57534E] hover:text-[#8B1E1E]"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#8B1E1E]">
          Student dashboard
        </p>
        <h1 className="font-academic-serif text-3xl font-bold text-[#0F2042] mt-1">
          {studentData?.name || username}
        </h1>
        <p className="text-sm text-[#57534E] mt-1">
          Signed in as <span className="font-mono">{username}</span>
        </p>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <StatCard label="Coins" value={`🪙 ${studentData?.coins || 0}`} />
          <StatCard
            label="Study time"
            value={`${Math.round((studentData?.time_spent_sec || 0) / 60)} min`}
          />
          <StatCard label="Day streak" value={studentData?.streak || 0} />
          <StatCard label="Questions done" value={completedQuestions} />
        </section>

        <section className="mt-8 rounded-xl border border-[#d4d9cf] bg-[#fffefa] p-6">
          <h2 className="font-academic-serif text-xl font-bold text-[#0F2042]">
            Practice check-in
          </h2>
          <p className="text-sm text-[#57534E] mt-1">
            Completing the sample 4-mark question logs a score of 4, adds 10
            coins, and records 90 seconds of study time.
          </p>
          <button
            type="button"
            onClick={() => handleQuestionSubmit(4, 4)}
            className="mt-4 rounded-lg border border-[#d4d9cf] bg-[#8B1E1E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#741818]"
          >
            Complete 4-Mark Question (+10 Coins)
          </button>
        </section>

        <section className="mt-6 rounded-xl border border-[#d4d9cf] bg-[#fffefa] p-6">
          <h2 className="font-academic-serif text-xl font-bold text-[#0F2042]">
            Recommended focus
          </h2>
          <p className="text-sm text-[#57534E] mt-1">
            {studentData?.recommended_focus || "General Review"}
          </p>
        </section>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-[#d4d9cf] bg-[#fffefa] p-4">
      <p className="text-xs font-mono uppercase tracking-wider text-[#57534E]">
        {label}
      </p>
      <p className="text-xl font-bold text-[#0F2042] mt-1">{value}</p>
    </div>
  );
}
