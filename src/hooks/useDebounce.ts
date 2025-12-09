import { useCallback, useRef } from "react";

export const useDebounce = <Args extends any[], Result>(
  fn: (...args: Args) => Promise<Result>,
  time: number = 500
) => {
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);

  return useCallback(
    (...args: Args) => {
      return new Promise<Result>(resolve => {
        clearTimeout(timeout.current ?? undefined);
        timeout.current = setTimeout(async () => {
          const result = await fn.apply(window, args);
          resolve(result);
        }, time);
      });
    },
    [fn, time]
  );
};
