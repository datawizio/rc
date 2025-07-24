import { useContext, type FC } from "react";
import { Breadcrumb as AntBreadcrumb, type BreadcrumbProps } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import ConfigContext from "@/components/ConfigProvider/context";

import "./index.less";

export interface FCBreadcrumb extends FC<BreadcrumbProps> {
  Item: typeof AntBreadcrumb.Item;
  Separator: typeof AntBreadcrumb.Separator;
}

const Breadcrumb: FCBreadcrumb = ({ separator, ...props }) => {
  const { direction } = useContext(ConfigContext);

  if (!separator) {
    separator = direction === "rtl" ? <LeftOutlined /> : <RightOutlined />;
  }

  return (
    <AntBreadcrumb className="dw-breadcrumb" separator={separator} {...props} />
  );
};

Breadcrumb.Item = AntBreadcrumb.Item;
Breadcrumb.Separator = AntBreadcrumb.Separator;

Breadcrumb.displayName = "Breadcrumb";

export default Breadcrumb;
