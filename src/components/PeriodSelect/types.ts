import type { Dayjs } from "dayjs";
import type { CalendarType } from "@/types/calendar";
import type { DatePickerPlaceholder } from "@/components/DateRangePicker/types";
import type { DateRange } from "@/types/date";

export interface DateRangeType<DT extends string | Dayjs = string> {
  startDate: DT | null;
  endDate: DT | null;
}

export interface IDateConfig {
  datePicker: DateRangeType;
  prevDatePicker: DateRangeType;
  selectedPeriod: PeriodEnum;
  selectedPrevPeriod: PrevPeriodEnum;
}

export type PeriodAvailable = {
  [key in PeriodEnum]: PrevPeriodEnum[];
};

export type PeriodAvailableForDates = {
  [key in periodsForDatesEnum]: PrevPeriodEnum[];
};

export type PeriodOption = keyof PeriodAvailable;

export type AvailablePresets<T> = { include?: T[]; exclude?: T[] };

export type PrevPeriodConfigOption = {
  type?: CalendarType;
  period?: AvailablePresets<PeriodEnum>;
  dates?: AvailablePresets<periodsForDatesEnum>;
};

export type PrevPeriodConfig = {
  [key in PrevPeriodEnum]: PrevPeriodConfigOption;
};

export type Period = {
  [key in PeriodEnum]: PrevPeriodEnum[];
};

export type PeriodEnum =
  | "last_update_date"
  | "penultimate_update_date"
  | "last_7_days"
  | "prev_week"
  | "week_begin"
  | "month_begin"
  | "prev_month"
  | "quarter_begin"
  | "prev_quarter"
  | "year_begin"
  | "current_day"
  | "current_week"
  | "current_month"
  | "current_quarter"
  | "current_year"
  | "last_30_days"
  | "last_90_days"
  | "last_180_days"
  | "last_365_days"
  | "prev_year"
  | "all_time"
  | "date";

export type PrevPeriodEnum =
  | "previous"
  | "prev_last_week"
  | "prev_last_month"
  | "prev_last_quarter"
  | "prev_last_year"
  | "same_weekday_prev_year"
  | "prev_date";

export type periodsForDatesEnum =
  | "week"
  | "month"
  | "quarter"
  | "year"
  | "date";

export type ConfigurableDatePickerPlaceholder = (config: {
  isPickerEmpty: boolean;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}) => DatePickerPlaceholder | undefined;

export interface PeriodSelectProps {
  type: CalendarType;
  format?: string;
  clientDate?: string;
  clientStartDate?: string;
  periodLabel?: string;
  limitMaxDate?: boolean;
  prevPeriodLabel?: string;
  dateConfig?: IDateConfig;
  onChange?: (dateConfig: IDateConfig) => void;
  allowEmptyEndDate?: boolean;
  datePickerPlaceholder?:
    | DatePickerPlaceholder
    | ConfigurableDatePickerPlaceholder;
}

export type GetPeriod = (config: {
  periodKey?: PeriodEnum;
  date?: DateRange | null;
  clientDate?: string;
  clientStartDate?: string;
}) => DateRangeType;
