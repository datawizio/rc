import clsx from "clsx";
import { Layout as AntLayout } from "antd";

import type { FC, PropsWithChildren } from "react";
import type { Theme } from "@/utils/theme";

import "./index.less";

export interface TopBarProps {
  theme?: Theme;
}

const TopBar: FC<PropsWithChildren<TopBarProps>> = ({ children, theme }) => {
  const className = clsx({
    "top-bar": true,
    "dw-dark": theme === "dark"
  });

  return <AntLayout.Header className={className}>{children}</AntLayout.Header>;
};

export default TopBar;
