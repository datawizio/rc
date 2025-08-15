import clsx from "clsx";
import React from "react";
import Checkbox from "@/components/Checkbox";
import type { TransferItem } from "../types";

export interface ListItemProps {
  disabled?: boolean;
  checked?: boolean;
  prefixCls: string;
  onClick: (item: TransferItem) => void;
  item: TransferItem;
}

const ListItem: React.FC<ListItemProps> = props => {
  const { item, checked, disabled, prefixCls, onClick } = props;

  const className = clsx({
    [`${prefixCls}-content-item`]: true,
    [`${prefixCls}-content-item-disabled`]: disabled || item.disabled,
    [`${prefixCls}-content-item-checked`]: checked
  });

  return (
    <li
      className={className}
      title={item.title}
      onClick={disabled || item.disabled ? undefined : () => onClick(item)}
    >
      <Checkbox checked={checked} disabled={disabled || item.disabled} />
      <span className={`${prefixCls}-content-item-text`}>{item.title}</span>
    </li>
  );
};

export default React.memo(ListItem);
