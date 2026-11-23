import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function formatDate(timestamp: string): string {
  try {
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return timestamp.slice(0, 10);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return timestamp.slice(0, 10);
  }
}


export function getGradeFromPercentage(percentage: number): {
  grade: string;
  color: string;
  label: string;
} {
  if (percentage >= 80) {
    return { grade: "A*", color: "text-emerald-700 bg-emerald-50 border-emerald-200", label: "Outstanding (A*)" };
  }
  if (percentage >= 70) {
    return { grade: "A", color: "text-emerald-700 bg-emerald-50 border-emerald-200", label: "Excellent (A)" };
  }
  if (percentage >= 60) {
    return { grade: "B", color: "text-blue-700 bg-blue-50 border-blue-200", label: "Good (B)" };
  }
  if (percentage >= 50) {
    return { grade: "C", color: "text-amber-700 bg-amber-50 border-amber-200", label: "Competent (C)" };
  }
  if (percentage >= 40) {
    return { grade: "D", color: "text-orange-700 bg-orange-50 border-orange-200", label: "Developing (D)" };
  }
  return { grade: "U", color: "text-rose-700 bg-rose-50 border-rose-200", label: "Ungraded (U)" };
}
