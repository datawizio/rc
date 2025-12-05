import clsx from "clsx";
import { TreeSelect as AntTreeSelect } from "antd";

import type { FC } from "react";
import type { TreeSelectProps as AntTreeSelectProps } from "antd";
import type { SelectValue } from "antd/es/tree-select";

import "./index.less";

export interface TreeSelectProps<VT> extends AntTreeSelectProps<VT> {
  /**
   * Whether to display the "Check All" checkbox above the tree.
   * @default false
   */
  showCheckAll?: boolean;

  /**
   * Custom title for the "Check All" checkbox.
   * @default "Check All"
   */
  checkAllTitle?: string;

  /**
   * Custom key to represent the "Check All" logic node (used to identify and manage checking).
   * Should be unique and not conflict with any real tree node keys.
   * @default "-1"
   */
  checkAllKey?: string;

  /**
   * Remove indents.
   */
  flat?: boolean;
}

export type TreeSelectComponent = FC<TreeSelectProps<SelectValue>>;

export interface TreeSelectCompoundComponent extends TreeSelectComponent {
  TreeNode: typeof AntTreeSelect.TreeNode;
}

const TreeSelect: TreeSelectCompoundComponent = ({
  flat,
  className,
  showCheckAll = false,
  checkAllTitle = "Check All",
  checkAllKey = "-1",
  classNames,
  treeData,
  treeDefaultExpandedKeys = [],
  maxTagCount = 10,
  ...restProps
}) => {
  let customTreeData = treeData;
  const customTreeExpandedKeys = treeDefaultExpandedKeys;

  if (showCheckAll) {
    customTreeData = [
      {
        key: checkAllKey,
        title: checkAllTitle,
        children: treeData,
        className: "tree-check-all"
      }
    ];
    customTreeExpandedKeys.push(checkAllKey);
  }

  return (
    <AntTreeSelect
      {...restProps}
      treeData={customTreeData}
      className={clsx(className, "dw-tree-select")}
      treeDefaultExpandedKeys={customTreeExpandedKeys}
      maxTagCount={maxTagCount}
      classNames={{
        popup: {
          root: clsx(classNames?.popup?.root, "dw-tree-select__dropdown", {
            "dw-tree-select__dropdown--flat": flat
          })
        }
      }}
    />
  );
};

TreeSelect.TreeNode = AntTreeSelect.TreeNode;

export default TreeSelect;
