import dayjs from "dayjs";
import { calendarInfo } from "@/utils/calendar";
import {
  AVAILABLE_PERIODS_FOR_DATES,
  CUSTOM_PERIOD_KEY,
  CUSTOM_PREV_PERIOD_KEY,
  DEFAULT_PERIOD,
  DEFAULT_PREV_PERIOD,
  FORMATTED_PATTERN,
  PERIOD_AVAILABLE,
  PREV_PERIOD_CONFIG
} from "./constants";

import type { ActionDispatch } from "react";
import type { Dayjs } from "dayjs";
import type { CalendarType } from "@/types/calendar";
import type { DateRange } from "@/types/date";
import type { IUserPeriodSelect } from "./hooks/usePeriodSelect";
import type {
  DateRangeType,
  GetPeriod,
  IDateConfig,
  PeriodEnum,
  PrevPeriodEnum
} from "./types";

const startOfWeek = (date: Dayjs) => {
  return calendarInfo.getStartOfWeek(date);
};

const endOfWeek = (date: Dayjs) => {
  return calendarInfo.getStartOfWeek(date).add(6, "day");
};

const startOfYear = (date: Dayjs) => {
  return calendarInfo.getStartOfYear(date);
};

const endOfYear = (date: Dayjs) => {
  return calendarInfo.getStartOfYear(date).add(1, "year").subtract(1, "day");
};

const startOfQuarter = (date: Dayjs) => {
  return calendarInfo.getStartOfQuarter(date);
};

const endOfQuarter = (date: Dayjs) => {
  return calendarInfo
    .getStartOfQuarter(date)
    .add(3, "month")
    .subtract(1, "day");
};

export const getPrevPeriod = ({
  date,
  prev_period,
  clientDate,
  period
}: {
  date: PeriodEnum | DateRange;
  period: DateRangeType | null;
  clientDate: string;
  prev_period: PrevPeriodEnum | null;
}) => {
  const newPrevPeriod: DateRangeType<Dayjs> = {
    startDate: null,
    endDate: null
  };

  switch (date) {
    case "last_update_date": {
      newPrevPeriod.startDate = dayjs(clientDate).subtract(1, "day");
      newPrevPeriod.endDate = dayjs(clientDate).subtract(1, "day");
      break;
    }

    case "penultimate_update_date": {
      newPrevPeriod.startDate = dayjs(clientDate).subtract(2, "day");
      newPrevPeriod.endDate = dayjs(clientDate).subtract(2, "day");
      break;
    }

    case "last_7_days": {
      newPrevPeriod.startDate = dayjs(clientDate).subtract(13, "day");
      newPrevPeriod.endDate = dayjs(clientDate).subtract(7, "day");
      break;
    }

    case "prev_week": {
      newPrevPeriod.startDate = startOfWeek(dayjs(clientDate)).subtract(
        2,
        "week"
      );
      newPrevPeriod.endDate = endOfWeek(newPrevPeriod.startDate);
      break;
    }

    case "week_begin": {
      newPrevPeriod.startDate = startOfWeek(dayjs(clientDate)).subtract(
        1,
        "week"
      );
      newPrevPeriod.endDate = dayjs(clientDate).subtract(1, "week");
      break;
    }

    case "month_begin": {
      newPrevPeriod.startDate = dayjs(clientDate)
        .startOf("month")
        .subtract(1, "month");
      newPrevPeriod.endDate = dayjs(clientDate).subtract(1, "month");
      break;
    }

    case "prev_month": {
      newPrevPeriod.startDate = dayjs(clientDate)
        .startOf("month")
        .subtract(2, "month");
      newPrevPeriod.endDate = dayjs(newPrevPeriod.startDate).endOf("month");
      break;
    }

    case "quarter_begin": {
      newPrevPeriod.startDate = startOfQuarter(dayjs(clientDate)).subtract(
        1,
        "quarter"
      );
      newPrevPeriod.endDate = dayjs(clientDate).subtract(1, "quarter");
      break;
    }

    case "prev_quarter": {
      const quarterStart = startOfQuarter(dayjs(clientDate));
      newPrevPeriod.startDate = quarterStart.subtract(2, "quarter");

      newPrevPeriod.endDate = quarterStart
        .subtract(1, "quarter")
        .subtract(1, "day");

      break;
    }

    case "year_begin": {
      newPrevPeriod.startDate = startOfYear(dayjs(clientDate)).subtract(
        1,
        "year"
      );

      newPrevPeriod.endDate = dayjs(clientDate).subtract(1, "year");
      break;
    }

    case "current_day": {
      newPrevPeriod.startDate = dayjs().subtract(1, "day");
      newPrevPeriod.endDate = dayjs().subtract(1, "day");
      break;
    }

    case "current_week": {
      newPrevPeriod.startDate = startOfWeek(dayjs()).subtract(1, "week");
      newPrevPeriod.endDate = endOfWeek(dayjs()).subtract(1, "week");
      break;
    }

    case "current_month": {
      newPrevPeriod.startDate = dayjs().startOf("month").subtract(1, "month");
      newPrevPeriod.endDate = dayjs().endOf("month").subtract(1, "month");
      break;
    }

    case "current_quarter": {
      newPrevPeriod.startDate = startOfQuarter(dayjs()).subtract(1, "quarter");
      newPrevPeriod.endDate = endOfQuarter(dayjs()).subtract(1, "quarter");
      break;
    }

    case "current_year": {
      newPrevPeriod.startDate = startOfYear(dayjs()).subtract(1, "year");
      newPrevPeriod.endDate = endOfYear(dayjs()).subtract(1, "year");
      break;
    }

    case "last_30_days": {
      newPrevPeriod.startDate = dayjs(clientDate).subtract(59, "day");
      newPrevPeriod.endDate = dayjs(clientDate).subtract(30, "day");
      break;
    }

    case "last_90_days": {
      newPrevPeriod.startDate = dayjs(clientDate).subtract(179, "day");
      newPrevPeriod.endDate = dayjs(clientDate).subtract(90, "day");
      break;
    }

    case "last_180_days": {
      newPrevPeriod.startDate = dayjs(clientDate).subtract(359, "day");
      newPrevPeriod.endDate = dayjs(clientDate).subtract(180, "day");
      break;
    }

    case "last_365_days": {
      newPrevPeriod.startDate = dayjs(clientDate).subtract(729, "day");
      newPrevPeriod.endDate = dayjs(clientDate).subtract(365, "day");
      break;
    }

    case "prev_year": {
      const prevYearStart = startOfYear(dayjs(clientDate)).subtract(2, "year");

      newPrevPeriod.startDate = prevYearStart;
      newPrevPeriod.endDate = endOfYear(prevYearStart);

      break;
    }

    default: {
      const startPickerDate = date[0];
      const endPickerDate = date[1] ?? clientDate;

      const diff = dayjs(endPickerDate).diff(startPickerDate, "day");
      newPrevPeriod.startDate = dayjs(startPickerDate).subtract(
        diff + 1,
        "day"
      );
      newPrevPeriod.endDate = dayjs(startPickerDate).subtract(1, "day");
      break;
    }
  }

  const periodEnd = period?.endDate ?? clientDate;

  switch (prev_period) {
    case "prev_last_week": {
      newPrevPeriod.startDate = dayjs(period?.startDate).subtract(1, "week");
      newPrevPeriod.endDate = dayjs(periodEnd).subtract(1, "week");
      break;
    }

    case "prev_last_month": {
      newPrevPeriod.startDate = dayjs(period?.startDate).subtract(1, "month");
      newPrevPeriod.endDate = dayjs(periodEnd).subtract(1, "month");
      break;
    }

    case "prev_last_quarter": {
      newPrevPeriod.startDate = dayjs(period?.startDate).subtract(1, "quarter");
      newPrevPeriod.endDate = dayjs(periodEnd).subtract(1, "quarter");
      break;
    }

    case "same_weekday_prev_year": {
      newPrevPeriod.startDate = dayjs(period?.startDate).subtract(52, "week");
      newPrevPeriod.endDate = dayjs(periodEnd).subtract(52, "week");
      break;
    }

    case "prev_last_year": {
      const diff = dayjs(periodEnd).diff(period?.startDate, "day");
      newPrevPeriod.startDate = dayjs(period?.startDate).subtract(1, "year");
      newPrevPeriod.endDate = dayjs(newPrevPeriod.startDate).add(+diff, "day");
      break;
    }

    case "prev_date": {
      newPrevPeriod.startDate = dayjs(date[0]);
      newPrevPeriod.endDate = dayjs(date[1]);
      break;
    }

    default: {
      // If selected previous do nothing
      break;
    }
  }

  if (newPrevPeriod.startDate && newPrevPeriod.endDate) {
    return {
      startDate: newPrevPeriod.startDate.format(FORMATTED_PATTERN),
      endDate: newPrevPeriod.endDate.format(FORMATTED_PATTERN)
    };
  }
};

export const getPeriod: GetPeriod = ({
  periodKey,
  date = null,
  clientDate,
  clientStartDate
}) => {
  const newPeriod: DateRangeType<Dayjs> = {
    startDate: null,
    endDate: null
  };

  switch (periodKey) {
    case "last_update_date": {
      newPeriod.startDate = dayjs(clientDate);
      newPeriod.endDate = dayjs(clientDate);
      break;
    }

    case "penultimate_update_date": {
      const lastDay = dayjs(clientDate).subtract(1, "day");
      newPeriod.startDate = lastDay;
      newPeriod.endDate = lastDay;
      break;
    }

    case "last_7_days": {
      newPeriod.endDate = dayjs(clientDate);
      newPeriod.startDate = dayjs(clientDate).subtract(6, "day");
      break;
    }

    case "prev_week": {
      newPeriod.startDate = startOfWeek(dayjs(clientDate)).subtract(1, "week");
      newPeriod.endDate = endOfWeek(newPeriod.startDate);
      break;
    }

    case "week_begin": {
      newPeriod.startDate = startOfWeek(dayjs(clientDate));
      newPeriod.endDate = dayjs(clientDate);
      break;
    }

    case "month_begin": {
      newPeriod.startDate = dayjs(clientDate).startOf("month");
      newPeriod.endDate = dayjs(clientDate);
      break;
    }

    case "prev_month": {
      newPeriod.startDate = dayjs(clientDate)
        .startOf("month")
        .subtract(1, "month");

      newPeriod.endDate = dayjs(newPeriod.startDate).endOf("month");
      break;
    }

    case "quarter_begin": {
      newPeriod.startDate = startOfQuarter(dayjs(clientDate));
      newPeriod.endDate = dayjs(clientDate);
      break;
    }

    case "current_day": {
      newPeriod.startDate = dayjs();
      newPeriod.endDate = dayjs();
      break;
    }

    case "current_week": {
      newPeriod.startDate = startOfWeek(dayjs());
      newPeriod.endDate = endOfWeek(dayjs());
      break;
    }

    case "current_month": {
      newPeriod.startDate = dayjs().startOf("month");
      newPeriod.endDate = dayjs().endOf("month");
      break;
    }

    case "current_quarter": {
      newPeriod.startDate = startOfQuarter(dayjs());
      newPeriod.endDate = endOfQuarter(dayjs());
      break;
    }

    case "current_year": {
      newPeriod.startDate = startOfYear(dayjs());
      newPeriod.endDate = endOfYear(dayjs());
      break;
    }

    case "prev_quarter": {
      const quarterStart = startOfQuarter(dayjs(clientDate));
      newPeriod.startDate = quarterStart.subtract(1, "quarter");

      newPeriod.endDate = quarterStart.subtract(1, "day");

      break;
    }

    case "year_begin": {
      newPeriod.startDate = startOfYear(dayjs(clientDate));
      newPeriod.endDate = dayjs(clientDate);
      break;
    }

    case "last_30_days": {
      newPeriod.startDate = dayjs(clientDate).subtract(29, "day");
      newPeriod.endDate = dayjs(clientDate);
      break;
    }

    case "last_90_days": {
      newPeriod.startDate = dayjs(clientDate).subtract(89, "day");
      newPeriod.endDate = dayjs(clientDate);
      break;
    }

    case "last_180_days": {
      newPeriod.startDate = dayjs(clientDate).subtract(179, "day");
      newPeriod.endDate = dayjs(clientDate);
      break;
    }

    case "last_365_days": {
      newPeriod.startDate = dayjs(clientDate).subtract(364, "day");
      newPeriod.endDate = dayjs(clientDate);
      break;
    }

    case "prev_year": {
      const yearStart = startOfYear(dayjs(clientDate));
      newPeriod.startDate = yearStart.subtract(1, "year");
      newPeriod.endDate = yearStart.subtract(1, "day");
      break;
    }

    case "all_time": {
      const last_update_date = dayjs().format("YYYY-MM-DD");

      const startDate =
        clientStartDate && clientStartDate > last_update_date
          ? last_update_date
          : clientStartDate;

      newPeriod.startDate = dayjs(startDate);
      newPeriod.endDate = dayjs(clientDate);
      break;
    }

    case "date": {
      const [startCustomDate, endCustomDate] = date ?? [null, null];
      newPeriod.startDate = startCustomDate;
      newPeriod.endDate = endCustomDate;
      break;
    }

    default:
      break;
  }

  if (
    clientStartDate &&
    newPeriod.startDate &&
    newPeriod.startDate < dayjs(clientStartDate)
  ) {
    newPeriod.startDate = dayjs(clientStartDate);
  }

  return {
    startDate: newPeriod.startDate?.format(FORMATTED_PATTERN) ?? null,
    endDate: newPeriod.endDate?.format(FORMATTED_PATTERN) ?? null
  };
};

export const actionCreator = <T extends string, P extends object>(
  dispatch: ActionDispatch<[{ type: T; payload?: P }]>,
  type: T,
  payload: P = {} as P
) => {
  dispatch({
    type,
    payload
  });
};

type DefaultDateConfigType = {
  initialSelectedPeriod: PeriodEnum;
  isCustomPeriod: boolean;
  initialSelectedPrevPeriod: PrevPeriodEnum;
  isCustomPrevPeriod: boolean;
  initialPeriod: DateRangeType;
  initialPrevPeriod: DateRangeType;
  defaultPickerValue: DateRange;
  defaultPrevPickerValue: DateRange;
};

export const getInitialDateConfig = (
  dateConfig: IDateConfig
): DefaultDateConfigType => {
  const initialDate = {
    startDate: null,
    endDate: null
  };
  const initialSelectedPeriod = dateConfig.selectedPeriod
    ? dateConfig.selectedPeriod
    : DEFAULT_PERIOD;
  const isCustomPeriod = initialSelectedPeriod === CUSTOM_PERIOD_KEY;

  const initialSelectedPrevPeriod = dateConfig.selectedPrevPeriod
    ? dateConfig.selectedPrevPeriod
    : DEFAULT_PREV_PERIOD;
  const isCustomPrevPeriod =
    initialSelectedPrevPeriod === CUSTOM_PREV_PERIOD_KEY;

  const initialPeriod = dateConfig.datePicker
    ? dateConfig.datePicker
    : initialDate;
  const initialPrevPeriod = dateConfig.prevDatePicker
    ? dateConfig.prevDatePicker
    : initialDate;

  const defaultPickerValue: DateRange = dateConfig.datePicker
    ? [
        dateConfig.datePicker.startDate
          ? dayjs(dateConfig.datePicker.startDate)
          : null,
        dateConfig.datePicker.endDate
          ? dayjs(dateConfig.datePicker.endDate)
          : null
      ]
    : [null, null];

  const defaultPrevPickerValue: DateRange = dateConfig.prevDatePicker
    ? [
        dateConfig.prevDatePicker.startDate
          ? dayjs(dateConfig.prevDatePicker.startDate)
          : null,
        dateConfig.prevDatePicker.endDate
          ? dayjs(dateConfig.prevDatePicker.endDate)
          : null
      ]
    : [null, null];

  return {
    initialSelectedPeriod,
    isCustomPeriod,
    initialSelectedPrevPeriod,
    isCustomPrevPeriod,
    initialPeriod,
    initialPrevPeriod,
    defaultPickerValue,
    defaultPrevPickerValue
  };
};

export const formatDateConfig = (state: IUserPeriodSelect): IDateConfig => {
  return {
    datePicker: state.period,
    prevDatePicker: state.prevPeriod,
    selectedPeriod: state.selectedPeriod,
    selectedPrevPeriod: state.selectedPrevPeriod
  };
};

export const isEmptyPeriod = (period: DateRangeType): boolean => {
  return !period.startDate && !period.endDate;
};

export const getDateArrayFromRange = (dateRange: DateRangeType): DateRange => {
  return [
    dateRange.startDate ? dayjs(dateRange.startDate) : null,
    dateRange.endDate ? dayjs(dateRange.endDate) : null
  ];
};

export const getAvailablePeriodsForDates = (
  dateRange: DateRangeType,
  forceEmpty: boolean = false
) => {
  const weekLength = 7;
  const daysDiff = dayjs(dateRange.endDate).diff(dateRange.startDate, "day");
  const monthLength = dayjs(dateRange.startDate).daysInMonth();

  const startQuarter = dayjs(dateRange.startDate).startOf("quarter");
  const endQuarter = dayjs(dateRange.startDate).endOf("quarter");
  const quarterLength = dayjs(endQuarter).diff(startQuarter, "day") + 1;

  const startYear = dayjs(dateRange.startDate).startOf("year");
  const endYear = dayjs(dateRange.startDate).endOf("year");
  const yearLength = Math.abs(dayjs(endYear).diff(startYear, "day") + 1);

  if (daysDiff < yearLength && daysDiff > quarterLength) {
    return AVAILABLE_PERIODS_FOR_DATES["year"];
  }

  if (daysDiff < quarterLength && daysDiff >= monthLength) {
    return AVAILABLE_PERIODS_FOR_DATES["quarter"];
  }

  if (daysDiff < monthLength && daysDiff >= weekLength) {
    return AVAILABLE_PERIODS_FOR_DATES["month"];
  }

  if (daysDiff < weekLength) {
    return AVAILABLE_PERIODS_FOR_DATES["week"];
  }

  return forceEmpty ? [] : AVAILABLE_PERIODS_FOR_DATES["date"];
};

export const getAvailablePrevPeriod = (
  currentPeriod: PeriodEnum,
  calendarType: CalendarType
) => {
  const prevPeriods = PERIOD_AVAILABLE[currentPeriod];
  return prevPeriods.filter(p => {
    const { type } = PREV_PERIOD_CONFIG[p];
    if (type) return type === calendarType;
    return true;
  });
};
