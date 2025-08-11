import type { Dispatch, SetStateAction } from "react";
import type { ButtonProps } from "antd";
import type { SelectProps, DefaultOptionType } from "antd/lib/select";

export interface CronProps {
  /**
   * Cron value, the component is by design a controlled component.
   * The first value will be the default value.
   */
  value: string;

  /**
   * Set the cron value, similar to onChange.
   * The naming tells you that you have to set the value by yourself.
   */
  setValue: SetValue;

  /**
   * Set the container className and used as a prefix for other selectors.
   * Available selectors: https://xrutayisire.github.io/react-js-cron/?path=/story/reactjs-cron--custom-style
   */
  className?: string;

  /**
   * Humanize the labels in the cron component, SUN-SAT and JAN-DEC.
   * @default true
   */
  humanizeLabels?: boolean;

  /**
   * Humanize the value, SUN-SAT and JAN-DEC.
   * @default false
   */
  humanizeValue?: boolean;

  /**
   * Add a "0" before numbers lower than 10.
   * @default false
   */
  leadingZero?: LeadingZero;

  /**
   * Define the default period when the default value is empty.
   * @default 'day'
   */
  defaultPeriod?: PeriodType;

  /**
   * Disable the cron component.
   * @default false
   */
  disabled?: boolean;

  /**
   * Make the cron component read-only.
   * @default false
   */
  readOnly?: boolean;

  /**
   * Define if empty should trigger an error.
   * @default 'for-default-value'
   */
  allowEmpty?: AllowEmpty;

  /**
   * Support cron shortcuts.
   * @default ['@yearly', '@annually', '@monthly', '@weekly', '@daily', '@midnight', '@hourly']
   */
  shortcuts?: Shortcuts;

  /**
   * Define the clock format.
   */
  clockFormat?: ClockFormat;

  /**
   * Display the clear button.
   * @default true
   */
  clearButton?: boolean;

  /**
   * AntDesign button props to customize the clear button.
   */
  clearButtonProps?: ClearButtonProps;

  /**
   * Define the clear button action.
   * @default 'fill-with-every'
   */
  clearButtonAction?: ClearButtonAction;

  /**
   * Display error style (red border and background).
   * @default true
   */
  displayError?: boolean;

  /**
   * Triggered when the cron component detects an error with the value.
   */
  onError?: OnError;

  /**
   * Define if a double click on a dropdown option should automatically
   * select / unselect periodicity.
   * @default true
   */
  periodicityOnDoubleClick?: boolean;

  /**
   * Define if it's possible to select only one or multiple values for each select.
   * When the mode is 'single', periodicityOnDoubleClick prop is ignored and set to false by default.
   * @default 'multiple'
   */
  mode?: Mode;

  /**
   * Change the component language.
   * Can also be used to remove prefix and suffix.
   *
   * When setting `humanizeLabels`, you can change the language of the
   * alternative labels with 'altWeekDays' and 'altMonths'.
   *
   * The order of the 'locale' properties 'weekDays', 'months', 'altMonths'
   * and 'altWeekDays' is important! The index will be used as a value.
   *
   * @default './locale.ts'
   */
  locale?: Locale;

  /**
   * The number of the day of the week on which the week starts.
   * Must be in the range from 1 to 7, where 1 is Monday and 7 is Sunday.
   * @default 7
   */
  startOfWeek?: number;

  withHours?: boolean;
  withMinutes?: boolean;
  defaultHour?: number;

  getPopupContainer?: () => HTMLElement;
}

export interface Locale {
  everyText?: string;
  emptyMonths?: string;
  emptyMonthDays?: string;
  emptyMonthDaysShort?: string;
  emptyWeekDays?: string;
  emptyWeekDaysShort?: string;
  emptyHours?: string;
  emptyMinutes?: string;
  emptyMinutesForHourPeriod?: string;
  yearOption?: string;
  monthOption?: string;
  weekOption?: string;
  dayOption?: string;
  hourOption?: string;
  minuteOption?: string;
  rebootOption?: string;
  prefixPeriod?: string;
  prefixMonths?: string;
  prefixMonthDays?: string;
  prefixWeekDays?: string;
  prefixWeekDaysForMonthAndYearPeriod?: string;
  prefixHours?: string;
  prefixMinutes?: string;
  prefixMinutesForHourPeriod?: string;
  suffixMinutesForHourPeriod?: string;
  errorInvalidCron?: string;
  clearButtonText?: string;
  weekDays?: string[];
  months?: string[];
  altWeekDays?: string[];
  altMonths?: string[];
}

export type SetValueFunction = (value: string, period: string) => void;
export type SetValue = SetValueFunction | Dispatch<SetStateAction<string>>;

export type CronError =
  | {
      type: "invalid_cron";
      description: string;
    }
  | undefined;

export type OnErrorFunction = (error: CronError) => void;

export type OnError =
  | OnErrorFunction
  | Dispatch<SetStateAction<CronError>>
  | undefined;

export type ClearButtonProps = Omit<ButtonProps, "onClick">;
export type ClearButtonAction = "empty" | "fill-with-every" | "to-default";

export type PeriodType =
  | "year"
  | "month"
  | "week"
  | "day"
  | "hour"
  | "minute"
  | "reboot";

export type AllowEmpty = "always" | "never" | "for-default-value";

export type CronType =
  | "period"
  | "months"
  | "month-days"
  | "week-days"
  | "hours"
  | "minutes";

export type LeadingZeroType = "month-days" | "hours" | "minutes";
export type LeadingZero = boolean | LeadingZeroType[];
export type ClockFormat = "24-hour-clock" | "12-hour-clock";

export type ShortcutsType =
  | "@yearly"
  | "@annually"
  | "@monthly"
  | "@weekly"
  | "@daily"
  | "@midnight"
  | "@hourly"
  | "@reboot";

export type Shortcuts = boolean | ShortcutsType[];
export type Mode = "multiple" | "single";

export interface FieldProps {
  value?: number[];
  setValue: SetValueNumbersOrUndefined;
  locale: Locale;
  className?: string;
  disabled: boolean;
  readOnly: boolean;
  period: PeriodType;
  periodicityOnDoubleClick: boolean;
  mode: Mode;
  withHours?: boolean;
  withMinutes?: boolean;
  getPopupContainer?: () => HTMLElement;
}

export interface PeriodProps
  extends Omit<
    FieldProps,
    "value" | "setValue" | "period" | "periodicityOnDoubleClick" | "mode"
  > {
  value: PeriodType;
  setValue: SetValuePeriod;
  shortcuts: Shortcuts;
}

export interface MonthsProps extends FieldProps {
  humanizeLabels: boolean;
}

export interface MonthDaysProps extends FieldProps {
  weekDays?: number[];
  leadingZero: LeadingZero;
}

export interface WeekDaysProps extends FieldProps {
  humanizeLabels: boolean;
  monthDays?: number[];
  startOfWeek?: number;
}

export interface HoursProps extends FieldProps {
  leadingZero: LeadingZero;
  clockFormat?: ClockFormat;
}

export interface MinutesProps extends FieldProps {
  leadingZero: LeadingZero;
  clockFormat?: ClockFormat;
}

export interface CustomSelectProps
  extends Omit<
    SelectProps,
    | "mode"
    | "tokenSeparators"
    | "allowClear"
    | "virtual"
    | "onClick"
    | "onBlur"
    | "tagRender"
    | "dropdownRender"
    | "showSearch"
    | "showArrow"
    | "onChange"
    | "dropdownMatchSelectWidth"
    | "options"
    | "onSelect"
    | "onDeselect"
  > {
  grid?: boolean;
  setValue: SetValueNumbersOrUndefined;
  optionsList?: string[];
  locale: Locale;
  value?: number[];
  humanizeLabels?: boolean;
  disabled: boolean;
  readOnly: boolean;
  leadingZero?: LeadingZero;
  clockFormat?: ClockFormat;
  period: PeriodType;
  unit: Unit;
  periodicityOnDoubleClick: boolean;
  mode: Mode;
  sortOptionsList?: (a: DefaultOptionType, b: DefaultOptionType) => number;
}

export type SetValueNumbersOrUndefined = Dispatch<
  SetStateAction<number[] | undefined>
>;

export type SetValuePeriod = Dispatch<SetStateAction<PeriodType | undefined>>;
export type SetInternalError = Dispatch<SetStateAction<boolean>>;

export interface DefaultLocale {
  everyText: string;
  emptyMonths: string;
  emptyMonthDays: string;
  emptyMonthDaysShort: string;
  emptyWeekDays: string;
  emptyWeekDaysShort: string;
  emptyHours: string;
  emptyMinutes: string;
  emptyMinutesForHourPeriod: string;
  yearOption: string;
  monthOption: string;
  weekOption: string;
  dayOption: string;
  hourOption: string;
  minuteOption: string;
  rebootOption: string;
  prefixPeriod: string;
  prefixMonths: string;
  prefixMonthDays: string;
  prefixWeekDays: string;
  prefixWeekDaysForMonthAndYearPeriod: string;
  prefixHours: string;
  prefixMinutes: string;
  prefixMinutesForHourPeriod: string;
  suffixMinutesForHourPeriod: string;
  errorInvalidCron: string;
  clearButtonText: string;
  weekDays: string[];
  months: string[];
  altWeekDays: string[];
  altMonths: string[];
}

export type CronValues = { [key in CronType]: number[] | string | undefined };

export interface ShortcutsValues {
  name: ShortcutsType;
  value: string;
}

export interface Unit {
  type: CronType;
  min: number;
  max: number;
  total: number;
  alt?: string[];
}

export interface Clicks {
  time: number;
  value: number;
}
