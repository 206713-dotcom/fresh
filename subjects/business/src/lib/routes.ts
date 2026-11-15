const AUTH_PAGES = ["sign-in", "sign-up", "dashboard"] as const;

export type AuthPage = (typeof AUTH_PAGES)[number];
export type AppView = "app" | AuthPage;

function isAuthPage(value: string | null | undefined): value is AuthPage {
  return !!value && (AUTH_PAGES as readonly string[]).includes(value);
}

/** Which screen to show. Works at the site root and under /subjects/business/. */
export function currentView(): AppView {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const segment = path.split("/").filter(Boolean).pop() || "";
  if (isAuthPage(segment)) return segment;

  const query = new URLSearchParams(window.location.search).get("page");
  if (isAuthPage(query)) return query;

  const hash = window.location.hash.replace(/^#\/?/, "").split(/[?#]/)[0];
  if (isAuthPage(hash)) return hash;

  return "app";
}

/**
 * Stay on the HTML file that is actually being served.
 * Absolute /sign-in and /dashboard only work when EcBiz is the whole site.
 */
export function viewHref(view: AppView): string {
  const url = new URL(window.location.href);
  const parts = url.pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1] || "";

  if (isAuthPage(last)) {
    parts.pop();
    const dir = parts.length ? `/${parts.join("/")}/` : "/";
    url.pathname = dir;
  }

  if (view === "app") url.searchParams.delete("page");
  else url.searchParams.set("page", view);

  url.hash = "";
  const search = url.searchParams.toString();
  return url.pathname + (search ? `?${search}` : "");
}
