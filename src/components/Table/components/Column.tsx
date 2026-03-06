import clsx from "clsx";
import { useTable } from "@/components/Table/hooks/useTable";
import { useDrag, useDrop } from "react-dnd";
import { useDebouncedCallback } from "use-debounce";
import { isSafari } from "@/utils/navigatorInfo";
import { columnIcons } from "../utils/columnIcons";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";

import type { DropTargetMonitor } from "react-dnd";
import type { SafeKey } from "antd/es/table/interface";
import type { IColumn } from "../types";
import type {
  FC,
  PropsWithChildren,
  HTMLAttributes,
  CSSProperties,
  MouseEvent
} from "react";

export interface ColumnProps extends HTMLAttributes<HTMLTableCellElement> {
  level: number;
  model: IColumn;
  virtual?: boolean;
  isHeader?: boolean;
  onWidthChange?: (columnKey: string, width: number) => void;
  calcColumnWidth?: (width: number) => number;
}

const DEFAULT_SUBCOLUMN_WIDTH = 130;
const DEFAULT_SUBCELL_WIDTH = 20;
const DEFAULT_MAX_VALUE = 10;

const getColumnWidth = (
  column: HTMLElement | null,
  minWidth: number,
  virtual: boolean
) => {
  if (!virtual && column?.style.width) {
    return Math.max(parseInt(column.style.width), minWidth);
  }

  if (column?.offsetWidth) {
    return Math.max(column.offsetWidth, minWidth);
  }

  return undefined;
};

const Column: FC<PropsWithChildren<ColumnProps>> = ({
  model,
  onClick,
  level,
  onWidthChange,
  virtual,
  isHeader,
  calcColumnWidth,
  ...restProps
}) => {
  const isSafariBrowser = isSafari();
  const [lastWidth, setLastWidth] = useState<number>(0);
  const startedResize = useRef<boolean>(false);
  const columnRef = useRef<HTMLTableCellElement>(null);
  const lastWidthRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const firstLoad = useRef(true);

  const {
    dispatch,
    tableState: {
      columnsWidth,
      columnsForceUpdate,
      sortParams,
      sortParamsPriority
    },
    tableProps: { multisorting }
  } = useTable();

  const sortingPriority: number = useMemo(() => {
    if (!multisorting) return 0;
    let params = Object.keys(sortParams);
    if (sortParamsPriority) {
      params = params.sort((a: string, b: string) => {
        return sortParamsPriority[a] - sortParamsPriority[b];
      });
    }
    if (params.length > 1) {
      const idx = params.findIndex((key: string) => key === model.key);
      if (idx !== -1) return idx + 1;
    }
    return 0;
  }, [model.key, multisorting, sortParams, sortParamsPriority]);

  const showColumnIcon = useMemo(
    () => !!model.icon && !!columnIcons[model.icon],
    [model]
  );

  const minWidth = useMemo(() => {
    if (model.colMinWidth) {
      return model.colMinWidth;
    }

    if (model.children?.length) {
      return model.children.length * DEFAULT_SUBCOLUMN_WIDTH;
    }

    if (model.parent_key) {
      return DEFAULT_SUBCOLUMN_WIDTH;
    }

    return 100;
  }, [model]);

  const calculateWidth = useCallback(
    (target: HTMLElement | null) => {
      return getColumnWidth(target, minWidth, Boolean(virtual));
    },
    [minWidth, virtual]
  );

  const [, dragRef] = useDrag({
    type: "column",
    item: { key: model.key, level },
    canDrag: !model.fixed && model.draggable !== false
  });

  const autoScroll = (step = 50) => {
    return (_col: IColumn, monitor: DropTargetMonitor) => {
      const SLOW_SCROLL_BREAKPOINT = 60;
      const FAST_SCROLL_BREAKPOINT = 25;

      const scrollTable = (
        node: HTMLElement | null | undefined,
        left: number
      ) => {
        node?.scroll({
          left,
          behavior: "smooth"
        });
      };

      if (virtual) {
        const tableHeaderDOMWrapper = columnRef.current?.closest(
          ".dw-table--virtual .ant-table-header"
        );
        const tableWrapper = tableHeaderDOMWrapper?.parentElement;

        const tableBodyDOMWrapper =
          tableWrapper?.querySelector<HTMLElement>(".ant-table-body");

        if (!tableBodyDOMWrapper || !tableHeaderDOMWrapper) return;

        const cursor = monitor.getClientOffset();
        const rectHeader = tableHeaderDOMWrapper.getBoundingClientRect();

        if (cursor && cursor.x - rectHeader.left < FAST_SCROLL_BREAKPOINT) {
          scrollTable(
            tableBodyDOMWrapper,
            tableBodyDOMWrapper.scrollLeft - step * 3
          );
          return;
        }
        if (cursor && rectHeader.right - cursor.x < FAST_SCROLL_BREAKPOINT) {
          scrollTable(
            tableBodyDOMWrapper,
            tableBodyDOMWrapper.scrollLeft + step * 3
          );
          return;
        }

        if (cursor && cursor.x - rectHeader.left < SLOW_SCROLL_BREAKPOINT) {
          scrollTable(
            tableBodyDOMWrapper,
            tableBodyDOMWrapper.scrollLeft - step
          );
          return;
        }
        if (cursor && rectHeader.right - cursor.x < SLOW_SCROLL_BREAKPOINT) {
          scrollTable(
            tableBodyDOMWrapper,
            tableBodyDOMWrapper.scrollLeft + step
          );
          return;
        }
      }

      const tableDOMWrapper = columnRef.current?.closest<HTMLElement>(
        ".ant-table-content > .dw-table__wrapper"
      );

      if (tableDOMWrapper && isSafariBrowser) {
        const cursor = monitor.getClientOffset();
        const rect = tableDOMWrapper.getBoundingClientRect();

        if (cursor && cursor.x - rect.left < SLOW_SCROLL_BREAKPOINT) {
          scrollTable(tableDOMWrapper, tableDOMWrapper.scrollLeft - step);
        }

        if (cursor && rect.right - cursor.x < SLOW_SCROLL_BREAKPOINT) {
          scrollTable(tableDOMWrapper, tableDOMWrapper.scrollLeft + step);
        }
      }
    };
  };

  const autoScrollDebounced = useDebouncedCallback(
    (col: IColumn, monitor: DropTargetMonitor) => {
      autoScroll()(col, monitor);
    },
    150
  );

  const dispatchWidthThrottled = useDebouncedCallback(
    (key: string, width: number) => {
      dispatch({
        type: "columnWidthChange",
        payload: { key, width }
      });
    },
    0, // Immediate update since Cells now use direct DOM sync during drag
    { leading: true, trailing: true }
  );

  const [{ isOver, canDrop }, dropRef] = useDrop<
    IColumn,
    unknown,
    { isOver: boolean; canDrop: boolean }
  >({
    accept: "column",
    drop: droppedItem => {
      dispatch({
        type: "swapColumns",
        payload: [droppedItem.key, model.key]
      });
    },
    canDrop: droppedItem => {
      return (
        droppedItem.level === level &&
        droppedItem.key !== model.key &&
        !model.fixed &&
        model.draggable !== false
      );
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    }),
    hover: autoScrollDebounced
  });

  const dndRef = useCallback(
    (ref: HTMLTableCellElement) => {
      columnRef.current = ref;
      dragRef(ref);
      dropRef(ref);
    },
    [dragRef, dropRef]
  );

  useEffect(() => {
    if (!isHeader) return;

    const colKey = model.dataIndex || model.key || model.originalKey;

    const fn = () => {
      if (!columnRef.current) {
        rafRef.current = requestAnimationFrame(fn);
        return;
      }

      const currentWidth = columnRef.current.offsetWidth;
      const shouldUpdateDOM = startedResize.current;
      const shouldUpdateState = firstLoad.current && currentWidth > 0;

      if (shouldUpdateDOM && currentWidth > 0 && currentWidth >= minWidth) {
        if (currentWidth !== lastWidthRef.current) {
          lastWidthRef.current = currentWidth;

          // Instant Column Sync:
          // Directly update ALL cells (header and body) with this column key.
          // This ensures header and body move as one, bypassing React lag.
          const columnElements = document.querySelectorAll(
            `[data-column-key="${colKey}"]`
          );
          columnElements.forEach(el => {
            (el as HTMLElement).style.width = currentWidth + "px";
            (el as HTMLElement).style.minWidth = currentWidth + "px";
          });

          dispatchWidthThrottled(String(colKey), currentWidth);
        }
      } else if (
        shouldUpdateState &&
        currentWidth > 0 &&
        currentWidth >= minWidth
      ) {
        dispatch({
          type: "columnWidthChange",
          payload: {
            key: String(colKey),
            width: currentWidth
          }
        });
        firstLoad.current = false;
        lastWidthRef.current = currentWidth;
      }

      if (currentWidth > 0 && currentWidth < minWidth) {
        const columnElements = document.querySelectorAll(
          `[data-column-key="${colKey}"]`
        );
        columnElements.forEach(el => {
          (el as HTMLElement).style.width = minWidth + "px";
          (el as HTMLElement).style.minWidth = minWidth + "px";
        });
        lastWidthRef.current = minWidth;
      }

      rafRef.current = requestAnimationFrame(fn);
    };

    rafRef.current = requestAnimationFrame(fn);

    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [
    isHeader,
    minWidth,
    calculateWidth,
    model.dataIndex,
    model.key,
    model.originalKey,
    model.children,
    model.parent_key,
    virtual,
    dispatch,
    dispatchWidthThrottled
  ]);

  const onMouseUpHandler = useCallback(() => {
    if (startedResize.current) {
      const externalKey = model.originalKey || model.key;
      const internalKey = model.dataIndex || model.key || model.originalKey;
      const width = calculateWidth(columnRef.current);

      if (typeof width === "number") {
        onWidthChange?.(String(externalKey), width);
        dispatchWidthThrottled.cancel();
        dispatch({
          type: "columnWidthChange",
          payload: {
            key: String(internalKey),
            width
          }
        });
      }
      startedResize.current = false;
    }
  }, [
    model.originalKey,
    model.key,
    model.dataIndex,
    onWidthChange,
    calculateWidth,
    dispatch,
    dispatchWidthThrottled
  ]);

  const onMouseDownHandler = useCallback(
    (event: MouseEvent<HTMLTableCellElement>) => {
      if (onWidthChange) {
        const rect = event.currentTarget.getBoundingClientRect();
        const isRightEdge = event.clientX > rect.right - 20;

        if (isRightEdge && model.resizable) {
          startedResize.current = true;
        }
      }
      setLastWidth(calculateWidth(event.currentTarget) ?? 0);
    },
    [onWidthChange, calculateWidth, model.resizable]
  );

  const onClickHandler = useCallback(
    (event: MouseEvent<HTMLTableCellElement>) => {
      const currentWidth = calculateWidth(event.currentTarget);
      if (typeof currentWidth === "number") {
        const isSameWidth = Math.abs(lastWidth - currentWidth) <= 1;
        if (isSameWidth && onClick) onClick(event);
      }
    },
    [lastWidth, onClick, calculateWidth]
  );

  useEffect(() => {
    if (!onWidthChange) return;
    window.addEventListener("mouseup", onMouseUpHandler);

    return () => {
      window.removeEventListener("mouseup", onMouseUpHandler);
    };
  }, [onWidthChange, onMouseUpHandler]);

  const className = useMemo(() => {
    return clsx(
      "dw-table__column",
      {
        "dw-table__column--resizable": model.resizable,
        "dw-table__column--fixed": Boolean(model.fixed),
        "dw-table__column--drop-hover": isOver && canDrop,
        "dw-table__column--with-sorter-idx": multisorting && sortingPriority,
        "dw-table__column--fixed-left": model.fixed === "left",
        "dw-table__column--fixed-right": model.fixed === "right"
      },
      restProps.className
    );
  }, [
    model.resizable,
    model.fixed,
    isOver,
    canDrop,
    multisorting,
    sortingPriority,
    restProps.className
  ]);

  const styles = useMemo(() => {
    const getCurrentWidth = () => {
      const colKey = model.dataIndex || model.key || model.originalKey;
      if (startedResize.current && lastWidthRef.current >= minWidth) {
        return { width: lastWidthRef.current };
      }

      const columnsWidthPreset = columnsWidth?.[colKey as SafeKey];
      if (columnsWidthPreset) {
        return { width: Math.max(columnsWidthPreset, minWidth) };
      }

      if (model.colWidth) {
        return { width: Math.max(model.colWidth, minWidth) };
      }

      if (model.children?.length) {
        return { width: model.children.length * DEFAULT_SUBCOLUMN_WIDTH };
      }

      if (model.max_value) {
        return {
          width:
            Math.max(model.max_value, DEFAULT_MAX_VALUE) * DEFAULT_SUBCELL_WIDTH
        };
      }

      return {};
    };

    if (model.parent_key) return {};

    const conf: Record<string, any> = getCurrentWidth();
    if (calcColumnWidth && typeof conf.width === "number") {
      conf.width = calcColumnWidth(conf.width);
    }

    if (typeof conf.width === "number") {
      lastWidthRef.current = conf.width;
    }

    conf.minWidth = minWidth + "px";
    return conf;
  }, [
    model,
    calcColumnWidth,
    minWidth,
    columnsWidth?.[
      model.dataIndex || model.key || (model.originalKey as SafeKey)
    ],
    columnsForceUpdate
  ]);

  return (
    <th
      {...restProps}
      ref={dndRef}
      className={className}
      onClick={onClickHandler}
      data-column-key={model.dataIndex || model.key || model.originalKey}
      title={String(model.title)}
      onMouseDown={onMouseDownHandler}
      style={
        {
          ...restProps.style,
          ...styles,
          "--order": sortingPriority
        } as CSSProperties
      }
    >
      <div
        className={clsx(
          "icon-column-container",
          !model.sorter && !model.filtered && "un-sortable-column"
        )}
      >
        {showColumnIcon && model.icon && columnIcons[model.icon]}
        {restProps.children}
      </div>
    </th>
  );
};

export default Column;
