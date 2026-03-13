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

  const colKey = useMemo(() => {
    const child = Array.isArray(children) && children[1];
    if (isValidElement<{ column: IColumn }>(child)) {
      return (child?.props.column?.dataIndex ||
        child?.props.column?.key) as string;
    }
    return undefined;
  }, [children]);

  return (
    <td {...props} style={style} data-column-key={colKey}>
      <div className="dw-table__cell">{children}</div>
    </td>
  );
};

export default React.memo(Cell, (prevProps, nextProps) => {
  // Deep comparison of columnsWidth is expensive, but we only care about the width
  // of the specific column this cell belongs to.
  // We compare the components/children (which contain the column definition)
  // and manually check if the relevant width in the global state has changed.
  if (prevProps.children !== nextProps.children) return false;
  if (prevProps.className !== nextProps.className) return false;

  return true;
});
