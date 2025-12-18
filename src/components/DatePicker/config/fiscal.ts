import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import localeData from "dayjs/plugin/localeData";
import dayjsConfig from "rc-picker/es/generate/dayjs";
import { fiscalCalendar } from "@/utils/fiscalCalendar";
import { parseLocale } from "../utils/locale";

import type { Dayjs } from "dayjs";
import type { GenerateConfig } from "rc-picker/es/generate";

dayjs.extend(isBetween);
dayjs.extend(localeData);

export interface FiscalCalendarConfig extends GenerateConfig<Dayjs> {
  type?: "fiscal";
  getMonths?: (locale: string) => string[];
  getStartOfMonth?: (date: Dayjs) => Dayjs;
  getMonthWeeksCount?: (date: Dayjs) => number;
  getNextMonth?: (date: Dayjs, offset: number) => Dayjs;
  locale: GenerateConfig<Dayjs>["locale"] & {
    getMonths?: (locale: string) => string[];
  };
}

export const fiscalCalendarConfig: FiscalCalendarConfig = Object.assign(
  {},
  dayjsConfig
);

fiscalCalendarConfig.type = "fiscal";
fiscalCalendarConfig.locale = Object.assign({}, dayjsConfig.locale);
fiscalCalendarConfig.getEndDate = date => fiscalCalendar.getEndDate(date);
fiscalCalendarConfig.getYear = date => fiscalCalendar.getYear(date);
fiscalCalendarConfig.getMonth = date => fiscalCalendar.getMonth(date);

fiscalCalendarConfig.getStartOfMonth = date => {
  return fiscalCalendar.getStartOfMonth(date);
};

fiscalCalendarConfig.getMonthWeeksCount = date => {
  return fiscalCalendar.getMonthWeeksCount(date);
};

fiscalCalendarConfig.getNextMonth = (date, offset) => {
  return fiscalCalendar.getNextMonth(date, offset);
};

fiscalCalendarConfig.locale.format = (locale, date, format) => {
  if (format === "YYYY") {
    let y1 = fiscalCalendar.getYear(date);

    if (fiscalCalendar.calendar) {
      Object.entries(fiscalCalendar.calendar).forEach(([key, value]) => {
        if (date.isBetween(value.from, value.to, "day")) {
          y1 = Number(key);
        }
      });
    }

    const y2 = y1 + 1;
    return `${y1}/${y2}`;
  }
  return date.locale(parseLocale(locale)).format(format);
};

fiscalCalendarConfig.locale.getShortMonths = locale => {
  const months = dayjs().locale(parseLocale(locale)).localeData().monthsShort();
  const res = [];
  for (let i = 0; i < 12; i++) {
    res.push(months[(fiscalCalendar.startMonth + i) % 12]);
  }
  return res;
};

fiscalCalendarConfig.locale.getMonths = locale => {
  const months = dayjs().locale(parseLocale(locale)).localeData().months();
  const res = [];
  for (let i = 0; i < 12; i++) {
    res.push(months[(fiscalCalendar.startMonth + i) % 12]);
  }
  return res;
};
