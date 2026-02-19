import { useEffect } from "react";
import { browser } from "@/utils/navigatorInfo";

/**
 * Add class names to the root element:
 * - browser name class (e.g. `chrome`, `firefox`, etc.) to the root element;
 * - `scrollable` class when the scroll height is greater than the client height (i.e. scrollbar is visible).
 */
export const useRootClassNames = () => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add(browser.getBrowserName(true));

    const observer = new ResizeObserver(([rootEntry]) => {
      rootEntry.target.classList.toggle(
        "scrollable",
        root.scrollHeight > root.clientHeight
      );
    });

    observer.observe(root);
    return () => observer.disconnect();
  }, []);
};
