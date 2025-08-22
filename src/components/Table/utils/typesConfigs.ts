import { formatNumericValue } from "@/utils/helpers";
import type { DTypeConfig } from "../types";

export const basicDTypesConfig = {
  "number": {
    sorter: (a, b) => a - b,
    toString: value => value && formatNumericValue(value),
    filter: (value, filterBy) => value === filterBy,
    search: (value, searchBy) => {
      if (typeof value === "undefined" || value === null) return false;
      if (searchBy.includes(";")) {
        return basicDTypesConfig["number"].multiSearch?.(value, searchBy);
      }
      return value.toString().includes(searchBy);
    },
    multiSearch: (value, searchBy) => {
      const searchByArr = searchBy
        .trim()
        .split(";")
        .filter(i => i);
      return searchByArr.some(
        str =>
          str.trim() &&
          value.toString().trim().includes(str.trim().toLowerCase())
      );
    },
    render: value => value && formatNumericValue(value)
  } as DTypeConfig<number>,

  "boolean": {
    sorter: (a, b) => +a - +b,
    toString: value => value.toString(),
    filter: (value, filterBy) => value === filterBy
  } as DTypeConfig<boolean>,

  "string": {
    toString: value => value,
    sorter: (a, b) => a.localeCompare(b),
    filter: (value, filterBy) => value === filterBy,
    search: (value, searchBy) => {
      if (typeof value === "undefined" || value === null) return false;
      if (searchBy.includes(";")) {
        return basicDTypesConfig["string"].multiSearch?.(value, searchBy);
      }
      return value.toLowerCase().includes(searchBy.toLowerCase());
    },
    multiSearch: (value, searchBy) => {
      const searchByArr = searchBy
        .trim()
        .split(";")
        .filter(i => i);
      return searchByArr.some(
        str =>
          str.trim() &&
          value.trim().toLowerCase().includes(str.trim().toLowerCase())
      );
    }
  } as DTypeConfig<string>
};
