import clsx from "clsx";
import i18next from "i18next";
import CustomSelect from "../components/CustomSelect";
import { useMemo } from "react";
import { DEFAULT_LOCALE_EN } from "../locale";
import { UNITS } from "../constants";

import type { FC } from "react";
import type { MinutesProps } from "../types";

const Minutes: FC<MinutesProps> = ({
  value,
  setValue,
  locale,
  className,
  disabled,
  readOnly,
  leadingZero,
  clockFormat,
  period,
  periodicityOnDoubleClick,
  mode,
  getPopupContainer
}) => {
  const internalClassName = useMemo(
    () =>
      clsx(
        "react-js-cron-field",
        "react-js-cron-minutes",
        className && `${className}-field`,
        className && `${className}-minutes`
      ),
    [className]
  );

  return (
    <div className={internalClassName} title={i18next.t("MINUTES")}>
      {period === "hour"
        ? locale.prefixMinutesForHourPeriod !== "" && (
            <span>
              {locale.prefixMinutesForHourPeriod ||
                DEFAULT_LOCALE_EN.prefixMinutesForHourPeriod}
            </span>
          )
        : locale.prefixMinutes !== "" && (
            <span>
              {locale.prefixMinutes || DEFAULT_LOCALE_EN.prefixMinutes}
            </span>
          )}

      <CustomSelect
        placeholder={
          period === "hour"
            ? locale.emptyMinutesForHourPeriod ||
              DEFAULT_LOCALE_EN.emptyMinutesForHourPeriod
            : locale.emptyMinutes || DEFAULT_LOCALE_EN.emptyMinutes
        }
        value={value}
        unit={UNITS[0]}
        setValue={setValue}
        locale={locale}
        className={className}
        disabled={disabled}
        readOnly={readOnly}
        leadingZero={leadingZero}
        clockFormat={clockFormat}
        period={period}
        periodicityOnDoubleClick={periodicityOnDoubleClick}
        mode={mode}
        getPopupContainer={getPopupContainer}
      />

      {period === "hour" && locale.suffixMinutesForHourPeriod !== "" && (
        <span>
          {locale.suffixMinutesForHourPeriod ||
            DEFAULT_LOCALE_EN.suffixMinutesForHourPeriod}
        </span>
      )}
    </div>
  );
};

export default Minutes;
