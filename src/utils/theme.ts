// Types

export type Theme = "dark" | "light" | "system";

declare global {
  interface Window {
    theme: Theme;
  }
}

// Constants

export const THEME_KEY = "theme";
export const THEME_EVENT = "theme-change";
export const DEFAULT_THEME = "light" satisfies Theme;
export const ANTD_THEME_CLASS = "ant-theme";

// Theming

const applyTheme = (theme: Theme) => {
  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;

  document.body.classList.remove("theme-light", "theme-dark");
  document.body.classList.add(ANTD_THEME_CLASS, `theme-${resolvedTheme}`);

  window.theme = theme;
  localStorage.setItem(THEME_KEY, theme);

  document.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }));
};

export const initTheme = () => {
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  applyTheme(stored || DEFAULT_THEME);
};

export const changeTheme = (theme: Theme) => {
  applyTheme(theme);
};

export const getSystemTheme = (): Theme => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

export const getCurrentTheme = (): Theme => {
  return window.theme || DEFAULT_THEME;
};

// Global style variables

export const cssVar = (variableName: string) => {
  const styles = window.getComputedStyle(document.body);
  return styles.getPropertyValue(variableName);
};
