import { Tree as AntTree } from "antd";
import type { FC } from "react";
import type { TreeProps as AntTreeProps } from "antd";

import "./index.less";

export interface TreeProps extends AntTreeProps {
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
   * If true, disables the "Check All" checkbox (if shown).
   * @default false
   */
  isAllDisabled?: boolean;
}

const Tree: FC<TreeProps> = ({
  treeData,
  showCheckAll = false,
  checkAllTitle = "Check All",
  checkAllKey = "-1",
  isAllDisabled = false,
  defaultExpandedKeys = [],
  expandedKeys = [],
  ...restProps
}) => {
  const customDefaultExpandedKeys = defaultExpandedKeys;
  const customExpandedKeys = expandedKeys;
  let customTreeData = treeData;

  if (showCheckAll) {
    customTreeData = [
      {
        key: checkAllKey,
        title: checkAllTitle,
        children: treeData,
        className: "tree-check-all",
        disabled: isAllDisabled
      }
    ];

    if (customDefaultExpandedKeys.indexOf(checkAllKey)) {
      customDefaultExpandedKeys.push(checkAllKey);
    }

    if (customExpandedKeys.indexOf(checkAllKey)) {
      customExpandedKeys.push(checkAllKey);
    }
  }

  return (
    <AntTree
      {...restProps}
      treeData={customTreeData}
      defaultExpandedKeys={customDefaultExpandedKeys}
      expandedKeys={customExpandedKeys}
    />
  );
};

export default Tree;
