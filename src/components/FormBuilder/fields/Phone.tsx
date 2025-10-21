import PhoneInput from "@/components/PhoneInput";
import { useMemo } from "react";
import { Form } from "antd";
import { useConfig } from "@/hooks";

import type { FC } from "react";
import type { FormRule } from "antd";
import type { ValidatorRule } from "rc-field-form/es/interface";
import type { FieldPhoneProps } from "../types";

const phoneValidation = (message: string) => ({
  message,
  validator(rule: FormRule, value: string) {
    if (!value || PhoneInput.isValidPhoneNumber(value)) {
      return Promise.resolve();
    }
    return Promise.reject((rule as ValidatorRule).message);
  }
});

export const FieldPhone: FC<FieldPhoneProps> = ({
  label,
  rules,
  name,
  placeholder,
  onChange
}) => {
  const { translate } = useConfig();

  const internalRules = useMemo(() => {
    const validation = phoneValidation(
      translate("PHONE_NUMBER_VALIDATION_MESSAGE")
    );
    return rules ? rules.concat([validation]) : [validation];
  }, [rules, translate]);

  const handleChange = (value: string) => {
    onChange?.({ name, value });
  };

  return (
    <Form.Item name={name} label={label} rules={internalRules}>
      <PhoneInput placeholder={placeholder} onChange={handleChange} />
    </Form.Item>
  );
};
