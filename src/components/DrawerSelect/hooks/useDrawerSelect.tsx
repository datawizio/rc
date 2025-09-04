import { useReducer } from "react";

import type { AntTreeNode } from "antd/lib/tree";
import type { DefaultOptionType, SelectValue } from "antd/lib/select";

export type SelectValues = Extract<SelectValue, unknown[]>;

export interface IDrawerSelectState {
  internalLoading: boolean | undefined;
  page: number;
  totalPages: number;
  drawerVisible: boolean;
  searchValue: string;
  internalValue: SelectValues | undefined;
  selected: AntTreeNode | undefined;
  selectAllState: string;
  optionsState: DefaultOptionType[];
}

const reducer = (state: IDrawerSelectState, action: any) => {
  switch (action.type) {
    case "remoteLoadDataStart": {
      return { ...state, internalLoading: true, ...action.payload };
    }

    case "remoteLoadDataStop": {
      return { ...state, internalLoading: false, ...action.payload };
    }

    case "drawerCancel": {
      return {
        ...state,
        searchValue: "",
        drawerVisible: false,
        ...action.payload
      };
    }

    case "openDrawer": {
      return {
        ...state,
        drawerVisible: true
      };
    }

    case "drawerSubmit": {
      return {
        ...state,
        searchValue: "",
        drawerVisible: false,
        ...action.payload
      };
    }

    case "setSelected": {
      return {
        ...state,
        selected: action.payload
      };
    }

    case "setSearchValue": {
      return {
        ...state,
        searchValue: action.payload
      };
    }

    case "setInternalValue": {
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

export const useDrawerSelect = (initialState: IDrawerSelectState) => {
  return useReducer(reducer, initialState);
};
