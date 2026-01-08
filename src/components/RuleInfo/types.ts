import type { Dispatch } from "react";

export interface RuleInfoProps {
  formatDateRange: FormatDateRangeType;
  logic: object | string;
  widget_params: WidgetParams;
  name: string;
  dtype: string;
  disabled?: boolean;
  tooltip?: string;
}

export type WidgetParamsDimension = {
  name: string;
  type?: "exclude" | "include";
  values?: string[] | string | boolean | number | object;
};

export interface WidgetParams {
  dimension?: WidgetParamsDimension;
  filters?: WidgetParamsDimension[];
}
export interface DimensionsType {
  displayName?: string;
  originalName?: string;
  values?: string[];
}

export type FormatDateRangeType = (from: string, to: string) => string;

export interface IRuleInfoReducer {
  widgetParams: WidgetParams;
  dimensions?: DimensionsType | DimensionsType[];
  filters?: DimensionsType | DimensionsType[];
  countValues: { [key: string]: number };
  logic: object | string;
  formatDateRange: FormatDateRangeType;
  name: string;
  modalShow: boolean;
  defaultActiveKey: string[];
}

export interface IRuleInfoContext {
  ruleInfoState: IRuleInfoReducer;
  dispatch: Dispatch<RuleInfoAction>;
}

export type ListType = keyof WidgetParams;

export type RuleInfoAction =
  | {
      type: "toggleModalShow";
      payload: { show: boolean; defaultActiveKey: string[] };
    }
  | {
      type: "search";
      payload: { value: string; type: ListType; name: string };
    }
  | {
      type: "reset";
    };
