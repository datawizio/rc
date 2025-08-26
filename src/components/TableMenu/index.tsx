import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";

import {
  DownOutlined,
  SendOutlined,
  VerticalAlignBottomOutlined
} from "@ant-design/icons";
import { Dropdown, Menu, message } from "antd";
import { useCallback, useMemo } from "react";
import { saveAs } from "file-saver";
import { useConfig } from "@/hooks";
import { useTable } from "@/components/Table/hooks/useTable";

import type { FC, MouseEvent } from "react";
import type { MaybePromise } from "@/types/utils";
import type { ButtonProps } from "@/components/Button";
import type { TableState } from "@/components/Table/types";

import "./index.less";

export interface TableMenuProps extends ButtonProps {
  filename?: string;
  getFilename?: () => string;
  menuItems?: any;
  config?: any;
  settings?: any;
  params?: any;
  duration?: number;
  exportHandler?: (
    tableState: TableState | null,
    filename: string,
    hideLoadingMessageFn?: () => void
  ) => Promise<BlobPart> | Promise<void> | null;
  exportHandlerCallback?: (
    fileData: BlobPart | Blob,
    filename: string
  ) => MaybePromise<void>;
  onSendClick?: (expand?: "horizontally" | "grouped") => Promise<void>;
  onTotalClick?: (e: MouseEvent<HTMLElement>) => void;
  onExpandVertical?: (e: MouseEvent<HTMLElement>) => void;
  onExpandHorizontal?: (e: MouseEvent<HTMLElement>) => void;
  nonExpandableMetrics?: Set<string>;
}

const TableMenu: FC<TableMenuProps> = ({
  config = {},
  settings = {},
  onSendClick,
  exportHandler,
  exportHandlerCallback,
  getFilename,
  filename = "exported_table.xlsx",
  duration,
  onExpandHorizontal,
  onExpandVertical,
  nonExpandableMetrics = new Set(),
  ...restProps
}) => {
  const { translate } = useConfig();
  const context = useTable();

  const { expand_horizontally, expand_tree, vertical_axis_metrics } = settings;
  const {
    fixed_total,
    expand_table_vertically,
    expand_table_horizontally,
    show_export_xls,
    show_send_to_email,
    is_visualization,
    dimension_count,
    has_tree
  } = config;

  const hasExpandableMetrics = vertical_axis_metrics?.some(
    (metric: { value: string }) => !nonExpandableMetrics.has(metric.value)
  );

  const { tableState, dispatch } = useMemo(() => {
    if (context) {
      return { tableState: context.tableState, dispatch: context.dispatch };
    }
    return { tableState: null, dispatch: null };
  }, [context]);

  const handleExport = useCallback(
    async () => {
      if (exportHandler) {
        let file = filename;
        if (getFilename) {
          file = getFilename();
        }
        const messageKey = "exporting-" + file;

        const hideLoadingMessageFn = message.loading({
          content: translate("LOADING"),
          key: messageKey,
          duration: duration
        });

        const fileData = await exportHandler(
          tableState,
          file,
          hideLoadingMessageFn
        );

        if (!fileData) return;

        saveAs(new Blob([fileData]), file);

        message.success({ content: translate("SUCCESS"), key: messageKey });

        if (exportHandlerCallback && fileData) {
          await exportHandlerCallback(new Blob([fileData]), file);
        }
      }
    },
    // eslint-disable-next-line
    [
      tableState,
      translate,
      exportHandler,
      filename,
      getFilename,
      exportHandlerCallback
    ]
  );

  const handleTotalClick = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      e?.stopPropagation();
      e?.preventDefault();

      dispatch?.({
        type: "update",
        payload: {
          fixedTotal: !tableState?.fixedTotal,
          pagination: {
            ...tableState.pagination,
            current: 1
          }
        }
      });
    },
    [dispatch, tableState]
  );

  const handleMenuClick = (e: any) => {
    switch (e.key) {
      case "export_xlsx":
        void handleExport();
        break;
      case "send_xlsx":
        void onSendClick?.(expand_horizontally ? "horizontally" : undefined);
        break;
      default:
        break;
    }
  };

  const {
    send_xlsx_submenu,
    without_expand_tree,
    send_xlsx_expand_submenu,
    expand_tree_horizontally,
    expand_tree_grouped
  } = useMemo(() => {
    const res = {
      send_xlsx_submenu: is_visualization,
      without_expand_tree: true,
      send_xlsx_expand_submenu: false,

      expand_tree_grouped:
        !expand_horizontally &&
        ((has_tree && expand_tree) ||
          (!has_tree && dimension_count > 1 && expand_tree) ||
          dimension_count > 1),

      expand_tree_horizontally:
        !expand_horizontally &&
        hasExpandableMetrics &&
        ((dimension_count === 1 && has_tree) ||
          (has_tree && expand_tree) ||
          (!has_tree && dimension_count > 1 && expand_tree) ||
          dimension_count > 1)
    };

    if (res.expand_tree_horizontally || res.expand_tree_grouped) {
      res.send_xlsx_expand_submenu = true;
    }
    return res;
  }, [
    dimension_count,
    expand_horizontally,
    expand_tree,
    hasExpandableMetrics,
    has_tree,
    is_visualization
  ]);

  const menu = (
    <Menu onClick={handleMenuClick} className="table-menu-dropdown">
      {fixed_total && (
        <Menu.Item key="fixed_total" className="menu-item-checkbox">
          <Checkbox
            checked={Boolean(tableState?.fixedTotal)}
            onClick={handleTotalClick}
          >
            {translate("FIXED_TOTAL")}
          </Checkbox>
        </Menu.Item>
      )}
      {expand_table_vertically && (
        <Menu.Item key="expand_table_vertically" className="menu-item-checkbox">
          <Checkbox onClick={onExpandVertical}>
            {translate("EXPAND_THE_TABLE_VERTICALLY")}
          </Checkbox>
        </Menu.Item>
      )}
      {expand_table_horizontally && (
        <Menu.Item
          key="expand_table_horizontally"
          className="menu-item-checkbox"
        >
          <Checkbox onClick={onExpandHorizontal}>
            {translate("EXPAND_TABLE_HORIZONTALLY")}
          </Checkbox>
        </Menu.Item>
      )}
      {(fixed_total ||
        expand_table_vertically ||
        expand_table_horizontally) && (
        <Menu.Divider className={"table-menu-dropdown__divider"} />
      )}
      {show_export_xls !== false && (
        <Menu.Item
          key="export_xlsx"
          icon={
            <VerticalAlignBottomOutlined
              className={"table-menu-dropdown__icon"}
            />
          }
        >
          {translate("SAVE_XLS")}
        </Menu.Item>
      )}
      {show_send_to_email &&
        (send_xlsx_submenu ? (
          <Menu.SubMenu
            key="send_xlsx_submenu"
            title={
              <>
                <SendOutlined className={"table-menu-dropdown__icon__send"} />
                {translate("SEND_XLS")}
              </>
            }
          >
            {without_expand_tree && (
              <Menu.Item
                key="without_expand_tree"
                onClick={() => onSendClick?.()}
              >
                {translate("WITHOUT_EXPAND_TREE")}
              </Menu.Item>
            )}
            {send_xlsx_expand_submenu && (
              <Menu.SubMenu
                key="send_xlsx_expand_submenu"
                title={translate("APPLY_EXPAND_TREE")}
              >
                {expand_tree_horizontally && (
                  <Menu.Item
                    key="expand_tree_horizontally"
                    onClick={() => onSendClick?.("horizontally")}
                  >
                    {translate("EXPAND_TREE_HORIZONTALLY")}
                  </Menu.Item>
                )}
                {expand_tree_grouped && (
                  <Menu.Item
                    key="expand_tree_grouped"
                    onClick={() => onSendClick?.("grouped")}
                  >
                    {translate("EXPAND_TREE_GROUPED")}
                  </Menu.Item>
                )}
              </Menu.SubMenu>
            )}
          </Menu.SubMenu>
        ) : (
          <Menu.Item
            key="send_xlsx"
            icon={
              <SendOutlined className={"table-menu-dropdown__icon__send"} />
            }
          >
            {translate("SEND_XLS")}
          </Menu.Item>
        ))}
    </Menu>
  );

  const hasMenuItem =
    show_send_to_email ||
    show_export_xls !== false ||
    expand_table_horizontally ||
    expand_table_vertically ||
    fixed_total;

  return hasMenuItem ? (
    <div className="table-menu table-toolbar--right">
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button
          className="table-menu__button"
          icon={<DownOutlined className={"table-menu__icon"} />}
          border={false}
          {...restProps}
        />
      </Dropdown>
    </div>
  ) : null;
};

export default TableMenu;
