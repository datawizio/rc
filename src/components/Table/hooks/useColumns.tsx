import CellData from "../components/CellData";
import { useMemo } from "react";

import type { SafeKey } from "antd/es/table/interface";
import type { IColumn, TableProps, TableState } from "../types";

export const useColumns = (
  state: TableState,
  props: TableProps
): Partial<TableState> => {
  const {
    columns,
    visibleColumnsKeys,
    sortParams,
    filterParams,
    columnsWidth,
    dTypesConfig
  } = state;

  const {
    sortable,
    columnsConfig,
    isResizableColumns,
    cellRenderProps,
    rowPrefix,
    rowPrefixDeps
  } = props;

  const initializedColumns = useMemo(() => {
    function initColumns(columns?: IColumn[], level = 1) {
      if (!columns) return [];

      return columns
        .reduce<IColumn[]>((acc, column, idx) => {
          const nextColumn: IColumn = {
            ...column,
            ...(columnsConfig?.[column.key as SafeKey] || {})
          };

          const isParent = nextColumn.children && nextColumn.children.length;
          const hasCheckedChildren =
            isParent &&
            nextColumn.children?.find(child =>
              visibleColumnsKeys.includes(child.key)
            );

          if (
            !nextColumn.fixed &&
            visibleColumnsKeys &&
            visibleColumnsKeys.length &&
            !visibleColumnsKeys.includes(nextColumn.key) &&
            !hasCheckedChildren
          ) {
            return acc;
          }

          if (isParent) {
            nextColumn.sorter = false;
            nextColumn.children = initColumns(nextColumn.children, level + 1);
          } else {
            nextColumn.sorter =
              "sorter" in nextColumn ? nextColumn.sorter : sortable;
          }

          if (!("render" in nextColumn)) {
            nextColumn.render = (value, record, index) => {
              return (
                <CellData
                  row={record}
                  value={value}
                  xIndex={index}
                  columnLevel={level}
                  column={nextColumn}
                  yIndex={nextColumn.fixed === "left" ? 0 : idx + 1}
                  dTypesConfig={dTypesConfig}
                  cellRenderProps={cellRenderProps}
                  rowPrefix={rowPrefix}
                  rowPrefixDeps={rowPrefixDeps}
                />
              );
            };
          }

          if (!("resizable" in nextColumn) && level === 1) {
            nextColumn.resizable = isResizableColumns;
          }

          nextColumn.onHeaderCell = () => {
            return { model: { ...nextColumn }, level } as any;
          };

          return acc.concat(nextColumn);
        }, [])
        .sort((a, b) => +Boolean(b.fixed) - +Boolean(a.fixed));
    }

    return initColumns(columns ?? []);
  }, [
    columns,
    columnsConfig,
    visibleColumnsKeys,
    sortable,
    dTypesConfig,
    cellRenderProps,
    rowPrefix,
    rowPrefixDeps,
    isResizableColumns
  ]);

  const { nextColumns, nextColumnWidth } = useMemo(() => {
    const nextColumnWidth: Record<string, number> = {};

    const nextColumns = (function rec(
      columns: IColumn[],
      defaultWidth: number
    ) {
      return columns.map((column: IColumn) => {
        const record = {
          ...column,
          sortOrder: sortParams[column.dataIndex],
          filteredValue:
            column.filters && filterParams[column.dataIndex]
              ? filterParams[column.dataIndex]
              : null
        };

        if (column.children && column.children.length) {
          record.children = rec(column.children, 130); // DEFAULT_SUBCOLUMN_WIDTH
        } else {
          nextColumnWidth[record.dataIndex] =
            columnsWidth?.[record.dataIndex] ?? record.colWidth ?? defaultWidth;
        }

        return record;
      });
    })(initializedColumns, 200);

    return { nextColumns, nextColumnWidth };
  }, [sortParams, filterParams, initializedColumns, columnsWidth]);

  return {
    columns: nextColumns,
    columnsWidth: nextColumnWidth
  };
};
