import type { ReactNode, FC, ComponentType } from "react";
import type { ListProps } from "antd";
import type { ListItemTypeProps as AntListItemTypeProps } from "antd/es/list/Item";

export interface ListItemFieldProps {
  id?: string;
  title: ReactNode;
  description: ReactNode;
  value?: ReactNode;
  customIcon?: ReactNode;
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
