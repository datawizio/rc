import { useMemo } from "react";
import { useConfig } from "@/hooks/useConfig";

import type { PickerLocale } from "antd/es/date-picker/generatePicker";
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

const resolveFormat = (format?: string | string[]) => {
  if (!format) return undefined;
  if (typeof format === "string") return format;
  if (Array.isArray(format)) return format[0];
};

/**
 * Builds a picker locale whose calendar cell hover title follows the component `format`.
 *
 * @param format - The format to use for the date picker.
 * @param locale - The locale to use for the date picker.
 */
export const usePickerLocale = (
  format?: string | string[],
  locale?: PickerLocale
) => {
  const { locale: contextLocale } = useConfig();
  const fieldDateFormat = resolveFormat(format);

  return useMemo(() => {
    if (!fieldDateFormat) return locale;
    const datePickerLocale = contextLocale?.DatePicker;

    return {
      ...datePickerLocale,
      ...locale,
      lang: {
        ...datePickerLocale?.lang,
        ...locale?.lang,
        fieldDateFormat
      }
    } as PickerLocale;
  }, [contextLocale, locale, fieldDateFormat]);
};
