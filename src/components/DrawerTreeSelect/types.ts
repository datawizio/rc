import type { FC, ReactElement } from "react";
import type { TreeSelectProps as AntTreeSelectProps } from "antd";
import type { SelectValue } from "antd/lib/tree-select";
import type { AntTreeNode } from "antd/lib/tree";
import type { SafeKey } from "rc-tree-select/es/interface";

export type SelectValues = Extract<SelectValue, unknown[]>;

export interface IDrawerTreeSelectFilters {
  shop_markers?: string[] | number[];
  search?: string;
  level?: string | number;
  value?: SelectValue;
  first?: boolean;
}

export type LevelsType = { value: string; label: string }[];

export interface MarkersRenderProps {
  onChange?: (selected: string[]) => void;
}

export type DrawerTreeSelectProps<VT> = Omit<
  AntTreeSelectProps<VT>,
  "onChange" | "loadData" | "onDeselect"
> & {
  additionalFilters?: any;
  asyncData?: boolean;
  headerHeight?: number;
  drawerTitle?: string;
  drawerWidth?: number;
  showLevels?: boolean;
  noticeRender?: ReactElement | null;
  showMarkers?: boolean;
  markersRender?: ((props: MarkersRenderProps) => ReactElement) | null;
  levels?: LevelsType;
  markersTree?: any;
  level?: string | number;
  isFlatList?: boolean;
  remoteSearch?: boolean;
  showSelectAll?: boolean;
  selectAllUponLevelChange?: boolean;
  selectAllText?: string;
  onCheckedDependentValue?: (
    fieldName: SafeKey,
    selectedItems: string[]
  ) => void;
  dependentItems?: any[];
  treeDataCount?: number;
  strictlyModeCheckbox?: boolean;
  emptyIsAll?: boolean;
  selectedMarkers?: string[] | number[];
  loadData?: (filters: IDrawerTreeSelectFilters) => Promise<any>;
  loadChildren?: (nodeId: string, filters?: any) => Promise<any>;
  loadMarkersChildren?: (id: string, filters?: any) => Promise<any>;
  onChange?: (values: SelectValue, selected?: AntTreeNode, extra?: any) => void;
  onChangeReturnObject?: (obj: {
    value: SelectValue;
    level: string | number | undefined;
    markers: string[] | number[];
    selected?: AntTreeNode;
    drawerVisible?: boolean;
  }) => void;
  onLevelChange?: (level: string) => void;
  onMarkerChange?: (markers: any) => void;
  maxSelected?: number;
  maxTagLength?: number;
  disableParentsOnSearch?: boolean;
  onDrawerCloseCallback?: (payload?: any) => void;
  onDrawerCancelCallback?: (payload?: any) => void;
  onDrawerOpenCallback?: (payload?: any) => void;
  onDrawerSubmitCallback?: (payload?: any) => void;
};

export interface DrawerTreeSelectCompoundComponent<VT>
  extends FC<DrawerTreeSelectProps<VT>> {
  SHOW_PARENT: "SHOW_PARENT";
  SHOW_ALL: "SHOW_ALL";
  SHOW_CHILD: "SHOW_CHILD";
}
