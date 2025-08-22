import type { FC } from "react";
import type { IColumn, IRow } from "@/components/Table/types";

import "./index.less";

const DEFAULT_MAX = 10;

const NumberRangeCell: FC<{
  cellVal: number;
  column: IColumn;
  row: IRow;
}> = ({ cellVal }) => {
  const min = 0;
  const max = cellVal >= DEFAULT_MAX ? cellVal : DEFAULT_MAX;

  return (
    <div className="number-range-cell">
      <span>{min}</span>
      <span>{max}</span>
    </div>
  );
};

export default NumberRangeCell;
