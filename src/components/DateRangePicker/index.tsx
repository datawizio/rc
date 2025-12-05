import clsx from "clsx";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import DatePicker from "@/components/DatePicker";

import { Tag } from "antd";
import { useCallback, useMemo, useState } from "react";
import { useConfig } from "@/hooks";
import {
  DefaultPreset,
  DefaultPresetPrev,
  DefaultPresetRanges
} from "./presets";

import type { Dayjs } from "dayjs";
import type { HandlerFn } from "@/types/utils";
import type { DateType, DateRange } from "@/types/date";
import type { DateRangePickerProps, IDateRangePicker } from "./types";

import "./index.less";

dayjs.extend(customParseFormat);

const DateRangePicker: IDateRangePicker = ({
  fullWidth,
  type = "iso-8601",
  ranges,
  presets,
  currDateRange,
  useDefaultPreset,
  defaultPresetExceptions,
  maxDateForPresets,
  useCurrentDayPreset,
  inputReadOnly = true,
  format = "DD-MM-YYYY",
  dateTo: propsDateTo = "02-12-2001",
  dateFrom: propsDateFrom = "02-12-2001",
  minDate: propsMinDate,
  maxDate: propsMaxDate,
  ...props
}) => {
  const { t } = useConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [previewRange, setPreviewRange] = useState<DateRange | null>(null);

  const getPresets = useCallback(() => {
    // Presets absent
    if (!ranges && !useDefaultPreset && !presets) return;

    /* Params priority:
     * - ranges
     * - presets
     * - useDefaultPreset
     * */

    if (ranges) return ranges;

    if (presets && presets.length) {
      const result: Record<string, any> = {};

      const defaultPreset = DefaultPreset(
        type,
        propsMinDate ?? null,
        maxDateForPresets ?? propsMaxDate ?? null,
        useCurrentDayPreset
      );
      const defaultPresetPrev = DefaultPresetPrev(
        type,
        currDateRange?.date_from || propsDateFrom,
        currDateRange?.date_to || propsDateTo
      );

      type PresetKey = keyof typeof defaultPreset;
      type PresetPrevKey = keyof typeof defaultPresetPrev;

      presets.forEach(item => {
        if (defaultPreset[item as PresetKey]) {
          result[item] = defaultPreset[item as PresetKey];
        }

        const prevKey = item.toUpperCase() as PresetPrevKey;
        if (defaultPresetPrev[prevKey]) {
          result[prevKey] = defaultPresetPrev[prevKey];
        }
      });

      return result;
    }

    if (useDefaultPreset) {
      const defaultPreset = {
        ...DefaultPreset(
          type,
          propsMinDate ?? null,
          maxDateForPresets ?? propsMaxDate ?? null,
          useCurrentDayPreset
        )
      };

      if (defaultPresetExceptions && defaultPresetExceptions.length) {
        defaultPresetExceptions.forEach(item => {
          delete defaultPreset[item as keyof typeof defaultPreset];
        });
      }
      return defaultPreset;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currDateRange,
    defaultPresetExceptions,
    presets,
    maxDateForPresets,
    propsDateFrom,
    propsDateTo,
    propsMaxDate,
    propsMinDate,
    ranges,
    useDefaultPreset
  ]);

  const translatedPreset = useMemo(() => {
    const presetRanges = getPresets();

    if (!presetRanges) return;

    const defaultPresetMap = new Map(Object.entries(presetRanges));
    const translatedPresets: Array<{ label: string; value: DateRange }> = [];

    defaultPresetMap.forEach((value, key) => {
      const translatedKey = t(key);
      translatedPresets.push({ label: translatedKey, value });
    });

    return translatedPresets;
  }, [getPresets, t]);

  const formatDate = useCallback(
    (date: DateType | null | undefined) => {
      return !date ? null : dayjs(date, format);
    },
    [format]
  );

  const [dateFrom, dateTo] = useMemo(() => {
    return [formatDate(propsDateFrom), formatDate(propsDateTo)];
  }, [propsDateFrom, propsDateTo, formatDate]);

  const [maxDate, minDate] = useMemo(() => {
    return [formatDate(propsMaxDate), formatDate(propsMinDate)];
  }, [propsMaxDate, propsMinDate, formatDate]);

  const isDisabledDate = useCallback(
    (date: Dayjs) => {
      const formattedDate = formatDate(date.format("DD-MM-YYYY"));
      return Boolean(
        (maxDate && formattedDate?.isAfter(maxDate)) ||
          (minDate && formattedDate?.isBefore(minDate))
      );
    },
    [maxDate, minDate, formatDate]
  );

  const onChange: HandlerFn<DateRangePickerProps, "onChange"> = (
    dates,
    dateStrings
  ) => {
    const [dateFrom, dateTo] = dates || [null, null];

    const emptyCheck = props.allowEmpty?.some(Boolean)
      ? !dateFrom && !dateTo
      : !dateFrom || !dateTo;

    if (emptyCheck) props.onClear?.();
    else props.onChange?.(dates, dateStrings);
  };

  const RangePicker = DatePicker.Picker[type].RangePicker;

  const renderExtraFooter = () => (
    <>
      {translatedPreset?.map(({ label, value }) => {
        return (
          <Tag
            key={label}
            color="purple"
            onMouseEnter={() => setPreviewRange(value)}
            onMouseLeave={() => setPreviewRange(null)}
            onClick={() => {
              const [valueFrom, valueTo] = value;
              const dateStrings: [string, string] = [
                valueFrom?.format(format) ?? "",
                valueTo?.format(format) ?? ""
              ];

              onChange(value, dateStrings);

              // Close panel after applying preset
              if (props.open === undefined) {
                setIsOpen(false);
              }
              props.onOpenChange?.(false);
            }}
          >
            {label}
          </Tag>
        );
      })}
    </>
  );

  return (
    <RangePicker
      {...props}
      format={format}
      inputReadOnly={inputReadOnly}
      renderExtraFooter={renderExtraFooter}
      className={clsx(fullWidth && "ant-picker-full-width")}
      classNames={{ popup: { root: "dw-range-picker-dropdown" } }}
      onChange={onChange}
      value={previewRange ?? [dateFrom, dateTo]}
      disabledDate={isDisabledDate}
      open={props.open ?? isOpen}
      onOpenChange={open => {
        props.onOpenChange?.(open);
        if (props.open === undefined) setIsOpen(open);
        if (!open) setPreviewRange(null);
      }}
    />
  );
};

DateRangePicker.presets = DefaultPresetRanges;

export default DateRangePicker;
