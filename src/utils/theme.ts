/* Types */

export type ThemingMode = "dark" | "light" | "system";
export type Theme = Exclude<ThemingMode, "system">;

declare global {
  interface Window {
    /**
     * The current theme of the application.
     * @deprecated Use `getCurrentTheme()` instead.
     */
    theme: Theme;
  }

  interface DocumentEventMap {
    [THEME_EVENT]: CustomEvent<Theme>;
  }
}

/* Constants */

export const THEME_KEY = "theme";
export const THEME_EVENT = "theme-change";
export const DEFAULT_THEME = "light" satisfies Theme;
export const ANTD_THEME_CLASS = "ant-theme";

/* Theming */

let themingEnabled = true;

const applyTheme = (theme: Theme) => {
  document.body.classList.remove("theme-light", "theme-dark");
  document.body.classList.add(ANTD_THEME_CLASS, `theme-${theme}`);

  window.theme = theme;

  if (themingEnabled) {
    localStorage.setItem(THEME_KEY, theme);
  }

  document.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }));
};

export const initTheme = (config: { enabled?: boolean } = {}) => {
  if (themingEnabled === config.enabled) return;
  themingEnabled = config.enabled ?? true;

  if (!themingEnabled) {
    applyTheme(DEFAULT_THEME);
    return;
  }

  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  applyTheme(stored || DEFAULT_THEME);
};

export const changeTheme = (themingMode: ThemingMode) => {
  if (!themingEnabled) return;
  applyTheme(themingMode === "system" ? getSystemTheme() : themingMode);
};

export const getSystemTheme = (): Theme => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

export const getCurrentTheme = (): Theme => {
  if (!themingEnabled) return DEFAULT_THEME;
  return (localStorage.getItem(THEME_KEY) as Theme) || DEFAULT_THEME;
};

export const themed = <T, V = T>(lightValue: T, darkValue: V) => {
  return getCurrentTheme() === "dark" ? darkValue : lightValue;
};

/* Global style variables */

export const cssVar = <T extends string>(variableName: T) => {
  const styles = window.getComputedStyle(document.body);
  return styles.getPropertyValue(variableName);
};
