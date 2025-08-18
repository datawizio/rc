import dayjsConfig from "rc-picker/es/generate/dayjs";
import { calendarInfo } from "@/utils/calendar";
import { parseLocale } from "../utils/locale";

import type { Dayjs } from "dayjs";
import type { GenerateConfig } from "rc-picker/es/generate";

export interface ISO8601CalendarConfig extends GenerateConfig<Dayjs> {
  getStartOfMonth?: (date: Dayjs) => Dayjs;
}

const iso8601CalendarConfig: ISO8601CalendarConfig = Object.assign(
  {},
  dayjsConfig
);

iso8601CalendarConfig.locale = Object.assign({}, iso8601CalendarConfig.locale);

iso8601CalendarConfig.isAfter = (date1, date2) => {
  return date1.isAfter(date2);
};

iso8601CalendarConfig.getStartOfMonth = date => {
  return dayjsConfig.setDate(date, 1);
};

iso8601CalendarConfig.locale.format = (locale, date, format) => {
  if (format === "YYYY" && calendarInfo.startMonth !== 0) {
    const y1 =
      calendarInfo.startMonth > date.month() ? date.year() - 1 : date.year();

    const y2 = y1 + 1;
    return `${y1}/${y2}`;
  }
  return date.locale(parseLocale(locale)).format(format);
};

export { iso8601CalendarConfig };
