import { useCallback, useEffect, useMemo, useState } from "react";
import { Tree } from "antd";
import { useConfig } from "@/hooks";
import { flattenOptions } from "@/utils/data/tree";
import { buildTreeData, getRelatedKeys } from "../utils/tree";

import type { FC, Key } from "react";
import type { TreeProps, TreeDataNode } from "antd";
import type { SafeKey } from "rc-tree-select/es/interface";
import type { CheckedStrategy } from "rc-tree-select/lib/utils/strategyUtil";
import type { HandlerFn } from "@/types/utils";
import type { IDrawerTreeSelectState } from "../hooks/useDrawerTreeSelect";
import type { SelectValues } from "../types";

export type InnerTreeProps = Omit<
  TreeProps<any>,
  "onCheck" | "onExpand" | "selectable"
> & {
  simpleMode?: boolean;
  remoteSearch?: boolean;
  searchValue?: string;
  treeNodeFilterProp?: string;
  internalTreeDefaultExpandedKeys?: Key[];
  onExpandedKeysChange?: (keys: SafeKey[]) => void;
  setState?: (state: Partial<IDrawerTreeSelectState>) => void;
  showCheckedStrategy?: CheckedStrategy;
  checkSelectAllStatus?: (
    values: SelectValues | undefined,
    ignoreEmpty?: boolean,
    forceSelectAll?: boolean
  ) => { selectAllState: string; internalValue?: SelectValues | undefined };
};

const InnerTree: FC<InnerTreeProps> = ({
  treeData,
  simpleMode,
  remoteSearch,
  searchValue,
  treeNodeFilterProp = "title",
  checkStrictly,
  internalTreeDefaultExpandedKeys,
  checkedKeys,
  multiple,
  setState,
  onExpandedKeysChange,
  showCheckedStrategy,
  checkSelectAllStatus,
  ...props
}) => {
  const { translate } = useConfig();
  const [localExpandedKeys, setLocalExpandedKeys] = useState<Key[]>([]);

  const nestedTreeData = useMemo(() => {
    return simpleMode ? buildTreeData(treeData) : treeData;
  }, [simpleMode, treeData]);

  const flatDataList = useMemo(() => {
    if (simpleMode) return treeData ?? [];
    return flattenOptions(treeData);
  }, [simpleMode, treeData]);

  /* Search logic */

  const searchPredicate = useCallback(
    <T,>(filterValue: T) => {
      return Boolean(
        searchValue &&
          typeof filterValue === "string" &&
          filterValue.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
      );
    },
    [searchValue]
  );

  const isLocalSearching = useMemo(
    () => !remoteSearch && Boolean(searchValue),
    [remoteSearch, searchValue]
  );

  const renderedTreeData = useMemo(() => {
    if (!isLocalSearching) return nestedTreeData;
    const visibleKeys = new Set(localExpandedKeys ?? []);

    // Visually hide nodes that are not expanded during local searching (do not filter data)
    const markHidden = (nodes?: TreeDataNode[]): TreeDataNode[] | undefined => {
      if (!nodes) return nodes;
      return nodes.map(node => {
        const shouldHide = !visibleKeys.has(node.key);
        const children = markHidden(node.children);

        return {
          ...node,
          children,
          style: shouldHide ? { ...node.style, display: "none" } : node.style
        } as TreeDataNode;
      });
    };

    return markHidden(nestedTreeData as TreeDataNode[]);
  }, [isLocalSearching, nestedTreeData, localExpandedKeys]);

  useEffect(() => {
    if (remoteSearch) return;

    if (!searchValue) {
      setLocalExpandedKeys([]);
      return;
    }

    const keysToExpand = flatDataList
      .map(item => {
        const filterValue = item[treeNodeFilterProp as keyof TreeDataNode];

        if (searchPredicate(filterValue)) {
          return getRelatedKeys(nestedTreeData ?? [], item.key);
        }

        return null;
      })
      .filter((x): x is Key[] => Boolean(x))
      .reduce((acc, item) => [...acc, ...item], []);

    setLocalExpandedKeys(Array.from(new Set(keysToExpand)));
  }, [
    searchValue,
    remoteSearch,
    flatDataList,
    nestedTreeData,
    treeNodeFilterProp,
    searchPredicate
  ]);

  /* Handlers */

  const handleTreeExpand = useCallback<HandlerFn<TreeProps, "onExpand">>(
    expandedKeys => {
      if (!remoteSearch && searchValue) {
        setLocalExpandedKeys(expandedKeys);
        return;
      }
      onExpandedKeysChange?.(expandedKeys as SafeKey[]);
    },
    [onExpandedKeysChange, remoteSearch, searchValue]
  );

  const handleTreeCheck = useCallback<HandlerFn<TreeProps, "onCheck">>(
    (ck, info) => {
      const rawChecked = new Set<Key>(
        Array.isArray(ck) ? (ck as Key[]) : ((ck?.checked as Key[]) ?? [])
      );

      const keyToNode = new Map<Key, TreeDataNode>();
      const childrenMap = new Map<Key, Key[]>();
      const leafKeys = new Set<Key>();

      const indexNodes = (nodes?: TreeDataNode[]) => {
        if (!nodes) return;
        for (const n of nodes) {
          keyToNode.set(n.key, n);
          const childKeys = (n.children || []).map(c => c.key);
          if (childKeys.length) {
            childrenMap.set(n.key, childKeys);
            indexNodes(n.children);
          } else {
            leafKeys.add(n.key);
          }
        }
      };

      indexNodes(nestedTreeData as TreeDataNode[]);

      const getDescendantLeaves = (k: Key): Key[] => {
        const node = keyToNode.get(k);
        if (!node) return [];
        if (!node.children || node.children.length === 0) return [k];
        const res: Key[] = [];
        const stack = [...(childrenMap.get(k) || [])];
        while (stack.length) {
          const cur = stack.pop() as Key;
          const cn = keyToNode.get(cur);
          if (!cn) continue;
          if (!cn.children || cn.children.length === 0) {
            res.push(cur);
          } else {
            stack.push(...(childrenMap.get(cur) || []));
          }
        }
        return res;
      };

      const selectedLeaves = new Set<Key>();
      rawChecked.forEach(k => {
        if (leafKeys.has(k)) {
          selectedLeaves.add(k);
        } else {
          getDescendantLeaves(k).forEach(d => selectedLeaves.add(d));
        }
      });

      const strategy = showCheckedStrategy || "SHOW_CHILD";
      let valueKeys: Key[] = [];

      if (strategy === "SHOW_CHILD") {
        valueKeys = Array.from(selectedLeaves);
      } else if (strategy === "SHOW_ALL") {
        valueKeys = Array.from(
          new Set<Key>([...rawChecked, ...selectedLeaves])
        );
      } else {
        const roots = (nestedTreeData as TreeDataNode[]) || [];
        const collect = (node: TreeDataNode): Key[] => {
          const leaves = getDescendantLeaves(node.key);
          const allLeavesSelected = leaves.every(l => selectedLeaves.has(l));
          if (allLeavesSelected) return [node.key];
          if (!node.children || node.children.length === 0) {
            return selectedLeaves.has(node.key) ? [node.key] : [];
          }
          let acc: Key[] = [];
          for (const ch of node.children) acc = acc.concat(collect(ch));
          return acc;
        };
        valueKeys = Array.from(new Set<Key>(roots.flatMap(r => collect(r))));
      }

      let state: Record<string, any> = {};

      if (multiple) {
        state.internalValue = valueKeys;
        if (valueKeys) {
          const check = checkSelectAllStatus?.(valueKeys as SafeKey[], true);
          state = { ...state, ...check };
        }
      } else {
        state.internalValue = info?.checked ? [info?.node?.key] : [];
      }

      state.internalTreeDataCount = (state.internalValue || []).length;
      setState?.(state);
    },
    [
      multiple,
      setState,
      checkSelectAllStatus,
      nestedTreeData,
      showCheckedStrategy
    ]
  );

  if (nestedTreeData?.length === 0) {
    return translate("NO_DATA");
  }

  return (
    <Tree
      {...props}
      expandedKeys={
        !remoteSearch && searchValue
          ? localExpandedKeys
          : internalTreeDefaultExpandedKeys
      }
      selectable={false}
      onExpand={handleTreeExpand}
      treeData={renderedTreeData}
      checkedKeys={checkedKeys || []}
      onCheck={handleTreeCheck}
      checkStrictly={(remoteSearch && Boolean(searchValue)) || checkStrictly}
      filterTreeNode={node => {
        return searchPredicate(node[treeNodeFilterProp as keyof TreeDataNode]);
      }}
    />
  );
};

export default InnerTree;
