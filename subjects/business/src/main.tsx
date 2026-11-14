import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.tsx";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import StudyDashboard from "./pages/StudyDashboard.tsx";
import { startSheetSync } from "./lib/sheetSync";
import "./index.css";

// Restore this student's data from the Google Sheet and keep it in sync.
startSheetSync();

function currentPath() {
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

function isSignInPath(path: string) {
  return path === "/sign-in" || path.startsWith("/sign-in/");
}

function isSignUpPath(path: string) {
  return path === "/sign-up" || path.startsWith("/sign-up/");
}

function isDashboardPath(path: string) {
  return path === "/dashboard" || path.startsWith("/dashboard/");
}

function Root() {
  const path = currentPath();

  // The main study app stays completely independent of the account system.
  if (isSignInPath(path)) return <SignInPage />;
  if (isSignUpPath(path)) return <SignUpPage />;
  if (isDashboardPath(path)) return <StudyDashboard />;
  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
    <Analytics />
  </StrictMode>
);
