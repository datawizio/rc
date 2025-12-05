import clsx from "clsx";
import Button from "@/components/Button";

import { useCallback, useMemo, useState } from "react";
import { Tooltip } from "antd";
import { CloseOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useConfig, useTheme } from "@/hooks";

import type { ReactNode, MouseEvent, FC } from "react";
import type { TooltipProps } from "antd";

import "./index.less";

export interface InfoTooltipProps {
  description?: string | ReactNode;
  detailedLink?: string | null;
  detailedTextKey?: string;
  className?: string;
  placement?: TooltipProps["placement"];
  trigger?: TooltipProps["trigger"];
  getPopupContainer?: TooltipProps["getPopupContainer"];
}

const InfoTooltip: FC<InfoTooltipProps> = ({
  description,
  detailedLink,
  detailedTextKey,
  placement,
  trigger,
  className,
  getPopupContainer
}) => {
  const { t } = useConfig();
  const theme = useTheme();
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const buttonClassNames = clsx({
    "info-tooltip-button": true,
    "info-tooltip-button-highlighted": tooltipVisible
  });

  const tooltipClassNames = clsx(className || "", {
    "info-tooltip": true,
    "info-tooltip-theme-light": theme !== "dark",
    "info-tooltip-theme-dark": theme === "dark"
  });

  const closeTooltip = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setTooltipVisible(false);
  }, []);

  const tooltip = useMemo(() => {
    return description ? (
      <div className="info-tooltip-content">
        <CloseOutlined onClick={closeTooltip} />
        {description}
        {detailedLink && (
          <p className="info-tooltip-detailed">
            <a href={detailedLink} target="_blank" rel="noreferrer">
              {detailedTextKey ? t(detailedTextKey) : t("DETAILED")}
              ...
            </a>
          </p>
        )}
      </div>
    ) : (
      <></>
    );
  }, [closeTooltip, description, detailedLink, detailedTextKey, t]);

  const onVisibleChangeCallback = useCallback((visible: boolean) => {
    setTooltipVisible(visible);
  }, []);

  return description ? (
    <Tooltip
      title={tooltip}
      placement={placement}
      trigger={trigger || ["click"]}
      classNames={{ root: tooltipClassNames }}
      open={tooltipVisible}
      onOpenChange={onVisibleChangeCallback}
      getPopupContainer={getPopupContainer}
    >
      <Button
        className={buttonClassNames}
        icon={<InfoCircleOutlined />}
        type="link"
        onClick={(e: MouseEvent) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      />
    </Tooltip>
  ) : null;
};

export default InfoTooltip;
