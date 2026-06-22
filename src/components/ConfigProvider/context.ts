import { createContext } from "react";
import type { TFunction } from "i18next";
import type { ConfigProviderProps } from "antd";

export interface ConfigContextValue extends Pick<
  ConfigProviderProps,
  "locale" | "direction"
> {
  /**
   * Translation function from `i18next` used to localize texts.
   * Falls back to an identity function in the default context value.
   */
  t: TFunction;
}

export const defaultContextValue: ConfigContextValue = {
  t: (transKey => transKey) as TFunction
};

const ConfigContext = createContext<ConfigContextValue>(defaultContextValue);

export default ConfigContext;
