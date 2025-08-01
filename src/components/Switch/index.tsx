import { Switch as AntSwitch, Typography } from "antd";

import type { FC } from "react";
import type { SwitchProps as AntSwitchProps } from "antd";

import "./index.less";

export interface SwitchProps extends AntSwitchProps {
  placeholder?: string;
}

const Switch: FC<SwitchProps> = ({ placeholder, ...restProps }) => {
  return (
    <div className="dw-switch__container">
      {placeholder && (
        <Typography.Text className="dw-switch__container--placeholder">
          {placeholder}
        </Typography.Text>
      )}
      <AntSwitch {...restProps} />
    </div>
  );
};

export default Switch;
