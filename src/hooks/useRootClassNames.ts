import { useEffect } from "react";

export const rootClassNames = {
  scrollbarHidden: "scrollbar-hidden"
};

/**
 * Add class names to the root element:
 * - `scrollbar-hidden` when a modal or drawer is open (to avoid using :has() for performance concerns).
 */
export const useRootClassNames = () => {
  useEffect(() => {
    const root = document.documentElement;

    /* Check if a modal or drawer is open */

    let rafId: number | undefined;

    const updateScrollbarHiddenClass = () => {
      const hasOpen = document.querySelector(
        ".ant-drawer-open, .ant-modal-mask, .ant-image-preview"
      );
      root.classList.toggle(rootClassNames.scrollbarHidden, !!hasOpen);
    };

    const mutationObserver = new MutationObserver(() => {
      rafId = requestAnimationFrame(updateScrollbarHiddenClass);
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    /* Cleanup */

    return () => {
      mutationObserver.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
};
