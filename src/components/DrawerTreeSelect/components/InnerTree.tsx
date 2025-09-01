import { useCallback, useEffect, useMemo, useState } from "react";
import { Tree } from "antd";
import { useConfig } from "@/hooks";
import { buildTreeData } from "../utils/tree";

import type { FC, Key } from "react";
import type { TreeProps } from "antd";
import type { DataNode } from "antd/es/tree";
import type { SafeKey } from "rc-tree-select/es/interface";
import type { HandlerFn } from "@/types/utils";

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
  setState?: (state: any) => void;
  checkSelectAllStatus?: (
    values: any,
    ignoreEmpty?: boolean,
    forceSelectAll?: boolean
  ) => { selectAllState: string; internalValue?: any };
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
  checkSelectAllStatus,
  ...props
}) => {
  const { translate } = useConfig();
  const [localExpandedKeys, setLocalExpandedKeys] = useState<Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const nestedTreeData = useMemo(() => {
    return simpleMode ? buildTreeData(treeData) : treeData;
  }, [simpleMode, treeData]);

  const flatDataList = useMemo(() => {
    if (simpleMode) return treeData ?? [];

    const list: DataNode[] = [];
    const walk = (nodes: DataNode[] | undefined) => {
      if (!nodes || !Array.isArray(nodes)) return;

      for (const node of nodes) {
        list.push(node);
        if (node.children && node.children.length) {
          walk(node.children);
        }
      }
    };

    walk(nestedTreeData);
    return list;
  }, [nestedTreeData, simpleMode, treeData]);

  /* Search logic */

  useEffect(() => {
    if (remoteSearch) return;
    const value = searchValue;

    if (!value) {
      setLocalExpandedKeys([]);
      setAutoExpandParent(false);
      return;
    }

    const keysToExpand = flatDataList
      .map(item => {
        const filterValue = item[treeNodeFilterProp as keyof typeof item];

        if (
          filterValue &&
          typeof filterValue === "string" &&
          filterValue.toLowerCase().indexOf(value.toLowerCase()) > -1
        ) {
          return item.key;
        }

        return undefined;
      })
      .filter((key, i, self): key is Key => !!key && self.indexOf(key) === i);

    setLocalExpandedKeys(keysToExpand);
    setAutoExpandParent(true);
  }, [
    searchValue,
    remoteSearch,
    flatDataList,
    nestedTreeData,
    treeNodeFilterProp
  ]);

  /* Handlers */

  const handleTreeExpand = useCallback<HandlerFn<TreeProps, "onExpand">>(
    expandedKeys => {
      if (!remoteSearch && searchValue) {
        setLocalExpandedKeys(expandedKeys);
        setAutoExpandParent(false);
        return;
      }
      onExpandedKeysChange?.(expandedKeys as SafeKey[]);
    },
    [onExpandedKeysChange, remoteSearch, searchValue]
  );

  const handleTreeCheck = useCallback<HandlerFn<TreeProps, "onCheck">>(
    (ck, info) => {
      const valueKeys = Array.isArray(ck) ? ck : (ck?.checked ?? []);
      let state: Record<string, any> = {};

      if (multiple) {
        state.internalValue = valueKeys;
        if (valueKeys) {
          const check = checkSelectAllStatus?.(valueKeys, true);
          state = { ...state, ...check };
        }
      } else {
        state.internalValue = info?.checked ? [info?.node?.key] : [];
      }

      state.internalTreeDataCount = (state.internalValue || []).length;
      setState?.(state);
    },
    [multiple, setState, checkSelectAllStatus]
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
      treeData={nestedTreeData}
      checkedKeys={checkedKeys || []}
      onCheck={handleTreeCheck}
      checkStrictly={(remoteSearch && Boolean(searchValue)) || checkStrictly}
      autoExpandParent={autoExpandParent}
    />
  );
};

export default InnerTree;
