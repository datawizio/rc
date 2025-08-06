import List from "../index";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { useConfig } from "@/hooks";

import type { FC } from "react";
import type { ListItemFieldProps } from "../types";

const ListItemField: FC<ListItemFieldProps> = ({
  title,
  description,
  value,
  customIcon,
  id,
  onClick
}) => {
  const { direction } = useConfig();
  const icon = direction === "rtl" ? <LeftOutlined /> : <RightOutlined />;

  return (
    <List.Item onClick={onClick} className="list-item-field" id={id || ""}>
      <div className="list-item-field-container">
        <List.Item.Meta title={title} description={description} />
        <div className="value-container">{value}</div>
      </div>
      {customIcon !== undefined ? customIcon : icon}
    </List.Item>
  );
};

export default ListItemField;
