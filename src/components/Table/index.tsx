import clsx from "clsx";
import React from "react";
import SkeletonTable from "./components/SkeletonTable";
import Cell from "./components/Cell";
import Row from "./components/Row";
import Column from "./components/Column";
import ToolBar from "./components/ToolBar";
import TableWrapper from "./components/TableWrapper";
import HeaderWrapper from "./components/HeaderWrapper";

import { useMemo, useReducer, useCallback, useImperativeHandle } from "react";

import { Table as AntdTable } from "antd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { reducer, initializer } from "./reducer";
import { useColumns } from "./hooks/useColumns";
import { useDataSource } from "./hooks/useDataSource";
import { usePropsToState } from "./hooks/usePropsToState";
import { useAsyncProviders } from "./hooks/useAsyncProviders";
import { TableContext } from "./context";
import { isSafari } from "@/utils/navigatorInfo";
import { useConfig } from "@/hooks";

import {
  LoadingOutlined,
  RightOutlined,
  DownOutlined
} from "@ant-design/icons";

import {
  basicSortHandler,
  basicFilterHandler,
  basicSearchHandler
} from "./utils/handlers";

import type { HandlerFn } from "@/types/utils";
import type {
  TableProps,
  TableCompoundComponent,
  TableRef,
  IRow,
  IColumn
} from "./types";

import "./index.less";

export class CancelRequestError<T = any> extends Error {
  public data: T;

  constructor(data: T) {
    super("Canceled Request"); // (1)
    this.name = "CancelRequestError"; // (2)
    this.data = data;
  }
}

const tableDefaultProps: Partial<TableProps> = {
  bordered: true,
  sortable: true,
  isResizableColumns: true,
  autoColWidth: false,
  compressColumns: false,
  showSorterTooltip: false,

  size: "small",
  width: "auto",
  height: "auto",
  tableLayout: "fixed",

  locale: { total: "TABLE_TOTAL" },

  dTypesConfig: {},
  columnsConfig: {},
  cellRenderProps: {},

  columns: [],
  dataSource: [],
  pageSizeOptions: ["20", "35", "50", "100"],

  showSizeChanger: true,
  sortHandler: basicSortHandler,
  filterHandler: basicFilterHandler,
  searchHandler: basicSearchHandler
};

const Table = React.forwardRef<TableRef, TableProps>((customProps, ref) => {
  const props = { ...tableDefaultProps, ...customProps };

  const {
    errorRender,
    virtual,
    width = "auto",
    height = "auto",
    locale = { total: "TABLE_TOTAL" },
    isNested,
    children,
    components,
    autoColWidth,
    dataProvider,
    showExpandIcon,
    compressColumns,
    responsiveColumns,
    rowChildrenProvider,
    nestedTableProvider,
    onColumnWidthChange,
    expandRowCallback,
    sortColumnCallback,
    isTotalRow,
    calcColumnWidth,
    ...restProps
  } = props;

  const isAsync = props.async;

  const { translate } = useConfig();
  const [baseState, dispatch] = useReducer(reducer, props, initializer);

  const columnsState = useColumns(baseState, props);
  const dataSourceState = useDataSource(baseState, props);

  const state: any = useMemo(
    () => ({
      ...baseState,
      ...dataSourceState,
      ...columnsState,
      loading: false
    }),
    [baseState, columnsState, dataSourceState]
  );

  if (!isAsync) {
    if (state.pagination.total !== state.dataSource.length) {
      state.pagination.total = state.dataSource.length;
      dispatch({ type: "paginate", payload: state.pagination });
    }
  }

  if (dataSourceState.expandedRowKeys) delete dataSourceState.expandedRowKeys;

  const fetchData = useAsyncProviders(state, dispatch, props);

  usePropsToState(dispatch, props);

  const handleChangeTable = useCallback<HandlerFn<TableProps, "onChange">>(
    (pagination, filters, sorter, { action }) => {
      dispatch({ type: "filter", payload: filters });
      dispatch({
        type: "sort",
        payload: Array.isArray(sorter) ? [...sorter] : [sorter]
      });
      dispatch({ type: "paginate", payload: pagination });

      if (action === "sort" && sortColumnCallback) {
        sortColumnCallback(sorter);
      }
    },
    [sortColumnCallback]
  );

  const handleExpandRow = useCallback<HandlerFn<TableProps, "onExpand">>(
    async (isExpanded, row) => {
      let toggle = true;
      if ((isNested && isNested(row)) || (!isNested && nestedTableProvider)) {
        if (!row.nested) {
          dispatch({
            type: "addLoadingRow",
            payload: row.key
          });

          const result = await nestedTableProvider?.(row);
          if (!result) toggle = false;

          dispatch({
            type: "setNestedTable",
            payload: [row, result]
          });
        }
      } else if (rowChildrenProvider && row.children && !row.children.length) {
        dispatch({
          type: "addLoadingRow",
          payload: row.key
        });

        const children = await rowChildrenProvider(row, state);
        dispatch({
          type: "setRowChildren",
          payload: [row, children?.length ? children : undefined]
        });
      }

      if (toggle) {
        dispatch({
          type: isExpanded ? "expandRow" : "collapseRow",
          payload: row
        });
      }

      if (isExpanded) {
        expandRowCallback?.(row);
      }
    },
    [
      rowChildrenProvider,
      nestedTableProvider,
      isNested,
      state,
      expandRowCallback
    ]
  );

  const totalRenderer = useCallback(
    (total: number, [current, to]: [number, number]) => {
      return translate(locale.total, { current, to, total });
    },
    [translate, locale.total]
  );

  const expandIconRender = useCallback<HandlerFn<TableProps, "expandIcon">>(
    ({ expanded, onExpand, record, prefixCls, expandable }) => {
      const iconPrefix = `${prefixCls}-row-expand-icon`;
      if (state.loadingRows[record.key]) return <LoadingOutlined />;

      let icon = null;
      let internalExpandable = expandable;

      if (showExpandIcon) {
        internalExpandable = showExpandIcon(record);
      }

      if (internalExpandable) {
        icon = <RightOutlined />;
        if (expanded) {
          icon = <DownOutlined />;
        }
      }

      return (
        <button
          type="button"
          onClick={e => {
            onExpand(record, e!);
            e.stopPropagation();
          }}
          className={clsx(iconPrefix, {
            [`${iconPrefix}-spaced`]: !internalExpandable,
            [`${iconPrefix}-expanded`]: expandable && expanded,
            [`${iconPrefix}-collapsed`]: expandable && !expanded
          })}
          aria-label={expanded ? locale.collapse : locale.expand}
        >
          {icon}
        </button>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.loadingRows]
  );

  const customComponents = useMemo<TableProps["components"]>(() => {
    if (virtual) {
      return {
        header: {
          wrapper: HeaderWrapper,
          cell: props => {
            return props.model ? (
              <Column
                {...props}
                calcColumnWidth={calcColumnWidth}
                virtual={virtual}
                isHeader
                onWidthChange={onColumnWidthChange ?? (() => {})}
              />
            ) : (
              <th {...props} />
            );
          }
        }
      };
    }

    return {
      ...components,
      table: props => <TableWrapper {...props} style={{ height, width }} />,
      header: {
        cell: props => {
          return props.model ? (
            <Column
              calcColumnWidth={calcColumnWidth}
              isHeader
              {...props}
              onWidthChange={onColumnWidthChange}
            />
          ) : (
            <th {...props} />
          );
        }
      },
      body: {
        cell: props => <Cell {...props} />,
        row: props => <Row {...props} isTotalRow={isTotalRow} />
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [virtual, components, height, width, isTotalRow]);

  const className = useMemo(
    () =>
      clsx(
        "dw-table",
        {
          "dw-table--skeleton": baseState.firstRenderLoader && dataProvider,
          "dw-table--loading": baseState.loading,
          "dw-table--empty": !state.dataSource.length,
          "dw-table--nestedable": props.expandable?.expandedRowRender,
          "dw-table--responsive-columns": responsiveColumns,
          "dw-table--auto-col-width": autoColWidth,
          "dw-table--compress-columns": compressColumns,
          "dw-table--safari": isSafari(),
          "dw-table--virtual": virtual,
          "dw-table--small":
            height &&
            (typeof height === "string" ? parseInt(height) : height) < 200
        },
        props.className
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      baseState.loading,
      state.dataSource.length,
      props.expandable,
      props.className,
      responsiveColumns,
      autoColWidth,
      compressColumns
    ]
  );

  useImperativeHandle(ref, () => ({
    async load(payload: boolean = true) {
      dispatch({ type: "loading", payload });
    },
    async reload() {
      dispatch({ type: "loading", payload: true });
      await fetchData();
      dispatch({ type: "loading", payload: false });
    },
    updateRow(rowKey: string, data: IColumn) {
      dispatch({ type: "updateRow", payload: [rowKey, data] });
    },
    getState() {
      return state;
    },
    addLoadingRow(rowKey: string) {
      dispatch({ type: "addLoadingRow", payload: rowKey });
    },
    resetPagination(pageSize?: number) {
      dispatch({ type: "resetPagination", payload: pageSize });
    },
    expandRow(isExpanded: boolean, row: IRow) {
      handleExpandRow(isExpanded, row);
    }
  }));

  return (
    <div className="dw-table-container">
      <DndProvider backend={HTML5Backend}>
        <TableContext.Provider
          value={{
            tableProps: props,
            tableState: state,
            dispatch: dispatch,
            baseTableState: baseState
          }}
        >
          <SkeletonTable
            loading={Boolean(baseState.loading)}
            skeleton={Boolean(baseState.firstRenderLoader && dataProvider)}
          >
            {children}
            {state.error && errorRender ? (
              errorRender(state.error)
            ) : (
              <AntdTable
                {...restProps}
                {...state}
                virtual={virtual}
                scroll={
                  virtual
                    ? {
                        y: height
                        // x: 500
                      }
                    : undefined
                }
                expandIcon={expandIconRender}
                className={className}
                onExpand={handleExpandRow}
                onChange={handleChangeTable}
                components={customComponents}
                pagination={
                  props.pagination === false
                    ? false
                    : {
                        ...state.pagination,
                        ...props.pagination,
                        showTotal: totalRenderer
                      }
                }
              />
            )}
          </SkeletonTable>
        </TableContext.Provider>
      </DndProvider>
    </div>
  );
}) as TableCompoundComponent;

Table.ToolBar = ToolBar;

export default Table;
