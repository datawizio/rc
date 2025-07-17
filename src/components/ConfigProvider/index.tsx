import { useMemo } from "react";
import { ConfigProvider as AntdConfigProvider } from "antd";

import ConfigContext, { defaultContextValue } from "./context";

import type { FC } from "react";
import type { ConfigProviderProps as AntdConfigProviderProps } from "antd";
import type { ConfigContextValue } from "./context";

const ConfigProvider: FC<ConfigContextValue & AntdConfigProviderProps> = (
  props = defaultContextValue
) => {
  const { children, translate, direction, ...restProps } = props;

  const contextValue = useMemo<ConfigContextValue>(() => {
    const nextValue: ConfigContextValue = {};

    if (translate) nextValue.translate = translate;
    if (direction) nextValue.direction = direction;

    return nextValue;
  }, [direction, translate]);

  return (
    <ConfigContext.Provider value={contextValue}>
      <AntdConfigProvider {...restProps}>{children}</AntdConfigProvider>
    </ConfigContext.Provider>
  );
};

ConfigProvider.displayName = "ConfigProvider";

export default ConfigProvider;
