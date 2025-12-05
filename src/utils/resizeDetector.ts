import type { MaybePromise } from "@/types/utils";

export const resizeDetector = (
  el: HTMLElement,
  onResize: (nextHeight: number, nextWidth: number) => MaybePromise<void>,
  checkInterval: number = 500
) => {
  let lastWidth: number;
  let lastHeight: number;

  const updateLastSize = () => {
    lastWidth = el.offsetWidth;
    lastHeight = el.offsetHeight;
  };

  const notifyListener = async () => {
    if (el.offsetWidth === 0) return;
    await onResize(el.offsetHeight, el.offsetWidth);
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
    if (lastWidth !== el.offsetWidth || lastHeight !== el.offsetHeight) {
      frame();
    }
  }, checkInterval);

  return () => clearInterval(resizeObserverInterval);
};
