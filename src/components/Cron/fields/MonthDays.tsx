import clsx from "clsx";
import CustomSelect from "../components/CustomSelect";
import { useMemo } from "react";
import { DEFAULT_LOCALE_EN } from "../locale";
import { UNITS } from "../constants";

import type { FC } from "react";
import type { MonthDaysProps } from "../types";

const MonthDays: FC<MonthDaysProps> = ({
  value,
  setValue,
  locale,
  className,
  weekDays,
  disabled,
  readOnly,
  leadingZero,
  period,
  periodicityOnDoubleClick,
  mode,
  getPopupContainer
}) => {
  const noWeekDays = !weekDays || weekDays.length === 0;

  const internalClassName = useMemo(
    () =>
      clsx(
        "react-js-cron-field",
        "react-js-cron-month-days",
        !noWeekDays && "react-js-cron-month-days-placeholder",
        className && `${className}-field`,
        className && `${className}-month-days`
      ),
    [className, noWeekDays]
  );

  const localeJSON = JSON.stringify(locale);
  const placeholder = useMemo(
    () => {
      if (noWeekDays) {
        return locale.emptyMonthDays || DEFAULT_LOCALE_EN.emptyMonthDays;
      }

      return (
        locale.emptyMonthDaysShort || DEFAULT_LOCALE_EN.emptyMonthDaysShort
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [noWeekDays, localeJSON]
  );

  const displayMonthDays =
    !readOnly ||
    (value && value.length > 0) ||
    ((!value || value.length === 0) && (!weekDays || weekDays.length === 0));

  return displayMonthDays ? (
    <div className={internalClassName}>
      {locale.prefixMonthDays !== "" && (
        <span>
          {locale.prefixMonthDays || DEFAULT_LOCALE_EN.prefixMonthDays}
        </span>
      )}

      <CustomSelect
        placeholder={placeholder}
        value={value}
        setValue={setValue}
        unit={UNITS[2]}
        locale={locale}
        className={className}
        disabled={disabled}
        readOnly={readOnly}
        leadingZero={leadingZero}
        period={period}
        periodicityOnDoubleClick={periodicityOnDoubleClick}
        mode={mode}
        getPopupContainer={getPopupContainer}
      />
    </div>
  ) : null;
};

export default MonthDays;
