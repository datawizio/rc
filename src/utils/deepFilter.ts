import type { DataSourceType, IRow } from "@/components/Table/types";

export const deepFilter = (
  node: DataSourceType | undefined,
  callback: (row: IRow) => boolean,
  onFoundParent: null | ((row: IRow) => void) = null,
  deepProp: keyof IRow = "children"
): DataSourceType => {
  if (!node) return [];
  return [...node].reduce((acc, item) => {
    if (
      item[deepProp] &&
      Array.isArray(item[deepProp]) &&
      item[deepProp].length
    ) {
      const children = deepFilter(
        item[deepProp],
        callback,
        onFoundParent,
        deepProp
      );

      if (children && children.length) {
        const foundParent = { ...item, children };
        onFoundParent?.(foundParent);
        return acc.concat(foundParent);
      }
    }

    const isCoincided = callback(item);
    return isCoincided ? acc.concat(item) : acc;
  }, [] as DataSourceType);
};
