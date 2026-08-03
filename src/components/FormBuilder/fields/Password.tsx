import React, { useCallback } from "react";
import { Form, Input } from "antd";

import type { FormItemProps } from "antd";
import type { FieldTextProps } from "../types";

export interface FieldPasswordProps extends FieldTextProps {
  formItemProps?: FormItemProps;
}

export const FieldPassword: React.FC<FieldPasswordProps> = React.memo(
  ({ label, rules, name, placeholder, onChange, formItemProps, ...props }) => {
    const handleFieldChange = useCallback<
      React.ChangeEventHandler<HTMLInputElement>
    >(({ target: { value } }) => onChange?.({ name, value }), [name, onChange]);

    return (
      <Form.Item name={name} label={label} rules={rules} {...formItemProps}>
        <Input.Password
          {...props}
          placeholder={placeholder}
          onChange={handleFieldChange}
        />
      </Form.Item>
    );
  }
);
