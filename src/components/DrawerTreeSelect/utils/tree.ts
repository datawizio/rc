import type { Key } from "react";
import type { TreeDataNode } from "antd";
import type { CheckedStrategy } from "rc-tree-select/lib/utils/strategyUtil";
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

/* Selection and indexing */

export type TreeIndexes = {
  keyToNode: Map<Key, TreeDataNode>;
  childrenMap: Map<Key, Key[]>;
  leafKeys: Set<Key>;
};

export const buildTreeIndexes = (
  roots: TreeDataNode[] | undefined
): TreeIndexes => {
  const keyToNode = new Map<Key, TreeDataNode>();
  const childrenMap = new Map<Key, Key[]>();
  const leafKeys = new Set<Key>();

  const walk = (nodes?: TreeDataNode[]) => {
    if (!nodes) return;

    for (const node of nodes) {
      keyToNode.set(node.key, node);
      const childKeys = (node.children || []).map(c => c.key);

      if (childKeys.length) {
        childrenMap.set(node.key, childKeys);
        walk(node.children);
      } else {
        leafKeys.add(node.key);
      }
    }
  };

  walk(roots);

  return { keyToNode, childrenMap, leafKeys };
};

export const getDescendantLeaves = (key: Key, indexes: TreeIndexes): Key[] => {
  const node = indexes.keyToNode.get(key);

  if (!node) return [];
  if (!node.children || node.children.length === 0) return [key];

  const res: Key[] = [];
  const stack = [...(indexes.childrenMap.get(key) || [])];

  while (stack.length) {
    const currentKey = stack.pop() as Key;
    const currentNode = indexes.keyToNode.get(currentKey);

    if (!currentNode) continue;
    if (!currentNode.children || currentNode.children.length === 0) {
      res.push(currentKey);
    } else {
      stack.push(...(indexes.childrenMap.get(currentKey) || []));
    }
  }

  return res;
};

export const applyCheckedStrategy = (
  rawChecked: Iterable<Key>,
  strategy: CheckedStrategy | undefined,
  indexes: TreeIndexes,
  roots: TreeDataNode[] | undefined
): Key[] => {
  const chosen = strategy || "SHOW_CHILD";
  const raw = new Set<Key>(rawChecked);
  const selectedLeaves = new Set<Key>();

  raw.forEach(key => {
    if (indexes.leafKeys.has(key)) {
      selectedLeaves.add(key);
    } else {
      getDescendantLeaves(key, indexes).forEach(d => selectedLeaves.add(d));
    }
  });

  if (chosen === "SHOW_CHILD") {
    return Array.from(selectedLeaves);
  }

  if (chosen === "SHOW_ALL") {
    return Array.from(new Set<Key>([...raw, ...selectedLeaves]));
  }

  // SHOW_PARENT: collapse fully-selected subtrees
  const collect = (node: TreeDataNode): Key[] => {
    const leaves = getDescendantLeaves(node.key, indexes);
    const allLeavesSelected = leaves.every(l => selectedLeaves.has(l));
    if (allLeavesSelected) return [node.key];
    if (!node.children || node.children.length === 0) {
      return selectedLeaves.has(node.key) ? [node.key] : [];
    }

    let acc: Key[] = [];
    for (const ch of node.children) {
      acc = acc.concat(collect(ch));
    }

    return acc;
  };

  const result: Key[] = [];
  for (const root of roots || []) {
    result.push(...collect(root));
  }

  return Array.from(new Set(result));
};
