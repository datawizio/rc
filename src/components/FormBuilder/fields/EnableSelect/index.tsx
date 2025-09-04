import { Form } from "antd";
import { Field } from "./Field";

import type { FC, ReactNode } from "react";
import type { FormFieldProps, EnableSelectValueType } from "../../types";

import "./index.less";

export type FieldEnableSelectProps = FormFieldProps<EnableSelectValueType> & {
  renderField: (value?: EnableSelectValueType) => ReactNode;
};

export const FieldEnableSelect: FC<FieldEnableSelectProps> = ({
  label,
  rules,
  name,
  initialValue,
  placeholder,
  renderField,
  onChange
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      initialValue={initialValue}
      className="field-enable-select"
    >
      <Field
        name={name}
        renderField={renderField}
        placeholder={placeholder}
        onChange={onChange}
      />
    </Form.Item>
  );
};
