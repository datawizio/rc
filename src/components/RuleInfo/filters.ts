import i18next from "i18next";
import {
  abcXyzMetricsOrder,
  defaultAbcXyzValues
} from "@/utils/filter/constants";

const PRICE_ABC_GROUPS = {
  "a": "I",
  "b": "II",
  "c": "III"
};

type ABC = keyof typeof PRICE_ABC_GROUPS;

const abcXyzMapper = {
  "default": (value: any) => {
    return {
      group: value.select?.toUpperCase() ?? null,
      values: (["a", "b", "c"] as const).map(
        x => `${x.toUpperCase()}: ${value[x]}%`
      )
    };
  },
  "price_abc": (value: any) => {
    return {
      group: value.select && `(${PRICE_ABC_GROUPS[value.select as ABC]})`,
      values: (["a", "b", "c"] as const).map((x, i, arr) => {
        return `${PRICE_ABC_GROUPS[x]}: ${value[arr[i]]} - ${
          value[arr[i + 1]] || value.last
        }`;
      })
    };
  },
  "coefficient_of_variation_abc": (value: any) => {
    return {
      group: value.select?.toUpperCase() ?? null,
      values: (["x", "y", "z"] as const).map(
        x => `${x.toUpperCase()}: ${value[x]}`
      )
    };
  }
} as const;

const abcXyzValuesAreEqual = (first: any, second: any) => {
  if ("a" in first && "a" in second) {
    return first.a === second.a && first.b === second.b && first.c === second.c;
  }

  if ("x" in first && "x" in second) {
    return first.x === second.x && first.y === second.y && first.z === second.z;
  }

  return false;
};

type AbcXyz = keyof typeof abcXyzMapper;
type AbcXyzValues = keyof typeof defaultAbcXyzValues;

export const getAbcXyzString = (key: string, value: any) => {
  if (key === "by") {
    return i18next.t(`BY_${value.toUpperCase()}`);
  }

  const name = i18next.t(key.toUpperCase());

  const mapFn = abcXyzMapper[key as AbcXyz] ?? abcXyzMapper["default"];
  const { group, values } = mapFn(value);

  const defaultValue = defaultAbcXyzValues[key as AbcXyzValues];
  const hasCustomValues = !abcXyzValuesAreEqual(value, defaultValue);
  const hasGroup = value.select !== null && group;

  if (!hasGroup && !hasCustomValues) {
    return null;
  }

  const groupText = hasGroup ? `: ${i18next.t("GROUP")} ${group}` : " ";
  const valuesText =
    hasGroup || hasCustomValues ? `(${values.join(", ")})` : "";

  return `${name}${groupText} ${valuesText}`;
};

export const filtersMapperFunctions = {
  "boolean": (value: boolean) => {
    return [value ? i18next.t("SELECTED") : i18next.t("NOT_SELECTED")];
  },
  "string": (value: string) => {
    return [i18next.t(value.toUpperCase())];
  },
  "number": {
    "category_level_view": (value: number) => {
      return [`${i18next.t("LEVEL_N")} ${value}`];
    }
  },
  "array": (value: Array<string | number>, type?: "include" | "exclude") => {
    if (type === "exclude") {
      const res = [...value];
      res[0] = `${i18next.t("ALL_EXCEPT")} ${res[0]}`;
      return res;
    }

    return value;
  },
  "object": {
    "new_products": (value: any) => {
      return [
        value.include
          ? i18next.t("SHOW_ONLY_NEW_PRODUCTS")
          : i18next.t("EXCLUDE_NEW_PRODUCTS_FROM_ANALYSIS")
      ];
    },
    "abc_xyz": (value: Record<string, any>) => {
      return abcXyzMetricsOrder
        .map(key => getAbcXyzString(key, value[key]))
        .filter(item => item !== null);
    }
  }
} as const;
