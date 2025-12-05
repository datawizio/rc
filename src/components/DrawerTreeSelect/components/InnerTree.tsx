import { useCallback, useEffect, useMemo, useState } from "react";
import { Tree } from "antd";
import { useConfig } from "@/hooks";
import { flattenOptions } from "@/utils/data/tree";
import {
  buildTreeData,
  getRelatedKeys,
  buildTreeIndexes,
  applyCheckedStrategy
} from "../utils/tree";

import type { FC, Key } from "react";
import type { TreeProps, TreeDataNode } from "antd";
import type { SafeKey } from "rc-tree-select/es/interface";
import type { CheckedStrategy } from "rc-tree-select/es/utils/strategyUtil";
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
  ) => Partial<IDrawerTreeSelectState>;
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
  const { t } = useConfig();
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

  const searchingLocally = useMemo(
    () => !remoteSearch && Boolean(searchValue),
    [remoteSearch, searchValue]
  );

  const renderedTreeData = useMemo(() => {
    if (!searchingLocally) return nestedTreeData;
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
  }, [searchingLocally, nestedTreeData, localExpandedKeys]);

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

  const indexes = useMemo(
    () => buildTreeIndexes(nestedTreeData as TreeDataNode[]),
    [nestedTreeData]
  );

  const handleTreeCheck = useCallback<HandlerFn<TreeProps, "onCheck">>(
    (ck, info) => {
      const rawChecked = Array.isArray(ck) ? ck : (ck?.checked ?? []);

      const valueKeys = applyCheckedStrategy(
        rawChecked,
        showCheckedStrategy,
        indexes,
        nestedTreeData as TreeDataNode[]
      );

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
      indexes,
      nestedTreeData,
      showCheckedStrategy
    ]
  );

  // During local search, if nothing matched, all nodes are effectively hidden
  if (
    nestedTreeData?.length === 0 ||
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
        !remoteSearch && searchValue
          ? localExpandedKeys
          : internalTreeDefaultExpandedKeys
      }
      selectable={false}
      onExpand={handleTreeExpand}
      treeData={renderedTreeData}
      checkedKeys={checkedKeys || []}
      onCheck={handleTreeCheck}
      checkStrictly={checkStrictly}
      filterTreeNode={node => {
        return searchPredicate(node[treeNodeFilterProp as keyof TreeDataNode]);
      }}
    />
  );
};

export default InnerTree;
