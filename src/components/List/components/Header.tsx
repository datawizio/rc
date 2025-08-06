import { List } from "antd";

import type { FC } from "react";
import type { ListItemHeaderProps } from "../types";

const ListItemHeader: FC<ListItemHeaderProps> = ({ title }) => {
  return <List.Item className="list-item-header">{title}</List.Item>;
};

export default ListItemHeader;
