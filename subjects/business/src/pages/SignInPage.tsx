import { useEffect, useState } from "react";
import { AuthShell } from "../components/AuthShell";
import { getSession, login } from "../lib/auth";

const inputClass =
  "w-full rounded-lg border border-[#d4d9cf] bg-[#fffefa] px-3 py-2 text-sm text-[#192e28] outline-none focus:border-[#8B1E1E] focus:ring-2 focus:ring-[#8B1E1E]/20";

export default function SignInPage() {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Already signed in? Go straight through.
  useEffect(() => {
    if (getSession()) {
      window.location.replace("/dashboard");
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);

    const result = await login(code, password);
    if (result.ok) {
      window.location.replace("/dashboard");
      return;
    }

    setError(result.error ?? "Could not sign in.");
    setBusy(false);
  }

  return (
    <AuthShell
      title="EcBiz Student Sign In"
      subtitle="Your 6-digit student number and the password you chose."
    >
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-xl border border-[#d4d9cf] bg-[#fffefa] p-6 shadow-sm"
      >
        <h2 className="font-academic-serif text-2xl font-bold text-[#0F2042]">
          Sign in
        </h2>
        <p className="mt-1 text-sm text-[#57534E]">
          Welcome back — enter your details to continue.
        </p>

        <label className="mt-5 block text-xs font-mono font-semibold uppercase tracking-wider text-[#57534E]">
          Student number
        </label>
        <input
          className={inputClass + " mt-1 font-mono tracking-[0.3em]"}
          value={code}
          onChange={(event) =>
            setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
          }
          inputMode="numeric"
          autoComplete="username"
          maxLength={6}
          placeholder="123456"
          required
        />

        <label className="mt-4 block text-xs font-mono font-semibold uppercase tracking-wider text-[#57534E]">
          Password
        </label>
        <input
          className={inputClass + " mt-1"}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          placeholder="Your EcBiz password"
          required
        />

        {error ? (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-[#8B1E1E]/30 bg-[#8B1E1E]/5 px-3 py-2 text-sm text-[#8B1E1E]"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-lg bg-[#8B1E1E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#741818] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <p className="mt-4 text-center text-sm text-[#57534E]">
          Don&apos;t have an account?{" "}
          <a
            href="/sign-up"
            className="font-semibold text-[#8B1E1E] hover:underline"
          >
            Sign up
          </a>
        </p>
      </form>
    </AuthShell>
  );
}
