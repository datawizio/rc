import i18next from "i18next";
import ListInfo from "@/components/ListInfo";
import ShowAllModal from "./components/ShowAllModal";
import { filtersMapperFunctions as functions } from "./filters";

import type {
  DimensionsType,
  FormatDateRangeType,
  WidgetParams,
  WidgetParamsDimension
} from "./types";

declare global {
  interface Window {
    allDict: Record<string, any>;
  }
}

export const MAX_LENGTH_ITEM_LIST = 7;

export const getValue = (
  dimension: WidgetParamsDimension,
  formatDateRange: (from: string, to: string) => string
) => {
  const key = dimension["name"].toLowerCase();
  const value = dimension["values"] as any;

  if (key === "chain") return [i18next.t("CHAIN")];

  if (!value) return [i18next.t("ALL")];
  if (typeof value === "boolean") return [functions.boolean(value)];
  if (typeof value === "string") return [functions.string(value)];

  if (typeof value === "number") {
    const fn = functions.number?.[key as keyof typeof functions.number];
    return fn ? fn(value) : [value];
  }

  if (Array.isArray(value)) return functions.array(value, dimension["type"]);
  if (value["from"]) return [formatDateRange(value["from"], value["to"])];

  if (typeof value === "object") {
    const fn = functions.object?.[key as keyof typeof functions.object];
    return fn ? fn(value) : [JSON.stringify(value)];
  }

  return [value];
};

export const parseDimension = (
  dimension: WidgetParamsDimension,
  formatDateRange: (from: string, to: string) => string,
  showExpandButton: boolean = true,
  maxLength?: number
) => (
  <ListInfo
    key={dimension.name}
    items={getValue(dimension, formatDateRange)}
    label={i18next.t(dimension.name.toUpperCase())}
    maxLength={maxLength ?? MAX_LENGTH_ITEM_LIST}
    showExpandButton={showExpandButton}
    expandButton={<ShowAllModal dimensionName={dimension.name} />}
    renderItem={(item: string) => item}
    onlyLabel={dimension.name === "chain"}
  />
);

export const parseLogic = <
  TLogic extends Record<string, any> | TLogic[],
  TReturn extends string | string[] = string
>(
  logic: TLogic
): TReturn => {
  if (Array.isArray(logic)) {
    return logic.map((logicItem: string | TLogic) => {
      if (typeof logicItem !== "object") {
        return logicItem;
      }

      if ("var" in logicItem) {
        let value = logicItem["var"];

        if (window.allDict && value?.startsWith("custom_")) {
          value = window.allDict[value]?.title ?? value;
        }

        return i18next.t(value.toUpperCase());
      }

      return parseLogic<TLogic, string>(logicItem);
    }) as TReturn;
  }

  const op = Object.keys(logic)[0];
  const l = logic[op];

  if (op === "!") {
    return ("!" + parseLogic<TLogic, string>(l)) as TReturn;
  }

  const res = parseLogic<TLogic, string[]>(l);
  if (Array.isArray(res) && res.length > 1) {
    return `(${res.join(` ${i18next.t(op.toUpperCase())} `)})` as TReturn;
  }

  return res.join(` ${i18next.t(op.toUpperCase())}`) as TReturn;
};

export function getDimensions<
  TDimension extends
    | WidgetParamsDimension
    | WidgetParamsDimension[]
    | null
    | undefined,
  TReturn extends TDimension extends WidgetParamsDimension[] | null | undefined
    ? DimensionsType[]
    : DimensionsType
>(
  dimension: TDimension,
  formatDateRange: FormatDateRangeType,
  ignore: string[] = []
): TReturn | null {
  if (!dimension) return null;

  if (Array.isArray(dimension)) {
    return dimension
      .filter(f => !ignore.includes(f.name))
      .map(filter => ({
        displayName: `${i18next.t("FILTER")}: ${i18next.t(
          filter["name"].toUpperCase()
        )}`,
        originalName: filter["name"],
        values: getValue(filter, formatDateRange)
      })) as TReturn;
  }

  return {
    displayName: `${i18next.t("DIMENSION")}: ${i18next.t(
      dimension["name"].toUpperCase()
    )}`,
    originalName: dimension["name"],
    values: getValue(dimension, formatDateRange)
  } as TReturn;
}

export const countValues = (
  dimension: WidgetParamsDimension | WidgetParamsDimension[]
): number => {
  if (!dimension.values) return 0;
  if (Array.isArray(dimension.values)) return dimension.values.length;
  return 1;
};

export const getCountValues = (
  item: WidgetParams,
  formatDateRange: FormatDateRangeType
): Record<string, number> => {
  if (!item.filters) return {};
  const resultObj: Record<string, number> = {};

  item.filters.forEach(d => {
    resultObj[d.name] = getValue(d, formatDateRange).length;
  });

  if (item.dimension) {
    const val = getValue(item.dimension, formatDateRange);
    resultObj[item.dimension.name] = val.length;
  }

  return resultObj;
};

export const getDimensionNameByKey = (key: string): string => {
  const specificDimensionNames = {
    category: "CATEGORIES"
  };

  type Key = keyof typeof specificDimensionNames;
  return specificDimensionNames[key as Key] ?? key.toUpperCase() + "S";
};
