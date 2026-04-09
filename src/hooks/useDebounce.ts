import { useCallback, useRef } from "react";
import type { MaybePromise } from "@/types/utils";

export const useDebounce = <Args extends any[], Result>(
  fn: (...args: Args) => MaybePromise<Result>,
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
