import { useReducer } from "react";
import {
  CUSTOM_PERIOD_KEY,
  CUSTOM_PREV_PERIOD_KEY,
  DEFAULT_PREV_PERIOD
} from "../constants";
import {
  getAvailablePeriodsForDates,
  getAvailablePrevPeriod,
  getDateArrayFromRange,
  getPeriod,
  getPrevPeriod
} from "../helper";

import type { CalendarType } from "@/types/calendar";
import type { DateRangeType, PeriodEnum, PrevPeriodEnum } from "../types";

export interface IUserPeriodSelect {
  selectedPeriod: PeriodEnum;
  selectedPrevPeriod: PrevPeriodEnum;
  period: DateRangeType;
  prevPeriod: DateRangeType;
  showPeriodPicker: boolean;
  showPrevPeriodPicker: boolean;
  isPickerEmpty: boolean;
  isPrevPickerEmpty: boolean;
  calendarType: CalendarType;
  availablePrevPeriods: PrevPeriodEnum[];
  clientDate: string;
  clientStartDate: string;
}

const reducer = (state: IUserPeriodSelect, action: any) => {
  switch (action.type) {
    case "updatePeriod": {
      const { periodKey } = action.payload;
      const {
        clientDate,
        clientStartDate,
        period: oldPeriod,
        calendarType
      } = state;

      const availablePrevPeriods = getAvailablePrevPeriod(
        periodKey,
        calendarType
      );

      const isCustomDate = periodKey === CUSTOM_PERIOD_KEY;

      const period = getPeriod({
        periodKey,
        date: isCustomDate ? getDateArrayFromRange(oldPeriod) : null,
        clientDate,
        clientStartDate
      });

      const prevPeriod = getPrevPeriod({
        period,
        clientDate,
        prev_period: DEFAULT_PREV_PERIOD,
        date: isCustomDate ? getDateArrayFromRange(period) : periodKey
      });

      if (isCustomDate) {
        return {
          ...state,
          period,
          availablePrevPeriods: getAvailablePeriodsForDates({
            ...period,
            endDate: period.endDate ?? clientDate
          }),
          isPickerEmpty: false,
          showPeriodPicker: true,
          selectedPeriod: periodKey
        };
      }

      return {
        ...state,
        period,
        availablePrevPeriods,
        prevPeriod,
        showPeriodPicker: false,
        isPickerEmpty: false,
        showPrevPeriodPicker: false,
        selectedPrevPeriod: DEFAULT_PREV_PERIOD,
        selectedPeriod: periodKey
      };
    }

    case "updatePrevPeriod": {
      const { prevPeriodKey } = action.payload;
      const {
        clientDate,
        period,
        selectedPeriod,
        prevPeriod: oldPrevPeriod
      } = state;

      const isCustomDate = selectedPeriod === CUSTOM_PERIOD_KEY;
      const isCustomPrevDate = prevPeriodKey === CUSTOM_PREV_PERIOD_KEY;

      const isBothCustomDate = isCustomDate && isCustomPrevDate;

      const prevPeriod = getPrevPeriod({
        date: isBothCustomDate
          ? getDateArrayFromRange(oldPrevPeriod)
          : isCustomDate
            ? getDateArrayFromRange(period)
            : selectedPeriod,
        prev_period: prevPeriodKey,
        clientDate,
        period
      });

      if (isCustomPrevDate) {
        return {
          ...state,
          isPrevPickerEmpty: false,
          selectedPrevPeriod: prevPeriodKey,
          showPrevPeriodPicker: true
        };
      }

      return {
        ...state,
        prevPeriod,
        isPrevPickerEmpty: false,
        selectedPrevPeriod: prevPeriodKey,
        showPrevPeriodPicker: false
      };
    }

    case "updateDatePicker": {
      const { date } = action.payload;
      const {
        selectedPeriod,
        selectedPrevPeriod,
        prevPeriod: oldPrevPeriod,
        clientDate,
        clientStartDate
      } = state;

      const isCustomDate = selectedPeriod === CUSTOM_PERIOD_KEY;
      const isCustomPrevDate = selectedPrevPeriod === CUSTOM_PREV_PERIOD_KEY;

      if (!isCustomDate) {
        return state;
      }

      const period = getPeriod({
        clientDate,
        clientStartDate,
        periodKey: CUSTOM_PERIOD_KEY,
        date
      });

      const prevPeriod = getPrevPeriod({
        period,
        clientDate,
        prev_period: DEFAULT_PREV_PERIOD,
        date: getDateArrayFromRange(period)
      });

      return {
        ...state,
        period,
        prevPeriod: isCustomPrevDate ? oldPrevPeriod : prevPeriod,
        availablePrevPeriods: getAvailablePeriodsForDates({
          ...period,
          endDate: period.endDate ?? clientDate
        }),
        selectedPrevPeriod: isCustomPrevDate
          ? CUSTOM_PREV_PERIOD_KEY
          : DEFAULT_PREV_PERIOD,
        isPickerEmpty: false
      };
    }

    case "updatePrevDatePicker": {
      const { date } = action.payload;
      const { clientDate, period } = state;

      const prevPeriod = getPrevPeriod({
        period,
        clientDate,
        prev_period: CUSTOM_PREV_PERIOD_KEY,
        date
      });

      return {
        ...state,
        prevPeriod,
        isPrevPickerEmpty: false
      };
    }

    case "clearPicker": {
      return {
        ...state,
        isPickerEmpty: true
      };
    }

    case "clearPrevPicker": {
      return {
        ...state,
        isPrevPickerEmpty: true
      };
    }

    case "setState": {
      return {
        ...state,
        ...action.payload
      };
    }

    default:
      throw new Error();
  }
};

export const usePeriodSelect = (initialState: IUserPeriodSelect) => {
  return useReducer(reducer, initialState);
};
