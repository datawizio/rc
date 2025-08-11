import clsx from "clsx";
import i18next from "i18next";
import CustomSelect from "../components/CustomSelect";
import { useMemo } from "react";
import { DEFAULT_LOCALE_EN } from "../locale";
import { UNITS } from "../constants";

import type { FC } from "react";
import type { HoursProps } from "../types";

const Hours: FC<HoursProps> = ({
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
        "react-js-cron-hours",
        className && `${className}-field`,
        className && `${className}-hours`
      ),
    [className]
  );

  return (
    <div className={internalClassName} title={i18next.t("HOURS")}>
      {locale.prefixHours !== "" && (
        <span>{locale.prefixHours || DEFAULT_LOCALE_EN.prefixHours}</span>
      )}

      <CustomSelect
        placeholder={locale.emptyHours || DEFAULT_LOCALE_EN.emptyHours}
        value={value}
        unit={UNITS[1]}
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
    </div>
  );
};

export default Hours;
