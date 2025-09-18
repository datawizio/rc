import { useMemo } from "react";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";

import type { FC, MouseEvent } from "react";
import type { DataNode } from "rc-tree-select/es/interface";
import type { ICheckedItem } from "../types";

interface ButtonAddAllProps {
  node?: DataNode;
  selected: Set<string>;
  onClick?: (items: ICheckedItem[], checked: boolean) => void;
}

export const ButtonAddAll: FC<ButtonAddAllProps> = ({
  node,
  selected,
  onClick
}) => {
  const { minus, children } = useMemo(() => {
    const children: ICheckedItem[] = [];
    let minus = true;

    if (!node?.children || node.children.length === 0) {
      return {
        children,
        minus
      };
    }

    node.children.forEach(item => {
      if (!item.disabled) {
        if (!selected.has(item.key as string)) {
          minus = false;
        }

        children.push({
          key: item.key as string,
          title: item.sourceTitle as string
        });
      }
    });

    return { children, minus };
  }, [node?.children, selected]);

  const handleClick = (checked: boolean) => {
    onClick?.(children, checked);
  };

  const handlePlusClick = (e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    handleClick(true);
  };

  const handleMinusClick = (e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    handleClick(false);
  };

  const hasChildren = node && node.children && node.children.length > 0;
  if (!hasChildren) return null;

  return minus ? (
    <MinusCircleOutlined
      onClick={handleMinusClick}
      className="button-add-all"
    />
  ) : (
    <PlusCircleOutlined onClick={handlePlusClick} className="button-add-all" />
  );
};
