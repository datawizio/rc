import dayjs from "dayjs";
import React, { useCallback, useMemo } from "react";
import DateRangePicker from "@/components/DateRangePicker";

import { Form } from "antd";

import type { Dayjs } from "dayjs";
import type { ComponentProps } from "react";
import type { DateRange, DateType } from "@/types/date";
import type { CalendarType } from "@/types/calendar";
import type { FormFieldProps } from "../types";
import type { PresetsRangeType } from "@/components/DateRangePicker/types";
import type { Overwrite } from "@/types/utils";

export interface DateRangePickerParams {
  from: Dayjs | null;
  to: Dayjs | null;
}

export type FieldDateRangePickerProps = Overwrite<
  Overwrite<
    ComponentProps<typeof DateRangePicker>,
    FormFieldProps<DateRangePickerParams>
  >,
  {
    type?: CalendarType;
    format?: string;
    inputReadOnly?: boolean;
    storeFormat?: string;
    maxDateForPresets?: string;
    maxDate?: string;
    minDate?: string;
    defaultPickerValue?: any;
    ranges?: PresetsRangeType;
    presets?: string[];
    useDefaultPreset?: boolean;
    allowClear?: boolean;
    defaultPresetExceptions?: string[];
    currDateRange?: {
      date_from: DateType;
      date_to: DateType;
    };
    getPopupContainer?: () => HTMLElement | null;
    useCurrentDayPreset?: boolean;
  }
>;

export type FieldProps = Overwrite<
  FormFieldProps<DateRangePickerParams>,
  {
    format?: string;
    storeFormat?: string;
    value: DateRangePickerParams;
    useCurrentDayPreset?: boolean;
    onChange?: (dates: DateRange | null) => void;
  }
>;

const Field: React.FC<FieldProps> = ({
  format,
  storeFormat,
  value,
  onChange,
  ...restProps
}) => {
  const handleClear = useCallback(() => {
    onChange?.([null, null]);
  }, [onChange]);

  const dateFrom = useMemo(() => {
    if (Array.isArray(value) && value.length) {
      value.from = value[0];
    }
    return value.from && storeFormat
      ? dayjs(value.from, storeFormat)
      : value.from;
  }, [storeFormat, value]);

  const dateTo = useMemo(() => {
    if (Array.isArray(value) && value.length) {
      value.to = value[1];
    }
    return value.to && storeFormat ? dayjs(value.to, storeFormat) : value.to;
  }, [storeFormat, value]);

  return (
    // @ts-expect-error: Type mismatch
    <DateRangePicker
      onChange={dates => onChange?.(dates)}
      onClear={handleClear}
      format={format}
      dateFrom={dateFrom}
      dateTo={dateTo}
      fullWidth
      {...restProps}
    />
  );
};

export const FieldDateRangePicker: React.FC<FieldDateRangePickerProps> =
  React.memo(({ format, label, rules, name, onChange, ...restProps }) => {
    const handleChange = ([from, to]: DateRange) => {
      onChange?.({ name, value: { from, to } });
    };

    return (
      <Form.Item name={name} label={label} rules={rules}>
        {/* @ts-expect-error: Type mismatch */}
        <Field
          onChange={dates => handleChange(dates as DateRange)}
          format={format}
          {...restProps}
        />
      </Form.Item>
    );
  });
