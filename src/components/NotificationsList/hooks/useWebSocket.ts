import { useWebSocketSubscription } from "@/hooks";
import { useCallback, useEffect } from "react";

import type { Dispatch } from "react";
import type {
  Action,
  IListItem,
  ListProps,
  ListState
} from "@/types/notifications";

export const useWebSocket = (
  state: ListState<IListItem>,
  dispatch: Dispatch<Action<IListItem>>,
  props: ListProps<IListItem>
) => {
  const { dataProvider, dataProviderDeps, messageId: id } = props;

  const fetchData = useCallback(
    async () => {
      if (dataProvider) {
        try {
          dispatch({ type: "loading", payload: true });
          await dataProvider(state);
        } catch (e) {
          if (e instanceof Error) {
            if (e.name === "CancelRequestError") {
              throw e;
            }

            console.warn("Table loading failed: " + e.message);
          }
        }
      }
    },
    // eslint-disable-next-line
    [dataProvider, state.pageSize, state.currentPage, state.force].concat(
      dataProviderDeps && dataProviderDeps(state)
    )
  );

  useEffect(() => {
    void fetchData();
  }, [dispatch, fetchData]);

  useWebSocketSubscription({
    id: id ?? "",
    callback: message => {
      const data = props.parseMessage ? props.parseMessage(message) : {};
      if (data) dispatch({ type: "update", payload: data });
    }
  });

  useWebSocketSubscription({
    id: `${id}-update`,
    message: props.updateSubscription?.message,
    callback: message => {
      props.updateSubscription?.callback(message, dispatch);
    }
  });

  return fetchData;
};
