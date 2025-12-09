import React, { useMemo } from "react";
import dayjs from "dayjs";
import DatePicker from "@/components/DatePicker";
import { Form } from "antd";

import type { Dayjs } from "dayjs";
import type { CalendarType } from "@/types/calendar";
import type { FieldDatePickerProps, FormFieldProps } from "../types";

interface FieldProps extends Omit<FormFieldProps<any>, "onChange" | "name"> {
  format?: string;
  storeFormat?: string;
  value?: any;
  type: CalendarType;
  disabledDate?: (currentDate: Dayjs) => boolean;
  onChange?: (date: Dayjs | null, dateString: string | null) => void;
  inputReadOnly?: boolean;
  className?: string;
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
    const handleChange = (value: Dayjs | null) => {
      onChange?.({ name, value });
    };

    return (
      <Form.Item name={name} label={label} rules={rules}>
        <Field
          {...restProps}
          inputReadOnly={inputReadOnly}
          placeholder={placeholder}
          onChange={handleChange}
          format={format}
          type={type}
          className={fullWidth ? "ant-picker-w100" : ""}
        />
      </Form.Item>
    );
  }
);
