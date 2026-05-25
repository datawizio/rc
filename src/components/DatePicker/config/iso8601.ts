import dayjsConfig from "@rc-component/picker/es/generate/dayjs";
import { parseLocale } from "../utils/locale";

import type { Dayjs } from "dayjs";
import type { GenerateConfig } from "@rc-component/picker/es/generate";

export interface ISO8601CalendarConfig extends GenerateConfig<Dayjs> {
  type: "iso-8601";
}

const iso8601CalendarConfig: ISO8601CalendarConfig = Object.assign(
  { type: "iso-8601" as const },
  dayjsConfig
);

iso8601CalendarConfig.locale = Object.assign({}, iso8601CalendarConfig.locale);

iso8601CalendarConfig.locale.format = (locale, date, format) => {
  return date.locale(parseLocale(locale)).format(format);
};

export { iso8601CalendarConfig };
