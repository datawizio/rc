import NumberRangeCell from "./NumberRangeCell";
import type { DTypeConfig } from "@/components/Table/types";

export type NumberRangeType = {
  dtype: "number_range";
  value: number;
};

const DTNumberRange = {
  toString: cellVal => cellVal.value.toString(),
  render: (cellVal, row, column) => {
    return (
      <NumberRangeCell cellVal={cellVal.value} column={column} row={row} />
    );
  }
} as DTypeConfig<NumberRangeType>;

export default DTNumberRange;
