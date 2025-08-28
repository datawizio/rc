import type {
  IDrawerTreeSelectFilters,
  SelectValues
} from "@/components/DrawerTreeSelect/types";

export const getMainLevelItems = (
  items: any[] | undefined = [],
  level: string | number | null = 1
) => {
  const set = new Set<string>();

  for (const item of items) {
    if ((level === null && item.pId === null) || item.level === level) {
      set.add(item.id);
    } else {
      break;
    }
  }
  return set;
};

export const getAllLeafItems = (items: any[] = []) => {
  const array: string[] = [];
  for (const item of items) {
    if (item.isLeaf) {
      array.push(item.id);
    }
  }

  return array;
};

export const isAllItemsChecked = (
  items: SelectValues,
  set: Set<SelectValues[number]>
) => {
  if (items.length !== set.size) return false;

  for (const value of items) {
    if (!set.has(value)) {
      return false;
    }
  }

  return true;
};

export const calcEmptyIsAll = (
  emptyIsAll: boolean,
  filters: IDrawerTreeSelectFilters
) => {
  if (!emptyIsAll) return false;
  if (filters.search) return false;
  if (filters.level && filters.level.toString() !== "1") return false;
  return !(filters.shop_markers && filters.shop_markers.length !== 0);
};
