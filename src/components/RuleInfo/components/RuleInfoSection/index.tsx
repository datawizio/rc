import clsx from "clsx";
import { useTranslation } from "react-i18next";
import type { FC, PropsWithChildren } from "react";

import "./index.less";

export const RuleInfoSection: FC<
  PropsWithChildren<{
    name: string;
    className?: string;
  }>
> = ({ name, children, className }) => {
  const { t } = useTranslation();

  return (
    <div className={clsx("rule-info-section", className)}>
      <div className="rule-info-section-name">{t(name)}</div>
      <div className="rule-info-section-content">{children}</div>
    </div>
  );
};
