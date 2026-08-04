import ConfigContext, { defaultContextValue } from "./context";

import { useLayoutEffect, useMemo } from "react";
import { ConfigProvider as AntdConfigProvider, App, theme } from "antd";
import { useTheme } from "@/hooks";
import { ANTD_THEME_CLASS, cssVar, initTheme } from "@/utils/theme";

import type { FC } from "react";
import type { ConfigContextValue } from "./context";
import type {
  ThemeConfig,
  ConfigProviderProps as AntdConfigProviderProps
} from "antd";

export type ConfigProviderProps = Partial<ConfigContextValue> &
  AntdConfigProviderProps & {
    /**
     * When `false`, the app always uses the light theme.
     * Theme is not read from or written to `localStorage`.
     * @default true
     */
    themingEnabled?: boolean;
  };

const ConfigProvider: FC<ConfigProviderProps> = ({
  t,
  locale,
  direction,
  themingEnabled = true,
  children,
  ...props
}) => {
  const customTheme = useTheme();
  const isDark = customTheme === "dark";

  const tokens: ThemeConfig["token"] = {
    borderRadius: 4,
    colorText: cssVar("--text-color"),
    colorPrimary: cssVar("--primary-color"),
    colorLink: cssVar("--primary-color")
  };

  const components: ThemeConfig["components"] = {
    Table: {
      headerBorderRadius: 0,
      borderRadius: 0,
      headerSplitColor: "transparent"
    },
    Pagination: {
      itemBg: "transparent",
      itemActiveBg: "transparent"
    },
    Form: {
      itemMarginBottom: 14
    },
    Modal: {
      fontWeightStrong: 500
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
    if (locale) nextValue.locale = locale;
    if (direction) nextValue.direction = direction;

    return nextValue;
  }, [t, locale, direction]);

  useLayoutEffect(() => {
    initTheme({ enabled: themingEnabled });
  }, [themingEnabled]);

  return (
    <ConfigContext.Provider value={contextValue}>
      <AntdConfigProvider
        {...props}
        locale={locale}
        theme={themeConfig}
        drawer={{ mask: { blur: false } }}
        modal={{ mask: { blur: false } }}
      >
        <App notification={{ maxCount: 3, stack: false }}>{children}</App>
      </AntdConfigProvider>
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
