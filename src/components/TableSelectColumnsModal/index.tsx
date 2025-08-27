import { useMemo } from "react";
import { TableSelectColumnsModalModal } from "./components/Modal";
import { useTable } from "@/components/Table/hooks/useTable";

import type { FC } from "react";
import type { IColumn } from "@/components/Table/types";

import "./index.less";

export interface TableSelectColumnsModalProps {
  locale?: {
    apply: string;
    checkAll: string;
    openButton: string;
    headerModal: string;
  };
  showSelectedCount?: boolean;
  onSubmit?: (selected?: string[]) => void;
  withSearch?: boolean;
  maxCheckedKeys?: number;
  fetchAfterApply?: (selected: string[], row: any) => boolean;
  filterSelectedColumns?: (selected: string[]) => string[];
  additionalVisibleColumns?: string[];
  hiddenColumns?: string[];
}

const defaultProps = {
  locale: {
    apply: "SUBMIT",
    checkAll: "ALL",
    openButton: "COLUMNS",
    headerModal: "SELECT_COLUMNS"
  },
  withSearch: true
};

const TableSelectColumnsModal: FC<TableSelectColumnsModalProps> = (
  props = defaultProps
) => {
  const { tableState, baseTableState } = useTable();

  const treeData = useMemo(() => {
    const fixedColumnsKeys = tableState.columns
      ?.filter(column => column.fixed)
      ?.map(column => column.key);

    return (function rec(columns?: IColumn[], parent?: IColumn): any[] {
      if (!columns) return [];
      return columns?.map(column => ({
        key: column.key,
        parentKey: parent && parent.key,
        title: column.title,
        disabled: fixedColumnsKeys?.includes(column.key),
        children: column.children && rec(column.children, column)
      }));
    })(baseTableState.columns);
  }, [baseTableState.columns, tableState.columns]);

  return <TableSelectColumnsModalModal {...props} treeData={treeData} />;
};

export default TableSelectColumnsModal;
