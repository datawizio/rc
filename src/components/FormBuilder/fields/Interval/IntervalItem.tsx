import DatePicker from "@/components/DatePicker";
import { useConfig } from "@/hooks";

import type { FC } from "react";
import type { Dayjs } from "dayjs";
import type { IntervalItemProps } from "../../types";

export const IntervalItem: FC<IntervalItemProps> = ({
  label,
  value,
  format,
  picker = "month",
  minDate,
  maxDate,
  onChange
}) => {
  const { t } = useConfig();

  return (
    <>
      <div className="field-interval-label">{label}:</div>
      <DatePicker
        disabledDate={date => {
          return Boolean(
            (maxDate && date > maxDate) || (minDate && date < minDate)
          );
        }}
        picker={picker}
        placeholder={t("UNLIMITED")}
        value={value}
        onChange={value => onChange(value as Dayjs)}
        format={format}
      />
    </>
  );
};
