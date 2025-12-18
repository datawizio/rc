import clsx from "clsx";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useTable } from "@/components/Table/hooks/useTable";
import { useDrag, useDrop } from "react-dnd";
import { useDebouncedCallback } from "use-debounce";
import { isSafari } from "@/utils/navigatorInfo";
import { columnIcons } from "../utils/columnIcons";

import type { DropTargetMonitor } from "react-dnd";
import type { SafeKey } from "antd/es/table/interface";
import type { IColumn, SorterObject } from "../types";
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

const DEFAULT_COLUMN_WIDTH = 200;
const DEFAULT_SUB_CELL_WIDTH = 20;
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
  const rafRef = useRef<number>(null);

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
  }, [
    model.key,
    // eslint-disable-next-line
    (model.sorter as SorterObject).multiple,
    multisorting,
    sortParams,
    sortParamsPriority
  ]);

  const showColumnIcon = useMemo(
    () => !!model.icon && !!columnIcons[model.icon],
    [model]
  );

  const minWidth = model.colMinWidth || 100;

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
    if (!onWidthChange) return;
    window.addEventListener("mouseup", onMouseUpHandler);

    return () => {
      window.removeEventListener("mouseup", onMouseUpHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isHeader) return;

    const colKey = model.dataIndex || model.key || model.originalKey;

    const sortersElements = columnRef.current?.querySelectorAll<HTMLElement>(
      ".ant-table-column-sorters"
    );

    if (sortersElements && sortersElements.length > 0) {
      sortersElements[0].style.setProperty("min-width", "0%");

      setTimeout(() => {
        sortersElements[0].style.setProperty("min-width", "100%");
      }, 1000);
    }

    const fn = () => {
      const columnWidth = calculateWidth(columnRef.current);

      // If the native resize set `width` below the minimum, immediately clamp it on the element.
      if (columnRef.current) {
        const styleWidth = parseInt(columnRef.current.style?.width);

        if (styleWidth < minWidth) {
          columnRef.current.style.width = minWidth + "px";
        }
      }

      // The width should only be changed for the current column (when `startedResize.current = true`)
      // or when the table is not in virtual mode (i.e. the resizing is handled by the browser).
      const shouldResize = !virtual || startedResize.current;

      if (
        shouldResize &&
        columnRef?.current &&
        typeof columnWidth === "number" &&
        lastWidthRef.current !== columnWidth &&
        columnWidth !== 0
      ) {
        dispatch({
          type: "columnWidthChange",
          payload: {
            key: colKey,
            width: columnWidth
          }
        });
      }

      rafRef.current = requestAnimationFrame(fn);
    };

    fn();

    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHeader]);

  const onMouseUpHandler = useCallback(() => {
    if (startedResize?.current) {
      const colKey = model.originalKey || model.key;
      const width = calculateWidth(columnRef.current);

      if (typeof width === "number") {
        onWidthChange?.(String(colKey), width);
      }
      startedResize.current = false;
    }
  }, [model.originalKey, model.key, onWidthChange, calculateWidth]);

  const onMouseDownHandler = useCallback(
    (event: MouseEvent<HTMLTableCellElement>) => {
      if (onWidthChange) startedResize.current = true;
      setLastWidth(calculateWidth(event.target as HTMLTableCellElement) ?? 0);
    },
    [onWidthChange, calculateWidth]
  );

  const onClickHandler = useCallback(
    (event: MouseEvent<HTMLTableCellElement>) => {
      const currentWidth = calculateWidth(event.target as HTMLTableCellElement);
      if (lastWidth === currentWidth && onClick) onClick(event);
    },
    [lastWidth, onClick, calculateWidth]
  );

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
    const getWidth = () => {
      const columnsWidthPreset = columnsWidth?.[model.key as SafeKey];

      if (columnsWidthPreset) {
        return { width: columnsWidthPreset };
      }

      if (model.colWidth) {
        return {
          width: model.colWidth
        };
      }

      if (model.children && model.children.length) {
        return {
          width: model.children.length * DEFAULT_COLUMN_WIDTH
        };
      }

      if (
        model.max_value &&
        (model.max_value === 0 || model.max_value < DEFAULT_MAX_VALUE)
      ) {
        model.max_value = DEFAULT_MAX_VALUE;
      }

      if (model.max_value) {
        return {
          width: model.max_value * DEFAULT_SUB_CELL_WIDTH
        };
      }

      return {};
    };

    if (model.parent_key) {
      return {};
    }

    const conf: Record<string, any> = getWidth();

    if (calcColumnWidth && typeof conf.width === "number") {
      conf.width = calcColumnWidth(conf.width);
    }

    if (typeof conf.width === "number") {
      lastWidthRef.current = conf.width;
    }

    conf.minWidth = minWidth + "px";
    return conf;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    model.children,
    model.max_value,
    model.colWidth,
    columnsForceUpdate,
    columnsWidth?.[model.key as SafeKey] // eslint-disable-line
  ]);

  return (
    <th
      {...restProps}
      ref={dndRef}
      className={className}
      onClick={onClickHandler}
      title={String(model.title)}
      onMouseDown={onMouseDownHandler}
      style={
        {
          ...styles,
          ...restProps.style,
          "--order": sortingPriority
        } as CSSProperties
      }
    >
      {showColumnIcon ? (
        <div
          className={clsx(
            "icon-column-container",
            !model.sorter && !model.filtered && "un-sortable-column"
          )}
        >
          {model.icon && columnIcons[model.icon]}
          {restProps.children}
        </div>
      ) : (
        restProps.children
      )}
    </th>
  );
};

export default Column;
