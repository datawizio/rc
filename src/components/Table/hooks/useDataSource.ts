import { useMemo } from "react";
import type { HandlerResponse, TableProps, TableState } from "../types";

export const useDataSource = (
  state: TableState,
  props: TableProps
): Partial<TableState> => {
  const { sortHandler, filterHandler, searchHandler, async } = props;

  const {
    columnsMap,
    visibleColumnsKeys,
    sortParams,
    dataSource,
    searchValue,
    filterParams,
    dTypesConfig
  } = state;

  return useMemo(() => {
    let nextState: Partial<TableState> = { dataSource };
    if (async) return nextState;

    const setNextState = (newState: HandlerResponse<Partial<TableState>>) => {
      if (newState)
        nextState = {
          ...nextState,
          ...newState
        };
    };

    if (searchValue && searchValue.length) {
      const found = searchHandler?.(
        columnsMap,
        visibleColumnsKeys,
        nextState.dataSource,
        searchValue,
        dTypesConfig
      );
      setNextState(found);
    }

    if (Object.keys(filterParams).length) {
      const filtered = filterHandler?.(
        columnsMap,
        nextState.dataSource,
        filterParams,
        dTypesConfig
      );
      setNextState(filtered);
    }

    if (Object.keys(sortParams).length) {
      const sorted = sortHandler?.(
        columnsMap,
        nextState.dataSource,
        sortParams,
        dTypesConfig
      );
      setNextState(sorted);
    }

    return nextState;
    // eslint-disable-next-line
  }, [
    dataSource,
    columnsMap,
    searchValue,
    JSON.stringify(sortParams), // eslint-disable-line
    JSON.stringify(filterParams) // eslint-disable-line
  ]);
};
