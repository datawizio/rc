import { Menu as AntMenu, type MenuProps } from "antd";
import type { FC } from "react";

import "./index.less";

export type MenuComponent = FC<MenuProps>;

export interface MenuCompoundComponent extends MenuComponent {
  Item: typeof AntMenu.Item;
  SubMenu: typeof AntMenu.SubMenu;
  ItemGroup: typeof AntMenu.ItemGroup;
  Divider: typeof AntMenu.Divider;
}

const Menu: MenuCompoundComponent = ({ theme = "dark", ...props }) => {
  return <AntMenu theme={theme} {...props} />;
};

Menu.Item = AntMenu.Item;
Menu.Divider = AntMenu.Divider;
Menu.SubMenu = AntMenu.SubMenu;
Menu.ItemGroup = AntMenu.ItemGroup;

export default Menu;
