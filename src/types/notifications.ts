import type { ReactNode, MouseEvent, Dispatch } from "react";
import type { ListProps as AntListProps } from "antd";
import type { WebSocketMessage } from "@/utils/ws";

export interface IListItem {
  id: string;
  title: string;
  read: boolean;
  createdAt: string;
}

export type RenderItemProps<T> = {
  item: T;
  onCheckChange?: (id: string) => void;
  checked?: boolean;
};

export interface ListProps<T> extends Omit<AntListProps<T>, "renderItem"> {
  dataProvider: (
    state: ListState<T>
  ) => Partial<ListState<T>> | Promise<Partial<ListState<T>>> | void;
  dataProviderDeps: (state: ListState<T>) => any[];
  total?: number;
  pageSize?: number;
  currentPage?: number;
  showAllColumns?: boolean;
  renderItem?: (props: RenderItemProps<T>) => ReactNode;
  parseMessage?: (message: WebSocketMessage) => Partial<ListState<T>> | null;
  messageId?: string;
  actions?: ReactNode;
  updateSubscription?: {
    message?: WebSocketMessage;
    callback: (
      message: WebSocketMessage,
      dispatch: Dispatch<Action<IListItem>>
    ) => void;
  };
  groupListItems?: (item: Array<T>) => Array<T & { groupName?: string }>;
  nothingHereMessage?: ReactNode;
  showActions?: boolean;
}

export type CheckAllStatus = "all" | "partial" | null;

export interface ListState<T> extends ListProps<T> {
  checkedKeys: Set<string>;
  checkedAllOnPage: CheckAllStatus;
  checkedAll: boolean;
  force: number;
}

export type Action<T> =
  | { type: "update"; payload: Partial<ListState<T>> }
  | { type: "updateItems"; payload: Partial<ListState<T>>[] }
  | { type: "paginate"; payload: { page: number; pageSize: number } }
  | { type: "updatePaginate"; payload?: string }
  | { type: "check"; payload: string }
  | { type: "checkAllOnPage"; payload?: boolean }
  | { type: "checkAll" }
  | { type: "reload" }
  | { type: "loading"; payload: boolean }
  | { type: "setChecked"; payload: string[] };

export interface INotificationConfig {
  app_id: number;
  dashboard_id: string;
  widget_id: string;
  text: string;
  rule: any;
  rule_id: number;
  rule_name: string;
  rule_names: string[];
  report_name?: string;
  date_from?: string;
  days_count?: number;
  total_count?: number;
  media_name?: string;
  thumbnail?: string;
}

export interface INotification extends IListItem {
  read: boolean;
  archive: boolean;
  description: string;
  message: string;
  createdAt: string;
  dtype: string;
  clientId: string;
  conf: INotificationConfig;
}

export interface NotificationActions {
  onOpenLink?: (e: MouseEvent<HTMLElement>) => void;
  onDelete?: (e: MouseEvent<HTMLElement>) => void;
  onRestore?: (e: MouseEvent<HTMLElement>) => void;
  onMarkAsRead?: (e: MouseEvent<HTMLElement>) => void;
  onMarkAsUnread?: (e: MouseEvent<HTMLElement>) => void;
}

export type NotificationPageType = "unread_page" | "deleted_page" | null;
