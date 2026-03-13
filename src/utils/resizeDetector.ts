import type { MaybePromise } from "@/types/utils";

export const resizeDetector = (
  element: HTMLElement,
  onResize: (nextHeight: number, nextWidth: number) => MaybePromise<void>,
  checkInterval: number = 500
) => {
  let lastWidth: number;
  let lastHeight: number;

  const updateLastSize = () => {
    lastWidth = element.offsetWidth;
    lastHeight = element.offsetHeight;
  };

  const notifyListener = async () => {
    if (element.offsetWidth === 0) return;
    await onResize(element.offsetHeight, element.offsetWidth);
  };

  const frame = () => {
    void notifyListener();

    // Defer the snapshot of last size to the next animation frame
    // to avoid feedback loops where `onResize` affects layout immediately.
    window.requestAnimationFrame(() => {
      updateLastSize();
    });
  };

  frame();

  const resizeObserverInterval = setInterval(async () => {
    if (
      lastWidth !== element.offsetWidth ||
      lastHeight !== element.offsetHeight
    ) {
      frame();
    }
  }, checkInterval);

  return () => clearInterval(resizeObserverInterval);
};
