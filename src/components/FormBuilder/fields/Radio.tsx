import React, { useCallback } from "react";
import Radio from "@/components/Radio";
import { Form } from "antd";

import type { RadioChangeEvent } from "antd/es/radio";
import type { FieldRadioProps } from "../types";

export const FieldRadio: React.FC<FieldRadioProps> = React.memo(
  ({ label, rules, name, options, onChange }) => {
    const handleFieldChange = useCallback(
      ({ target: { value } }: RadioChangeEvent) => {
        onChange?.({
          name,
          value
        });
      },
      [name, onChange]
    );

    return (
      <Form.Item name={name} label={label} rules={rules}>
        <Radio.Group onChange={handleFieldChange}>
          {options.map(option => (
            <Radio value={option.value} key={option.value}>
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
    );
  }
);
