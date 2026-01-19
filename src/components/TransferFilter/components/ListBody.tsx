import ListItem from "./ListItem";
import SkeletonListItem from "@/components/Transfer/components/SkeletonListItem";

import { Component } from "react";
import { Pagination } from "antd";
import { ListTree } from "./ListTree";
import { isLocalDataSource } from "../helper";

import type { FC, ReactNode } from "react";
import type { PaginationType } from "antd/es/transfer/interface";
import type { TransferListProps } from "./List";
import type { ICheckedItem, TransferFilterItem } from "../types";

type PartialTransferListProps = Omit<TransferListProps, "checkedKeys" | "type">;

export interface TransferListBodyProps extends PartialTransferListProps {
  filteredItems: TransferFilterItem[];
  ref: any;
  totalItemsCount: number;
  checkedKeys: string[];
  loading?: boolean;
  type?: "tree" | "list";
  pagination?: PaginationType;
  loadTreeData?: any;
  expandedKeys?: string[];
  disabledKeys?: string[];
  enabledKeys?: string[];
  disableAll?: boolean;
  onPageChange?: (page: number) => void;
}

interface TransferListBodyState {
  current: number;
}

const parsePagination = (
  pagination?: PaginationType
): Extract<PaginationType, object> | null => {
  if (!pagination) {
    return null;
  }

  const defaultPagination = {
    pageSize: 100
  };

  if (typeof pagination === "object") {
    return {
      ...defaultPagination,
      ...pagination
    };
  }

  return defaultPagination;
};

class ListBody extends Component<TransferListBodyProps, TransferListBodyState> {
  state = {
    current: 1
  };

  onItemSelect = (item: TransferFilterItem) => {
    const { onItemSelect, checkedKeys } = this.props;
    const checked = checkedKeys.indexOf(item.key) >= 0;
    onItemSelect(
      {
        key: item.key,
        title: item.title!,
        ...(item?.article ? { article: item?.article } : {})
      },
      !checked
    );
  };

  onItemsSelect = (items: ICheckedItem[], checked: boolean) => {
    this.props.onItemsSelect?.(items, checked);
  };

  resetPage = () => {
    this.setState({ current: 1 });
  };

  onPageChange = (current: number) => {
    this.setState({ current });
    this.props.onPageChange?.(current);
  };

  getItems = () => {
    const { filteredItems, direction, value, local } = this.props;
    const { current } = this.state;

    if (isLocalDataSource(value.include, direction, local)) {
      return filteredItems.slice((current - 1) * 100, current * 100);
    }
    return filteredItems;
  };

  render() {
    const { current } = this.state;
    const {
      prefixCls,
      filteredItems,
      expandedKeys,
      checkedKeys,
      disabled: globalDisabled,
      loading,
      disabledKeys,
      disableAll,
      enabledKeys,
      type,
      pagination,
      loadTreeData,
      totalItemsCount
    } = this.props;

    let paginationNode: ReactNode = null;

    const enabledSet = new Set(enabledKeys);
    const disabledSet = new Set(disabledKeys);
    const mergedPagination = parsePagination(pagination);
    const displayItems = this.getItems();

    if (type !== "tree" && mergedPagination) {
      paginationNode = (
        <Pagination
          simple={true}
          size="small"
          disabled={globalDisabled}
          className={`${prefixCls}-pagination`}
          total={totalItemsCount}
          current={current}
          onChange={this.onPageChange}
          {...mergedPagination}
        />
      );
    }

    return (
      <>
        <ul className={`${prefixCls}-content`}>
          {type === "tree" ? (
            <ListTree
              checkedKeys={checkedKeys}
              disabledKeys={disabledKeys!}
              disableAll={disableAll!}
              enabledKeys={enabledKeys!}
              filteredItems={filteredItems}
              loadData={loadTreeData}
              expandedKeys={expandedKeys!}
              onItemSelect={this.onItemSelect}
              onItemsSelect={this.onItemsSelect}
            />
          ) : (
            displayItems.map(item => {
              item.key = item.key ?? item.id;

              const disabled = disableAll
                ? !enabledSet.has(item.key)
                : disabledSet.has(item.key);

              const checked = checkedKeys.indexOf(item.key) >= 0;

              return (
                <ListItem
                  disabled={globalDisabled || disabled}
                  key={item.key}
                  item={item}
                  checked={checked}
                  prefixCls={prefixCls}
                  onClick={this.onItemSelect}
                />
              );
            })
          )}
          {loading && (
            <SkeletonListItem count={filteredItems.length === 0 ? 10 : 2} />
          )}
        </ul>
        {paginationNode}
      </>
    );
  }
}

const ListBodyWrapper: FC<TransferListBodyProps> = props => (
  <ListBody {...props} />
);

export default ListBodyWrapper;
