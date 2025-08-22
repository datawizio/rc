import { useContext } from "react";
import { RuleInfoContext } from "@/components/RuleInfo/context";

export const useRuleContext = () => {
  const ctx = useContext(RuleInfoContext);

  if (ctx === null) {
    throw new Error(
      "RuleInfoContext value is null. Make sure you provided a proper value"
    );
  }

  return ctx;
};
