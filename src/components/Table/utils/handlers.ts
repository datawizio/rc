import { defineCellType } from "./utils";
import { deepFilter } from "@/utils/deepFilter";

import type { DataSourceType, HandlerResponse, IRow } from "../types";
import type {
  FilterHandlerType,
  SearchHandlerType,
  SorterHandlerType
} from "../types";

export const basicSearchHandler: SearchHandlerType = (
  columnsMap,
  visibleColumnsKeys,
  dataSource,
  searchValue,
  dTypesConfig
) => {
  const expandedRowKeys: string[] = [];

  const foundRows = deepFilter(
    dataSource,
    (row: IRow) => {
      return Object.entries(row).some(([dataIndex, cellVal]) => {
        // Exclude hidden columns from search
        if (
          !dataIndex.includes("name") &&
          visibleColumnsKeys.length &&
          !visibleColumnsKeys.includes(dataIndex)
        ) {
          return false;
        }

        const typeConfig =
          dTypesConfig?.[defineCellType(cellVal, columnsMap[dataIndex])];

        return (
          typeConfig &&
          searchValue &&
          typeConfig.search &&
          typeConfig.search(cellVal, searchValue.trim())
        );
      });
    },
    parent => expandedRowKeys.push(parent.key)
  );

  const response: HandlerResponse = { dataSource: foundRows };

  if (expandedRowKeys.length) {
    response.expandedRowKeys = expandedRowKeys;
  }

  return response;
};

export const basicFilterHandler: FilterHandlerType = (
  columnsMap,
  dataSource,
  filterParams,
  dTypesConfig
) => {
  const filterData = (dataSource?: DataSourceType) => {
    return deepFilter(dataSource, (row: IRow) =>
      Object.entries(filterParams).some(([dataIndex, filterParameter]) => {
        const cellVal = row[dataIndex];
        const typeConfig =
          dTypesConfig?.[defineCellType(cellVal, columnsMap[dataIndex])];

        return filterParameter?.some(
          filterBy => typeConfig?.filter && typeConfig.filter(cellVal, filterBy)
        );
      })
    );
  };

  return {
    dataSource: Object.keys(filterParams).length
      ? filterData(dataSource)
      : dataSource
  };
};

export const basicSortHandler: SorterHandlerType = (
  columnsMap,
  dataSource,
  sortParams,
  dTypesConfig
) => {
  const [dataIndex, order] = Object.entries(sortParams)[0] || [];
  if (!order) return { dataSource };

  const sortData = (dataSource: DataSourceType) => {
    let sortedDataSource = dataSource.sort((aRow, bRow) => {
      const a = aRow[dataIndex];
      const b = bRow[dataIndex];

      const { sorter } =
        dTypesConfig?.[defineCellType(a, columnsMap[dataIndex])] ?? {};

      const compareResult = sorter ? sorter(a, b) : 0;

      if (compareResult !== 0)
        return order === "ascend" ? compareResult : -compareResult;

      return 0;
    });

    sortedDataSource = sortedDataSource.map(item => {
      if (item.children) {
        return {
          ...item,
          children: sortData(item.children)
        } as any;
      }
      return item;
    });

    return sortedDataSource;
  };

  return { dataSource: dataSource && sortData(dataSource) };
};
