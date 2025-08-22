import { useEffect } from "react";
import type { Dispatch } from "react";
import type { TableProps, Action } from "../types";

export const usePropsToState = (
  dispatch: Dispatch<Action>,
  { columns, loading, dataSource, searchValue, visibleColumnsKeys }: TableProps
) => {
  useEffect(() => {
    if (loading !== undefined) {
      dispatch({ type: "loading", payload: !!loading });
    }
  }, [loading, dispatch]);

  useEffect(() => {
    if (searchValue !== undefined) {
      dispatch({ type: "update", payload: { searchValue } });
    }
  }, [searchValue, dispatch]);

  useEffect(() => {
    if (columns && columns.length > 0) {
      dispatch({ type: "updateColumns", payload: columns || [] });
    }
  }, [columns, dispatch]);

  useEffect(() => {
    if (dataSource) {
      dispatch({ type: "updateDataSource", payload: dataSource });
    }
  }, [dataSource, dispatch]);

  useEffect(() => {
    if (visibleColumnsKeys) {
      dispatch({ type: "visibleColumnsKeys", payload: visibleColumnsKeys });
    }
  }, [visibleColumnsKeys, columns, dispatch]);
};
