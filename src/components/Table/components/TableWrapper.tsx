import { useRef, useState, useEffect, useMemo } from "react";
import { resizeDetector } from "@/utils/resizeDetector";
import { getAbsoluteHeight } from "@/utils/sizeUtils";
import { useTable } from "@/components/Table/hooks/useTable";

import type { FC, HTMLAttributes, CSSProperties } from "react";

const TableWrapper: FC<HTMLAttributes<HTMLTableElement>> = ({
  style,
  ...tableProps
}) => {
  const resizeRef = useRef<() => void>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { height: _height, width: _width, ...tableStyles } = style ?? {};

  const {
    tableState: { dataSource },
    tableProps: { responsiveTable, autoHeight }
  } = useTable();

  const [width, setWidth] = useState<CSSProperties["width"]>(_width);
  const [height, setHeight] = useState<CSSProperties["height"]>(_height);

  useEffect(() => setWidth(_width), [_width]);
  useEffect(() => setHeight(_height), [_height]);

  useEffect(() => {
    if (wrapperRef.current && responsiveTable && dataSource?.length) {
      const container = wrapperRef.current.closest(".dw-table-container");

      if (container && container.parentElement) {
        const parent = container.parentElement;
        const pagination =
          container.getElementsByClassName("ant-pagination")[0];

        const toolbar =
          container.getElementsByClassName("dw-table__toolbar")[0];

        resizeRef.current?.();

        resizeRef.current = resizeDetector(parent, (elHeight, elWidth) => {
          const offset = [toolbar, pagination].reduce((acc, el) => {
            return el ? acc + getAbsoluteHeight(el as any) : acc;
          }, 0);

          const nextWidth = elWidth;
          const nextHeight = Math.max(0, Math.floor(elHeight - offset));

          setWidth(prev => (prev !== nextWidth ? nextWidth : prev));
          setHeight(prev => (prev !== nextHeight ? nextHeight : prev));
        });

        return resizeRef.current;
      }
    }
  }, [responsiveTable, wrapperRef, dataSource]);

  const styles = useMemo(() => {
    const stylesObject: CSSProperties = { width };

    if (autoHeight) stylesObject.maxHeight = height;
    else stylesObject.height = height;

    return stylesObject;
  }, [height, width, autoHeight]);

  return (
    <div style={styles} ref={wrapperRef} className="dw-table__wrapper">
      <table {...tableProps} style={tableStyles} />
    </div>
  );
};

export default TableWrapper;
