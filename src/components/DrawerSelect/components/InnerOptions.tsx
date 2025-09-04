import { useCallback, useEffect, useMemo, useState } from "react";
import { Tree } from "antd";
import { useConfig } from "@/hooks";
import { buildTreeData } from "@/components/DrawerTreeSelect/utils/tree";

import type { FC, Key } from "react";
import type { TreeProps, TreeDataNode } from "antd";
import type { SafeKey, SimpleModeConfig } from "rc-tree-select/es/interface";
import type { HandlerFn } from "@/types/utils";
import type { DefaultOptionType } from "antd/es/select";
import type { BasicDataNode } from "antd/es/tree";

export type InnerOptionsProps = Omit<
  TreeProps<BasicDataNode & SimpleModeConfig>,
  | "multiple"
  | "selectable"
  | "checkable"
  | "treeData"
  | "checkedKeys"
  | "onCheck"
  | "checkStrictly"
  | "filterTreeNode"
> & {
  options: DefaultOptionType[];
  value: SafeKey[];
  remoteSearch?: boolean;
  searchValue?: string;
  keyProp?: string;
  labelProp?: string;
  filterProp?: string;
  onCheck?: (checked: SafeKey[]) => void;
};

const InnerOptions: FC<InnerOptionsProps> = ({
  options,
  value,
  remoteSearch,
  searchValue,
  keyProp = "key",
  labelProp = "title",
  filterProp = "title",
  onCheck,
  ...props
}) => {
  const { translate } = useConfig();
  const [notHiddenKeys, setNotHiddenKeys] = useState<Set<Key> | null>(null);

  const nestedTreeData = useMemo(() => {
    return buildTreeData(
      options.map(option => ({
        ...option,
        id: option[keyProp],
        key: option[keyProp],
        title: option[labelProp],
        isLeaf: true,
        pId: 0
      }))
    );
  }, [options, labelProp, keyProp]);

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

    // Visually hide nodes that are not expanded during local searching (do not filter data)
    const markHidden = (nodes?: TreeDataNode[]): TreeDataNode[] | undefined => {
      if (!nodes) return nodes;
      return nodes.map(node => {
        const shouldHide = notHiddenKeys && !notHiddenKeys.has(node.key);
        const children = markHidden(node.children);

        return {
          ...node,
          children,
          style: shouldHide ? { ...node.style, display: "none" } : node.style
        } as TreeDataNode;
      });
    };

    return markHidden(nestedTreeData as TreeDataNode[]);
  }, [searchingLocally, nestedTreeData, notHiddenKeys]);

  useEffect(() => {
    if (remoteSearch) return;

    if (!searchValue) {
      setNotHiddenKeys(null);
      return;
    }

    const keysToDisplay = options
      .map(item => {
        const filterValue = item[filterProp as keyof DefaultOptionType];
        if (searchPredicate(filterValue)) return item[keyProp];
        return null;
      })
      .filter((x): x is SafeKey => Boolean(x));

    setNotHiddenKeys(new Set(keysToDisplay));
  }, [
    options,
    searchValue,
    remoteSearch,
    filterProp,
    keyProp,
    nestedTreeData,
    searchPredicate
  ]);

  /* Handlers */

  const handleTreeCheck = useCallback<HandlerFn<TreeProps, "onCheck">>(
    ck => {
      const rawChecked = Array.isArray(ck) ? ck : (ck?.checked ?? []);
      onCheck?.(rawChecked as SafeKey[]);
    },
    [onCheck]
  );

  // During local search, if nothing matched, all nodes are effectively hidden
  if (
    nestedTreeData?.length === 0 ||
    (searchingLocally && searchValue && !notHiddenKeys?.size)
  ) {
    return translate("NO_DATA");
  }

  return (
    <Tree
      {...props}
      multiple={true}
      selectable={false}
      checkable={true}
      treeData={renderedTreeData}
      checkedKeys={value || []}
      onCheck={handleTreeCheck}
      checkStrictly={true}
      virtual={!searchingLocally}
    />
  );
};

export default InnerOptions;
