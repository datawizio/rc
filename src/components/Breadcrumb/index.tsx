import { Breadcrumb as AntBreadcrumb, type BreadcrumbProps } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useConfig } from "@/hooks";
import type { FC } from "react";

import "./index.less";

export interface BreadcrumbComponent extends FC<BreadcrumbProps> {
  Item: typeof AntBreadcrumb.Item;
  Separator: typeof AntBreadcrumb.Separator;
}

const Breadcrumb: BreadcrumbComponent = ({ separator, ...props }) => {
  const { direction } = useConfig();

  if (!separator) {
    separator = direction === "rtl" ? <LeftOutlined /> : <RightOutlined />;
  }

  return (
    <AntBreadcrumb className="dw-breadcrumb" separator={separator} {...props} />
  );
};

Breadcrumb.Item = AntBreadcrumb.Item;
Breadcrumb.Separator = AntBreadcrumb.Separator;

export default Breadcrumb;
