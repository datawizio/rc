import { useMemo } from "react";
import { ConfigProvider as AntdConfigProvider, theme } from "antd";
import { useTheme } from "@/hooks";
import { ANTD_THEME_CLASS, cssVar, initTheme } from "@/utils/theme";
import ConfigContext, { defaultContextValue } from "./context";

import type { FC } from "react";
import type { ConfigContextValue } from "./context";
import type {
  ThemeConfig,
  ConfigProviderProps as AntdConfigProviderProps
} from "antd";

export type ConfigProviderProps = Partial<ConfigContextValue> &
  AntdConfigProviderProps;

initTheme();

const ConfigProvider: FC<ConfigProviderProps> = ({
  t,
  direction,
  children,
  ...props
}) => {
  const customTheme = useTheme();
  const isDark = customTheme === "dark";

  const tokens: ThemeConfig["token"] = {
    borderRadius: 4,
    colorText: "rgba(0, 0, 0, 0.65)",
    colorPrimary: cssVar("--primary-color"),
    colorLink: cssVar("--primary-color")
  };

  const components: ThemeConfig["components"] = {
    Table: {
      headerBorderRadius: 0,
      borderRadius: 0
    }
  };

  const themeConfig: ThemeConfig = {
    cssVar: { key: ANTD_THEME_CLASS },
    hashed: false,
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: tokens,
    components: components,
    ...props.theme
  };

  const contextValue = useMemo<ConfigContextValue>(() => {
    const nextValue = defaultContextValue;

    if (t) nextValue.t = t;
    if (direction) nextValue.direction = direction;

    return nextValue;
  }, [direction, t]);

  return (
    <ConfigContext.Provider value={contextValue}>
      <AntdConfigProvider {...props} theme={themeConfig}>
        {children}
      </AntdConfigProvider>
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
