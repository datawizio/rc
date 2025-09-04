import React, { useCallback } from "react";
import Switch from "@/components/Switch";
import { Form } from "antd";
import { useConfig } from "@/hooks";

import type { FieldSwitchProps } from "../types";

export const FieldSwitch: React.FC<FieldSwitchProps> = React.memo(
  ({
    label,
    placeholder,
    rules,
    name,
    onChange,
    disabled,
    title,
    checkedChildren,
    unCheckedChildren,
    loading,
    size
  }) => {
    const { direction } = useConfig();

    const handleFieldChange = useCallback(
      (checked: boolean) => {
        onChange?.({
          name,
          value: checked
        });
      },
      [onChange, name]
    );

    return (
      <Form.Item
        name={name}
        label={label}
        rules={rules}
        valuePropName="checked"
      >
        <Switch
          placeholder={placeholder}
          onChange={handleFieldChange}
          disabled={disabled}
          title={title}
          checkedChildren={checkedChildren}
          unCheckedChildren={unCheckedChildren}
          loading={loading}
          size={size}
          className={direction === "rtl" ? "ant-switch-rtl" : ""}
        />
      </Form.Item>
    );
  }
);
