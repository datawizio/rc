import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import DateRangePicker from "@/components/DateRangePicker";

import { useEffect, useCallback, useRef } from "react";
import { Select } from "antd";
import { useConfig } from "@/hooks";
import { usePeriodSelect } from "./hooks/usePeriodSelect";
import {
  DEFAULT_PERIOD,
  DEFAULT_PREV_PERIOD,
  PERIOD_OPTIONS,
  PREV_PERIOD_OPTIONS
} from "./constants";
import {
  actionCreator,
  isEmptyPeriod,
  formatDateConfig,
  getAvailablePrevPeriod,
  getInitialDateConfig
} from "./helper";

import type { FC } from "react";
import type { DateRange } from "@/types/date";
import type {
  IDateConfig,
  PeriodEnum,
  PeriodSelectProps,
  PrevPeriodEnum
} from "./types";

import "./index.less";

dayjs.extend(quarterOfYear);

const { Option } = Select;

const PeriodSelect: FC<PeriodSelectProps> = ({
  type = "iso-8601",
  clientDate = "2021-11-28",
  clientStartDate = "2020-10-21",
  periodLabel = "SELECT_PERIOD",
  prevPeriodLabel = "SELECT_PREV_PERIOD",
  limitMaxDate = false,
  dateConfig = {} as IDateConfig,
  format,
  onChange,
  allowEmptyEndDate,
  datePickerPlaceholder
}) => {
  const { translate } = useConfig();

  const {
    initialSelectedPeriod,
    isCustomPeriod,
    initialSelectedPrevPeriod,
    isCustomPrevPeriod,
    initialPeriod,
    initialPrevPeriod,
    defaultPickerValue,
    defaultPrevPickerValue
  } = getInitialDateConfig(dateConfig);

  const [state, dispatch] = usePeriodSelect({
    availablePrevPeriods: getAvailablePrevPeriod(initialSelectedPeriod, type),
    clientDate,
    clientStartDate,
    isPickerEmpty: false,
    isPrevPickerEmpty: false,
    showPeriodPicker: isCustomPeriod,
    showPrevPeriodPicker: isCustomPrevPeriod,
    period: initialPeriod,
    calendarType: type,
    prevPeriod: initialPrevPeriod,
    selectedPeriod: initialSelectedPeriod,
    selectedPrevPeriod: initialSelectedPrevPeriod
  });

  const {
    availablePrevPeriods,
    isPickerEmpty,
    isPrevPickerEmpty,
    showPeriodPicker,
    showPrevPeriodPicker,
    period,
    prevPeriod,
    selectedPeriod,
    selectedPrevPeriod
  } = state;

  const startDate = period.startDate ? dayjs(period.startDate) : null;
  const endDate = period.endDate ? dayjs(period.endDate) : null;

  const startDateRef = useRef(startDate);
  const endDateRef = useRef(endDate);

  useEffect(() => {
    startDateRef.current = startDate;
  }, [startDate]);

  useEffect(() => {
    endDateRef.current = endDate;
  }, [endDate]);

  useEffect(() => {
    if (startDate?.isAfter(dayjs(clientDate)) && !endDate) {
      return;
    }

    if (isEmptyPeriod(period)) {
      actionCreator(dispatch, "updatePeriod", {
        periodKey: DEFAULT_PERIOD
      });
    } else {
      onChange?.(formatDateConfig(state));
    }
    // eslint-disable-next-line
  }, [period, prevPeriod]);

  const handlePeriodChange = (periodKey: PeriodEnum) => {
    actionCreator(dispatch, "updatePeriod", {
      periodKey
    });
  };

  const handlePrevPeriodChange = (prevPeriodKey: PrevPeriodEnum) => {
    actionCreator(dispatch, "updatePrevPeriod", {
      prevPeriodKey
    });
  };

  const onDateRangeChange = (date: DateRange | null) => {
    actionCreator(dispatch, "updateDatePicker", {
      date
    });
  };

  const onDateRangeClear = () => {
    actionCreator(dispatch, "clearPicker");
  };

  const onPrevDateRangeChange = (date: DateRange | null) => {
    actionCreator(dispatch, "updatePrevDatePicker", { date });
  };

  const onPrevDateRangeClear = () => {
    actionCreator(dispatch, "clearPrevPicker");
  };

  const isDisabledOption = useCallback(
    (option: PrevPeriodEnum) => !availablePrevPeriods.includes(option),
    [availablePrevPeriods]
  );

  const isDisabledPrevSelect = !availablePrevPeriods.length;

  const dateRangePickerPlaceholder =
    typeof datePickerPlaceholder === "function"
      ? datePickerPlaceholder({ isPickerEmpty, startDate, endDate })
      : datePickerPlaceholder;

  useEffect(() => {
    const period = dateConfig?.selectedPeriod;
    if (period && period !== DEFAULT_PERIOD) handlePeriodChange(period);
  }, []); // eslint-disable-line

  useEffect(() => {
    const prevPeriod = dateConfig?.selectedPrevPeriod;

    if (isDisabledOption(prevPeriod)) {
      handlePrevPeriodChange(DEFAULT_PREV_PERIOD);
    } else if (prevPeriod && prevPeriod !== DEFAULT_PREV_PERIOD) {
      handlePrevPeriodChange(prevPeriod);
    }
  }, [isDisabledOption]); // eslint-disable-line

  return (
    <div className="period-picker-wrapper">
      <div className="period-container">
        <span className="period-title">{translate(periodLabel)}</span>
        <Select onChange={handlePeriodChange} value={selectedPeriod}>
          {PERIOD_OPTIONS.map((option, i) => {
            return (
              <Option key={i} value={option}>
                {translate(
                  option === "date" ? "SET_DATE" : option.toUpperCase()
                )}
              </Option>
            );
          })}
        </Select>
        {showPeriodPicker && (
          <DateRangePicker
            placeholder={dateRangePickerPlaceholder}
            inputReadOnly={false}
            type={type}
            dateFrom={!isPickerEmpty ? startDate : null}
            dateTo={!isPickerEmpty ? endDate : null}
            minDate={dayjs(clientStartDate)}
            maxDate={limitMaxDate ? dayjs(clientDate) : undefined}
            defaultValue={!isPickerEmpty ? defaultPickerValue : undefined}
            onChange={onDateRangeChange}
            onClear={onDateRangeClear}
            defaultPickerValue={[
              !isPickerEmpty ? startDate! : dayjs(clientDate),
              !isPickerEmpty ? endDate! : dayjs(clientDate)
            ]}
            format={format}
            allowEmpty={[false, allowEmptyEndDate ?? false]}
            onOpenChange={(open: boolean) => {
              setTimeout(() => {
                if (
                  !open &&
                  startDateRef.current?.isAfter(dayjs(clientDate)) &&
                  !endDateRef.current
                ) {
                  actionCreator(dispatch, "clearPicker");
                }
              }, 0);
            }}
          />
        )}
      </div>
      <div className="prev-period-container">
        <span className="period-title">{translate(prevPeriodLabel)}</span>

        <Select
          onChange={handlePrevPeriodChange}
          disabled={isDisabledPrevSelect}
          value={selectedPrevPeriod}
        >
          {PREV_PERIOD_OPTIONS.map((option, i) => (
            <Option key={i} disabled={isDisabledOption(option)} value={option}>
              {translate(
                option === "prev_date" ? "SET_DATE" : option.toUpperCase()
              )}
            </Option>
          ))}
        </Select>
        {showPrevPeriodPicker && (
          <DateRangePicker
            inputReadOnly={false}
            type={type}
            dateFrom={!isPrevPickerEmpty ? dayjs(prevPeriod.startDate) : null}
            dateTo={!isPrevPickerEmpty ? dayjs(prevPeriod.endDate) : null}
            minDate={dayjs(clientStartDate)}
            maxDate={limitMaxDate ? dayjs(clientDate) : undefined}
            defaultValue={
              !isPrevPickerEmpty ? defaultPrevPickerValue : undefined
            }
            onChange={onPrevDateRangeChange}
            onClear={onPrevDateRangeClear}
            defaultPickerValue={[
              !isPrevPickerEmpty
                ? dayjs(prevPeriod.startDate)
                : dayjs(clientDate),
              !isPrevPickerEmpty ? dayjs(prevPeriod.endDate) : dayjs(clientDate)
            ]}
            format={format}
          />
        )}
      </div>
    </div>
  );
};

export default PeriodSelect;
