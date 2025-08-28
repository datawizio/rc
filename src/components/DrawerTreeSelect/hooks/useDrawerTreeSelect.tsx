import { useReducer } from "react";

import type { AntTreeNode } from "antd/es/tree";
import type { DataNode, SafeKey } from "rc-tree-select/es/interface";
import type { LevelsType, SelectValues } from "../types";

export interface IUseDrawerTreeSelect {
  drawerVisible: boolean;
  internalValue: SelectValues | undefined;
  selected: AntTreeNode | undefined;
  stateTreeData: DataNode[] | undefined;
  internalLoading: boolean | undefined;
  internalLevels: LevelsType;
  selectAllState: string;
  internalTreeDataCount: number;
  internalTreeExpandedKeys: SafeKey[];
  fakeVisible: boolean;
  showSelectAll: boolean;
}

const reducer = (state: IUseDrawerTreeSelect, action: any) => {
  console.log({ state, action });
  switch (action.type) {
    case "resetInternalValue": {
      return { ...state, internalValue: [] };
    }

    case "remoteLoadDataStart": {
      const newState: any = {
        stateTreeData: [],
        internalLoading: true
      };

      if (action.payload) {
        newState.value = action.payload;
      }

      return { ...state, ...newState };
    }

    case "remoteLoadDataStop": {
      return { ...state, internalLoading: false, ...action.payload };
    }

    case "drawerCancel": {
      return {
        ...state,
        selectAllState: "",
        drawerVisible: false,
        fakeVisible: false,
        internalTreeExpandedKeys: [],
        ...action.payload
      };
    }

    case "openDrawer": {
      return {
        ...state,
        drawerVisible: true,
        fakeVisible: true,
        ...action.payload
      };
    }

    case "drawerSubmit": {
      return {
        ...state,
        drawerVisible: false,
        fakeVisible: false,
        internalTreeExpandedKeys: [],
        ...action.payload
      };
    }

    case "setSelected": {
      return {
        ...state,
        selected: action.payload
      };
    }

    case "internalTreeExpandedKeys": {
      return {
        ...state,
        internalTreeExpandedKeys: action.payload
      };
    }

    case "stateTreeData": {
      return {
        ...state,
        stateTreeData: action.payload
      };
    }

    case "internalValue": {
      return {
        ...state,
        internalValue: action.payload
      };
    }

    case "setState": {
      return {
        ...state,
        ...action.payload
      };
    }

    default:
      throw new Error();
  }
};

export const useDrawerTreeSelect = (initialState: IUseDrawerTreeSelect) => {
  return useReducer(reducer, initialState);
};
