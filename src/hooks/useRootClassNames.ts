import { useEffect } from "react";
import { browser } from "@/utils/navigatorInfo";

export const rootClassNames = {
  scrollable: "scrollable",
  scrollbarHidden: "scrollbar-hidden"
};

/**
 * Add class names to the root element:
 * - browser name class (e.g. `chrome`, `firefox`, etc.) to the root element;
 * - `scrollable` class when the scroll height is greater than the client height (i.e. scrollbar is visible);
 * - `scrollbar-hidden` when an Ant Design modal or drawer is open (avoids :has() for performance).
 */
export const useRootClassNames = () => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add(browser.getBrowserName(true));

    /* Check if the scrollbar is visible on the page */

    const resizeObserver = new ResizeObserver(([rootEntry]) => {
      rootEntry.target.classList.toggle(
        rootClassNames.scrollable,
        root.scrollHeight > root.clientHeight
      );
    });

    resizeObserver.observe(root);

    /* Check if an Ant Design modal or drawer is open */

    let rafId: number | undefined;

    const updateScrollbarHiddenClass = () => {
      const hasOpen = document.querySelector(".ant-drawer-open, .ant-modal");
      root.classList.toggle(rootClassNames.scrollbarHidden, !!hasOpen);
    };

    const mutationObserver = new MutationObserver(() => {
      rafId = requestAnimationFrame(updateScrollbarHiddenClass);
    });

    mutationObserver.observe(document.body, {
      childList: true
    });

    /* Cleanup */

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
};
