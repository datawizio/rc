import clsx from "clsx";
import CustomSelect from "../components/CustomSelect";
import { useMemo } from "react";
import { DEFAULT_LOCALE_EN } from "../locale";
import { UNITS } from "../constants";

import type { FC } from "react";
import type { WeekDaysProps } from "../types";

const WeekDays: FC<WeekDaysProps> = ({
  value,
  setValue,
  locale,
  className,
  humanizeLabels,
  monthDays,
  disabled,
  readOnly,
  period,
  periodicityOnDoubleClick,
  mode,
  getPopupContainer,
  startOfWeek = 7
}) => {
  const optionsList = locale.weekDays || DEFAULT_LOCALE_EN.weekDays;
  const noMonthDays = period === "week" || !monthDays || monthDays.length === 0;

  const internalClassName = useMemo(
    () =>
      clsx(
        "react-js-cron-field",
        "react-js-cron-week-days",
        !noMonthDays && "react-js-cron-week-days-placeholder",
        className && `${className}-field`,
        className && `${className}-week-days`
      ),
    [className, noMonthDays]
  );

  const localeJSON = JSON.stringify(locale);
  const placeholder = useMemo(
    () => {
      if (noMonthDays) {
        return locale.emptyWeekDays || DEFAULT_LOCALE_EN.emptyWeekDays;
      }

      return locale.emptyWeekDaysShort || DEFAULT_LOCALE_EN.emptyWeekDaysShort;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [noMonthDays, localeJSON]
  );

  const displayWeekDays =
    period === "week" ||
    !readOnly ||
    (value && value.length > 0) ||
    ((!value || value.length === 0) && (!monthDays || monthDays.length === 0));

  const monthDaysIsDisplayed =
    !readOnly ||
    (monthDays && monthDays.length > 0) ||
    ((!monthDays || monthDays.length === 0) && (!value || value.length === 0));

  return displayWeekDays ? (
    <div className={internalClassName}>
      {locale.prefixWeekDays !== "" &&
        (period === "week" || !monthDaysIsDisplayed) && (
          <span>
            {locale.prefixWeekDays || DEFAULT_LOCALE_EN.prefixWeekDays}
          </span>
        )}

      {locale.prefixWeekDaysForMonthAndYearPeriod !== "" &&
        period !== "week" &&
        monthDaysIsDisplayed && (
          <span>
            {locale.prefixWeekDaysForMonthAndYearPeriod ||
              DEFAULT_LOCALE_EN.prefixWeekDaysForMonthAndYearPeriod}
          </span>
        )}

      <CustomSelect
        placeholder={placeholder}
        optionsList={optionsList}
        grid={false}
        value={value}
        unit={{
          ...UNITS[4],
          // Allow translation of alternative labels when using "humanizeLabels"
          alt: locale.altWeekDays || DEFAULT_LOCALE_EN.altWeekDays
        }}
        setValue={setValue}
        locale={locale}
        className={className}
        humanizeLabels={humanizeLabels}
        disabled={disabled}
        readOnly={readOnly}
        period={period}
        periodicityOnDoubleClick={periodicityOnDoubleClick}
        mode={mode}
        getPopupContainer={getPopupContainer}
        sortOptionsList={(a, b) => {
          if (!a.value || !b.value) return 0;

          // Convert into a zero-based index.
          const offset = startOfWeek % 7;

          // Adjust the position of each day based on the custom start.
          // Subtracting the offset "rotates" the week, aligning it to the new start.
          const adjustedA = ((a.value as number) - offset + 7) % 7;
          const adjustedB = ((b.value as number) - offset + 7) % 7;

          return adjustedA - adjustedB;
        }}
      />
    </div>
  ) : null;
};

export default WeekDays;
