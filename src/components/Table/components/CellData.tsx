import React, { useMemo } from "react";
import { defineCellType } from "../utils/utils";
import { formatNumericValue, isNumeric } from "@/utils/helpers";

import type { IRow, IColumn, TableProps } from "../types";

export type CellDataProps<T = any> = Pick<
  TableProps,
  "dTypesConfig" | "cellRenderProps" | "rowPrefix" | "rowPrefixDeps"
> & {
  value: T;
  row: IRow;
  column: IColumn;
  yIndex: number;
  xIndex: number;
  columnLevel: number;
};

const CellData: React.FC<CellDataProps> = ({
  value,
  row,
  column,
  xIndex,
  yIndex,
  columnLevel,
  dTypesConfig,
  cellRenderProps,
  rowPrefix,
  rowPrefixDeps
}) => {
  const typeConfig = useMemo(() => {
    return dTypesConfig?.[defineCellType(value, column)];
  }, [dTypesConfig, value, column]);

  const cellDataRender = useMemo(() => {
    let outputValue = value;
    if (isNumeric(value)) outputValue = formatNumericValue(parseFloat(value));

    return typeConfig && typeConfig.render
      ? typeConfig.render(value, row, column, xIndex, cellRenderProps)
      : outputValue;
  }, [typeConfig, value, xIndex, cellRenderProps, column, row]);

  const deps = rowPrefixDeps ? rowPrefixDeps(row) : [];

  const rowPrefixRender = useMemo(() => {
    return (
      rowPrefix &&
      yIndex === 0 &&
      columnLevel === 1 &&
      rowPrefix(value, row, column, xIndex)
    );
    // eslint-disable-next-line
  }, [rowPrefix, value, xIndex, column, row, columnLevel, yIndex, ...deps]);

  return (
    <div className="dw-table__cell-data">
      {rowPrefixRender && <span className="row-prefix">{rowPrefixRender}</span>}
      {cellDataRender}
    </div>
  );
};

export default React.memo(CellData);
