import clsx from "clsx";
import Hours from "./fields/Hours";
import Minutes from "./fields/Minutes";
import MonthDays from "./fields/MonthDays";
import Months from "./fields/Months";
import Period from "./fields/Period";
import WeekDays from "./fields/WeekDays";

import { Button } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { setError, usePrevious } from "./utils";
import { DEFAULT_LOCALE_EN } from "./locale";
import { getCronStringFromValues, setValuesFromCronString } from "./converter";

import type { FC } from "react";
import type { CronProps, PeriodType } from "./types";

import "./index.less";

const Cron: FC<CronProps> = ({
  clearButton = true,
  clearButtonProps = {},
  clearButtonAction = "fill-with-every",
  locale = DEFAULT_LOCALE_EN,
  value = "",
  setValue,
  displayError = true,
  onError,
  className,
  defaultPeriod = "day",
  allowEmpty = "for-default-value",
  humanizeLabels = true,
  humanizeValue = false,
  disabled = false,
  readOnly = false,
  leadingZero = false,
  shortcuts = [
    "@yearly",
    "@annually",
    "@monthly",
    "@weekly",
    "@daily",
    "@midnight",
    "@hourly"
  ],
  periodicityOnDoubleClick = true,
  mode = "multiple",
  defaultHour,
  withHours = false,
  withMinutes = false,
  getPopupContainer,
  startOfWeek = 7
}) => {
  const internalValueRef = useRef<string>(value);
  const defaultPeriodRef = useRef<PeriodType>(defaultPeriod);

  const [period, setPeriod] = useState<PeriodType | undefined>();
  const [monthDays, setMonthDays] = useState<number[] | undefined>();
  const [months, setMonths] = useState<number[] | undefined>();
  const [weekDays, setWeekDays] = useState<number[] | undefined>();
  const [hours, setHours] = useState<number[] | undefined>();
  const [minutes, setMinutes] = useState<number[] | undefined>();
  const [error, setInternalError] = useState<boolean>(false);
  const [valueCleared, setValueCleared] = useState<boolean>(false);
  const previousValueCleared = usePrevious(valueCleared);
  const localeJSON = JSON.stringify(locale);

  useEffect(
    () => {
      setValuesFromCronString(
        value,
        setInternalError,
        onError,
        allowEmpty,
        internalValueRef,
        true,
        locale,
        shortcuts,
        setMinutes,
        setHours,
        setMonthDays,
        setMonths,
        setWeekDays,
        setPeriod
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(
    () => {
      if (value !== internalValueRef.current) {
        setValuesFromCronString(
          value,
          setInternalError,
          onError,
          allowEmpty,
          internalValueRef,
          false,
          locale,
          shortcuts,
          setMinutes,
          setHours,
          setMonthDays,
          setMonths,
          setWeekDays,
          setPeriod
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, internalValueRef, localeJSON, allowEmpty, shortcuts]
  );

  useEffect(
    () => {
      // Only change the value if a user touched a field
      // and if the user didn't use the clear button
      if (
        (period || minutes || months || monthDays || weekDays || hours) &&
        !valueCleared &&
        !previousValueCleared
      ) {
        const cron = getCronStringFromValues(
          period || defaultPeriodRef.current,
          months,
          monthDays,
          weekDays,
          hours,
          minutes,
          humanizeValue
        );

        setValue(cron, period || defaultPeriodRef.current);
        internalValueRef.current = cron;

        onError?.(undefined);
        setInternalError(false);
      } else if (valueCleared) {
        setValueCleared(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      period,
      monthDays,
      months,
      weekDays,
      hours,
      minutes,
      humanizeValue,
      valueCleared
    ]
  );

  const handleClear = useCallback(
    () => {
      setMonthDays(undefined);
      setMonths(undefined);
      setWeekDays(undefined);
      setHours(defaultHour ? [defaultHour] : undefined);
      setMinutes(defaultHour ? [0] : undefined);

      // When clearButtonAction is 'empty'
      let newValue = "";

      const newPeriod =
        clearButtonAction !== "to-default" && period !== "reboot" && period
          ? period
          : defaultPeriodRef.current;

      if (newPeriod !== period) {
        setPeriod(newPeriod);
      }

      // When clearButtonAction is 'fill-with-every'
      if (
        clearButtonAction === "fill-with-every" ||
        clearButtonAction === "to-default"
      ) {
        newValue = getCronStringFromValues(
          newPeriod,
          undefined,
          undefined,
          undefined,
          defaultHour ? [defaultHour] : undefined,
          defaultHour ? [0] : undefined
        );
      }

      setValue(newValue, newPeriod);
      internalValueRef.current = newValue;

      setValueCleared(true);

      if (allowEmpty === "never" && clearButtonAction === "empty") {
        setInternalError(true);
        setError(onError, locale);
      } else {
        onError?.(undefined);
        setInternalError(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [period, setValue, onError, clearButtonAction]
  );

  const internalClassName = useMemo(
    () =>
      clsx({
        "react-js-cron": true,
        "react-js-cron-error": error && displayError,
        "react-js-cron-disabled": disabled,
        "react-js-cron-read-only": readOnly,
        [`${className}`]: !!className,
        [`${className}-error`]: error && displayError && !!className,
        [`${className}-disabled`]: disabled && !!className,
        [`${className}-read-only`]: readOnly && !!className
      }),
    [className, error, displayError, disabled, readOnly]
  );

  const { className: clearButtonClassNameProp, ...otherClearButtonProps } =
    clearButtonProps;

  const clearButtonClassName = useMemo(
    () =>
      clsx({
        "react-js-cron-clear-button": true,
        [`${className}-clear-button`]: !!className,
        [`${clearButtonClassNameProp}`]: !!clearButtonClassNameProp
      }),
    [className, clearButtonClassNameProp]
  );

  const otherClearButtonPropsJSON = JSON.stringify(otherClearButtonProps);
  const clearButtonNode = useMemo(
    () => {
      if (clearButton && !readOnly) {
        return (
          <Button
            className={clearButtonClassName}
            danger
            type="primary"
            disabled={disabled}
            {...otherClearButtonProps}
            onClick={handleClear}
          >
            {locale.clearButtonText || DEFAULT_LOCALE_EN.clearButtonText}
          </Button>
        );
      }

      return null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      clearButton,
      readOnly,
      localeJSON,
      clearButtonClassName,
      disabled,
      otherClearButtonPropsJSON,
      handleClear
    ]
  );

  const periodForRender = period || defaultPeriodRef.current;

  return (
    <div className={internalClassName}>
      <Period
        value={periodForRender}
        setValue={setPeriod}
        locale={locale}
        className={className}
        disabled={disabled}
        readOnly={readOnly}
        shortcuts={shortcuts}
        withHours={withHours}
        withMinutes={withMinutes}
        getPopupContainer={getPopupContainer}
      />

      {periodForRender === "reboot" ? (
        clearButtonNode
      ) : (
        <>
          {periodForRender === "year" && (
            <Months
              value={months}
              setValue={setMonths}
              locale={locale}
              className={className}
              humanizeLabels={humanizeLabels}
              disabled={disabled}
              readOnly={readOnly}
              period={periodForRender}
              periodicityOnDoubleClick={periodicityOnDoubleClick}
              mode={mode}
              getPopupContainer={getPopupContainer}
            />
          )}

          {(periodForRender === "year" || periodForRender === "month") && (
            <MonthDays
              value={monthDays}
              setValue={setMonthDays}
              locale={locale}
              className={className}
              weekDays={weekDays}
              disabled={disabled}
              readOnly={readOnly}
              leadingZero={leadingZero}
              period={periodForRender}
              periodicityOnDoubleClick={periodicityOnDoubleClick}
              mode={mode}
              getPopupContainer={getPopupContainer}
            />
          )}

          {(periodForRender === "year" ||
            periodForRender === "month" ||
            periodForRender === "week") && (
            <WeekDays
              value={weekDays}
              setValue={setWeekDays}
              locale={locale}
              className={className}
              humanizeLabels={humanizeLabels}
              monthDays={monthDays}
              disabled={disabled}
              readOnly={readOnly}
              period={periodForRender}
              periodicityOnDoubleClick={periodicityOnDoubleClick}
              mode={mode}
              getPopupContainer={getPopupContainer}
              startOfWeek={startOfWeek}
            />
          )}

          {(periodForRender === "year" ||
            periodForRender === "month" ||
            periodForRender === "week" ||
            periodForRender === "day") &&
            withHours && (
              <Hours
                value={hours}
                setValue={setHours}
                leadingZero={true}
                locale={locale}
                className={className}
                disabled={disabled}
                readOnly={readOnly}
                period={periodForRender}
                periodicityOnDoubleClick={periodicityOnDoubleClick}
                mode={mode}
                getPopupContainer={getPopupContainer}
              />
            )}

          {(periodForRender === "year" ||
            periodForRender === "month" ||
            periodForRender === "week" ||
            periodForRender === "day" ||
            periodForRender === "hour") &&
            withHours &&
            withMinutes && (
              <Minutes
                value={minutes}
                setValue={setMinutes}
                leadingZero={true}
                locale={locale}
                className={className}
                disabled={disabled}
                readOnly={readOnly}
                period={periodForRender}
                periodicityOnDoubleClick={periodicityOnDoubleClick}
                mode={mode}
                getPopupContainer={getPopupContainer}
              />
            )}

          <div>{clearButtonNode}</div>
        </>
      )}
    </div>
  );
};

export default Cron;
