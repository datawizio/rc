// Source: https://github.com/wubostc/virtualized-table-for-antd/blob/master/src/index.tsx

import { set_components, init } from "./vt";

import type { DependencyList } from "react";
import type { TableComponents, VirtualTableOptions } from "./vt";

/**
 * Initialize and manage virtualized table behavior.
 *
 * @param fnOpts
 * A factory function returning {@link VirtualTableOptions}.
 * Executed whenever the dependency list changes.
 *
 * @param deps
 * React dependency array controlling when the virtual table instance reinitialized.
 *
 * @returns
 * A tuple containing:
 * - **vt**: `TableComponents` to pass to the AntD Table.
 * - **setComponents**: Function that allows merging or overriding of internal table components.
 * - **ref**: The ref object exposing virtual scroll methods.
 *
 * @example
 * function TableComponent() {
 *   // Some logic here...
 *
 *   const y = 600;
 *
 *   const [vt] = useVirtualTable(() => ({
 *     scroll: { y }
 *   }), [y]);
 *
 *   return (
 *     <Table
 *       columns={columns}
 *       dataSource={dataSource}
 *       scroll={{ x: 1000, y }}
 *       components={vt}
 *     />
 *   );
 * }
 */
export const useVirtualTable = (
  fnOpts: () => VirtualTableOptions,
  deps: DependencyList
): [
  TableComponents,
  (components: TableComponents) => void,
  VirtualTableOptions["ref"]
] => {
  const ctx = init(fnOpts, deps || []);

  return [
    ctx.vt_components,
    (components: TableComponents) => set_components(ctx, components),
    ctx.ref
  ];
};
