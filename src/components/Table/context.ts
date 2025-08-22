import React, { type Dispatch } from "react";
import type { TableProps, TableState, Action } from "./types";

export const TableContext = React.createContext<{
  tableState: TableState;
  tableProps: TableProps;
  baseTableState: TableState;
  dispatch: Dispatch<Action>;
} | null>(null);
