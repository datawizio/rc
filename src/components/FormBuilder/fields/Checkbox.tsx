import React, { useCallback } from "react";
import Checkbox from "@/components/Checkbox";
import InfoTooltip from "@/components/InfoTooltip";
import { Form } from "antd";

import type { CheckboxChangeEvent } from "antd/es/checkbox/Checkbox";
import type { FieldCheckboxProps } from "../types";

export const FieldCheckbox: React.FC<FieldCheckboxProps> = React.memo(
  ({ label, rules, name, placeholder, disabled, onChange, infoTooltip }) => {
    const handleFieldChange = useCallback(
      ({ target: { checked } }: CheckboxChangeEvent) => {
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
        <Checkbox disabled={disabled} onChange={handleFieldChange}>
          {placeholder}
          {infoTooltip && <InfoTooltip {...infoTooltip} />}
        </Checkbox>
      </Form.Item>
    );
  }
);
