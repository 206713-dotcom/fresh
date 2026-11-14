import { useEffect, useState } from "react";
import { AuthShell } from "../components/AuthShell";
import { getSession, register } from "../lib/auth";

const inputClass =
  "w-full rounded-lg border border-[#d4d9cf] bg-[#fffefa] px-3 py-2 text-sm text-[#192e28] outline-none focus:border-[#8B1E1E] focus:ring-2 focus:ring-[#8B1E1E]/20";

export default function SignUpPage() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (getSession()) {
      window.location.replace("/dashboard");
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }

    setBusy(true);
    const result = await register(code, name, password);
    if (result.ok) {
      window.location.replace("/dashboard");
      return;
    }

    setError(result.error ?? "Could not create the account.");
    setBusy(false);
  }

  return (
    <AuthShell
      mode="sign-up"
      title="Create your EcBiz account"
      subtitle="Claim your 6-digit student number and choose your own password."
    >
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-xl border border-[#d4d9cf] bg-[#fffefa] p-6 shadow-sm"
      >
        <h2 className="font-academic-serif text-2xl font-bold text-[#0F2042]">
          Sign up
        </h2>
        <p className="mt-1 text-sm text-[#57534E]">
          This creates your row in the class Google Sheet.
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
          Name <span className="normal-case">(optional)</span>
        </label>
        <input
          className={inputClass + " mt-1"}
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          placeholder="Your name"
        />

        <label className="mt-4 block text-xs font-mono font-semibold uppercase tracking-wider text-[#57534E]">
          Password
        </label>
        <input
          className={inputClass + " mt-1"}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          placeholder="At least 6 characters"
          required
        />

        <label className="mt-4 block text-xs font-mono font-semibold uppercase tracking-wider text-[#57534E]">
          Confirm password
        </label>
        <input
          className={inputClass + " mt-1"}
          type="password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          autoComplete="new-password"
          placeholder="Type it again"
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
          {busy ? "Creating account…" : "Create account"}
        </button>

        <p className="mt-4 text-center text-sm text-[#57534E]">
          Already have an account?{" "}
          <a
            href="/sign-in"
            className="font-semibold text-[#8B1E1E] hover:underline"
          >
            Sign in
          </a>
        </p>
      </form>
    </AuthShell>
  );
}
