import React, { useCallback } from "react";
import { Form, Input } from "antd";

import type { FieldTextProps } from "../types";

export const FieldPassword: React.FC<FieldTextProps> = React.memo(
  ({ label, rules, name, placeholder, onChange, ...props }) => {
    const handleFieldChange = useCallback<
      React.ChangeEventHandler<HTMLInputElement>
    >(({ target: { value } }) => onChange?.({ name, value }), [name, onChange]);

    return (
      <Form.Item name={name} label={label} rules={rules}>
        <Input.Password
          {...props}
          placeholder={placeholder}
          onChange={handleFieldChange}
        />
      </Form.Item>
    );
  }
);
