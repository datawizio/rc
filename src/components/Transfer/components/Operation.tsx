import LeftOutlined from "@ant-design/icons/LeftOutlined";
import DoubleLeftOutlined from "@ant-design/icons/DoubleLeftOutlined";
import RightOutlined from "@ant-design/icons/RightOutlined";
import DoubleRightOutlined from "@ant-design/icons/DoubleRightOutlined";
import Button from "@/components/Button";
import { useConfig } from "@/hooks";
import type { FC, MouseEventHandler, CSSProperties } from "react";

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
  tooltips?: { throwAll: string; throwChosen: string };
}

const Operation: FC<TransferOperationProps> = ({
  disabled,
  moveToLeft,
  moveAllToLeft,
  moveToRight,
  moveAllToRight,
  leftActive,
  rightActive,
  className,
  style,
  tooltips
}) => {
  const { translate, direction } = useConfig();

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
