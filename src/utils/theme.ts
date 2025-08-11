/* Types */

export type ThemingMode = "dark" | "light" | "system";
export type Theme = Exclude<ThemingMode, "system">;

declare global {
  interface Window {
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

// Theming

const applyTheme = (theme: Theme) => {
  document.body.classList.remove("theme-light", "theme-dark");
  document.body.classList.add(ANTD_THEME_CLASS, `theme-${theme}`);

  window.theme = theme;
  localStorage.setItem(THEME_KEY, theme);

  document.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }));
};

export const initTheme = () => {
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  applyTheme(stored || DEFAULT_THEME);
};

export const changeTheme = (themingMode: ThemingMode) => {
  applyTheme(themingMode === "system" ? getSystemTheme() : themingMode);
};

export const getSystemTheme = (): Theme => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

export const getCurrentTheme = (): Theme => {
  return window.theme || DEFAULT_THEME;
};

/* Global style variables */

export const cssVar = <T extends string>(variableName: T): string => {
  const styles = window.getComputedStyle(document.body);
  return styles.getPropertyValue(variableName);
};
