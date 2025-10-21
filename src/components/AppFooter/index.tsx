import { useMemo, type FC } from "react";
import { Layout as AntLayout } from "antd";
import { useConfig } from "@/hooks";

import "./index.less";

export interface AppFooterProps {
  text?: string;
}

const AppFooter: FC<AppFooterProps> = ({ text }) => {
  const year = useMemo(() => new Date().getFullYear(), []);
  const { t } = useConfig();

  return (
    <AntLayout.Footer className="main-footer">
      {text || t("COPYRIGHT", { year })}
    </AntLayout.Footer>
  );
};

export default AppFooter;
