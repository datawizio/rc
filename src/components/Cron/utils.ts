import { useRef, useEffect } from "react";
import { DEFAULT_LOCALE_EN } from "./locale";

import type { OnError, Locale } from "./types";

/**
 * Creates an array of integers from start to end, inclusive.
 */
export const range = (start: number, end: number) => {
  const array: number[] = [];

  for (let i = start; i <= end; i++) {
    array.push(i);
  }

  return array;
};

/**
 * Sorts an array of numbers in ascending order.
 */
export const sort = (array: number[]) => {
  array.sort(function (a, b) {
    return a - b;
  });

  return array;
};

/**
 * Removes duplicate entries from an array.
 */
export const dedup = (array: number[]) => {
  const result: number[] = [];

  array.forEach(function (i) {
    if (result.indexOf(i) < 0) {
      result.push(i);
    }
  });

  return result;
};

/**
 * Handle onError prop to set the error.
 */
export const setError = (onError: OnError, locale: Locale) => {
  onError?.({
    type: "invalid_cron",
    description: locale.errorInvalidCron || DEFAULT_LOCALE_EN.errorInvalidCron
  });
};

/**
 * React hook to return the previous value.
 */
export const usePrevious = <T>(value: T) => {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
