import type { DefaultLocale } from "./types";

export const DEFAULT_LOCALE_EN: DefaultLocale = {
  everyText: "every",
  emptyMonths: "every month",
  emptyMonthDays: "every day of the month",
  emptyMonthDaysShort: "day of the month",
  emptyWeekDays: "every day of the week",
  emptyWeekDaysShort: "day of the week",
  emptyHours: "every hour",
  emptyMinutes: "every minute",
  emptyMinutesForHourPeriod: "every",
  yearOption: "year",
  monthOption: "month",
  weekOption: "week",
  dayOption: "day",
  hourOption: "hour",
  minuteOption: "minute",
  rebootOption: "reboot",
  prefixPeriod: "Every",
  prefixMonths: "in",
  prefixMonthDays: "on",
  prefixWeekDays: "on",
  prefixWeekDaysForMonthAndYearPeriod: "and",
  prefixHours: "at",
  prefixMinutes: ":",
  prefixMinutesForHourPeriod: "at",
  suffixMinutesForHourPeriod: "minute(s)",
  errorInvalidCron: "Invalid cron expression",
  clearButtonText: "Clear",

  // Order is important, the index will be used as value
  // Sunday must always be first, it's "0"
  weekDays: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ],

  // Order is important, the index will be used as value
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],

  // Order is important, the index will be used as value
  // Sunday must always be first, it's "0"
  altWeekDays: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],

  // Order is important, the index will be used as value
  altMonths: [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC"
  ]
};
