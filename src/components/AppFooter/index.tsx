import clsx from "clsx";
import { useMemo, type FC } from "react";
import { Layout as AntLayout } from "antd";
import { useConfig } from "@/hooks";

import "./index.less";

export interface AppFooterProps {
  text?: string;
  withLogo?: boolean;
}

const AppFooter: FC<AppFooterProps> = ({ text, withLogo }) => {
  const year = useMemo(() => new Date().getFullYear(), []);
  const { t } = useConfig();

  return (
    <AntLayout.Footer
      className={clsx("main-footer", withLogo && "main-footer--with-logo")}
    >
      {text || t("COPYRIGHT", { year })}
    </AntLayout.Footer>
  );
};

export default AppFooter;
