import dayjs from "dayjs";
import React from "react";
import DateRangePicker from "@/components/DateRangePicker";

import { Form } from "antd";

import type { Dayjs } from "dayjs";
import type { DateRange } from "@/types/date";
import type { FormFieldProps } from "../types";
import type { Overwrite } from "@/types/utils";
import type { DateRangePickerProps } from "@/components/DateRangePicker/types";

export interface DateRangePickerParams {
  from: Dayjs | null;
  to: Dayjs | null;
}

export type FieldDateRangePickerProps = Overwrite<
  Overwrite<
    DateRangePickerProps,
    Omit<FormFieldProps<DateRangePickerParams>, "placeholder">
  >,
  {
    maxDate?: string;
    minDate?: string;
    storeFormat?: string;
  }
>;

type FieldValue =
  | DateRangePickerParams
  | DateRange
  | [Dayjs | null | undefined, Dayjs | null | undefined]
  | null
  | undefined;

export type FieldProps = Overwrite<
  Omit<FormFieldProps<DateRangePickerParams>, "name" | "placeholder">,
  {
    format?: string;
    storeFormat?: string;
    value?: FieldValue;
    onChange?: (dates: DateRange | null) => void;
  }
>;

function rangeToParams(dates: DateRange | null): DateRangePickerParams {
  const [from, to] = dates ?? [null, null];
  return { from, to };
}

function normalizeFieldValue(value: FieldValue, storeFormat?: string) {
  const [rawFrom, rawTo] = Array.isArray(value)
    ? [value[0] ?? null, value[1] ?? null]
    : [value?.from ?? null, value?.to ?? null];

  const withFormat = (date: Dayjs | null, format?: string) =>
    date && format ? dayjs(date, format) : date;

  return [withFormat(rawFrom, storeFormat), withFormat(rawTo, storeFormat)];
}

const Field: React.FC<FieldProps> = ({
  format,
  storeFormat,
  value,
  onChange,
  ...restProps
}) => {
  const [dateFrom, dateTo] = normalizeFieldValue(value, storeFormat);

  return (
    <DateRangePicker
      onChange={dates => onChange?.(dates)}
      onClear={() => onChange?.([null, null])}
      format={format}
      dateFrom={dateFrom}
      dateTo={dateTo}
      fullWidth={true}
      {...restProps}
    />
  );
};

export const FieldDateRangePicker: React.FC<FieldDateRangePickerProps> =
  React.memo(({ format, label, rules, name, onChange, ...restProps }) => {
    return (
      <Form.Item
        name={name}
        label={label}
        rules={rules}
        getValueFromEvent={rangeToParams}
      >
        <Field
          onChange={dates => onChange?.({ name, value: rangeToParams(dates) })}
          format={format}
          {...restProps}
        />
      </Form.Item>
    );
  });
