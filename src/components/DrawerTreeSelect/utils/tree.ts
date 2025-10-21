import type { Key } from "react";
import type { TreeDataNode } from "antd";
import type { CheckedStrategy } from "rc-tree-select/es/utils/strategyUtil";
import type { SimpleModeConfig } from "rc-tree-select/es/interface";
import type {
  IDrawerTreeSelectFilters,
  SelectValues
} from "@/components/DrawerTreeSelect/types";

/**
 * Get ids of the first-level items (or of a specific level) from a flat, level-sorted list.
 *
 * The input list is expected to be ordered by level so that once items of a different
 * level are seen, iteration can stop early.
 *
 * @param items - Flat list of items that contain `id`, `pId`, and `level` fields
 * @param level - Level to collect. If null, selects items with `pId === null`
 * @returns Set of item ids belonging to the requested level
 */
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

/**
 * Collect ids of all leaf items from a flat list.
 * A leaf item is expected to have `isLeaf === true`.
 *
 * @param items - Flat list of items with `id` and `isLeaf`
 * @returns Array of leaf ids
 */
export const getAllLeafItems = (items: any[] = []) => {
  const array: string[] = [];
  for (const item of items) {
    if (item.isLeaf) {
      array.push(item.id);
    }
  }

  return array;
};

/**
 * Check whether every value from `items` is present in the provided set.
 *
 * @param items - Values that should be present
 * @param set - Set of currently selected values
 * @returns True if all `items` are present in `set`
 */
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

/**
 * Determine whether an "empty" filter state should be interpreted as "Select All".
 *
 * Rules:
 * - If `emptyIsAll` is disabled, returns false
 * - If there is a search query, returns false
 * - If level is set and not equal to 1, returns false
 * - If there are shop markers, returns false
 * - Otherwise, returns true
 *
 * @param emptyIsAll - Global flag enabling this behavior
 * @param filters - Current filter values
 */
export const calcEmptyIsAll = (
  emptyIsAll: boolean,
  filters: IDrawerTreeSelectFilters
) => {
  if (!emptyIsAll) return false;
  if (filters.search) return false;
  if (filters.level && filters.level.toString() !== "1") return false;
  return !(filters.shop_markers && filters.shop_markers.length !== 0);
};

/**
 * Build a nested tree from flat simple data
 * (with fields `id` as key and `pId` as a parent key).
 *
 * @param simpleData - Flat array with `id`, `pId`, and any `TreeDataNode` fields
 * @returns Array of root `TreeDataNode` with populated `children`
 */
export const buildTreeData = <
  T extends Omit<TreeDataNode, "children"> &
    Required<Pick<SimpleModeConfig, "id" | "pId">>
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
    // If a parent is missing (or explicitly 0), treat as a root
    if (item.pId === 0 || !nodeMap.has(item.pId)) {
      roots.push(node);
    } else {
      nodeMap.get(item.pId)!.children!.push(node);
    }
  });

  return roots;
};

/**
 * Get the list of related keys (target, its parents, and all its descendants).
 *
 * @param treeData - Tree roots
 * @param targetKey - Key to expand from
 * @returns Merged array with `targetKey`, `parentKeys`, and `childKeys`
 */
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
        // Everything in the path is parents of the found node
        parentKeys.push(...path);
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

/**
 * Build search indexes for a tree to enable fast leaf and children lookups.
 *
 * @param roots - Tree roots
 * @returns An object with key-to-node, children map, and leaf keys set
 */
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

/**
 * Get all descendant leaf keys for the given node key.
 * If the node itself is a leaf, returns an array with only that key.
 *
 * @param key - Starting node key
 * @param indexes - Precomputed tree indexes
 * @returns Array of leaf keys under the node
 */
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

/**
 * Apply rc-tree-select `CheckedStrategy` to a raw set of checked keys.
 *
 * Behavior by strategy:
 * - SHOW_CHILD: expand non-leaf selections into leaf keys only
 * - SHOW_ALL: include original selections plus all leaves under any selected parent
 * - SHOW_PARENT: collapse fully selected subtrees to the highest possible parent
 *
 * @param rawChecked - Iterable of checked keys (may include non-leaf nodes)
 * @param strategy - Strategy to apply; defaults to SHOW_CHILD
 * @param indexes - Precomputed tree indexes
 * @param roots - Tree roots (used by SHOW_PARENT to collapse from roots)
 * @returns Array of keys after applying the strategy
 */
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
      // Expand non-leaf selections into their leaf descendants
      getDescendantLeaves(key, indexes).forEach(d => selectedLeaves.add(d));
    }
  });

  if (chosen === "SHOW_CHILD") {
    return Array.from(selectedLeaves);
  }

  if (chosen === "SHOW_ALL") {
    return Array.from(new Set<Key>([...raw, ...selectedLeaves]));
  }

  // SHOW_PARENT: collapse fully selected subtrees
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
