import clsx from "clsx";
import { useCallback, useMemo } from "react";
import { Select } from "antd";
import { DEFAULT_LOCALE_EN } from "../locale";

import type { FC } from "react";
import type { PeriodProps, PeriodType } from "../types";

const Period: FC<PeriodProps> = ({
  value,
  setValue,
  locale,
  className,
  disabled,
  readOnly,
  shortcuts,
  getPopupContainer
}) => {
  let options = [
    {
      value: "year",
      label: locale.yearOption || DEFAULT_LOCALE_EN.yearOption
    },
    {
      value: "month",
      label: locale.monthOption || DEFAULT_LOCALE_EN.monthOption
    },
    {
      value: "week",
      label: locale.weekOption || DEFAULT_LOCALE_EN.weekOption
    },
    {
      value: "day",
      label: locale.dayOption || DEFAULT_LOCALE_EN.dayOption
    }
  ];

  if (shortcuts && (shortcuts === true || shortcuts.includes("@reboot"))) {
    options = [
      ...options,
      {
        value: "reboot",
        label: locale.rebootOption || DEFAULT_LOCALE_EN.rebootOption
      }
    ];
  }

  const handleChange = useCallback(
    (newValue: PeriodType) => {
      if (!readOnly) {
        setValue(newValue);
      }
    },
    [setValue, readOnly]
  );

  const internalClassName = useMemo(
    () =>
      clsx(
        "react-js-cron-field",
        "react-js-cron-period",
        className && `${className}-field`,
        className && `${className}-period`
      ),
    [className]
  );

  const selectClassName = useMemo(
    () =>
      clsx(
        "react-js-cron-select",
        locale.prefixPeriod === "" && "react-js-cron-select-no-prefix",
        className && `${className}-select`
      ),
    [className, locale.prefixPeriod]
  );

  const dropdownClassName = useMemo(
    () =>
      clsx(
        "react-js-cron-select-dropdown",
        "react-js-cron-select-dropdown-period",
        className && `${className}-select-dropdown`,
        className && `${className}-select-dropdown-period`
      ),
    [className]
  );

  return (
    <div className={internalClassName}>
      {locale.prefixPeriod !== "" && (
        <span>{locale.prefixPeriod || DEFAULT_LOCALE_EN.prefixPeriod}</span>
      )}

      <Select
        key={JSON.stringify(locale)}
        defaultValue={value}
        value={value}
        onChange={handleChange}
        options={options}
        className={selectClassName}
        classNames={{ popup: { root: dropdownClassName } }}
        disabled={disabled}
        showArrow={!readOnly}
        open={readOnly ? false : undefined}
        getPopupContainer={getPopupContainer}
      />
    </div>
  );
};

export default Period;
