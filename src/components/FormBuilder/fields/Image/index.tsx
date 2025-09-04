import React from "react";
import { Form } from "antd";
import { Image } from "./Image";

import type { FieldImageProps } from "../../types";

import "./index.less";

export const FieldImage: React.FC<FieldImageProps> = React.memo(
  ({ name, label, rules, placeholder, onChange }) => {
    return (
      <Form.Item name={name} label={label} rules={rules}>
        <Image onChange={onChange} name={name} placeholder={placeholder} />
      </Form.Item>
    );
  }
);
