import clsx from "clsx";
import Button from "@/components/Button";
import TreeSearch from "@/components/TreeSearch";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "antd";
import { ProfileOutlined } from "@ant-design/icons";
import { isSafari } from "@/utils/navigatorInfo";
import { useConfig } from "@/hooks";
import { useTable } from "@/components/Table/hooks/useTable";

import type { FC } from "react";
import type { TableSelectColumnsModalProps } from "../index";
import type { IColumn } from "@/components/Table/types";
import type { Key } from "antd/es/table/interface";

export interface TableSelectColumnsModalModalProps extends TableSelectColumnsModalProps {
  treeData: any;
  context?: any;
  titleRender?: any;
}

const defaultLocale = {
  apply: "SUBMIT",
  checkAll: "ALL",
  openButton: "COLUMNS",
  headerModal: "SELECT_COLUMNS"
};

const getColKeysRec = (columns: IColumn[]) => {
  let keys: (Key | undefined)[] = [];

  columns.forEach(col => {
    if (col) keys.push(col.key);
    if (col.children && col.children.length) {
      keys = keys.concat(getColKeysRec(col.children));
    }
  });

  return keys;
};

export const TableSelectColumnsModalModal: FC<
  TableSelectColumnsModalModalProps
> = ({
  showSelectedCount,
  locale = defaultLocale,
  withSearch = true,
  treeData,
  onSubmit,
  maxCheckedKeys = 100,
  filterSelectedColumns,
  additionalVisibleColumns,
  hiddenColumns,
  titleRender,
  ...props
}) => {
  const { t } = useConfig();
  const { tableState, dispatch, baseTableState } = useTable();

  const columnsCount = useMemo(() => {
    let count = 0;

    function dig(items: IColumn[]) {
      items.forEach(item => {
        if (
          item.children &&
          Array.isArray(item.children) &&
          item.children.length > 0
        ) {
          dig(item.children);
        } else {
          count++;
        }
      });
    }

    dig(treeData);

    return count;
  }, [treeData]);

  if (columnsCount < maxCheckedKeys) maxCheckedKeys = columnsCount;

  const [isOpened, setIsOpened] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [initialCheckedKeys, setInitialCheckedKeys] = useState<string[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleColumnsKeys = useMemo(() => {
    const metricColumns = filterSelectedColumns
      ? filterSelectedColumns(checkedKeys)
      : checkedKeys;

    let columns = additionalVisibleColumns
      ? metricColumns.concat(additionalVisibleColumns)
      : metricColumns;

    if (hiddenColumns && hiddenColumns.length) {
      columns = columns.filter(col => !hiddenColumns.includes(col));
    }

    return columns;
  }, [
    filterSelectedColumns,
    checkedKeys,
    additionalVisibleColumns,
    hiddenColumns
  ]);

  const visibleColumnsKeysLength = useMemo(() => {
    let count = visibleColumnsKeys.length;
    const additionalColumnsLength =
      additionalVisibleColumns && additionalVisibleColumns.length;
    if (additionalColumnsLength) {
      count = count - additionalColumnsLength;
    }
    return count;
  }, [additionalVisibleColumns, visibleColumnsKeys.length]);

  const modalClassNames = useMemo(() => {
    return clsx("select-columns__modal", {
      "select-columns__modal-with-counter": showSelectedCount,
      "select-columns__modal-safari": isSafari()
    });
  }, [showSelectedCount]);

  const selectedInfoClassNames = useMemo(() => {
    return clsx("select-columns__modal-selected", {
      "select-columns__modal-selected-warning":
        visibleColumnsKeysLength > maxCheckedKeys
    });
  }, [maxCheckedKeys, visibleColumnsKeysLength]);

  const unhighlightButton = useCallback(() => {
    setTimeout(() => {
      // @ts-expect-error: Property `blur` does not exist on type `ChildNode`
      containerRef.current?.childNodes[0].blur();
    }, 1000);
  }, [containerRef]);

  const handleApply = useCallback(() => {
    onSubmit?.(visibleColumnsKeys);

    const payload: any = { visibleColumnsKeys, templateSelected: false };
    if (
      (typeof props.fetchAfterApply === "boolean" && props.fetchAfterApply) ||
      (typeof props.fetchAfterApply === "function" &&
        props.fetchAfterApply(visibleColumnsKeys, tableState.dataSource?.[0]))
    ) {
      payload.forceFetch = tableState.forceFetch + 1;
      payload.columnsSwapped = false;
    }

    dispatch({ type: "update", payload });
    setIsOpened(false);
    setCheckedKeys(checkedKeys);
    setSearchValue("");
    unhighlightButton();
  }, [
    onSubmit,
    visibleColumnsKeys,
    props,
    tableState.dataSource,
    tableState.forceFetch,
    dispatch,
    checkedKeys,
    unhighlightButton
  ]);

  const handleCancel = useCallback(() => {
    setIsOpened(false);
    setSearchValue("");
    if (initialCheckedKeys.length > 0) {
      setCheckedKeys(initialCheckedKeys);
    }
    unhighlightButton();
  }, [initialCheckedKeys, unhighlightButton]);

  const onCheck = useCallback((checkedKeys: string[]) => {
    setCheckedKeys(checkedKeys || []);
  }, []);

  useEffect(() => {
    const checkedKeysList = (
      tableState.visibleColumnsKeys && tableState.visibleColumnsKeys.length
        ? tableState.visibleColumnsKeys
        : getColKeysRec(baseTableState.columns ?? [])
    ) as string[];

    setCheckedKeys(checkedKeysList);

    setInitialCheckedKeys(checkedKeysList);
  }, [tableState.visibleColumnsKeys, baseTableState.columns]);

  return (
    <div className="select-columns table-toolbar--right" ref={containerRef}>
      <Button
        border={false}
        onClick={() => setIsOpened(true)}
        title={t("COLUMNS_BTN_TITLE")}
      >
        <ProfileOutlined className="select-columns__icon" />
        {t(locale.openButton)}
      </Button>
      <Modal
        open={isOpened}
        title={t(locale.headerModal)}
        className={modalClassNames}
        destroyOnHidden={true}
        onCancel={handleCancel}
        footer={
          <Button
            type="primary"
            disabled={
              !visibleColumnsKeysLength ||
              visibleColumnsKeysLength > maxCheckedKeys
            }
            onClick={handleApply}
          >
            {t(locale.apply)}
          </Button>
        }
      >
        <TreeSearch
          checkable
          showCheckAll
          showSearchInput={withSearch}
          onCheck={checked => onCheck(checked as string[])}
          treeData={treeData}
          checkedKeys={checkedKeys}
          onExpand={setExpandedKeys}
          expandedKeys={expandedKeys}
          checkAllTitle={t(locale.checkAll)}
          maxCheckedKeys={maxCheckedKeys}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          titleRender={titleRender}
        />
        {showSelectedCount && (
          <div className={selectedInfoClassNames}>
            <div className="select-columns__modal-selected-inner">
              {t("SELECTED")}: {visibleColumnsKeysLength} / {maxCheckedKeys}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
