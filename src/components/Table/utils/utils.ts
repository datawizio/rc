import type { Key } from "react";
import type {
  BodyCellType,
  CellObjectType,
  IColumn,
  SortParams,
  SortParamsPriority,
  TableState
} from "../types";

export const defineCellType = (
  cell?: BodyCellType,
  column?: IColumn
): string => {
  const dType =
    column && column.dtype !== "object"
      ? column.dtype
      : (cell as CellObjectType)?.dtype;

  return dType || typeof cell;
};

export const filterByColumns = (
  columnsMap: TableState["columnsMap"],
  obj: { [columnKey: string]: any }
) => {
  return Object.keys(obj).reduce(
    (acc, columnKey) => {
      if (columnsMap[columnKey]) acc[columnKey] = obj[columnKey];
      return acc;
    },
    {} as Record<string, any>
  );
};

export const swapColumns = (
  columns: IColumn[] | undefined,
  keyFrom: IColumn["key"],
  keyTo: IColumn["key"]
) => {
  columns?.some((column, idxFrom) => {
    if (keyFrom === column.key) {
      const idxTo = columns.findIndex(column => column.key === keyTo);
      if (idxTo !== -1) {
        columns.splice(idxTo, 0, columns.splice(idxFrom, 1)[0]);
      }
      return true;
    }

    return (
      column.children?.length && swapColumns(column.children, keyFrom, keyTo)
    );
  });
};

export const reindexColumns = (columns: IColumn[] = []) => {
  columns.forEach((column, idx) => {
    column.order = idx;
  });
};

export const getVisibleColumns = (columns: IColumn[]) => {
  let flatList = true;

  const dig = (columns?: IColumn[]) => {
    let result: (Key | undefined)[] = [];

    columns?.forEach(column => {
      const isParent = column.children?.length;
      if (!isParent && column.default_visible !== false) {
        result.push(column.key);
      }

      if (isParent) {
        flatList = false;
        result = result.concat(dig(column.children));
      }
    });

    return result;
  };

  const result = dig(columns);
  if (flatList) {
    return result.length === columns.length ? [] : result;
  }
  return result;
};

export const setMultisortingForColumns = (
  columns: IColumn[],
  sortParams: SortParams,
  sortParamsPriority?: SortParamsPriority
): IColumn[] => {
  if (!columns) return [];
  let keys = Object.keys(sortParams);
  if (!keys.length) return columns;

  if (sortParamsPriority) {
    keys = keys.sort((a: string, b: string) => {
      return sortParamsPriority[a] - sortParamsPriority[b];
    });
  }

  return columns.map((col: IColumn) => {
    let multiple = 999;
    if (keys.includes(col.key as string)) {
      const i = keys.findIndex(k => k === col.key);
      if (i !== -1) {
        multiple = i + 1;
      }
    }
    return {
      ...col,
      sorter: {
        multiple
      }
    };
  });
};
