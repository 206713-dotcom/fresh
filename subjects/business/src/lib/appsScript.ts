/**
 * Shared access to the Apps Script Web App (see apps-script/Code.gs).
 * This is the only backend: no database, no Clerk, no Supabase.
 */

export const APPS_SCRIPT_URL =
  (import.meta.env.VITE_APPS_SCRIPT_URL as string | undefined)?.trim() || null;

export interface ScriptResponse<T = unknown> {
  success?: boolean;
  error?: string;
  data?: T;
  token?: string;
  access_code?: string;
  name?: string;
}

const DEFAULT_TIMEOUT_MS = 15000;

export async function requestScript<T = unknown>(
  url: string,
  init?: RequestInit
): Promise<ScriptResponse<T>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(url, { ...init, signal: controller.signal });

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return {
        success: false,
        error:
          "The Google Sheet endpoint did not return JSON. Check that the Web App is deployed with access set to \"Anyone\".",
      };
    }

    return (await res.json()) as ScriptResponse<T>;
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error && err.name === "AbortError"
          ? "The Google Sheet took too long to respond."
          : "Could not reach the Google Sheet. Check your connection.",
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function postToScript<T = unknown>(
  payload: Record<string, unknown>
): Promise<ScriptResponse<T>> {
  if (!APPS_SCRIPT_URL) {
    return { success: false, error: "VITE_APPS_SCRIPT_URL is not configured." };
  }

  return requestScript<T>(APPS_SCRIPT_URL, {
    method: "POST",
    // text/plain avoids a CORS preflight, which Apps Script cannot answer.
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
}
