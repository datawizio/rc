import type List from "./components/List";
import type { ICheckedItem, TransferFilterItem } from "./types";

export const isLoadedDataSource = (include: string[] | null) => {
  return Array.isArray(include) && include.length === 0;
};

export const isLocalDataSource = (
  include: string[] | null,
  direction: "right" | "left",
  local?: boolean
) => {
  if (local) return true;
  return direction === "right" && Array.isArray(include) && include.length > 0;
};

export const searchByArticle = (
  filterValue: string,
  item: TransferFilterItem
) => {
  const searchSet = new Set(filterValue.split(";"));
  if (item.article && searchSet.has(item.article)) {
    return true;
  }
};

export const getAllItems = (list: List | null): ICheckedItem[] => {
  if (!list) return [];

  const filteredItems = list["getFilteredItems"](list["state"]["dataSource"]);
  const disabledKeys = list["getDisabledKeys"](filteredItems);

  return filteredItems
    .filter(item => !disabledKeys.has(item.key))
    .map(({ key, title, article }) => ({
      key,
      title: title!,
      ...(article ? { article } : {})
    }));
};
