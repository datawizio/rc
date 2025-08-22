import { useMemo } from "react";
import { Tooltip } from "antd";

import type { FC, ReactNode } from "react";
import type { IColumn, IRow } from "@/components/Table/types";

import "./index.less";

const rowColors = [
  "#A4C2F4",
  "#B6D7A8",
  "#F9E599",
  "#EA9999",
  "#9966FF",
  "#999999",
  "#CC66CC",
  "#CC9966",
  "#CC0000",
  "#0033CC"
];

const BarCell: FC<{
  cellVal: number;
  column: IColumn;
  row: IRow;
  xIndex: number;
  tooltip?: ReactNode;
}> = ({ cellVal, column, xIndex, tooltip }) => {
  const defaultMax = 10;

  const max = useMemo(() => {
    return column.max_value && column.max_value >= defaultMax
      ? column.max_value
      : defaultMax;
  }, [column.max_value]);

  return (
    <div className="bar-cell">
      <div className="bar-sub-cell-wrapper">
        {Array.from({ length: max }, (_, idx) => {
          return (
            <span className="bar-sub-cell" key={idx}>
              {cellVal > idx && (
                <Tooltip title={tooltip}>
                  <div
                    className="bar-item"
                    style={{ backgroundColor: rowColors[xIndex] }}
                  ></div>
                </Tooltip>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default BarCell;
