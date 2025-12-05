import type { ReactElement, ReactNode, CSSProperties } from "react";
import type { PaginationType } from "antd/es/transfer/interface";

export type TransferFilterValue = {
  exclude: string[];
  include: string[] | null;
};

export interface ICheckedItem {
  key: string;
  title: string;
}
export type TransferFilterLoadDataByIdsParams = {
  ids: string[];
};

export type TransferFilterLoadDataByIdsResponse = {
  data: TransferFilterItem[];
};

export type TransferFilterLoadDataParams = {
  type: "tree" | "list";
  expanded?: string;
  page?: number;
  full?: boolean;
  pageCount?: number;
  search?: string;
  value?: string[];
  lastLevel?: boolean;
  exclude: string[];
  include: string[] | null;
  level?: number;
};

export type TransferFilterLoadDataResponse = {
  data: TransferFilterItem[];
  totalPages: number;
  count: number;
  expanded?: string[] | null;
  levels?: number[] | null;
};

export type TransferDirection = "left" | "right";

export interface RenderResultObject {
  label: ReactElement;
  value: string;
}

export type RenderResult = ReactElement | RenderResultObject | string | null;

export interface TransferFilterItem {
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
  | ((info: { selectedCount: number; totalCount: number }) => React.ReactNode);

export interface TransferFilterProps {
  value: TransferFilterValue;
  type: "tree" | "list";
  local?: boolean;
  prefixCls?: string;
  className?: string;
  disabled?: boolean;
  targetKeys?: string[];
  checkedKeys?: string[];
  operationDisabled?: boolean;
  onChange?: (value: TransferFilterValue) => void;
  onSelectChange?: (
    sourceCheckedKeys: string[],
    targetCheckedKeys: string[]
  ) => void;
  style?: CSSProperties;

  sourceTitle?: string;
  loadData?: (
    params: TransferFilterLoadDataParams,
    part: string
  ) => Promise<TransferFilterLoadDataResponse>;
  loadDataByIds?: (
    params: TransferFilterLoadDataByIdsParams
  ) => Promise<TransferFilterLoadDataByIdsResponse>;
  sourceFilters?: any;
  sourceActions?: ReactElement;
  targetTitle?: string;
  targetFilters?: any;
  targetActions?: ReactElement;
  tooltips?: { throwAll: string; throwChosen: string };

  pagination?: PaginationType;
  disableRoots?: boolean;
}

export interface TransferLocale {
  titles: string[];
  notFoundContent?: ReactNode;
  searchPlaceholder: string;
  itemUnit: string;
  itemsUnit: string;
}
