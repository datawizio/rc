import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import localeData from "dayjs/plugin/localeData";
import dayjsConfig from "@rc-component/picker/es/generate/dayjs";
import { fiscalCalendar } from "@/utils/fiscalCalendar";
import { formatYYYYMMFiscal } from "@/utils/calendar/format";
import { parseLocale } from "../utils/locale";

import type { Dayjs } from "dayjs";
import type { GenerateConfig } from "@rc-component/picker/es/generate";

dayjs.extend(isBetween);
dayjs.extend(localeData);

export interface FiscalCalendarConfig extends GenerateConfig<Dayjs> {
  type: "fiscal";
  locale: GenerateConfig<Dayjs>["locale"] & {
    getMonths?: (locale: string) => string[];
  };
}

export const fiscalCalendarConfig: FiscalCalendarConfig = Object.assign(
  { type: "fiscal" as const },
  dayjsConfig
);

fiscalCalendarConfig.locale = Object.assign({}, dayjsConfig.locale);

fiscalCalendarConfig.getEndDate = date => fiscalCalendar.getEndDate(date);
fiscalCalendarConfig.getYear = date => fiscalCalendar.getYear(date);

// Convert fiscal month index (0 = fiscal start month) back to calendar index
// expected by the picker (0 = Jan ... 11 = Dec), wrapping across year boundary.
fiscalCalendarConfig.getMonth = date => {
  return (fiscalCalendar.startMonth + fiscalCalendar.getMonth(date)) % 12;
};

// Return ordinal (1-based) within fiscal month so same day number in different
// calendar months (e.g. 25 Dec and 25 Jan) are distinct for hover/selection
fiscalCalendarConfig.getDate = date => {
  const startOfMonth = fiscalCalendar.getStartOfMonth(date);
  return date.diff(startOfMonth, "day") + 1;
};

// Use fiscal month navigation so header prev/next and grid base date are correct
fiscalCalendarConfig.addMonth = (date, offset) => {
  return fiscalCalendar.getNextMonth(date, offset);
};

// Map picker month index (Jan=0..Dec=11) to fiscal month index for this fiscal year.
// This keeps locale month labels correct and month cells aligned with fiscal periods.
fiscalCalendarConfig.setMonth = (date, month) => {
  const fiscalYear = fiscalCalendar.getYear(date);
  const januaryFiscalMonth = (12 - fiscalCalendar.startMonth) % 12;
  const januaryBase = fiscalCalendar.getStartOfMonthByNumber(
    fiscalYear,
    januaryFiscalMonth
  );

  return fiscalCalendar.getNextMonth(januaryBase, month);
};

// When the panel asks for "first day of month" (setDate(_, 1)), return start of fiscal month.
// For dateNum > 1, interpret as ordinal within fiscal month.
fiscalCalendarConfig.setDate = (date, dateNum) => {
  const startOfMonth = fiscalCalendar.getStartOfMonth(date);
  if (dateNum === 1) {
    return startOfMonth;
  }
  return startOfMonth.add(dateNum - 1, "day");
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

  if (format === "YYYY-MM") {
    return formatYYYYMMFiscal(date);
  }

  return date.locale(parseLocale(locale)).format(format);
};

fiscalCalendarConfig.locale.getMonths = locale => {
  const months = dayjs().locale(parseLocale(locale)).localeData().months();
  const res = [];
  for (let i = 0; i < 12; i++) {
    res.push(months[(fiscalCalendar.startMonth + i) % 12]);
  }
  return res;
};
