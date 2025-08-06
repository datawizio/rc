import type { ReactNode, FC, ComponentType } from "react";
import type { ListProps } from "antd";
import type { ListItemTypeProps as AntListItemTypeProps } from "antd/lib/list/Item";

export interface ListItemFieldProps {
  title: string;
  description: string;
  value?: string;
  customIcon?: ReactNode | null;
  id?: string;
  onClick?: () => void;
}

export interface ListItemHeaderProps {
  title: string;
}

export interface ListItemTypeProps extends AntListItemTypeProps {
  Field: ComponentType<ListItemFieldProps>;
  Header: ComponentType<ListItemHeaderProps>;
}

export type ListCompoundComponent<T = any> = FC<ListProps<T>> & {
  Item: ListItemTypeProps;
};
