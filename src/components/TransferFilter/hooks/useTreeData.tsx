import { useRef } from "react";
import { ButtonAddAll } from "../components/ButtonAddAll";
import { convertChildrenToData } from "rc-tree-select/es/utils/legacyUtil";

import type { ReactNode } from "react";
import type { SafeKey } from "antd/es/table/interface";
import type { ICheckedItem } from "../types";
import type {
  DataNode,
  SimpleModeConfig,
  DefaultValueType
} from "rc-tree-select/es/interface";

const MAX_WARNING_TIMES = 10;

const parseSimpleTreeData = (
  treeData: DataNode[],
  disableAll: boolean,
  disabledSet: Set<string>,
  enabledSet: Set<string>,
  selectedSet: Set<string>,
  onItemsSelect: (items: ICheckedItem[], checked: boolean) => void,
  { id, pId, rootPId }: SimpleModeConfig
): DataNode[] => {
  const keyNodes: Record<string, DataNode> = {};
  const rootNodeList: DataNode[] = [];

  // Fill in the map
  const nodeList = treeData.map(node => {
    const clone = { ...node };
    const key = clone[id as SafeKey];

    keyNodes[key] = clone;
    clone.key = clone.key || key;
    clone.disabled = disableAll ? !enabledSet.has(key) : disabledSet.has(key);
    clone.sourceTitle = clone.title;
    clone.title = (
      <>
        {clone.title}
        <ButtonAddAll
          node={keyNodes[key]}
          selected={selectedSet}
          onClick={onItemsSelect}
        />
      </>
    );

    return clone;
  });

  // Connect tree
  nodeList.forEach(node => {
    const parentKey = node[pId as SafeKey];
    const parent = keyNodes[parentKey];

    // Fill parent
    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(node);
    }

    // Fill root tree node
    if (parentKey === rootPId || (!parent && rootPId === null)) {
      rootNodeList.push(node);
    }
  });

  // nodeList.forEach(item => {
  //   const key = item[id];
  //   const node = keyNodes[key];
  //   node.title = (
  //     <>
  //       {node.title}
  //       <ButtonAddAll node={node} />
  //     </>
  //   );
  // });

  return rootNodeList;
};

/**
 * Format `treeData` with `value` and `key` which is used for calculation
 */
const formatTreeData = (
  treeData: DataNode[],
  getLabelProp: (node: DataNode) => ReactNode
): DataNode[] => {
  let warningTimes = 0;
  const valueSet = new Set<DefaultValueType>();

  const dig = (dataNodes: DataNode[] | undefined) => {
    return (dataNodes || []).map(node => {
      const { key, value, children, ...rest } = node;

      const mergedValue = "value" in node ? value : key;

      const dataNode: DataNode = {
        ...rest,
        key: key !== null && key !== undefined ? key : mergedValue,
        value: mergedValue as SafeKey,
        title: getLabelProp(node)
      };

      // Check `key` & `value` and warning user
      if (process.env.NODE_ENV !== "production") {
        if (
          key !== null &&
          key !== undefined &&
          value !== undefined &&
          String(key) !== String(value) &&
          warningTimes < MAX_WARNING_TIMES
        ) {
          warningTimes += 1;
        }

        valueSet.add(value as SafeKey);
      }

      if ("children" in node) {
        dataNode.children = dig(children);
      }

      return dataNode;
    });
  };

  return dig(treeData);
};

/**
 * Convert `treeData` or `children` into formatted `treeData`.
 * Will not re-calculate if `treeData` or `children` not change.
 */
export const useTreeData = (
  treeData: DataNode[],
  disableAll: boolean,
  disabled: string[],
  enabled: string[],
  selected: string[],
  onItemsSelect: (items: ICheckedItem[], checked: boolean) => void,
  children: ReactNode,
  {
    getLabelProp,
    simpleMode
  }: {
    getLabelProp: (node: DataNode) => ReactNode;
    simpleMode: boolean | SimpleModeConfig;
  }
): DataNode[] => {
  const cacheRef = useRef<{
    treeData?: DataNode[];
    children?: ReactNode;
    formatTreeData?: DataNode[];
    disableAll?: boolean;
    disabled?: string[];
    selected?: number;
    enabled?: string[];
  }>({});

  if (treeData) {
    cacheRef.current.formatTreeData =
      cacheRef.current.treeData === treeData &&
      cacheRef.current.disableAll === disableAll &&
      cacheRef.current.disabled === disabled &&
      cacheRef.current.selected === selected.length &&
      cacheRef.current.enabled === enabled
        ? cacheRef.current.formatTreeData
        : formatTreeData(
            simpleMode
              ? parseSimpleTreeData(
                  treeData,
                  disableAll,
                  new Set(disabled),
                  new Set(enabled),
                  new Set(selected),
                  onItemsSelect,
                  {
                    id: "id",
                    pId: "pId",
                    // @ts-expect-error: Type `null` is not assignable to type `SafeKey | undefined`
                    rootPId: null,
                    ...(simpleMode !== true ? simpleMode : {})
                  }
                )
              : treeData,
            getLabelProp
          );

    cacheRef.current.treeData = treeData;
    cacheRef.current.disableAll = disableAll;
    cacheRef.current.disabled = disabled;
    cacheRef.current.enabled = enabled;
    cacheRef.current.selected = selected.length;
  } else {
    cacheRef.current.formatTreeData =
      cacheRef.current.children === children
        ? cacheRef.current.formatTreeData
        : formatTreeData(convertChildrenToData(children), getLabelProp);
  }

  return cacheRef.current.formatTreeData ?? [];
};
