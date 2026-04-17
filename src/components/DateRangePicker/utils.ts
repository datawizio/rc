import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ClientDateFormat } from "@/utils/clientDateFormat";
import type { DateType } from "@/types/date";

dayjs.extend(customParseFormat);

const DEFAULT_DATE_FORMAT = new ClientDateFormat();

export const genPrevPeriod = (
  date_from: DateType,
  date_to: DateType,
  format: string = DEFAULT_DATE_FORMAT.toString()
): [DateType, DateType] => {
  if (!date_from || !date_to) return [null, null];

  const outputFormat = DEFAULT_DATE_FORMAT.toString();
  const delta = dayjs(date_to, format).diff(dayjs(date_from, format), "d");

  const prev_date_to = dayjs(date_to, format)
    .subtract(delta + 1, "d")
    .format(outputFormat);

  const prev_date_from = dayjs(prev_date_to, outputFormat)
    .subtract(delta, "d")
    .format(outputFormat);

  return [prev_date_from, prev_date_to];
};
