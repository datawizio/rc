import { useCallback, useLayoutEffect, useRef, useState } from "react";

/**
 * Measures the available height for the tree virtual list inside the drawer.
 * @param visible - Boolean indicating whether the drawer is visible.
 */
export const useTreeContainerHeight = (visible: boolean) => {
  const [height, setHeight] = useState<number>(0);

  const nodeRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  const ref = useCallback((node: HTMLDivElement | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    nodeRef.current = node;

    if (node) {
      const observer = new ResizeObserver(([entry]) => {
        setHeight(entry.contentRect.height);
      });
      observer.observe(node);
      observerRef.current = observer;
    }
  }, []);

  useLayoutEffect(() => {
    if (visible && nodeRef.current) {
      setHeight(nodeRef.current.offsetHeight);
    }
  }, [visible]);

  return { ref, height };
};
