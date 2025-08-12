import RadioGroup from "./components/Group";
import { Radio as AntRadio } from "antd";
import type { RadioCompoundComponent } from "./types";

import "./index.less";

const Radio: RadioCompoundComponent = props => {
  return <AntRadio {...props} />;
};

Radio.Group = RadioGroup;

export default Radio;
