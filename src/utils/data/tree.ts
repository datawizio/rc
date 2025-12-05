import type { TreeDataNode } from "antd";
import type { DataNode as TreeSelectDataNode } from "rc-tree-select/es/interface";

export type DataNode = TreeDataNode & TreeSelectDataNode;

export const unTree = (tree?: DataNode[]) => {
  let list: DataNode[] = [];
  tree?.forEach(item => {
    if (item) list.push(item);
    if (item.children && item.children.length) {
      list = list.concat(unTree(item.children));
    }
  });
  return list;
};

export type FilterOptionFn = (searchValue: string, node: any) => boolean;

interface FilterOptionsConfig {
  optionFilterProp?: string;
  filterOption?: FilterOptionFn | null;
}

/**
 * Return a flattened list of all nodes in DFS order.
 * The only requirement in current usage is that each item has a `key`.
 */
export function flattenOptions(treeData: DataNode[] = []): DataNode[] {
  const result: DataNode[] = [];
  const stack: DataNode[] = [...treeData].reverse();

  while (stack.length) {
    const node = stack.pop() as DataNode;
    result.push(node);
    const children = node.children;
    if (children && children.length) {
      for (let i = children.length - 1; i >= 0; i -= 1) {
        stack.push(children[i]);
      }
    }
  }

  return result;
}

/**
 * Filter tree data by searchValue using provided filterOption.
 * Keeps a node if it matches or any of its descendants match.
 * Returns a new tree structure without mutating the original nodes.
 */
export function filterOptions(
  searchValue: string,
  treeData: DataNode[] = [],
  config: FilterOptionsConfig = {}
): DataNode[] {
  const { filterOption } = config;

  if (!searchValue) return treeData;

  const predicate: FilterOptionFn = filterOption
    ? filterOption
    : (value, node) => {
        const title = node.title;
        return String(title)
          .toLowerCase()
          .includes(String(value).toLowerCase());
      };

  const dfs = (nodes: DataNode[]): DataNode[] => {
    const acc: DataNode[] = [];
    nodes.forEach(node => {
      const children = node.children || [];
      const filteredChildren = children.length ? dfs(children) : [];
      const isMatch = predicate(searchValue, node);

      if (isMatch || filteredChildren.length) {
        const cloned: DataNode = {
          ...node,
          // Replace children with filtered subset (or empty array)
          children: filteredChildren
        };
        acc.push(cloned);
      }
    });
    return acc;
  };

  return dfs(treeData);
}

export const findItemInTreeById = <T extends DataNode>(
  items: T[] | null | undefined,
  id: number
): T | undefined => {
  if (!items) return;

  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      return items[i];
    }

    const found = findItemInTreeById(items[i].children as T[], id);

    if (found) {
      return found;
    }
  }
};

/**
 * Return a new tree where each node has a `value` prop.
 * If `value` is missing, it will be set to `node.id ?? node.key`.
 */
export const prepareTreeData = (treeData: DataNode[] = []): DataNode[] => {
  const walk = (node: DataNode): DataNode => {
    const children = node.children || [];
    const hasOwnValue = Object.prototype.hasOwnProperty.call(node, "value");

    const base: DataNode = hasOwnValue
      ? node
      : { ...node, value: node.id ?? node.key };

    if (children.length) {
      return {
        ...base,
        children: children.map(walk)
      };
    }

    return base;
  };

  return treeData.map(walk);
};
