import clsx from "clsx";
import { useConfig } from "@/hooks";
import type { FC, PropsWithChildren } from "react";

import "./index.less";

export const RuleInfoSection: FC<
  PropsWithChildren<{
    name: string;
    className?: string;
    disabled?: boolean;
    tooltip?: string;
  }>
> = ({ name, children, className, disabled, tooltip }) => {
  const { t } = useConfig();

  return (
    <div className={clsx("rule-info-section", className)}>
      <div className="rule-info-section-name">{t(name)}</div>
      {disabled ? (
        <div className="colored-tags" title={tooltip}>
          <div className="colored-tag rule-info-section-content rule-info-section-content--disabled">
            {children}
          </div>
        </div>
      ) : (
        <div className="rule-info-section-content" title={tooltip}>
          {children}
        </div>
      )}
    </div>
  );
};
