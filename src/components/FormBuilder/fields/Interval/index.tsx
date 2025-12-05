import { useMemo } from "react";
import { Form } from "antd";
import { Interval } from "./Interval";
import { useConfig } from "@/hooks";

import type { FC } from "react";
import type { FormRule } from "antd";
import type { TFunction } from "i18next";
import type { ValidatorRule } from "rc-field-form/es/interface";
import type { FieldIntervalProps, IntervalType } from "../../types";

import "./index.less";

const intervalValidation = (t: TFunction) => ({
  validator(rule: FormRule, value: IntervalType) {
    if (
      value.from === null ||
      value.to === null ||
      value.from.isBefore(value.to)
    ) {
      return Promise.resolve();
    }

    return Promise.reject(
      (rule as ValidatorRule).message || t("INVALID_INTERVAL")
    );
  }
});

export const FieldInterval: FC<FieldIntervalProps> = ({
  name,
  label,
  rules,
  format,
  picker,
  minDate,
  maxDate,
  onChange
}) => {
  const { t } = useConfig();

  const handleChange = (value: IntervalType) => {
    onChange?.({ name, value });
  };

  const internalRules = useMemo(() => {
    const validatorRule = intervalValidation(t);
    return rules ? rules.concat([validatorRule]) : [validatorRule];
  }, [rules, t]);

  return (
    <Form.Item
      name={name}
      label={label}
      rules={internalRules}
      className="field-interval"
    >
      <Interval
        format={format}
        picker={picker}
        minDate={minDate}
        maxDate={maxDate}
        onChange={handleChange}
      />
    </Form.Item>
  );
};
