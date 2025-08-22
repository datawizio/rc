import { useMemo, isValidElement } from "react";
import { useTable } from "@/components/Table/hooks/useTable";

import type { IColumn } from "@/components/Table/types";
import type { SafeKey } from "antd/es/table/interface";
import type {
  FC,
  PropsWithChildren,
  CSSProperties,
  HTMLAttributes
} from "react";

const Cell: FC<PropsWithChildren<HTMLAttributes<HTMLTableCellElement>>> = ({
  children,
  ...props
}) => {
  const {
    tableState: { columnsWidth }
  } = useTable();

  const style = useMemo(() => {
    const output: CSSProperties = {};
    const child = Array.isArray(children) && children[1];

    if (isValidElement<{ column: IColumn }>(child)) {
      const column = child?.props.column;
      const columnKey = column && (column.key as SafeKey);

      if (columnKey) {
        const width = columnsWidth?.[columnKey];
        if (width != null) output.width = `${width}px`;
        return output;
      }
    }
  }, [children, columnsWidth]);

  return (
    <td {...props} style={style}>
      <div className="dw-table__cell">{children}</div>
    </td>
  );
};

export default Cell;
