import type { SortParamsPriority, TableState } from "@/components/Table/types";

export type TableTemplate = {
  id?: number;
  title: string;
  favorite: boolean;
  state: TableTemplateState;
};

export type TableTemplateState = {
  columnsPositions: LiteColumn[];
  sortParamsPriority: SortParamsPriority;
  fetchAfterApply?: boolean;
} & Partial<TableState>;

export type LiteColumn = {
  dataIndex: string;
  children?: LiteColumn[];
  order?: number;
};
