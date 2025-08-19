import DatePicker from "@/components/DatePicker";

import type { FC } from "react";
import type { Dayjs } from "dayjs";
import type { PickerTimeProps } from "antd/es/time-picker";

export type TimePickerProps = Omit<PickerTimeProps<Dayjs>, "picker">;

const TimePicker: FC<TimePickerProps> = props => {
  return <DatePicker {...props} picker="time" mode={undefined} />;
};

export default TimePicker;
