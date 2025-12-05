import type { ReactNode } from "react";
import type { Dayjs } from "dayjs";
import type { SelectProps, FormRule, DatePickerProps } from "antd";
import type { SwitchSize } from "antd/es/switch";
import type { CalendarType } from "@/types/calendar";
import type { InfoTooltipProps } from "@/components/InfoTooltip";
import type { DrawerSelectProps } from "../DrawerSelect";
import type {
  DrawerTreeSelectProps,
  SelectValues
} from "../DrawerTreeSelect/types";

export interface IFormFieldChanged<Type> {
  name: string | string[];
  value: Type;
  selected?: any;
}

export interface FormFieldProps<Type> {
  name: string | string[];
  placeholder?: string;
  label?: ReactNode | string;
  rules?: FormRule[];
  initialValue?: any;
  disabled?: boolean;
  onChange?: (change: IFormFieldChanged<Type>) => void;
  onDeselect?: (param: string | number) => void;
  infoTooltip?: InfoTooltipProps;
}

export interface FieldIntervalProps extends FormFieldProps<IntervalType> {
  picker?: DatePickerProps["picker"];
  format?: string;
  minDate?: Dayjs;
  maxDate?: Dayjs;
}

export type IntervalType = {
  from: Dayjs | null;
  to: Dayjs | null;
};

export interface IntervalProps {
  picker?: DatePickerProps["picker"];
  format?: string;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  value?: IntervalType;
  onChange: (value: IntervalType) => void;
}

export interface IntervalItemProps {
  label: string;
  picker?: DatePickerProps["picker"];
  format?: string;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  value: Dayjs | null;
  onChange: (value: Dayjs) => void;
}

export type FieldDatePickerProps = FormFieldProps<Dayjs | null> &
  DatePickerProps & {
    format?: string;
    fullWidth?: boolean;
    inputReadOnly?: boolean;
    type?: CalendarType;
    disabledDate?: (currentDate: Dayjs) => boolean;
  };

export interface FieldTextProps extends FormFieldProps<string> {
  type?: string;
  autoComplete?: string;
}

export type FieldCheckboxProps = FormFieldProps<boolean>;

export interface FieldSwitchProps extends FormFieldProps<boolean> {
  size?: SwitchSize;
  checkedChildren?: ReactNode;
  unCheckedChildren?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  title?: string;
}

export type RadioOptionType = {
  value: any;
  label: string;
  disabled?: boolean;
};

export interface FieldRadioProps extends FormFieldProps<string> {
  options: RadioOptionType[];
}

export interface FieldSelectProps extends FormFieldProps<string> {
  options: RadioOptionType[];
  mode?: "multiple" | "tags";
  showSearch?: boolean;
  allowClear?: boolean;
  notFoundContent?: string;
  getPopupContainer?: SelectProps["getPopupContainer"];
}

export interface FieldSliderProps extends FormFieldProps<string | number> {
  min: number;
  max: number;
  step?: number;
}

export type EnableSelectValueType = {
  enabled: boolean;
  value: any;
};

export type FieldEnableSelectProps = FormFieldProps<EnableSelectValueType>;
export type FieldPhoneProps = FormFieldProps<string>;

export type FieldDrawerSelectProps = FormFieldProps<string | string[]> &
  DrawerSelectProps<SelectValues>;

export type FieldDrawerTreeSelectProps = FormFieldProps<string> &
  DrawerTreeSelectProps<SelectValues>;

export type FieldImageProps = FormFieldProps<string | null>;

export interface ImageProps {
  name: string | string[];
  value?: string;
  placeholder?: string;
  onChange?: (change: IFormFieldChanged<string | null>) => void;
}
