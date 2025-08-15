import { FloatButton } from "antd";
import { UpOutlined } from "@ant-design/icons";
import type { ComponentProps, FC } from "react";

import "./index.less";

const BackTop: FC<ComponentProps<typeof FloatButton.BackTop>> = props => {
  return (
    <FloatButton.BackTop className="dw-back-top" {...props}>
      <div className="ant-back-top-content">
        <div className="ant-back-top-icon">
          <UpOutlined />
        </div>
      </div>
    </FloatButton.BackTop>
  );
};

export default BackTop;
