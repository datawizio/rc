import clsx from "clsx";
import dayjs from "dayjs";
import DatePicker from "@/components/DatePicker";
import { useConfig } from "@/hooks";

import type { FC } from "react";
import type { HandlerFn } from "@/types/utils";
import type { TimeRangePickerProps as AntTimeRangePickerProps } from "antd/es/time-picker";

export type TimeRangePickerProps = Omit<
  AntTimeRangePickerProps,
  "value" | "onChange"
> & {
  fullWidth?: boolean;
  value?: { from: string | null; to: string | null };
  onChange?: (value: { from: string | null; to: string | null }) => void;
};

const TimeRangePicker: FC<TimeRangePickerProps> = ({
  value,
  fullWidth,
  ...props
}) => {
  const { t } = useConfig();

  const handleChange: HandlerFn<AntTimeRangePickerProps, "onChange"> = (
    _,
    value
  ) => {
    const [dateFrom, dateTo] = value || [null, null];
    props.onChange?.({ from: dateFrom, to: dateTo });
  };

  const getFormattedDate = (date: string | null) => {
    if (!date) return null;
    return dayjs(date, (props.format ?? "HH:mm") as dayjs.OptionType);
  };

  return (
    <DatePicker.RangePicker
      {...props}
      onChange={handleChange}
      value={
        value && [getFormattedDate(value.from), getFormattedDate(value.to)]
      }
      picker="time"
      className={clsx(fullWidth && "ant-picker-w100")}
      classNames={{
        popup: {
          root: clsx("time-range-picker", props.classNames?.popup)
        }
      }}
      mode={undefined}
      placeholder={[t("START_TIME"), t("END_TIME")]}
    />
  );
};

export default TimeRangePicker;
