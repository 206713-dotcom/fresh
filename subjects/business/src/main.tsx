import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.tsx";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import StudyDashboard from "./pages/StudyDashboard.tsx";
import { startSheetSync } from "./lib/sheetSync";
import { currentView } from "./lib/routes";
import "./index.css";

// Restore this student's data from the Google Sheet and keep it in sync.
startSheetSync();

function Root() {
  const view = currentView();

  // The main study app stays completely independent of the account system.
  if (view === "sign-in") return <SignInPage />;
  if (view === "sign-up") return <SignUpPage />;
  if (view === "dashboard") return <StudyDashboard />;
  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
    <Analytics />
  </StrictMode>
);
