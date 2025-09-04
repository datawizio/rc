import DatePicker from "@/components/DatePicker";
import { useConfig } from "@/hooks";

import type { FC } from "react";
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
  const { translate } = useConfig();

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
        placeholder={translate("UNLIMITED")}
        value={value}
        onChange={onChange}
        format={format}
      />
    </>
  );
};
