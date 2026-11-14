import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  mode = "sign-in",
  children,
}: {
  title: string;
  subtitle: string;
  mode?: "sign-in" | "sign-up";
  children: ReactNode;
}) {
  const isSignUp = mode === "sign-up";

  return (
    <main className="study-page study-page-narrow">
      <div className="study-studio study-auth">
        <header className="study-hero">
          <div className="study-hero-content">
            <p className="study-hero-kicker">Cambridge 0264 · Business Studies</p>
            <h1 className="study-title">{title}</h1>
            <p className="study-description">{subtitle}</p>
          </div>
          <div className="study-hero-image" aria-hidden="true" />
        </header>

        <div className="study-auth-form">
          <div
            role="note"
            className="mb-5 rounded-xl border-2 border-[#C2841B] bg-[#FFF7E6] p-4 text-[#5C3A0A]"
          >
            <p className="text-sm font-bold flex items-center gap-2">
              <span aria-hidden="true">⚠️</span>
              Your login is your 6-digit student number
            </p>
            <p className="text-sm mt-1 leading-relaxed">
              Enter your 6-digit number in the <strong>Student number</strong> box.{" "}
              {isSignUp
                ? "Then choose your own EcBiz password (at least 6 characters)."
                : "Then enter the EcBiz password you chose."}{" "}
              <strong>Never use your school email or school password.</strong>
            </p>
          </div>

          <div className="flex justify-center">{children}</div>

          <p className="text-xs text-center text-[#57534E] mt-6 leading-relaxed">
            {isSignUp
              ? "Use your own 6-digit student number. If it says the number is already registered, sign in instead or ask your teacher."
              : "Forgotten your password? Ask your teacher to reset it — they can clear it from the class Google Sheet."}
          </p>

          <div className="mt-8 border-t border-[#d4d9cf] pt-5 text-center">
            <a
              href="/"
              aria-label="Skip signing in and go to the study app"
              className="inline-flex items-center gap-2 rounded-lg border border-[#d4d9cf] bg-[#fffefa] px-4 py-2 text-sm font-semibold text-[#57534E] hover:bg-[#f6f4ed] hover:text-[#8B1E1E]"
            >
              Skip all this and go to the app
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
