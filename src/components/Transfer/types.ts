import type { TransferListBodyProps } from "antd/es/transfer/ListBody";
import type { TransferListProps } from "./components/List";
import type {
  ReactElement,
  ReactNode,
  CSSProperties,
  SyntheticEvent
} from "react";

export type LoadDataParams = {
  page?: number;
  pageCount?: number;
  search?: string;
  value?: string[];
  componentId?: number;
};

export type LoadDataResponse = {
  data: TransferItem[];
  totalPages: number;
  count: number;
};

export type TransferDirection = "left" | "right";

export interface RenderResultObject {
  label: ReactElement;
  value: string;
}

export type RenderResult = ReactElement | RenderResultObject | string | null;

type TransferRender = (item: TransferItem) => RenderResult;

export interface TransferItem {
  key: string;
  title?: string;
  description?: string;
  disabled?: boolean;
  [name: string]: any;
}

export interface ListStyle {
  direction: TransferDirection;
}

export type SelectAllLabel =
  | ReactNode
  | ((info: { selectedCount: number; totalCount: number }) => ReactNode);

export interface TransferProps {
  prefixCls?: string;
  className?: string;
  disabled?: boolean;
  dataSource: TransferItem[];
  targetKeys?: string[];
  selectedKeys?: string[];
  render?: TransferRender;
  onChange?: (
    targetKeys: string[],
    direction: string,
    moveKeys: string[]
  ) => void;
  onSelectChange?: (
    sourceSelectedKeys: string[],
    targetSelectedKeys: string[]
  ) => void;
  style?: CSSProperties;
  listStyle: ((style: ListStyle) => CSSProperties) | CSSProperties;
  operationStyle?: CSSProperties;
  titles?: string[];
  operations?: string[];
  showSearch?: boolean;
  filterOption?: (inputValue: string, item: TransferItem) => boolean;
  locale?: Partial<TransferLocale>;
  footer?: (props: TransferListProps) => ReactNode;
  rowKey?: (record: TransferItem) => string;
  onSearch?: (direction: TransferDirection, value: string) => void;
  onScroll?: (
    direction: TransferDirection,
    e: SyntheticEvent<HTMLUListElement>
  ) => void;
  children?: (props: TransferListBodyProps<TransferItem>) => ReactNode;
  showSelectAll?: boolean;
  selectAllLabels?: SelectAllLabel[];
}

export interface TransferLocale {
  titles: string[];
  notFoundContent?: ReactNode;
  searchPlaceholder: string;
  itemUnit: string;
  itemsUnit: string;
}
