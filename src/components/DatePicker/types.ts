import type generatePicker from "antd/es/date-picker/generatePicker";
import type { Dayjs } from "dayjs";
import type { CalendarType } from "@/types/calendar";

export interface DatePickerPickers {
  [key: string]: ReturnType<typeof generatePicker<Dayjs>>;
}

export interface IDatePicker extends ReturnType<typeof generatePicker<Dayjs>> {
  Picker: DatePickerPickers;
}

export interface DatePickerWrapperProps {
  type?: CalendarType;
}
