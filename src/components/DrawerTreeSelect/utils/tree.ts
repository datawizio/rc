import type { Key } from "react";
import type { TreeDataNode } from "antd";
import type { SimpleModeConfig } from "rc-tree-select/lib/interface";
import type {
  IDrawerTreeSelectFilters,
  SelectValues
} from "@/components/DrawerTreeSelect/types";

export const getMainLevelItems = (
  items: any[] | undefined = [],
  level: string | number | null = 1
) => {
  const set = new Set<string>();

  for (const item of items) {
    if ((level === null && item.pId === null) || item.level === level) {
      set.add(item.id);
    } else {
      break;
    }
  }
  return set;
};

export const getAllLeafItems = (items: any[] = []) => {
  const array: string[] = [];
  for (const item of items) {
    if (item.isLeaf) {
      array.push(item.id);
    }
  }

  return array;
};

export const isAllItemsChecked = (
  items: SelectValues,
  set: Set<SelectValues[number]>
) => {
  if (items.length !== set.size) return false;

  for (const value of items) {
    if (!set.has(value)) {
      return false;
    }
  }

  return true;
};

export const calcEmptyIsAll = (
  emptyIsAll: boolean,
  filters: IDrawerTreeSelectFilters
) => {
  if (!emptyIsAll) return false;
  if (filters.search) return false;
  if (filters.level && filters.level.toString() !== "1") return false;
  return !(filters.shop_markers && filters.shop_markers.length !== 0);
};

export const buildTreeData = <
  T extends TreeDataNode & Required<SimpleModeConfig>
>(
  simpleData: T[] | undefined
) => {
  const nodeMap = new Map<number | string, TreeDataNode>();
  const roots: TreeDataNode[] = [];

  simpleData?.forEach(item => {
    nodeMap.set(item.id, { ...item, children: [] });
  });

  simpleData?.forEach(item => {
    const node = nodeMap.get(item.id)!;
    if (item.pId === 0 || !nodeMap.has(item.pId)) {
      roots.push(node);
    } else {
      nodeMap.get(item.pId)!.children!.push(node);
    }
  });

  return roots;
};

export const getRelatedKeys = (treeData: TreeDataNode[], targetKey: Key) => {
  const parentKeys: Key[] = [];
  const childKeys: Key[] = [];

  // Find node and parents
  const findNode = (
    nodes: TreeDataNode[],
    key: Key,
    path: Key[] = []
  ): TreeDataNode | null => {
    for (const node of nodes) {
      if (node.key === key) {
        parentKeys.push(...path); // Everything in path are parents
        return node;
      }

      if (node.children) {
        const found = findNode(node.children, key, [...path, node.key]);
        if (found) return found;
      }
    }

    return null;
  };

  // Collect all children recursively
  const collectChildren = (node: TreeDataNode) => {
    if (!node.children) return;
    for (const child of node.children) {
      childKeys.push(child.key);
      collectChildren(child);
    }
  };

  const targetNode = findNode(treeData, targetKey);
  if (targetNode) collectChildren(targetNode);

  return [targetKey, ...parentKeys, ...childKeys];
};
