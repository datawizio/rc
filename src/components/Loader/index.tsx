import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import type { FC, PropsWithChildren } from "react";

import "./index.less";

export interface LoaderProps {
  loading?: boolean;
  className?: string;
}

const Loader: FC<PropsWithChildren<LoaderProps>> = ({
  loading,
  className,
  children
}) => {
  return (
    <Spin
      spinning={loading}
      className="datawiz-loader"
      indicator={<LoadingOutlined />}
      wrapperClassName={className}
    >
      {children}
    </Spin>
  );
};

export default Loader;
