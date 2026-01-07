import React, { useMemo, isValidElement } from "react";
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
    tableState: { columnsWidth, columns }
  } = useTable();

  const style = useMemo(() => {
    const output: CSSProperties = {};
    const child = Array.isArray(children) && children[1];

    if (isValidElement<{ column: IColumn }>(child)) {
      const column = child?.props.column;
      const parentWidth =
        column?.parent_key && columnsWidth?.[column.parent_key];

      if (parentWidth) {
        const parentChildren =
          columns?.find(item => item.key === column.parent_key)?.children ?? [];

        const childWidth = parentWidth / parentChildren.length;

        if (Number.isFinite(childWidth)) {
          output.width = `${childWidth}px`;
          return output;
        }
      }

      if (column?.key) {
        const width = columnsWidth?.[column.key as SafeKey];

        if (width !== undefined && width !== null) {
          output.width = `${width}px`;
        }
      }
    }

    return output;
  }, [children, columns, columnsWidth]);

  return (
    <td {...props} style={style}>
      <div className="dw-table__cell">{children}</div>
    </td>
  );
};

export default React.memo(Cell);
