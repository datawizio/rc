import dayjs from "dayjs";
import i18next, { type TFunction } from "i18next";
import { capitalize } from "lodash";

export const formatDateTime = (
  dateOrigin: string | dayjs.Dayjs,
  translate: TFunction
) => {
  const dateFormat = "DD.MM.YYYY";
  const timeFormat = "HH:mm";

  const today = dayjs().format(dateFormat);
  const yesterday = dayjs().subtract(1, "day").format(dateFormat);

  const date = dayjs(dateOrigin).format(dateFormat);
  const time = dayjs(dateOrigin).format(timeFormat);

  const at = translate("AT");

  switch (date) {
    case today:
      return `${capitalize(translate("TODAY"))} ${at} ${time}`;
    case yesterday:
      return `${capitalize(translate("YESTERDAY"))} ${at} ${time}`;
    default:
      return `${date} ${time}`;
  }
};

export const generateDays = (count: number = 31) => {
  return Array.from({ length: count }, (_, idx) => {
    const day = idx + 1;
    return {
      value: day,
      label: day.toString()
    };
  });
};

export const monthsList = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER"
];

export const generateMonths = () => {
  return monthsList.map((month, idx) => {
    return {
      value: idx + 1,
      label: i18next.t(month)
    };
  });
};

export const generateYears = (count: number = 100) => {
  const currentYear = new Date().getFullYear();

  return Array.from({ length: count }, (_, i) => {
    const year = currentYear - i;
    return {
      label: year,
      value: year.toString()
    };
  });
};
