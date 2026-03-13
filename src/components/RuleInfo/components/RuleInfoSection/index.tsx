import clsx from "clsx";
import { Tooltip } from "antd";
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
        <div className="colored-tags">
          <Tooltip title={tooltip} placement="topLeft">
            <div className="colored-tag rule-info-section-content rule-info-section-content--disabled">
              {children}
            </div>
          </Tooltip>
        </div>
      ) : (
        <div className="rule-info-section-content" title={tooltip}>
          {children}
        </div>
      )}
    </div>
  );
};
