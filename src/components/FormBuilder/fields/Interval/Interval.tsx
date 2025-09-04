import { IntervalItem } from "./IntervalItem";
import { useConfig } from "@/hooks";

import type { FC } from "react";
import type { Dayjs } from "dayjs";
import type { IntervalProps } from "../../types";

export const Interval: FC<IntervalProps> = ({
  value,
  format,
  onChange,
  minDate,
  maxDate,
  picker
}) => {
  const { translate } = useConfig();

  const handleFromChange = (from: Dayjs) => {
    onChange({ from, to: value ? value.to : null });
  };

  const handleToChange = (to: Dayjs) => {
    onChange({ to, from: value ? value.from : null });
  };
  return (
    <>
      <IntervalItem
        minDate={minDate}
        maxDate={value?.to || maxDate}
        picker={picker}
        label={translate("FROM")}
        value={value ? value.from : null}
        onChange={handleFromChange}
        format={format}
      />
      <IntervalItem
        picker={picker}
        format={format}
        label={translate("TO")}
        onChange={handleToChange}
        minDate={value?.from || minDate}
        value={value ? value.to : null}
      />
    </>
  );
};
