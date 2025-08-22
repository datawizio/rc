import { useEffect, useCallback, useRef } from "react";
import { getVisibleColumns } from "../utils/utils";

import type { Dispatch } from "react";
import type { TableState, Action, TableProps } from "../types";

export const useAsyncProviders = (
  state: TableState,
  dispatch: Dispatch<Action>,
  props: TableProps
) => {
  const { dataProvider, dataProviderDeps, templatesProvider } = props;
  const firstUpdate = useRef(true);

  const fetchData = useCallback(
    async (first = false) => {
      if (dataProvider) {
        try {
          const data = await dataProvider(state);

          if (first) {
            data.visibleColumnsKeys = data.showAllColumns
              ? []
              : getVisibleColumns(data.columns ?? []);

            if (!data.sortParams && props.sortParams) {
              data.sortParams = props.sortParams;
            }
          }

          dispatch({
            type: "update",
            payload: {
              ...data,
              first: false,
              firstRenderLoader: false
            }
          });
        } catch (e) {
          if (e instanceof Error) {
            if (e.name === "CancelRequestError") throw e;
            console.warn("Table loading failed: " + e.message);
          }
        }
      }
    },
    // eslint-disable-next-line
    [dataProvider].concat(dataProviderDeps && dataProviderDeps(state))
  );

  const recoveryState = useCallback(async () => {
    const templates = await templatesProvider?.();
    const favorite = templates?.find(template => template.favorite);

    dispatch({ type: "update", payload: { templates } });

    if (favorite) dispatch({ type: "recoveryState", payload: favorite.state });
    else await fetchData(true);
  }, [dispatch, templatesProvider, fetchData]);

  useEffect(() => {
    (async () => {
      dispatch({ type: "loading", payload: true });

      try {
        if (firstUpdate.current && templatesProvider) await recoveryState();
        else await fetchData(state.first || firstUpdate.current);
        dispatch({ type: "loading", payload: false });
      } catch (e) {
        if (e instanceof Error && e.name === "CancelRequestError") {
          return;
        }
        dispatch({ type: "loading", payload: false });
      }
    })();
    // eslint-disable-next-line
  }, [
    dispatch,
    fetchData,
    templatesProvider,
    recoveryState,
    state.stateIsRecovered,
    state.forceFetch
  ]);

  useEffect(() => {
    firstUpdate.current = false;
  }, []);

  return fetchData;
};
