import clsx from "clsx";
import { useMemo, useCallback, useRef } from "react";
import { Select } from "antd";

import { DEFAULT_LOCALE_EN } from "../locale";
import { sort } from "../utils";
import { parsePartArray, partToString, formatValue } from "../converter";

import type { FC } from "react";
import type { SelectProps } from "antd";
import type { CustomSelectProps, Clicks } from "../types";

const CustomSelect: FC<CustomSelectProps> = ({
  value,
  grid = true,
  optionsList,
  setValue,
  locale,
  className,
  humanizeLabels,
  disabled,
  readOnly,
  leadingZero,
  clockFormat,
  period,
  unit,
  periodicityOnDoubleClick,
  mode,
  sortOptionsList,
  ...props
}) => {
  const stringValue = useMemo(() => {
    if (value && Array.isArray(value)) {
      return value.map((value: number) => value.toString());
    }
  }, [value]);

  const options = useMemo(
    () => {
      if (optionsList) {
        const opts = optionsList.map((option, index) => {
          const number = unit.min === 0 ? index : index + 1;

          return {
            value: number.toString(),
            label: option
          };
        });

        return sortOptionsList ? opts.sort(sortOptionsList) : opts;
      }

      return [...Array(unit.total)].map((_, index) => {
        const number = unit.min === 0 ? index : index + 1;

        return {
          value: number.toString(),
          label: formatValue(
            number,
            unit,
            humanizeLabels,
            leadingZero,
            clockFormat
          )
        };
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [optionsList, leadingZero, humanizeLabels, clockFormat]
  );
  const localeJSON = JSON.stringify(locale);
  const renderTag = useCallback(
    (props: Parameters<NonNullable<SelectProps["tagRender"]>>[number]) => {
      const { value: itemValue } = props;

      if (!value || value[0] !== Number(itemValue)) {
        return <></>;
      }

      const parsedArray = parsePartArray(value, unit);
      const cronValue = partToString(
        parsedArray,
        unit,
        humanizeLabels,
        leadingZero,
        clockFormat
      );
      const testEveryValue = cronValue.match(/^\*\/([0-9]+),?/) || [];

      return (
        <div>
          {testEveryValue[1]
            ? `${locale.everyText || DEFAULT_LOCALE_EN.everyText} ${
                testEveryValue[1]
              }`
            : cronValue}
        </div>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, localeJSON, humanizeLabels, leadingZero, clockFormat]
  );

  const simpleClick = useCallback(
    (newValueOption: number | number[]) => {
      const newValueOptions = Array.isArray(newValueOption)
        ? sort(newValueOption)
        : [newValueOption];

      let newValue: number[] = newValueOptions;

      if (value) {
        newValue = mode === "single" ? [] : [...value];

        newValueOptions.forEach(o => {
          const newValueOptionNumber = Number(o);

          if (value.some(v => v === newValueOptionNumber)) {
            newValue = newValue.filter(v => v !== newValueOptionNumber);
          } else {
            newValue = sort([...newValue, newValueOptionNumber]);
          }
        });
      }

      if (newValue.length === unit.total) {
        setValue([]);
      } else {
        setValue(newValue);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setValue, value]
  );

  const doubleClick = useCallback(
    (newValueOption: number) => {
      if (newValueOption !== 0 && newValueOption !== 1) {
        const limit = unit.total + unit.min;
        const newValue: number[] = [];

        for (let i = unit.min; i < limit; i++) {
          if (i % newValueOption === 0) {
            newValue.push(i);
          }
        }

        const oldValueEqualNewValue =
          value &&
          newValue &&
          value.length === newValue.length &&
          value.every((v: number, i: number) => v === newValue[i]);

        const allValuesSelected = newValue.length === options.length;

        if (allValuesSelected || oldValueEqualNewValue) {
          setValue([]);
        } else {
          setValue(newValue);
        }
      } else {
        setValue([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, options, setValue]
  );

  const clicksRef = useRef<Clicks[]>([]);
  const onOptionClick = useCallback(
    (newValueOption: string) => {
      if (!readOnly) {
        const doubleClickTimeout = 300;
        const clicks = clicksRef.current;

        clicks.push({
          time: new Date().getTime(),
          value: Number(newValueOption)
        });

        const id = window.setTimeout(() => {
          if (
            mode === "multiple" &&
            periodicityOnDoubleClick &&
            clicks.length > 1 &&
            clicks[clicks.length - 1].time - clicks[clicks.length - 2].time <
              doubleClickTimeout
          ) {
            if (
              clicks[clicks.length - 1].value ===
              clicks[clicks.length - 2].value
            ) {
              doubleClick(Number(newValueOption));
            } else {
              simpleClick([
                clicks[clicks.length - 2].value,
                clicks[clicks.length - 1].value
              ]);
            }
          } else {
            simpleClick(Number(newValueOption));
          }

          clicksRef.current = [];
        }, doubleClickTimeout);

        return () => {
          window.clearTimeout(id);
        };
      }
    },
    [
      clicksRef,
      simpleClick,
      doubleClick,
      readOnly,
      periodicityOnDoubleClick,
      mode
    ]
  );

  const onClear = useCallback(() => {
    if (!readOnly) {
      setValue([]);
    }
  }, [setValue, readOnly]);

  const internalClassName = useMemo(
    () =>
      clsx(
        "react-js-cron-select",
        "react-js-cron-custom-select",
        !!className && `${className}-select`
      ),
    [className]
  );

  const dropdownClassNames = useMemo(
    () =>
      clsx(
        "react-js-cron-select-dropdown",
        `react-js-cron-select-dropdown-${unit.type}`,
        "react-js-cron-custom-select-dropdown",
        `react-js-cron-custom-select-dropdown-${unit.type}`,
        grid && "react-js-cron-custom-select-dropdown-grid",
        !!className && `${className}-select-dropdown`,
        !!className && `${className}-select-dropdown-${unit.type}`,
        {
          "react-js-cron-custom-select-dropdown-minutes-large":
            unit.type === "minutes" && period !== "hour" && period !== "day",
          "react-js-cron-custom-select-dropdown-minutes-medium":
            unit.type === "minutes" && (period === "day" || period === "hour"),
          "react-js-cron-custom-select-dropdown-hours-twelve-hour-clock":
            unit.type === "hours" && clockFormat === "12-hour-clock"
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [className, grid, clockFormat, period]
  );

  return (
    <Select
      mode="multiple"
      allowClear={!readOnly}
      virtual={false}
      open={readOnly ? false : undefined}
      value={stringValue}
      onClear={onClear}
      tagRender={renderTag}
      className={internalClassName}
      classNames={{ popup: { root: dropdownClassNames } }}
      options={options}
      showSearch={false}
      showArrow={!readOnly}
      menuItemSelectedIcon={null}
      popupMatchSelectWidth={false}
      onSelect={onOptionClick}
      onDeselect={onOptionClick}
      disabled={disabled}
      dropdownAlign={
        (unit.type === "minutes" || unit.type === "hours") &&
        period !== "day" &&
        period !== "hour"
          ? { points: ["tr", "br"] } // Set direction to left to prevent dropdown to overlap a window
          : undefined
      }
      {...props}
    />
  );
};

export default CustomSelect;
