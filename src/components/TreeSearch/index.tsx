import Tree from "@/components/Tree";
import SearchInput from "@/components/SearchInput";
import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { Empty } from "antd";
import { unTree, flattenOptions, filterOptions } from "@/utils/data/tree";
import { useConfig } from "@/hooks";

import type { AntTreeNodeProps, DataNode } from "antd/es/tree";
import type { TreeProps } from "@/components/Tree";
import type {
  FC,
  Key,
  ReactNode,
  ChangeEvent,
  ChangeEventHandler
} from "react";

export interface AntTreeNodePropsExtended extends AntTreeNodeProps {
  parentKey?: string;
}

export interface TreeSearchProps extends TreeProps {
  /**
   * Localization settings for the search functionality.
   */
  locale?: {
    /**
     * Placeholder text for the search input field.
     * @default "SEARCH"
     */
    searchInputPlaceholder?: string;

    /**
     * Text to display when no search results are found.
     * @default "NO_DATA"
     */
    emptySearchResultText?: string;
  };

  /**
   * Maximum number of nodes that can be selected.
   */
  maxCheckedKeys?: number;

  /**
   * Current search input value.
   * @default ""
   */
  searchValue?: string;

  /**
   * Callback to update the search value.
   * @default () => void 0
   */
  setSearchValue?: (value: string) => void;

  /**
   * Whether to display the search input field.
   * @default true
   */
  showSearchInput?: boolean;

  /**
   * Custom search condition function.
   * By default, checks if the `searchValue` substring is included in `node.title` (case-insensitive).
   * @default null
   */
  searchCondition?: (value: string, node: AntTreeNodeProps) => boolean;

  /**
   * Custom renderer for the search input field.
   * Receives a change event handler for the input element.
   */
  renderInput?: (
    searchInputChangeHandler: ChangeEventHandler<HTMLInputElement>
  ) => ReactNode;

  /**
   * If true, shows all children of a matched parent node in search results.
   */
  showAllChildrenIfParentFound?: boolean;
}

const defaultSearchCondition = (
  searchValue: string,
  node: AntTreeNodeProps
) => {
  return String(node.title)
    .toLowerCase()
    .includes(String(searchValue).toLowerCase());
};

const defaultLocale = {
  searchInputPlaceholder: "SEARCH",
  emptySearchResultText: "NO_DATA"
};

const TreeSearch: FC<TreeSearchProps> = ({
  showSearchInput = true,
  searchValue = "",
  setSearchValue = () => void 0,
  renderInput,
  defaultExpandedKeys,
  treeData,
  searchCondition = null,
  checkedKeys,
  onCheck,
  showAllChildrenIfParentFound,
  locale = defaultLocale,
  ...restProps
}) => {
  const { searchInputPlaceholder, emptySearchResultText } = locale;

  const { t } = useConfig();
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [internalCheckedKeys, setInternalCheckedKeys] =
    useState<TreeProps["checkedKeys"]>(checkedKeys);

  const [expandedKeys, setExpandedKeys] = useState<Key[]>(
    defaultExpandedKeys ?? []
  );

  const [allDisabled, setAllDisabled] = useState<boolean>(false);

  const flatData = useMemo(() => {
    return unTree(treeData);
  }, [treeData]);

  const internalSearchCondition = useMemo(() => {
    return searchCondition || defaultSearchCondition;
  }, [searchCondition]);

  const setDisabledStatus = useCallback(
    (treeData: DataNode[] | undefined, status: boolean) => {
      treeData?.forEach(node => {
        if (node.children?.length) {
          node.disabled = status;
          setDisabledStatus(node.children, status);
        }
      });
    },
    []
  );

  const mergedTreeData = useMemo(() => {
    setDisabledStatus(treeData, !!searchValue);

    const filteredOptions = filterOptions(searchValue, treeData ?? [], {
      optionFilterProp: "title",
      filterOption: internalSearchCondition
    });

    if (!showAllChildrenIfParentFound) {
      filteredOptions.forEach(item => {
        item.children = filterOptions(searchValue, item.children ?? [], {
          optionFilterProp: "title",
          filterOption: internalSearchCondition
        });
      });
    }

    return filteredOptions;
  }, [
    internalSearchCondition,
    searchValue,
    setDisabledStatus,
    treeData,
    showAllChildrenIfParentFound
  ]);

  const handleSearchInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      clearTimeout(timeout.current);

      timeout.current = setTimeout(() => {
        setSearchValue(value);
      }, 200);
    },
    [setSearchValue]
  );

  const handleTreeExpand = useCallback((keys: Key[]) => {
    setExpandedKeys(keys);
  }, []);

  const recDown = useCallback(
    (
      nodes: AntTreeNodePropsExtended[],
      value: boolean,
      nextCheckedKeysSet: Set<Key | undefined>
    ) => {
      nodes.forEach(node => {
        if (node.disabled) return;

        if (value) nextCheckedKeysSet.add(node.key);
        else nextCheckedKeysSet.delete(node.key);

        if (
          node.children &&
          Array.isArray(node.children) &&
          node.children.length
        ) {
          recDown(
            node.children as AntTreeNodePropsExtended[],
            value,
            nextCheckedKeysSet
          );
        }
      });
    },
    []
  );

  const recUp = useCallback(
    (
      node: AntTreeNodePropsExtended,
      value: boolean,
      nextCheckedKeysSet: Set<Key>
    ) => {
      const parent = flatData.find(
        item => item.key === node.parentKey || item.key === node.pId
      );

      if (!parent || !parent.key || parent.key === "-1") return;

      const checked = parent.children?.every((child: DataNode) => {
        return nextCheckedKeysSet.has(child.key);
      });

      if (checked) nextCheckedKeysSet.add(parent.key);
      else nextCheckedKeysSet.delete(parent.key);

      recUp(parent as AntTreeNodePropsExtended, value, nextCheckedKeysSet);
    },
    [flatData]
  );

  const handleTreeCheck = useCallback(
    (keys: TreeProps["checkedKeys"], info: any) => {
      let nextKeys;
      let checked;

      const { node, event } = info;

      if (node.disabled) return;

      if (event === "select") {
        // If ALL checkbox is unchecked
        if (node.key === "-1" && node.checked) {
          const disabledKeys = node.children
            ? (node.children
                .map((item: DataNode) => (item.disabled ? item.key : null))
                .filter(Boolean) as Key[])
            : [];
          setInternalCheckedKeys(disabledKeys);
          onCheck?.(disabledKeys, info);
          return;
        }
        checked = !node.checked;
      } else {
        checked = info.checked;
      }

      if (Array.isArray(keys)) {
        nextKeys = [...keys];
      } else {
        nextKeys = keys ? [...keys.checked] : [];
      }

      const nextCheckedKeysSet = new Set<Key>(nextKeys);
      if (searchValue || event === "select") {
        if (checked) nextCheckedKeysSet.add(node.key);
        else nextCheckedKeysSet.delete(node.key);

        if (node.children && node.children.length) {
          recDown(node.children, checked, nextCheckedKeysSet);
        }

        if (node.parentKey || node.pId) {
          recUp(node, checked, nextCheckedKeysSet);
        }

        nextKeys = Array.from(nextCheckedKeysSet);
      }

      const allIdx = nextKeys.findIndex(key => key === "-1");
      if (allIdx !== -1) nextKeys.splice(allIdx, 1);
      setInternalCheckedKeys(nextKeys);

      onCheck?.(nextKeys, info);
    },
    [onCheck, recUp, recDown, searchValue]
  );

  const handleTreeSelect = useCallback<NonNullable<TreeProps["onSelect"]>>(
    (_, info) => handleTreeCheck(internalCheckedKeys, info),
    [handleTreeCheck, internalCheckedKeys]
  );

  useEffect(() => {
    const options = flattenOptions(treeData);
    if (searchValue) {
      setExpandedKeys(options.map(o => o.key));
      setAllDisabled(true);
    } else {
      setExpandedKeys(["-1"]);
      setAllDisabled(false);
    }
  }, [searchValue, treeData]);

  return (
    <div className="tree-search-container">
      <div className="tree-search-input" style={{ margin: "15px 0" }}>
        {showSearchInput &&
          (renderInput ? (
            renderInput(handleSearchInputChange)
          ) : (
            <SearchInput
              onChange={handleSearchInputChange}
              placeholder={t(
                searchInputPlaceholder ?? defaultLocale.searchInputPlaceholder
              )}
            />
          ))}
      </div>
      {mergedTreeData.length ? (
        <Tree
          {...restProps}
          treeData={mergedTreeData}
          checkedKeys={internalCheckedKeys}
          expandedKeys={expandedKeys}
          selectedKeys={[]}
          checkStrictly={!!searchValue}
          isAllDisabled={allDisabled}
          onExpand={handleTreeExpand}
          onCheck={handleTreeCheck}
          onSelect={handleTreeSelect}
        />
      ) : (
        <Empty
          description={t(
            emptySearchResultText ?? defaultLocale.emptySearchResultText
          )}
        />
      )}
    </div>
  );
};

export default TreeSearch;
