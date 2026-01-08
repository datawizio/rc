import type { MaybePromise } from "@/types/utils";

export const resizeDetector = (
  element: HTMLElement,
  onResize: (nextHeight: number, nextWidth: number) => MaybePromise<void>
) => {
  const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      const { height, width } = entry.contentRect;
      void onResize(height, width);
    }
  });

  resizeObserver.observe(element);

  return () => resizeObserver.disconnect();
};
