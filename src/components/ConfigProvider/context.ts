import { createContext } from "react";
import type { TFunction } from "i18next";
import type { DirectionType } from "antd/es/config-provider";

export interface ConfigContextValue {
  /**
   * Translation function from `i18next` used to localize texts.
   * Falls back to an identity function in the default context value.
   */
  t: TFunction;

  /**
   * Direction of layout for components that support RTL/LTR.
   */
  direction?: DirectionType;
}

export const defaultContextValue: ConfigContextValue = {
  t: (transKey => transKey) as TFunction
};

const ConfigContext = createContext<ConfigContextValue>(defaultContextValue);

export default ConfigContext;
