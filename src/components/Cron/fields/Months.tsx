import clsx from "clsx";
import CustomSelect from "../components/CustomSelect";
import { useMemo } from "react";
import { DEFAULT_LOCALE_EN } from "../locale";
import { UNITS } from "../constants";

import type { FC } from "react";
import type { MonthsProps } from "../types";

const Months: FC<MonthsProps> = ({
  value,
  setValue,
  locale,
  className,
  humanizeLabels,
  disabled,
  readOnly,
  period,
  periodicityOnDoubleClick,
  mode,
  getPopupContainer
}) => {
  const optionsList = locale.months || DEFAULT_LOCALE_EN.months;

  const internalClassName = useMemo(
    () =>
      clsx(
        "react-js-cron-field",
        "react-js-cron-months",
        className && `${className}-field`,
        className && `${className}-months`
      ),
    [className]
  );

  return (
    <div className={internalClassName}>
      {locale.prefixMonths !== "" && (
        <span>{locale.prefixMonths || DEFAULT_LOCALE_EN.prefixMonths}</span>
      )}

      <CustomSelect
        placeholder={locale.emptyMonths || DEFAULT_LOCALE_EN.emptyMonths}
        optionsList={optionsList}
        grid={false}
        value={value}
        unit={{
          ...UNITS[3],
          // Allow translation of alternative labels when using "humanizeLabels"
          alt: locale.altMonths || DEFAULT_LOCALE_EN.altMonths
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
      />
    </div>
  );
};

export default Months;
