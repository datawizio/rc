import Item from "./components/Item";
import { List as AntList } from "antd";
import type { ListCompoundComponent } from "./types";

import "./index.less";

const List: ListCompoundComponent = ({ bordered = true, ...props }) => {
  return <AntList bordered={bordered} {...props} />;
};

List.Item = Item;

export default List;
