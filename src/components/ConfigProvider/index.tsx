import { useMemo } from "react";
import { ConfigProvider as AntdConfigProvider } from "antd";
import ConfigContext, { defaultContextValue } from "./context";

import type { FC } from "react";
import type { ConfigProviderProps as AntdConfigProviderProps } from "antd";
import type { ConfigContextValue } from "./context";

export type ConfigProviderProps = Partial<ConfigContextValue> &
  AntdConfigProviderProps;

const ConfigProvider: FC<ConfigProviderProps> = props => {
  const { children, translate, direction, ...restProps } = props;

  const contextValue = useMemo<ConfigContextValue>(() => {
    const nextValue = defaultContextValue;

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

export default ConfigProvider;
