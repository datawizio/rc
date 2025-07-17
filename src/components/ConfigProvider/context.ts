import { createContext } from "react";
import type { TFunction } from "i18next";
import type { DirectionType } from "antd/es/config-provider";

export interface ConfigContextValue {
  translate?: TFunction;
  direction?: DirectionType;
}

export const defaultContextValue: ConfigContextValue = {
  translate: (transKey => transKey) as TFunction
};

const ConfigContext = createContext<ConfigContextValue>(defaultContextValue);

export default ConfigContext;
