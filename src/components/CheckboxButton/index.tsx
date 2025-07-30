import clsx from "clsx";
import { useCallback, useRef } from "react";
import { Button } from "antd";
import { useConfig } from "@/hooks";

import type { FC } from "react";
import type { ButtonProps as AntButtonProps } from "antd";

import "./index.less";

interface CheckboxButtonProps extends Omit<AntButtonProps, "onChange"> {
  className?: string;
  checked?: boolean;
  text?: string;
  border?: boolean;
  highlight?: boolean;
  onChange?: (value: boolean) => void;
}

const CheckboxButton: FC<CheckboxButtonProps> = ({
  className,
  checked,
  text,
  border = true,
  highlight,
  onChange,
  ...props
}) => {
  const { translate } = useConfig();
  const btnRef = useRef<HTMLButtonElement>(null);

  const buttonClasses = clsx(className, {
    "dw-btn": true,
    "button-checkbox": true,
    "active": checked,
    "no-border": !border,
    "highlight": highlight
  });

  const handleButtonClick = useCallback(() => {
    onChange?.(!checked);
    btnRef?.current?.blur();
  }, [checked, onChange]);

  return (
    <Button
      {...props}
      ref={btnRef}
      className={buttonClasses}
      onClick={handleButtonClick}
    >
      {text && translate(text)}
    </Button>
  );
};

export default CheckboxButton;
