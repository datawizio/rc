import type DatePicker from "../DatePicker";
import type { FC, ComponentProps } from "react";
import type { CalendarType } from "@/types/calendar";
import type { DateType, DateRange } from "@/types/date";
import type { Overwrite } from "@/types/utils";

export type DatePickerPlaceholder = [string, string];

export type PresetsRangeType = {
  [key: string]: DateRange;
};

export type DateRangePickerProps = Overwrite<
  ComponentProps<typeof DatePicker.RangePicker>,
  {
    // Calendar settings
    type?: CalendarType;
    format?: string;
    dateFrom?: DateType;
    dateTo?: DateType;
    minDate?: DateType;
    maxDate?: DateType;
    currDateRange?: { date_from: DateType; date_to: DateType };

    // Preset settings
    ranges?: PresetsRangeType;
    presets?: string[];
    useCurrentDayPreset?: boolean;
    useDefaultPreset?: boolean;
    maxDateForPresets?: DateType;
    defaultPresetExceptions?: string[];

    // UI settings
    fullWidth?: boolean;
    allowEmpty?: [boolean, boolean];
    onClear?: () => void;
    placeholder?: DatePickerPlaceholder;
  }
>;

export type IDateRangePicker = {
  presets: DefaultPresetType;
} & FC<DateRangePickerProps>;

export type DefaultPresetHandler = (
  maxDate?: DateType,
  minDate?: DateType
) => DateRange;

export type DefaultPresetType = {
  readonly current_day?: () => DateRange;
  readonly last_update_date?: (maxDate?: DateType) => DateRange;
  readonly yesterday?: (maxDate?: DateType) => DateRange;
  readonly week_begin?: DefaultPresetHandler;
  readonly lastWeek?: DefaultPresetHandler;
  readonly last_30_days?: DefaultPresetHandler;
  readonly currentMonth?: DefaultPresetHandler;
  readonly last_90_days?: DefaultPresetHandler;
  readonly quarterBegin?: DefaultPresetHandler;
  readonly last_180_days?: DefaultPresetHandler;
  readonly last_364_days?: DefaultPresetHandler;
  readonly last_365_days?: DefaultPresetHandler;
  readonly currentYear?: DefaultPresetHandler;
  readonly allPeriod?: DefaultPresetHandler;
};

export type DefaultPresetPrevHandler = (
  dateFrom: DateType,
  dateTo: DateType
) => DateRange;

export type DefaultPresetPrevType = {
  readonly previous?: DefaultPresetPrevHandler;
  readonly prev_last_week?: DefaultPresetPrevHandler;
  readonly prev_last_month?: DefaultPresetPrevHandler;
  readonly same_weekday_prev_year?: DefaultPresetPrevHandler;
  readonly prev_last_quarter?: DefaultPresetPrevHandler;
  readonly prev_last_year?: DefaultPresetPrevHandler;
};
