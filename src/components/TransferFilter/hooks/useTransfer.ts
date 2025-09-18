import { useMemo, useReducer } from "react";
import type { ICheckedItem, TransferFilterValue } from "../types";

export interface ITransferState {
  internalValue: TransferFilterValue;
  sourceValue: TransferFilterValue;
  sourceCheckedObj: { [key: string]: ICheckedItem };
  sourceChecked: string[];
  targetValue: TransferFilterValue;
  targetChecked: string[];
}

export interface IInitUseTransfer {
  internalValue: TransferFilterValue;
}

type TransferAction = {
  type: "setState";
  payload: Partial<ITransferState>;
};

const reducer = (state: ITransferState, action: TransferAction) => {
  switch (action.type) {
    case "setState": {
      return {
        ...state,
        ...action.payload
      };
    }

    default:
      throw new Error("Unknown action type");
  }
};

export const parseValue = (value: TransferFilterValue) => {
  const leftLoad = value.include === null || value.include.length > 0;
  // const rightLoad = value.include !== null && value.include.length === 0;

  const sourceValue: TransferFilterValue = {
    include: value.exclude.length > 0 ? value.exclude : leftLoad ? [] : null,
    exclude: value.include && value.include.length > 0 ? value.include : []
  };

  const targetValue: TransferFilterValue = {
    exclude: value.exclude,
    include: value.include
  };

  return {
    sourceValue,
    targetValue
  };
};

export const useTransfer = (value: TransferFilterValue) => {
  const { sourceValue, targetValue } = useMemo(
    () => parseValue(value),
    [value]
  );

  return useReducer<ITransferState, [TransferAction]>(reducer, {
    internalValue: value,
    sourceValue,
    targetValue,
    sourceCheckedObj: {},
    sourceChecked: [],
    targetChecked: []
  });
};
