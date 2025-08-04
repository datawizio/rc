import { Drawer as AntDrawer } from "antd";
import type { FC, ReactNode } from "react";
import type { DrawerProps as AntDrawerProps } from "antd";

import "./index.less";

export interface DrawerProps extends AntDrawerProps {
  actions?: ReactNode;
}

const Drawer: FC<DrawerProps> = ({ actions, footer, ...props }) => {
  const internalActions = actions ? (
    <div className="ant-drawer-actions">{actions}</div>
  ) : null;

  const internalFooter = footer || internalActions;
  return <AntDrawer {...props} footer={internalFooter} />;
};

export default Drawer;
