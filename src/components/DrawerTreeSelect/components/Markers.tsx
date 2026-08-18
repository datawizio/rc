import React from "react";
import TreeSelect from "@/components/TreeSelect";
import { useCallback } from "react";
import { useConfig } from "@/hooks";
import { prepareTreeData } from "@/utils/data/tree";

import type { DataNode } from "@rc-component/tree-select/lib/interface";
import type { TreeSelectProps } from "antd";

type LegacyDataNode = Parameters<NonNullable<TreeSelectProps["loadData"]>>[0];

export interface MarkersProps {
  value?: string[] | number[];
  treeData?: any;
  onChange?: any;
  loadChildren?: TreeSelectProps["loadData"];
  placeholder?: string;
  style?: React.CSSProperties;
}

const Markers: React.FC<MarkersProps> = ({
  value = [],
  treeData = [],
  onChange,
  loadChildren,
  placeholder,
  style
}) => {
  const { t } = useConfig();

  const handleSearch = useCallback((inputValue: string, treeNode: DataNode) => {
    if (typeof treeNode.title === "string") {
      return treeNode.title.toLowerCase().includes(inputValue.toLowerCase());
    }
    return false;
  }, []);

  const loadData = async (node: LegacyDataNode) => {
    if (node.children?.length) return;
    await loadChildren?.(node);
  };

  return (
    <TreeSelect
      className="select-markers-field"
      value={value}
      treeData={prepareTreeData(treeData)}
      treeCheckable={true}
      placeholder={placeholder ?? t("SHOP_MARKERS")}
      showCheckedStrategy="SHOW_PARENT"
      loadData={loadData}
      onChange={onChange}
      showSearch={{ filterTreeNode: handleSearch }}
      style={style}
    />
  );
};

export default React.memo(Markers);
