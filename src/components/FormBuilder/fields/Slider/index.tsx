import React from "react";
import { Form, InputNumber, Slider } from "antd";
import type { FieldSliderProps } from "../../types";

import "./index.less";

export const FieldSlider: React.FC<FieldSliderProps> = React.memo(
  ({ name, label, min, max, step, rules, onChange }) => {
    const handleChange = (value: number) => {
      onChange?.({
        name,
        value
      });
    };

    return (
      <div className="dw-slider">
        <Form.Item
          rules={rules}
          name={name}
          label={label}
          required={false}
          className="dw-slider-input"
        >
          <InputNumber
            min={min}
            max={max}
            step={step || 1}
            onChange={value => handleChange(value as number)}
          />
        </Form.Item>
        <Form.Item name={name} label={label} className="dw-slider-interval">
          <Slider
            min={min}
            max={max}
            step={step || 1}
            onChange={handleChange}
          />
        </Form.Item>
      </div>
    );
  }
);
