import { useEffect, useState } from "react";
import { Tree } from "antd";
import { useTreeData } from "../hooks/useTreeData";

import type { Key, FC, ReactNode } from "react";
import type { DataNode } from "rc-tree-select/es/interface";
import type { EventDataNode } from "rc-tree/es/interface";
import type { ICheckedItem } from "../types";

export interface ListTreeProps {
  filteredItems: DataNode[];
  disabledKeys: string[];
  disableAll: boolean;
  enabledKeys: string[];
  checkedKeys: string[];
  expandedKeys: string[];
  loadData: (node: EventDataNode<DataNode>) => Promise<void>;
  onItemSelect: (item: ICheckedItem) => void;
  onItemsSelect: (items: ICheckedItem[], checked: boolean) => void;
}

export const ListTree: FC<ListTreeProps> = ({
  filteredItems,
  disabledKeys,
  disableAll,
  enabledKeys,
  checkedKeys,
  expandedKeys,
  loadData,
  onItemSelect,
  onItemsSelect
}) => {
  const [internalExpandedKeys, setInternalExpandedKeys] =
    useState<string[]>(expandedKeys);

  const treeData = useTreeData(
    filteredItems,
    disableAll,
    disabledKeys,
    enabledKeys,
    checkedKeys,
    onItemsSelect,
    null,
    {
      getLabelProp: node => node.title as ReactNode,
      simpleMode: true
    }
  );

  const handleExpand = (expanded: Key[]) => {
    setInternalExpandedKeys(expanded as string[]);
  };

  const handleCheck = (
    _: unknown,
    { node }: { node: EventDataNode<DataNode> }
  ) => {
    onItemSelect({ key: node.key as string, title: node.sourceTitle });
  };

  const handleSelect = (
    _: unknown,
    { node }: { node: EventDataNode<DataNode> }
  ) => {
    handleCheck(_, { node });
  };

  useEffect(() => {
    setInternalExpandedKeys(expandedKeys);
  }, [expandedKeys]);

  return (
    <Tree
      blockNode
      checkable
      checkStrictly
      expandedKeys={internalExpandedKeys}
      checkedKeys={checkedKeys}
      selectedKeys={[]}
      treeData={treeData}
      loadData={loadData}
      loadedKeys={[]}
      onExpand={handleExpand}
      onCheck={handleCheck}
      onSelect={handleSelect}
    />
  );
};
