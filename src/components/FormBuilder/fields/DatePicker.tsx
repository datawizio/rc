import React, { useMemo } from "react";
import dayjs from "dayjs";
import DatePicker from "@/components/DatePicker";
import { Form } from "antd";

import type { Dayjs } from "dayjs";
import type { CalendarType } from "@/types/calendar";
import type { FieldDatePickerProps, FormFieldProps } from "../types";

interface FieldProps extends FormFieldProps<any> {
  format?: string;
  storeFormat?: string;
  value: any;
  type: CalendarType;
  disabledDate?: (currentDate: Dayjs) => boolean;
}

const Field: React.FC<FieldProps> = ({
  format,
  type,
  value,
  onChange,
  ...restProps
}) => {
  const formatedValue = useMemo<Dayjs | null>(() => {
    if (!value) return null;
    if (typeof value === "string") return dayjs(value);
    return value;
  }, [value]);

  const Component = DatePicker.Picker[type];

  return (
    <Component
      {...restProps}
      onChange={onChange}
      format={format}
      // @ts-expect-error: Type mismatch
      value={formatedValue}
    />
  );
};

export const FieldDatePicker: React.FC<FieldDatePickerProps> = React.memo(
  ({
    format,
    label,
    rules,
    name,
    placeholder,
    fullWidth,
    onChange,
    inputReadOnly,
    type = "iso-8601",
    ...restProps
  }) => {
    const handleChange = (value: Dayjs) => {
      onChange?.({ name, value });
    };

    return (
      <Form.Item name={name} label={label} rules={rules}>
        <Field
          {...restProps}
          inputReadOnly={inputReadOnly}
          placeholder={placeholder}
          // @ts-expect-error: Type mismatch
          onChange={handleChange}
          format={format}
          type={type}
          className={fullWidth ? "ant-picker-w100" : ""}
        />
      </Form.Item>
    );
  }
);
