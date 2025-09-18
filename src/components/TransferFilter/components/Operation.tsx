import Button from "@/components/Button";
import { useConfig } from "@/hooks";
import {
  LeftOutlined,
  DoubleLeftOutlined,
  RightOutlined,
  DoubleRightOutlined
} from "@ant-design/icons";

import type { MouseEventHandler, CSSProperties } from "react";

export interface TransferOperationProps {
  className?: string;
  moveToLeft?: MouseEventHandler<HTMLButtonElement>;
  moveAllToLeft?: MouseEventHandler<HTMLButtonElement>;
  moveToRight?: MouseEventHandler<HTMLButtonElement>;
  moveAllToRight?: MouseEventHandler<HTMLButtonElement>;
  leftActive?: boolean;
  rightActive?: boolean;
  style?: CSSProperties;
  disabled?: boolean;
  direction?: "ltr" | "rtl";
  tooltips?: { throwAll: string; throwChosen: string };
}

const Operation = ({
  className,
  direction,
  disabled,
  leftActive,
  rightActive,
  style,
  tooltips,
  moveToLeft,
  moveAllToLeft,
  moveToRight,
  moveAllToRight
}: TransferOperationProps) => {
  const { translate } = useConfig();

  return (
    <div className={className} style={style}>
      <Button
        type="primary"
        size="small"
        disabled={disabled || !rightActive}
        onClick={moveAllToRight}
        title={tooltips ? translate(tooltips.throwAll) : ""}
        icon={
          direction !== "rtl" ? <DoubleRightOutlined /> : <DoubleLeftOutlined />
        }
      />
      <Button
        type="primary"
        size="small"
        disabled={disabled || !rightActive}
        onClick={moveToRight}
        title={tooltips ? translate(tooltips.throwChosen) : ""}
        icon={direction !== "rtl" ? <RightOutlined /> : <LeftOutlined />}
      />
      <Button
        type="primary"
        size="small"
        disabled={disabled || !leftActive}
        onClick={moveToLeft}
        title={tooltips ? translate(tooltips.throwChosen) : ""}
        icon={direction !== "rtl" ? <LeftOutlined /> : <RightOutlined />}
      />
      <Button
        type="primary"
        size="small"
        disabled={disabled || !leftActive}
        onClick={moveAllToLeft}
        title={tooltips ? translate(tooltips.throwAll) : ""}
        icon={
          direction !== "rtl" ? <DoubleLeftOutlined /> : <DoubleRightOutlined />
        }
      />
    </div>
  );
};

export default Operation;
