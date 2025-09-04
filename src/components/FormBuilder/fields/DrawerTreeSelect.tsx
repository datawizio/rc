import DrawerTreeSelect from "@/components/DrawerTreeSelect";
import { Form } from "antd";

import type { FC } from "react";
import type { FieldDrawerTreeSelectProps } from "../types";

export const FieldDrawerTreeSelect: FC<FieldDrawerTreeSelectProps> = ({
  drawerTitle,
  label,
  name,
  initialValue,
  multiple,
  placeholder,
  rules,
  onChange,
  level,
  treeNodeFilterProp = "title",
  ...restProps
}) => {
  const handleFieldChange = (obj: any) => {
    if (!multiple && obj.value.length === 0) obj.value = "";
    onChange?.({ name, ...obj });
  };

  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      initialValue={initialValue}
    >
      <DrawerTreeSelect
        placeholder={placeholder}
        drawerTitle={drawerTitle || placeholder}
        level={level ?? 1}
        treeNodeFilterProp={treeNodeFilterProp}
        treeCheckable={true}
        showSearch={true}
        onChangeReturnObject={onChange ? handleFieldChange : undefined}
        allowClear={true}
        multiple={multiple}
        {...restProps}
      />
    </Form.Item>
  );
};
