import { fiscalCalendar } from "../fiscalCalendar";

import type { Dayjs } from "dayjs";
import type { CalendarType } from "@/types/calendar";

class Calendar {
  public type: CalendarType = "iso-8601";
  public startMonth: number = 0;
  public startWeek: number = 1;

  public setCalendarInfo(
    type: CalendarType,
    startMonth: number,
    startWeek: number,
    pattern: string
  ) {
    this.type = type;
    this.startMonth = startMonth - 1;
    this.startWeek = startWeek === 7 ? 0 : startWeek;

    if (type === "fiscal") {
      fiscalCalendar.setCalendarInfo(startMonth, startWeek, pattern);
    }
  }

  public getStartOfYear(date: Dayjs) {
    if (this.type === "fiscal") {
      return fiscalCalendar.getStartOfYear(date);
    }

    if (calendarInfo.startMonth > date.month()) {
      date = date.year(date.year() - 1);
    }

    return date.date(1).month(calendarInfo.startMonth);
  }

  public getStartOfWeek(date: Dayjs) {
    const diff = (date.day() - this.startWeek + 7) % 7;
    return date.subtract(diff, "day");
  }

  public getStartOfQuarter(date: Dayjs) {
    if (this.type === "fiscal") {
      return fiscalCalendar.getStartOfQuarter(date);
    }

    let startQuarter = this.getStartOfYear(date);

    while (!startQuarter.add(3, "month").isAfter(date)) {
      startQuarter = startQuarter.add(3, "month");
    }

    return startQuarter;
  }
}

export const calendarInfo = new Calendar();
