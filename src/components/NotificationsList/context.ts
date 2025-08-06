import { createContext, type Dispatch } from "react";
import type { Action, IListItem, ListState } from "@/types/notifications";

export const NotificationsListContext = createContext<{
  state: ListState<IListItem> | null;
  dispatch: Dispatch<Action<IListItem>> | null;
}>({ state: null, dispatch: null });
