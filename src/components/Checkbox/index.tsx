import { Checkbox as AntCheckbox, type CheckboxProps } from "antd";
import type { FC } from "react";

import "./index.less";

const Checkbox: FC<CheckboxProps> = props => {
  return <AntCheckbox {...props} />;
};

export default Checkbox;
