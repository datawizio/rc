import clsx from "clsx";
import React from "react";
import Checkbox from "@/components/Checkbox";

import type { TransferFilterItem } from "../types";

export interface ListItemProps {
  item: TransferFilterItem;
  prefixCls: string;
  checked?: boolean;
  disabled?: boolean;
  onClick: (item: TransferFilterItem) => void;
}

const ListItem: React.FC<ListItemProps> = ({
  item,
  checked,
  disabled,
  prefixCls,
  onClick
}) => {
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
