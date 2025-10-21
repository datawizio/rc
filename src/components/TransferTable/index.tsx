import { useCallback, useMemo } from "react";
import { Table as AntTable, Transfer } from "antd";
import { useConfig } from "@/hooks";

import type { FC, ReactNode, Key } from "react";
import type { TableProps, TransferProps } from "antd";
import type { SelectAllLabel, TransferDirection } from "antd/es/transfer";
import type { TransferListProps } from "antd/es/transfer";
import type { TableRowSelection } from "antd/es/table/interface";

type TableChangeParameters = Parameters<NonNullable<TableProps["onChange"]>>;

export interface TransferTableProps extends Omit<TransferProps, "listStyle"> {
  columns: NonNullable<TableProps["columns"]>;
  loading: boolean;
  filteredInfo: Record<NonNullable<TransferDirection>, string[]>;
  onTableChange: (
    direction: TransferDirection,
    pagination: TableChangeParameters[0],
    filter: TableChangeParameters[1]
  ) => void;
  transferTableProps?: TableProps;
}

const TransferTable: FC<TransferTableProps> = ({
  columns,
  loading,
  filteredInfo,
  onTableChange,
  transferTableProps,
  ...props
}) => {
  const { translate } = useConfig();

  const label = useCallback<Exclude<SelectAllLabel, ReactNode>>(
    ({ selectedCount, totalCount }) => (
      <>
        {translate("SELECTED")}: {selectedCount} / {totalCount}
      </>
    ),
    [translate]
  );

  const selectAllLabels = useMemo(() => {
    return [label, label];
  }, [label]);

  return (
    <Transfer
      {...props}
      className="transfer-table"
      selectAllLabels={selectAllLabels}
      showSelectAll={false}
    >
      {({
        direction,
        filteredItems,
        onItemSelectAll,
        onItemSelect,
        selectedKeys,
        disabled
      }) => (
        <Table
          transferTableProps={transferTableProps}
          direction={direction}
          filter={filteredInfo[direction]}
          loading={loading}
          columns={columns}
          items={filteredItems}
          onItemSelectAll={onItemSelectAll}
          onItemSelect={onItemSelect}
          listSelectedKeys={selectedKeys}
          listDisabled={disabled}
          onTableChange={onTableChange}
        />
      )}
    </Transfer>
  );
};

export interface InnerTableProps<T>
  extends Pick<
    TransferTableProps,
    "columns" | "transferTableProps" | "onTableChange"
  > {
  direction: TransferDirection;
  filter: string[];
  loading: boolean;
  columns: NonNullable<TableProps["columns"]>;
  items: T[];
  onItemSelectAll: TransferListProps<T>["onItemSelectAll"];
  onItemSelect: TransferListProps<T>["onItemSelect"];
  listSelectedKeys: Key[];
  listDisabled?: boolean;
  transferTableProps?: TableProps;
}

const Table = <T extends Record<"key" | "app_name" | (string & {}), any>>({
  direction,
  filter,
  loading,
  columns,
  items,
  onItemSelectAll,
  onItemSelect,
  listSelectedKeys,
  listDisabled,
  onTableChange,
  transferTableProps
}: InnerTableProps<T>) => {
  const filteredItems = useMemo(() => {
    const set = new Set(filter);
    return items.filter(item => set.size === 0 || set.has(item.app_name));
  }, [filter, items]);

  const rowSelection: TableRowSelection<T> = {
    getCheckboxProps: item => ({
      disabled: listDisabled || item.disabled
    }),
    onSelectAll: selected => {
      const treeSelectedKeys = filteredItems.map(({ key }) => key);
      onItemSelectAll(treeSelectedKeys, selected);
    },
    onSelect: ({ key }, selected) => {
      onItemSelect(key, selected);
    },
    selectedRowKeys: listSelectedKeys
  };

  const handleTableChange: TableProps["onChange"] = (pagination, filter) => {
    onTableChange(direction, pagination, filter);
  };

  const internalColumns = useMemo(() => {
    return [columns[0], { ...columns[1], filteredValue: filter }];
  }, [columns, filter]);

  return (
    <AntTable
      {...transferTableProps}
      rowSelection={rowSelection}
      columns={internalColumns}
      dataSource={filteredItems}
      loading={loading}
      size="small"
      onChange={handleTableChange}
      onRow={({ key }) => ({
        onClick: () => {
          onItemSelect(key, !listSelectedKeys.includes(key));
        }
      })}
    />
  );
};

export default TransferTable;
