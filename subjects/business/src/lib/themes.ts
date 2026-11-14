/**
 * Coin-unlocked app themes.
 *
 * Themes are pure CSS variable swaps declared in `index.css` under
 * `html[data-theme="…"]`, so switching one re-skins every component that reads
 * the design tokens (`--paper`, `--ink`, `--green`, …) without each component
 * knowing a theme exists.
 *
 * The two base themes are free; the rest are bought with Study Coins. Unlocks
 * live in localStorage, which `sheetSync` already snapshots to the Sheet, so a
 * purchase survives a cache clear on another device.
 */

export type ThemeId = "daylight" | "midnight" | "sepia" | "blueprint" | "sakura";

export interface AppTheme {
  id: ThemeId;
  name: string;
  blurb: string;
  /** Coins needed. Zero means free from the start. */
  price: number;
  /** True when the theme needs the `dark` class for Tailwind dark variants. */
  dark: boolean;
  /** Paper, accent, and sticker colours used for the shop preview. */
  swatch: [string, string, string];
}

export const APP_THEMES: AppTheme[] = [
  {
    id: "daylight",
    name: "Daylight",
    blurb: "Warm paper and forest green — the original look.",
    price: 0,
    dark: false,
    swatch: ["#f6f4ed", "#203e32", "#f6bb83"],
  },
  {
    id: "midnight",
    name: "Midnight",
    blurb: "Low-glare dark mode for late-night revision.",
    price: 0,
    dark: true,
    swatch: ["#0d1613", "#2f6b52", "#f6bb83"],
  },
  {
    id: "sepia",
    name: "Vintage Scholar",
    blurb: "Aged paper, dark ink and brass details.",
    price: 150,
    dark: false,
    swatch: ["#f2e7cf", "#4c3a16", "#e9b871"],
  },
  {
    id: "blueprint",
    name: "Blueprint",
    blurb: "Cool drafting-table blues and crisp navy ink.",
    price: 200,
    dark: false,
    swatch: ["#eaf2fb", "#174a6b", "#9cc8f5"],
  },
  {
    id: "sakura",
    name: "Sakura",
    blurb: "Soft blossom pinks for gentle weekend study.",
    price: 200,
    dark: false,
    swatch: ["#fdf0f4", "#7a2f45", "#f8b7c7"],
  },
];

const ACTIVE_KEY = "ecbiz_theme";
const UNLOCKED_KEY = "ecbiz_unlocked_themes";

const FREE_THEMES: ThemeId[] = ["daylight", "midnight"];
const THEME_IDS = APP_THEMES.map((theme) => theme.id);

function isThemeId(value: string): value is ThemeId {
  return (THEME_IDS as string[]).includes(value);
}

export function getTheme(id: ThemeId): AppTheme {
  return APP_THEMES.find((theme) => theme.id === id) ?? APP_THEMES[0];
}

/** Read the saved theme, migrating the old `"light"` / `"dark"` values. */
export function loadThemeId(): ThemeId {
  if (typeof window === "undefined") return "daylight";
  try {
    const raw = localStorage.getItem(ACTIVE_KEY);
    if (raw === "dark") return "midnight";
    if (raw === "light") return "daylight";
    if (raw && isThemeId(raw)) return raw;
  } catch {
    /* storage unavailable */
  }
  return "daylight";
}

export function saveThemeId(id: ThemeId): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVE_KEY, id);
  } catch {
    /* ignore */
  }
}

/** Free themes plus anything the student has bought. */
export function loadUnlockedThemes(): ThemeId[] {
  const unlocked = new Set<ThemeId>(FREE_THEMES);
  if (typeof window === "undefined") return [...unlocked];
  try {
    const raw = localStorage.getItem(UNLOCKED_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const value of parsed) {
          if (typeof value === "string" && isThemeId(value)) unlocked.add(value);
        }
      }
    }
  } catch {
    /* ignore a corrupt value */
  }
  return [...unlocked];
}

export function unlockTheme(id: ThemeId): void {
  if (typeof window === "undefined") return;
  const unlocked = new Set(loadUnlockedThemes());
  unlocked.add(id);
  try {
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify([...unlocked]));
  } catch {
    /* ignore */
  }
}

/** A saved theme whose unlock was lost still falls back to something owned. */
export function isThemeUsable(id: ThemeId): boolean {
  return loadUnlockedThemes().includes(id);
}
