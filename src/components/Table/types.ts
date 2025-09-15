import { ColumnIcons } from "./utils/columnIcons";

import type { TableProps as AntdTableProps, ColumnProps } from "antd/lib/table";
import type { MaybePromise, Overwrite } from "@/types/utils";
import type {
  TableTemplateState,
  TableTemplate
} from "../TableTemplates/types";

import type {
  ForwardRefExoticComponent,
  RefAttributes,
  ComponentType,
  ReactNode,
  ReactElement,
  PropsWithChildren
} from "react";

import type {
  SortOrder,
  SorterResult,
  TableLocale
} from "antd/lib/table/interface";

import type { ColumnType, FilterValue } from "antd/es/table/interface";

export type TableCompoundComponent = {
  ToolBar: ComponentType<PropsWithChildren>;
} & ForwardRefExoticComponent<TableProps & RefAttributes<TableRef>>;

/* Table types */

type OverwrittenTableProps<RT> = {
  columns?: IColumn<RT>[];
  dataSource?: DataSourceType;
  locale?: { total: string } & TableLocale;
};

type IColumnsSorter = (
  columns: IColumn[],
  oldColumnsInfo: { [k: string]: Partial<IColumn> },
  columnsSwapped?: boolean,
  templateSelected?: boolean
) => void;

export type SorterObject = Required<
  Exclude<ColumnType["sorter"], boolean | undefined | CallableFunction>
>;

export type TableProps<RT = any> = Overwrite<
  AntdTableProps<RT>,
  OverwrittenTableProps<RT>
> & {
  width?: string | number;
  height?: string | number;
  searchValue?: string;
  async?: boolean;
  autoColWidth?: boolean;
  compressColumns?: boolean;
  showAllColumns?: boolean;
  sortable?: boolean;
  forceColumns?: boolean;
  showSizeChanger?: boolean;
  multisorting?: boolean;
  isResizableColumns?: boolean;
  isNested?: (row: any) => boolean;
  showExpandIcon?: (row: any) => boolean;
  onColumnWidthChange?: (columnKey: string, width: number) => void;
  expandRowCallback?: (row: any) => void;
  sortColumnCallback?: (column: any) => void;
  calcColumnWidth?: (width: number) => number;

  error?: { message: string };

  errorRender?: (error: { message: string }) => ReactElement;

  /**
   * The table shrinks and stretches to the height specified in `height`.
   */
  autoHeight?: boolean;

  /**
   * Sets the table size based on its parent
   */
  responsiveTable?: boolean;

  /**
   * Stretches columns to the width of the table if possible
   */
  responsiveColumns?: boolean;
  sortParams?: SortParams;
  sortParamsPriority?: SortParamsPriority;

  pageSizeOptions?: string[];
  defaultPageSize?: number;
  templates?: TableTemplate[];
  visibleColumnsKeys?: Array<IColumn["key"]>;

  cellRenderProps?: { [key: string]: any };

  dTypesConfig?: {
    [dType: string]: DTypeConfig;
  };

  columnsConfig?: {
    [columnKey: string]: Partial<IColumn>;
  };

  columnsSorter?: IColumnsSorter;

  rowPrefix?: RowPrefix;
  rowPrefixDeps?: (row: IRow) => any[];

  sortHandler?: SorterHandlerType;
  globalHandler?: GlobalHandlerType;
  searchHandler?: SearchHandlerType;
  filterHandler?: FilterHandlerType;

  dataProvider?: DataProvider;
  dataProviderDeps?: (state: any) => any[];
  templatesProvider?: () => Promise<TableTemplate[]>;
  rowChildrenProvider?: RowChildrenProviderType;
  nestedTableProvider?: (
    expandedTow: IRow
  ) => Promise<Partial<TableState> | Promise<Partial<TableState>>>;

  isTotalRow?: (rowKey: string) => boolean;
};

export interface TableState extends Partial<TableProps> {
  sortParams: SortParams;
  filterParams: FilterParams;
  stateIsRecovered?: boolean;
  forceFetch: number;
  columnsMap: { [key: string]: IColumn };
  visibleColumnsKeys: Array<IColumn["key"]>;
  parentsMap: { [key: string]: string };
  loadingRows: { [key: string]: boolean };
  columnsSwapped?: boolean;
  columnsSorter?: IColumnsSorter;
  columnsWidth?: {
    [columnKey: string]: number;
  };
  fixedTotal?: boolean;
  first?: boolean;
  firstRenderLoader?: boolean;
  templateSelected?: boolean;
  columnsForceUpdate?: number;
  cancelled?: boolean;
  oldColumns?: Array<IColumn["key"]>;
}

export interface ISheetState {
  [key: string]: any[];
}

export interface ISheet {
  name: string;
  state: ISheetState;
}

export interface TableRef {
  reload: () => void;
}

export type Action =
  | { type: "expandRow"; payload: IRow }
  | { type: "search"; payload: string }
  | { type: "loading"; payload: boolean }
  | { type: "resetPagination"; payload?: number }
  | { type: "collapseRow"; payload: IRow }
  | { type: "sort"; payload: SorterResult<any>[] }
  | {
      type: "update";
      payload: Partial<TableState>;
    }
  | { type: "recoveryState"; payload: TableTemplateState }
  | { type: "paginate"; payload: TableState["pagination"] }
  | { type: "filter"; payload: Record<string, FilterValue | null> }
  | {
      type: "updateColumns";
      payload: TableProps["columns"] | Partial<TableProps & TableState>;
    }
  | { type: "setRowChildren"; payload: [IRow, IRow["children"]] }
  | { type: "addLoadingRow"; payload: string }
  | {
      type: "setNestedTable";
      payload: [
        IRow,
        Partial<TableState> | Promise<Partial<TableState>> | undefined
      ];
    }
  | { type: "updateDataSource"; payload: TableProps["dataSource"] }
  | { type: "updateRow"; payload: [IColumn["key"], IColumn] }
  | { type: "swapColumns"; payload: [IColumn["key"], IColumn["key"]] }
  | {
      type: "visibleColumnsKeys";
      payload: TableState["visibleColumnsKeys"];
    }
  | {
      type: "columnWidthChange";
      payload: { key: string; width: number };
    };

/* DataSource types */

export type DataSourceType = IRow[];

/* Column types */

type OverwrittenColumnProps<RT> = {
  children?: IColumn<RT>[];
};

export type IColumn<RT = any> = Overwrite<
  ColumnProps<RT>,
  OverwrittenColumnProps<RT>
> & {
  dtype?: string;
  dataIndex: string;
  resizable?: boolean;
  draggable?: boolean;
  default_visible?: boolean;
  icon?: ColumnIcons;
  max_value?: number;
  colWidth?: number;
  colMinWidth?: number;
  originalKey?: string;
  order?: number;
  index?: number;
  [key: string]: any;
};

/* Row types */

export type IRow = {
  [key: string]: BodyCellType;
} & { key: string; children: DataSourceType | undefined };

export type RowPrefix<T = any> = (
  cellVal: T,
  row: IRow,
  column: IColumn,
  index: number
) => ReactNode;

/* Cell types */

export type BodyCellType = string | number | boolean | object | CellObjectType;

export type CellObjectType = {
  dtype: string;
  [key: string]: any;
};

/* Data types config */

export type DTypeConfig<T = any> = {
  sorter?: (a: T, b: T) => number;
  toString: (cellVal: T) => string;
  toExcel?: (
    cellVal: T,
    row?: IRow,
    columnKey?: string,
    cellRenderProps?: any
  ) => any;
  search?: (cellVal: T, searchBy: string) => boolean;
  multiSearch?: (cellVal: T, searchBy: string) => boolean;
  filter?: (cellVal: T, filterBy: string | number | T) => boolean;
  tooltip?: (cellVal: T, row: IRow, column: IColumn) => ReactNode;
  defaultValue?: any;
  render?: (
    cellVal: T,
    row: IRow,
    column: IColumn,
    index: number,
    renderProps: TableProps["cellRenderProps"]
  ) => ReactNode;
};

/* Handlers */

export type HandlerResponse<T = Partial<TableState>> = T | void;

export type GlobalHandlerType = (
  state: TableState
) => HandlerResponse | Promise<HandlerResponse>;

export type SearchHandlerType = (
  columnsMap: TableState["columnsMap"],
  visibleColumnsKeys: TableState["visibleColumnsKeys"],
  dataSource: TableState["dataSource"],
  searchValue: TableState["searchValue"],
  dTypesConfig: TableState["dTypesConfig"]
) => HandlerResponse;

export type SorterHandlerType = (
  columnsMap: TableState["columnsMap"],
  dataSource: TableState["dataSource"],
  sortParams: SortParams,
  dTypesConfig: TableState["dTypesConfig"]
) => HandlerResponse;

export type FilterHandlerType = (
  columnsMap: TableState["columnsMap"],
  dataSource: TableState["dataSource"],
  searchValue: FilterParams,
  dTypesConfig: TableState["dTypesConfig"]
) => HandlerResponse;

export type FilterParams = Record<string, FilterValue | null>;

export type SortParams = {
  [columnKey: string]: SortOrder;
};

export type SortParamsPriority = { [key: string]: number };

/* Providers */

export type DataProvider = (
  state: TableState,
  fetchAll?: boolean
) => MaybePromise<Partial<TableState>>;

export type RowChildrenProviderType = (
  expandedRow: IRow,
  state: TableState
) => MaybePromise<IRow["children"]>;

export type PaginationResponse<R> = {
  count: number;
  results: R;
};

export type TableResponse = PaginationResponse<TableProps>;
