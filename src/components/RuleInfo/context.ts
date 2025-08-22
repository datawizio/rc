import { createContext } from "react";
import type { IRuleInfoContext } from "./types";

export const RuleInfoContext = createContext<IRuleInfoContext | null>(null);
