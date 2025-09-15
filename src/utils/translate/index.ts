import i18n from "i18next";
import type { IColumn, IRow, TableResponse } from "@/components/Table/types";

export const translateArray = (array: Array<string>) => {
  return array.map(item => i18n.t(item));
};

export const translateObjects = <T>(
  array: T | any,
  propertyName: string = "title"
): T => {
  return array.map((item: any) => ({
    ...item,
    value: item.value !== undefined ? item.value : item.id,
    [propertyName]: i18n.t(item[propertyName])
  }));
};

interface TranslateTableResponseOptions {
  /** Translate only column's header */
  onlyColumns?: boolean;

  /**
   * List of column keys to be translated.
   * If not provided, all columns will be translated.
   */
  columnsToTranslate?: string[];

  /*
   * An optional condition to determine whether a specific column
   * should be translated during the translation process.
   */
  translateByCondition?: (column: IColumn) => boolean;
}

export function translateTableResponse(
  fetcher: (...args: any) => Promise<TableResponse>,
  options?: TranslateTableResponseOptions
): (...args: any) => Promise<TableResponse> {
  return async (...args: any) => {
    const response = await fetcher(...args);

    if (response.results) {
      const {
        results: { columns, dataSource }
      } = response;

      response.results.columns = columns && translateColumns(columns, options);

      if (!options?.onlyColumns && dataSource) {
        response.results.dataSource = translateDataSource(dataSource, options);
      }
    }

    return response;
  };
}

export function translateColumns(
  columns: Array<IColumn>,
  options?: TranslateTableResponseOptions
): IColumn[] {
  return [...columns].map(column => {
    const nextColumn = { ...column };

    if (
      !options?.translateByCondition ||
      (options?.translateByCondition && options.translateByCondition(column))
    ) {
      nextColumn.title = i18n.t(column.title as string);
    }

    if (column.children && column.children.length) {
      nextColumn.children = translateColumns(column.children, options);
    }

    const filters = column.filters as Record<string, any>;

    if (column.filters) {
      const filterData = filters.data;
      if (Array.isArray(filterData) && filterData.length === 0) {
        delete nextColumn.filters;
      } else {
        nextColumn.filters = filters.need_translate
          ? translateObjects(filterData, "text")
          : filterData;

        nextColumn.filterMultiple = filters.multi_select;
      }
    }

    return nextColumn;
  });
}

export function translateDataSource(
  dataSource: Array<IRow>,
  options?: TranslateTableResponseOptions
): IRow[] {
  return [...dataSource].map(row => {
    let filteredRow = Object.entries(row);

    if (options?.columnsToTranslate?.length) {
      filteredRow = filteredRow.filter(([dataIndex]) => {
        return options.columnsToTranslate?.includes(dataIndex);
      });
    }

    return filteredRow.reduce(
      (acc, [dataIndex, cell]: any) => {
        if (Array.isArray(cell)) {
          if (dataIndex === "children") {
            acc[dataIndex] = translateDataSource(cell);
            return acc;
          }
          acc[dataIndex] = cell;
          return acc;
        }
        if (typeof cell === "string") acc[dataIndex] = i18n.t(cell) as string;
        if (typeof cell === "object") {
          acc[dataIndex] = {
            ...cell,
            value: i18n.t(cell.value) as string
          };
        }

        return acc;
      },
      { ...row }
    );
  });
}
