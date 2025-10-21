import React from "react";
import TreeSelect from "@/components/TreeSelect";
import { useCallback } from "react";
import { useConfig } from "@/hooks";

export interface MarkersProps {
  value?: string[] | number[];
  treeData?: any;
  onChange?: any;
  loadChildren?: (id: string, filters?: any) => Promise<any>;
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

  const handleSearch = useCallback((inputValue: string, treeNode: any) => {
    return treeNode.title.toLowerCase().includes(inputValue.toLowerCase());
  }, []);

  const loadData = async (node: any) => {
    if (node.children?.length) return;
    await loadChildren?.(node);
  };

  return (
    <TreeSelect
      value={value}
      treeData={treeData}
      treeCheckable={true}
      placeholder={placeholder ?? t("SHOP_MARKERS")}
      showCheckedStrategy="SHOW_PARENT"
      loadData={loadData}
      onChange={onChange}
      filterTreeNode={handleSearch}
      className="select-markers-field"
      style={style}
    />
  );
};

export default React.memo(Markers);
