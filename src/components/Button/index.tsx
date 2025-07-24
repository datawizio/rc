import clsx from "clsx";
import { Button as AntButton } from "antd";

import type { FC } from "react";
import type { ButtonProps as AntButtonProps } from "antd";

import "./index.less";

export interface ButtonProps extends AntButtonProps {
  /**
   * Control whether the button has a border.
   * @default true
   */
  border?: boolean;

  /**
   * Highlight the button visually on hover.
   */
  highlight?: boolean;
}

const Button: FC<ButtonProps> = ({
  border = true,
  highlight,
  className,
  ...props
}) => {
  return (
    <AntButton
      {...props}
      className={clsx("dw-btn", className, {
        "no-border": !border,
        "highlight": highlight
      })}
    />
  );
};

export default Button;
