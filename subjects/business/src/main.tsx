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

function authModeFromQuery(): "sign-in" | "sign-up" | "dashboard" | null {
  try {
    const open = new URLSearchParams(window.location.search).get("open");
    if (open === "signin" || open === "sign-in") return "sign-in";
    if (open === "signup" || open === "sign-up") return "sign-up";
    if (open === "dashboard") return "dashboard";
  } catch {}
  return null;
}

function Root() {
  // GitHub Pages serves this app from /fresh/subjects/business/Business.html,
  // so the account screens are addressed with ?open=... query flags instead of
  // server-only routes such as /sign-in.
  const authMode = authModeFromQuery();
  if (authMode === "sign-in") return <SignInPage />;
  if (authMode === "sign-up") return <SignUpPage />;
  if (authMode === "dashboard") return <StudyDashboard />;
  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
    <Analytics />
  </StrictMode>
);
