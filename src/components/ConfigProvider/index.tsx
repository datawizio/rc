import { useMemo } from "react";
import { ConfigProvider as AntdConfigProvider, theme } from "antd";
import { useTheme } from "@/hooks";
import { ANTD_THEME_CLASS, cssVar, initTheme } from "@/utils/theme";
import ConfigContext, { defaultContextValue } from "./context";

import type { FC } from "react";
import type { ConfigProviderProps as AntdConfigProviderProps } from "antd";
import type { ConfigContextValue } from "./context";

export type ConfigProviderProps = Partial<ConfigContextValue> &
  AntdConfigProviderProps;

initTheme();

const ConfigProvider: FC<ConfigProviderProps> = ({
  translate,
  direction,
  children,
  ...props
}) => {
  const customTheme = useTheme();
  const isDark = customTheme === "dark";

  const themeConfig = {
    cssVar: { key: ANTD_THEME_CLASS },
    hashed: false,
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: { colorPrimary: cssVar("--primary-color") },
    ...props.theme
  };

  const contextValue = useMemo<ConfigContextValue>(() => {
    const nextValue = defaultContextValue;

    if (translate) nextValue.translate = translate;
    if (direction) nextValue.direction = direction;

    return nextValue;
  }, [direction, translate]);

  return (
    <ConfigContext.Provider value={contextValue}>
      <AntdConfigProvider {...props} theme={themeConfig}>
        {children}
      </AntdConfigProvider>
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
