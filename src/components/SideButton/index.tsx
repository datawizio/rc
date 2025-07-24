import clsx from "clsx";
import Button, { type ButtonProps } from "../Button";
import { createPortal } from "react-dom";
import type { FC } from "react";

import "./index.less";

export interface SideButtonProps extends ButtonProps {
  text: string;
  icon: React.ReactNode;
  className?: string;
  renderTo?: Element;
  side?: "left" | "right";
  extra?: React.ReactNode;
}

const SideButton: FC<SideButtonProps> = ({
  className,
  icon,
  text,
  side = "right",
  renderTo = window.document.body,
  style,
  extra,
  ...restProps
}) => {
  return createPortal(
    <div
      style={style}
      className={clsx(
        "side-button-container",
        `side-button-container--${side}`,
        className
      )}
    >
      <Button {...restProps} className={"side-button side-button--" + side}>
        {side === "right" && (
          <>
            <span className="side-button__icon">{icon}</span>
            <span className="side-button__text">{text}</span>
          </>
        )}
        {side === "left" && (
          <>
            <span className="side-button__text">{text}</span>
            <span className="side-button__icon">{icon}</span>
          </>
        )}
      </Button>
      {extra}
    </div>,
    renderTo
  );
};

export default SideButton;
