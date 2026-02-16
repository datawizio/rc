import { useCallback, useEffect, useMemo, useState } from "react";
import { Tree } from "antd";
import { useConfig } from "@/hooks";
import { flattenOptions } from "@/utils/data/tree";
import {
  buildTreeData,
  getRelatedKeys,
  buildTreeIndexes,
  applyCheckedStrategy,
  getHalfCheckedKeys,
  expandCheckedKeysForDisplay
} from "../utils/tree";

import type { FC, Key } from "react";
import type { TreeProps, TreeDataNode } from "antd";
import type { SafeKey } from "rc-tree-select/es/interface";
import type { CheckedStrategy } from "rc-tree-select/es/utils/strategyUtil";
import type { HandlerFn, ReplaceParameter } from "@/types/utils";

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
  showCheckedStrategy?: CheckedStrategy;
  onCheck?: ReplaceParameter<HandlerFn<TreeProps, "onCheck">, 0, SafeKey[]>;
};

type TreeFilterFunction = {
  (nodes?: TreeDataNode[]): TreeDataNode[] | undefined;
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
  onExpandedKeysChange,
  showCheckedStrategy,
  onCheck,
  ...props
}) => {
  const { t } = useConfig();
  const [localExpandedKeys, setLocalExpandedKeys] = useState<Key[]>([]);

  const nestedTreeData = useMemo(() => {
    return (simpleMode ? buildTreeData(treeData) : treeData) as TreeDataNode[];
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

  const searchingLocally = useMemo(
    () => !remoteSearch && Boolean(searchValue),
    [remoteSearch, searchValue]
  );

  const renderedTreeData = useMemo(() => {
    if (!searchValue) {
      return nestedTreeData;
    }

    // When `remoteSearch` is enabled, clear the result returned from the backend
    if (remoteSearch) {
      const filterRemoteSearch: TreeFilterFunction = nodes => {
        if (!nodes) return nodes;
        return nodes
          .map(node => {
            const children = filterRemoteSearch(node.children);
            const filterValue = node[treeNodeFilterProp as keyof TreeDataNode];
            const isMatch = searchPredicate(filterValue);

            if (!children?.length && !isMatch) return null;

            return {
              ...node,
              children: children?.length ? children : undefined
            } as TreeDataNode;
          })
          .filter((node): node is TreeDataNode => Boolean(node));
      };

      return filterRemoteSearch(nestedTreeData);
    }

    // Otherwise, it means that we only perform search on the client side
    const visibleKeys = new Set(localExpandedKeys ?? []);

    const filterVisible: TreeFilterFunction = nodes => {
      if (!nodes) return nodes;
      return nodes
        .filter(node => visibleKeys.has(node.key))
        .map(node => {
          const children = filterVisible(node.children);
          return {
            ...node,
            children: children?.length ? children : undefined
          } as TreeDataNode;
        });
    };

    return filterVisible(nestedTreeData);
  }, [
    remoteSearch,
    localExpandedKeys,
    nestedTreeData,
    searchValue,
    searchPredicate,
    treeNodeFilterProp
  ]);

  const renderedTreeKeySet = useMemo(() => {
    const keys = new Set<Key>();
    const traverse = (nodes?: TreeDataNode[]) => {
      if (!nodes) return;
      nodes.forEach(node => {
        keys.add(node.key);
        traverse(node.children);
      });
    };
    traverse(renderedTreeData);
    return keys;
  }, [renderedTreeData]);

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
      if (searchingLocally) {
        setLocalExpandedKeys(expandedKeys);
      } else {
        onExpandedKeysChange?.(expandedKeys as SafeKey[]);
      }
    },
    [onExpandedKeysChange, searchingLocally]
  );

  const indexes = useMemo(
    () => buildTreeIndexes(nestedTreeData),
    [nestedTreeData]
  );

  const checkedKeysArray = useMemo(
    () =>
      Array.isArray(checkedKeys)
        ? checkedKeys
        : checkedKeys && "checked" in checkedKeys
          ? checkedKeys.checked
          : [],
    [checkedKeys]
  );

  const halfCheckedKeys = useMemo(() => {
    if (!searchingLocally) return [];
    return getHalfCheckedKeys(
      checkedKeysArray,
      showCheckedStrategy,
      indexes,
      nestedTreeData
    );
  }, [
    searchingLocally,
    checkedKeysArray,
    showCheckedStrategy,
    indexes,
    nestedTreeData
  ]);

  const treeCheckedKeys = useMemo(() => {
    if (searchingLocally) {
      const displayChecked = expandCheckedKeysForDisplay(
        checkedKeysArray,
        indexes,
        nestedTreeData
      );
      return { checked: displayChecked, halfChecked: halfCheckedKeys };
    }
    return checkedKeysArray;
  }, [
    searchingLocally,
    checkedKeysArray,
    halfCheckedKeys,
    indexes,
    nestedTreeData
  ]);

  const handleTreeCheck = useCallback<HandlerFn<TreeProps, "onCheck">>(
    (ck, info) => {
      const rawChecked = Array.isArray(ck) ? ck : (ck?.checked ?? []);
      const mergedChecked = searchingLocally
        ? (() => {
            const preserved = checkedKeysArray.filter(
              key => !renderedTreeKeySet.has(key)
            );

            // During local search we show parents as checked via `expandCheckedKeysForDisplay`.
            // Only use leaf keys so unchecking the only item in a group actually removes it
            // (otherwise the parent stays in `rawChecked` and gets expanded back to the leaf).
            const rawLeavesOnly = rawChecked.filter(key =>
              indexes.leafKeys.has(key)
            );

            return Array.from(new Set([...preserved, ...rawLeavesOnly]));
          })()
        : rawChecked;

      const valueKeys = checkStrictly
        ? mergedChecked
        : applyCheckedStrategy(
            mergedChecked,
            showCheckedStrategy,
            indexes,
            nestedTreeData
          );

      onCheck?.(valueKeys as SafeKey[], info);
    },
    [
      checkStrictly,
      showCheckedStrategy,
      indexes,
      nestedTreeData,
      onCheck,
      searchingLocally,
      checkedKeysArray,
      renderedTreeKeySet
    ]
  );

  // During search, if nothing matched, all nodes are effectively hidden
  if (
    renderedTreeData?.length === 0 ||
    (searchingLocally && searchValue && !localExpandedKeys?.length)
  ) {
    return (
      <div className="drawer-tree-select-list-placeholder">{t("NO_DATA")}</div>
    );
  }

  return (
    <Tree
      {...props}
      expandedKeys={
        searchingLocally ? localExpandedKeys : internalTreeDefaultExpandedKeys
      }
      selectable={false}
      onExpand={handleTreeExpand}
      treeData={renderedTreeData}
      checkedKeys={treeCheckedKeys}
      onCheck={handleTreeCheck}
      checkStrictly={searchingLocally ? true : checkStrictly}
      filterTreeNode={node => {
        return searchPredicate(node[treeNodeFilterProp as keyof TreeDataNode]);
      }}
    />
  );
};

export default InnerTree;
