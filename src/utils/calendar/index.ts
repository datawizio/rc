import { Dayjs } from "dayjs";
import { fiscalCalendar } from "../fiscalCalendar";
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

    return date.month(calendarInfo.startMonth).date(1);
  }
}

export const calendarInfo = new Calendar();
