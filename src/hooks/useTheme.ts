import { useSyncExternalStore } from "react";
import { THEME_EVENT, getCurrentTheme, type Theme } from "@/utils/theme";

export const useTheme = (): Theme => {
  const subscribe = (callback: () => void) => {
    document.addEventListener(THEME_EVENT, callback);
    return () => document.removeEventListener(THEME_EVENT, callback);
  };

  return useSyncExternalStore(subscribe, getCurrentTheme);
};
