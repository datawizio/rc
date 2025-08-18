import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { DateType } from "@/types/date";

dayjs.extend(customParseFormat);

export const genPrevPeriod = (
  date_from: DateType,
  date_to: DateType,
  format: string = "DD-MM-YYYY"
): [DateType, DateType] => {
  if (!date_from || !date_to) return [null, null];

  const delta = dayjs(date_to, format).diff(dayjs(date_from, format), "d");

  const prev_date_to = dayjs(date_to, format)
    .subtract(delta + 1, "d")
    .format("DD-MM-YYYY");

  const prev_date_from = dayjs(prev_date_to, "DD-MM-YYYY")
    .subtract(delta, "d")
    .format("DD-MM-YYYY");

  return [prev_date_from, prev_date_to];
};

export const reverseDate = (date: DateType, separator: string = "-") => {
  if (typeof date !== "string") return date;
  return date && date.split(separator).reverse().join(separator);
};
