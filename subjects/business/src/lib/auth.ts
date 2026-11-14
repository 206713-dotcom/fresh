/**
 * Student accounts backed by the `Users` tab of the Google Sheet.
 * Passwords are hashed in Apps Script; the browser only ever holds a signed
 * session token.
 */

import { APPS_SCRIPT_URL, postToScript } from "./appsScript";

const TOKEN_KEY = "ecbiz_session_token";
const CODE_KEY = "ecbiz_student_code";
const NAME_KEY = "ecbiz_student_name";

export interface Session {
  token: string;
  code: string;
  name: string;
}

export interface AuthResult {
  ok: boolean;
  error?: string;
  session?: Session;
}

function decodePayload(token: string): { sub?: string; exp?: number } | null {
  const part = token.split(".")[0];
  if (!part) return null;

  try {
    const padded = part.replace(/-/g, "+").replace(/_/g, "/");
    const withPadding = padded + "=".repeat((4 - (padded.length % 4)) % 4);
    const json = decodeURIComponent(
      Array.from(atob(withPadding))
        .map((char) => "%" + char.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json) as { sub?: string; exp?: number };
  } catch {
    return null;
  }
}

function saveSession(session: Session) {
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(CODE_KEY, session.code);
  localStorage.setItem(NAME_KEY, session.name);
}

export function clearSession() {
  for (const key of [TOKEN_KEY, CODE_KEY, NAME_KEY]) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
}

export function getSession(): Session | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const code = localStorage.getItem(CODE_KEY);
    if (!token || !code) return null;

    const payload = decodePayload(token);
    if (!payload || !payload.sub || !payload.exp) return null;
    if (payload.exp * 1000 <= Date.now()) {
      clearSession();
      return null;
    }
    if (payload.sub !== code) return null;

    return {
      token,
      code,
      name: localStorage.getItem(NAME_KEY) || "Student",
    };
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return getSession()?.token ?? null;
}

function normalise(value: string) {
  return (value || "").trim();
}

export async function login(code: string, password: string): Promise<AuthResult> {
  if (!APPS_SCRIPT_URL) {
    return {
      ok: false,
      error:
        "The Google Sheet is not connected yet. Ask your teacher to finish setup.",
    };
  }

  const cleanCode = normalise(code);
  if (!/^\d{6}$/.test(cleanCode)) {
    return { ok: false, error: "Your student number must be exactly 6 digits." };
  }

  const res = await postToScript<unknown>({
    action: "login",
    access_code: cleanCode,
    password,
  });

  if (!res.success || !res.token) {
    return { ok: false, error: res.error || "Could not sign in." };
  }

  const session: Session = {
    token: res.token,
    code: res.access_code || cleanCode,
    name: res.name || "Student",
  };
  saveSession(session);
  return { ok: true, session };
}

export async function register(
  code: string,
  name: string,
  password: string
): Promise<AuthResult> {
  if (!APPS_SCRIPT_URL) {
    return {
      ok: false,
      error:
        "The Google Sheet is not connected yet. Ask your teacher to finish setup.",
    };
  }

  const cleanCode = normalise(code);
  if (!/^\d{6}$/.test(cleanCode)) {
    return { ok: false, error: "Your student number must be exactly 6 digits." };
  }
  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }

  const res = await postToScript<unknown>({
    action: "register",
    access_code: cleanCode,
    name: normalise(name),
    password,
  });

  if (!res.success || !res.token) {
    return { ok: false, error: res.error || "Could not create the account." };
  }

  const session: Session = {
    token: res.token,
    code: res.access_code || cleanCode,
    name: res.name || normalise(name) || "Student",
  };
  saveSession(session);
  return { ok: true, session };
}
