import { useState } from "react";

declare global {
  interface Window {
    forceError: () => void;
  }
}

export const useError = () => {
  const [value, setValue] = useState<string | number>("value");

  window.forceError = () => {
    setValue(1);
  };

  // Intentionally calling `.slice()` on a value that may be a number
  // to simulate a runtime error and test error boundaries.
  // @ts-expect-error: Value may be a number, which does not have a `slice` method
  value.slice();
};
