import dayjsConfig from "@rc-component/picker/es/generate/dayjs";
import { calendarInfo } from "@/utils/calendar";
import { parseLocale } from "../utils/locale";

import type { Dayjs } from "dayjs";
import type { GenerateConfig } from "@rc-component/picker/es/generate";

export interface ISO8601CalendarConfig extends GenerateConfig<Dayjs> {
  type: "iso-8601";
}

const iso8601CalendarConfig: ISO8601CalendarConfig = Object.assign(
  { type: "iso-8601" as const },
  dayjsConfig
);

iso8601CalendarConfig.locale = Object.assign({}, iso8601CalendarConfig.locale);

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
