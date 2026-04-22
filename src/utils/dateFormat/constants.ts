import { ClientDateFormat } from "./index";

const fullDate = new ClientDateFormat();
const fulleDateWithDots = new ClientDateFormat(undefined, { separator: "." });
const yearMonthDate = new ClientDateFormat({ year: "YYYY", month: "MM" });

const STATIC_DATE_FORMATS = {
  DATE: () => `${fullDate}`,
  DATE_WITH_DOTS: () => `${fulleDateWithDots}`,
  DATE_TIME: () => `${fullDate} HH:mm:ss`,
  DATE_TIME_SHORT: () => `${fullDate} HH:mm`,
  DATE_TIME_WITH_PIPE: () => `${fullDate} | HH:mm`,
  YEAR: () => "YYYY",
  YEAR_MONTH: () => `${yearMonthDate}`,
  API_DATE: () => "YYYY-MM-DD",
  API_DATE_TIME: () => "YYYY-MM-DD HH:mm:ss"
};

export const DATE_FORMATS = new Proxy(STATIC_DATE_FORMATS, {
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver).call(this);
  }
}) as unknown as {
  [K in keyof typeof STATIC_DATE_FORMATS]: string;
};
