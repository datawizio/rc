import { List } from "antd";
import ListItemField from "./Field";
import ListItemHeader from "./Header";
import type { ListItemTypeProps } from "../types";

// @ts-expect-error: Property $$typeof is missing in the type
const Item: ListItemTypeProps = props => <List.Item {...props} />;

Item.Field = ListItemField;
Item.Header = ListItemHeader;
Item.Meta = List.Item.Meta;

export default Item;
