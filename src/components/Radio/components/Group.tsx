import clsx from "clsx";
import { Radio } from "antd";

import type { FC } from "react";
import type { RadioGroupProps } from "../types";

const RadioGroup: FC<RadioGroupProps> = ({ vertical, ...props }) => {
  return (
    <Radio.Group
      {...props}
      className={clsx({ "ant-radio-group-vertical": vertical })}
    />
  );
};

export default RadioGroup;
