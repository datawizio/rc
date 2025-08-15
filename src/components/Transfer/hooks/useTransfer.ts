import { useReducer } from "react";

export interface ITransferListState {
  sourceChecked: string[];
  targetChecked: string[];
}

function reducer(state: ITransferListState, action: any) {
  switch (action.type) {
    case "setState": {
      return {
        ...state,
        ...action.payload
      };
    }

    case "resetSourceChecked": {
      return {
        ...state,
        sourceChecked: []
      };
    }

    case "resetTargetChecked": {
      return {
        ...state,
        targetChecked: []
      };
    }

    default:
      throw new Error();
  }
}

export const useTransfer = (initialState: ITransferListState) => {
  return useReducer(reducer, initialState);
};
