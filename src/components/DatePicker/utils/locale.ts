import type { ILocaleMapObject } from "@/types/calendar";

export const localeMap: ILocaleMapObject = {
  en_GB: "en-gb",
  en_US: "en",
  zh_CN: "zh-cn",
  zh_TW: "zh-tw"
};

export const parseLocale = (locale: string) => {
  return localeMap[locale] || locale.split("_")[0];
};
