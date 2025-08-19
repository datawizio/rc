import { DatePicker as AntDatePicker } from "antd";
import { iso8601CalendarConfig } from "./config/iso8601";
import { fiscalCalendarConfig } from "./config/fiscal";

import type { Dayjs } from "dayjs";
import type { IDatePicker } from "./types";

import "./index.less";

const DatePicker = AntDatePicker.generatePicker<Dayjs>(
  iso8601CalendarConfig
) as IDatePicker;

DatePicker.Picker = {
  "fiscal": AntDatePicker.generatePicker<Dayjs>(fiscalCalendarConfig),
  "iso-8601": AntDatePicker.generatePicker<Dayjs>(iso8601CalendarConfig)
};

export default DatePicker;
