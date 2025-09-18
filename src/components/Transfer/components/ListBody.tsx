import ListItem from "./ListItem";
import SkeletonListItem from "./SkeletonListItem";
import { Component } from "react";

import type { FC } from "react";
import type { TransferItem } from "../types";
import type { TransferListProps } from "./List";

export type PartialTransferListProps = Omit<TransferListProps, "checkedKeys">;

export interface TransferListBodyProps extends PartialTransferListProps {
  filteredItems: TransferItem[];
  selectedKeys: string[];
  loading?: boolean;
}

class ListBody extends Component<TransferListBodyProps> {
  onItemSelect = (item: TransferItem) => {
    const { onItemSelect, selectedKeys } = this.props;
    const checked = selectedKeys.indexOf(item.key) >= 0;
    onItemSelect(item.key, !checked);
  };

  render() {
    const {
      prefixCls,
      onScroll,
      filteredItems,
      selectedKeys,
      disabled: globalDisabled,
      loading
    } = this.props;

    return (
      <ul className={`${prefixCls}-content`} onScroll={onScroll}>
        {filteredItems.map(item => {
          const { disabled } = item;
          const checked = selectedKeys.indexOf(item.key) >= 0;

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
        })}
        {loading && (
          <SkeletonListItem count={filteredItems.length === 0 ? 10 : 2} />
        )}
      </ul>
    );
  }
}

const ListBodyWrapper: FC<TransferListBodyProps> = props => (
  <ListBody {...props} />
);

export default ListBodyWrapper;
