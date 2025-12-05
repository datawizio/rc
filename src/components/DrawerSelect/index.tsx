import clsx from "clsx";
import SearchInput from "@/components/SearchInput";
import Drawer from "@/components/Drawer";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Markers from "@/components/DrawerTreeSelect/components/Markers";
import InnerOptions from "./components/InnerOptions";

import { App, Skeleton, Tag, Select, Tree } from "antd";
import { uniqBy } from "lodash";
import { useConfig } from "@/hooks";
import { useDrawerSelect } from "./hooks/useDrawerSelect";
import { useRef, useCallback, useMemo, useEffect, useState } from "react";

import type { FC, ReactNode, UIEvent, ChangeEvent } from "react";
import type { SelectProps, CheckboxChangeEvent, GetRef } from "antd";
import type { AntTreeNode } from "antd/es/tree";
import type { BaseOptionType, DefaultOptionType } from "antd/es/select";
import type { HandlerFn } from "@/types/utils";
import type { SelectValue } from "antd/es/select";
import type { SafeKey } from "rc-tree-select/es/interface";
import type { IDrawerSelectState, SelectValues } from "./hooks/useDrawerSelect";

import "./index.less";

export type DrawerSelectProps<VT> = Omit<SelectProps<VT>, "onChange"> & {
  additionalFilters?: any;
  asyncData?: boolean;
  hideSearch?: boolean;
  drawerTitle?: string;
  drawerWidth?: number;
  labelProp?: string;
  loadData?: (
    filters: any,
    page: number,
    search: string
  ) => Promise<{ data: any; totalPages: number }>;
  optionRender?: (option: DefaultOptionType) => ReactNode;
  noticeRender?: ReactNode;
  labelPropOptions?: ReactNode;
  multiple?: boolean;
  valueProp?: string;
  maxSelectedCount?: number;
  maxTagLength?: number;
  withPagination?: boolean;
  onChange?: (value: any, selected?: AntTreeNode) => void;
  onCheckSelectedValue?: (values: SelectValue) => void;
  onDrawerCancel?: () => void;
  valueToUncheck?: string | number;
  onLoadData?: (data: any, value: any) => { value?: any };
  loadMarkersChildren?: (id: string, filters?: any) => Promise<any>;
  markersTree?: any;
  selectedMarkers?: string[] | number[];
  markersFieldPlaceholder?: string;
  showMarkers?: boolean;
  onMarkerChange?: (markers: any) => void;
  markersFilterName?: string;
  showSelectAll?: boolean;
};

type Handler<T extends keyof SelectProps> = HandlerFn<
  SelectProps<SelectValues>,
  T
>;

const extractProperty = <V,>(
  array: Record<string, V>[],
  propertyName: string
) => {
  return array.map(item => item[propertyName]);
};

const convertOptions = <T extends BaseOptionType>(
  source: T[],
  valueProp: keyof T,
  labelProp: keyof T,
  selectedOptions: T[] = [],
  value: SelectValue | null = []
) => {
  const selected: T[] = [];
  const options: T[] = [];
  const set = new Set(Array.isArray(value) ? value : [value]);

  const selectedIds = selectedOptions.map(item => item[valueProp]);
  const selectedSet = new Set(selectedIds);

  source.forEach(opt => {
    const obj: T = {
      ...opt,
      value: opt[valueProp],
      label: opt[labelProp]
    };

    if (selectedSet.has(opt[valueProp])) {
      selected.push(obj);
      return;
    }

    if (set.has(opt[valueProp])) {
      selected.push(obj);
      return;
    }

    options.push(obj);
  });

  return { options, selected };
};

const DrawerSelect: FC<DrawerSelectProps<SelectValues>> = ({
  additionalFilters,
  asyncData = false,
  hideSearch,
  showSelectAll,
  drawerTitle = "",
  drawerWidth = 400,
  value,
  onChange,
  valueToUncheck,
  onCheckSelectedValue,
  options,
  optionRender,
  optionFilterProp,
  optionLabelProp,
  valueProp = "key",
  labelProp = "title",
  loadData,
  loading,
  multiple = false,
  maxSelectedCount,
  maxTagLength,
  maxTagCount = 10,
  noticeRender,
  labelPropOptions,
  onDrawerCancel,
  onLoadData,
  loadMarkersChildren,
  markersTree,
  selectedMarkers,
  markersFieldPlaceholder,
  showMarkers,
  onMarkerChange,
  markersFilterName,
  ...restProps
}) => {
  const { t } = useConfig();
  const { message } = App.useApp();

  const [
    {
      internalLoading,
      page,
      totalPages,
      drawerVisible,
      searchValue,
      internalValue,
      selected,
      selectAllState,
      optionsState
    },
    dispatch
  ] = useDrawerSelect({
    internalLoading: loading,
    page: 0,
    totalPages: 1,
    drawerVisible: false,
    searchValue: "",
    selectAllState: "",
    internalValue: undefined,
    selected: undefined,
    optionsState: []
  });

  const [scrollLoading, setScrollLoading] = useState(false);

  const optionsRef = useRef<GetRef<typeof Tree>>(null);
  const selectedOptions = useRef<DefaultOptionType[]>([]);
  const firstLoadedOptions = useRef<DefaultOptionType[]>([]);

  const markersSelected = useRef<string[] | number[]>(selectedMarkers || []);
  const markersChanged = useRef<boolean>(!!selectedMarkers?.length);

  const internalOptions = useMemo(() => {
    return options ? convertOptions(options, valueProp, labelProp).options : [];
  }, [options, valueProp, labelProp]);

  // SELECT ALL LOGIC ----------------------------
  // This logic supports only a flat list of options

  const checkSelectAllStatus = useCallback(
    (
      values: SelectValues | null | undefined,
      options?: DefaultOptionType[]
    ) => {
      if (!values) values = [];

      if (!multiple) return "";

      const allChecked = values.length === options?.length;

      if (!allChecked && values.length) {
        return "indeterminate";
      }

      if (allChecked) {
        return "checked";
      }

      return "";
    },
    [multiple]
  );

  const selectAll = useCallback(() => {
    const state: any = { selectAllState: "checked" };
    state.internalValue = optionsState.map((option: any) => option.value);
    return state;
  }, [optionsState]);

  const handleSelectAllChange = useCallback(
    (e: CheckboxChangeEvent) => {
      const checked = e.target.checked;
      let state: any;

      if (checked) {
        state = selectAll();
      } else {
        state = {
          selectAllState: "",
          internalValue: []
        };
      }

      dispatch({
        type: "setState",
        payload: state
      });
    },
    [dispatch, selectAll]
  );

  // ---------------------------------------------

  const callOnChange = useCallback(
    (value: any, selected?: AntTreeNode) => {
      if (!onChange) return;
      if (showMarkers) {
        onChange({
          value: value?.length ? value : [],
          markers: value?.length ? markersSelected.current : [],
          selected
        });
      } else {
        onChange(value, selected);
      }
    },
    [onChange, showMarkers]
  );

  const triggerOnChange = useCallback(
    (value: SelectValues | undefined) => {
      if (!onChange) return;
      if (!multiple) {
        if (Array.isArray(value) && !value.length) {
          callOnChange([]);
        } else {
          callOnChange(
            value,
            Array.isArray(value) && value.length ? selected : undefined
          );
        }
        return;
      }
      callOnChange(value);
    },
    [onChange, multiple, callOnChange, selected]
  );

  const loadPage = useCallback(
    async (search: string, page: number = 0, first: boolean = false) => {
      if (!loadData) return;

      if (page !== 0 && page >= totalPages) {
        return;
      }

      let state: Partial<IDrawerSelectState> = {};

      if (!page) state.optionsState = [];

      dispatch({
        type: "remoteLoadDataStart",
        payload: state
      });

      const filters = { ...additionalFilters, search };

      filters.selected = extractProperty(selectedOptions.current, valueProp);

      if (showMarkers && markersFilterName) {
        filters[markersFilterName] = markersSelected.current;
      }

      if (first) {
        filters.selected = value;
        filters.first = true;
      }

      const { data, totalPages: pages } = await loadData(filters, page, search);

      if (onLoadData) {
        const { value: loadValue } = onLoadData(data, value);
        if (loadValue) {
          triggerOnChange(loadValue);
        }
      }

      const options = convertOptions(
        data,
        valueProp,
        labelProp,
        first ? [] : selectedOptions.current,
        first ? value : []
      );

      if (first) {
        selectedOptions.current = options.selected;
        firstLoadedOptions.current = options.options;
      }

      state = {
        page: page,
        searchValue: search,
        totalPages: pages
      };

      if (page === 0) {
        state.optionsState = uniqBy(
          options.selected.concat(options.options),
          "key"
        );
      } else {
        state.optionsState = uniqBy(
          optionsState.concat(options.options),
          "key"
        );
      }

      if (showSelectAll && markersSelected.current.length) {
        state.selectAllState = first
          ? checkSelectAllStatus(value, state.optionsState)
          : "checked";

        state.internalValue = first
          ? (value ?? undefined)
          : (state.optionsState?.map(option => option.value) as SelectValues);
      }

      dispatch({
        type: "remoteLoadDataStop",
        payload: state
      });
    },
    // eslint-disable-next-line
    [
      loadData,
      dispatch,
      optionsState,
      valueProp,
      labelProp,
      totalPages,
      onLoadData,
      selectedMarkers
    ]
  );

  //  -------- HANDLERS --------

  const closeDrawer = useCallback(() => {
    setTimeout(() => {
      optionsRef.current?.scrollTo({ top: 0 });

      const activeElement = document.activeElement as HTMLElement;
      activeElement.blur();
    }, 100);
  }, []);

  const handleDrawerCancel = useCallback(() => {
    closeDrawer();

    const payload: any = { internalValue: !multiple && !value ? [] : value };

    // Reset selectAllState based on the actual value when canceling
    if (showSelectAll) {
      payload.selectAllState = checkSelectAllStatus(value, optionsState);
    }

    if (searchValue && loadData) {
      payload.optionsState = uniqBy(
        selectedOptions.current.concat(firstLoadedOptions.current),
        "key"
      );
    }

    dispatch({
      type: "drawerCancel",
      payload
    });

    if (searchValue) handleSearch("");

    onDrawerCancel?.();
    // eslint-disable-next-line
  }, [
    dispatch,
    closeDrawer,
    value,
    multiple,
    searchValue,
    loadData,
    showSelectAll,
    checkSelectAllStatus,
    optionsState
  ]);

  const handleDrawerSubmit = useCallback(() => {
    closeDrawer();

    const payload: any = {};

    if (searchValue) {
      payload.optionsState = uniqBy(
        selectedOptions.current.concat(firstLoadedOptions.current),
        "key"
      );
    }

    dispatch({
      type: "drawerSubmit",
      payload
    });

    triggerOnChange(internalValue);
    if (searchValue) handleSearch("");

    if (!internalValue?.length) {
      markersSelected.current = [];
    }

    // eslint-disable-next-line
  }, [dispatch, triggerOnChange, closeDrawer, internalValue, searchValue]);

  const handleSelectClick = () => {
    // if (internalLoading) return;
    dispatch({ type: "openDrawer" });
  };

  const handleSearchInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: "setSearchValue",
        payload: e.target.value
      });
    },
    [dispatch]
  );

  const handleSelect = useCallback(
    (selectedKey: SelectValue, node: DefaultOptionType) => {
      if (selectedKey && onCheckSelectedValue) {
        onCheckSelectedValue(selectedKey);
      }

      // For Tree component, we need to handle selection differently
      // This function is called when an option is selected in the tree
      if (!multiple) {
        selectedOptions.current = [node];
      } else {
        // Check if already selected to avoid duplicates
        const existingIndex = selectedOptions.current.findIndex(
          option => option.key === node.key
        );
        if (existingIndex === -1) {
          selectedOptions.current.push(node);
        }
      }

      dispatch({
        type: "setSelected",
        payload: node
      });
    },
    [dispatch, multiple, onCheckSelectedValue]
  );

  const handleDeselect = useCallback(
    (deselectedKey: SelectValue, node: DefaultOptionType) => {
      if (!multiple) {
        selectedOptions.current = [];
        return;
      }

      // Remove the deselected option from selectedOptions
      const index = selectedOptions.current.findIndex(
        option => option.key === node.key || option.key === deselectedKey
      );

      if (index !== -1) {
        selectedOptions.current.splice(index, 1);
      }
    },
    [multiple]
  );

  const handleSearch = useCallback(
    (searchValue: string) => void loadPage(searchValue),
    [loadPage]
  );

  const handleTreeCheck = useCallback(
    (checkedKeys: SelectValues) => {
      // Find newly selected and deselected items
      const currentValue = internalValue || [];
      const newSelected = checkedKeys.filter(
        key => !currentValue.includes(key as any)
      );
      const newDeselected = currentValue.filter(
        key => !checkedKeys.includes(key as any)
      );

      // Handle newly selected items
      newSelected.forEach(selectedKey => {
        const selectedOption = optionsState.find(
          option => option.value === selectedKey
        );
        if (selectedOption) {
          handleSelect(selectedKey, selectedOption);
        }
      });

      // Handle newly deselected items
      newDeselected.forEach(deselectedKey => {
        const deselectedOption = optionsState.find(
          option => option.value === deselectedKey
        );
        if (deselectedOption) {
          handleDeselect(deselectedKey, deselectedOption);
        }
      });

      // Continue with existing logic
      let newValue: any;

      if (multiple) {
        newValue = checkedKeys;
      } else {
        newValue = checkedKeys[1] ? [checkedKeys[1]] : [checkedKeys[0]];
      }

      if (
        maxSelectedCount &&
        Array.isArray(checkedKeys) &&
        checkedKeys.length > maxSelectedCount
      ) {
        const messageKey = "select-over-then-" + maxSelectedCount;
        void message.error({
          content: t("COUNT_MUST_BE_SMALLER_THEN", {
            maxCount: maxSelectedCount
          }),
          key: messageKey
        });

        return;
      }

      dispatch({
        type: "setInternalValue",
        payload: newValue && newValue[0] ? newValue : checkedKeys
      });

      if (!drawerVisible) {
        triggerOnChange(checkedKeys);
      }

      if (showSelectAll && markersSelected.current.length) {
        dispatch({
          type: "setState",
          payload: {
            selectAllState: checkSelectAllStatus(newValue, optionsState)
          }
        });
      }
    },
    [
      internalValue,
      multiple,
      maxSelectedCount,
      dispatch,
      drawerVisible,
      showSelectAll,
      optionsState,
      handleSelect,
      handleDeselect,
      message,
      t,
      triggerOnChange,
      checkSelectAllStatus
    ]
  );

  const handleChange = useCallback(
    (value: SelectValues) => {
      let newValue: any;

      if (multiple) {
        newValue = value;
      } else {
        newValue = value[1] ? [value[1]] : [value[0]];
      }

      if (
        maxSelectedCount &&
        Array.isArray(value) &&
        value.length > maxSelectedCount
      ) {
        const messageKey = "select-over-then-" + maxSelectedCount;
        void message.error({
          content: t("COUNT_MUST_BE_SMALLER_THEN", {
            maxCount: maxSelectedCount
          }),
          key: messageKey
        });

        return;
      }

      dispatch({
        type: "setInternalValue",
        payload: newValue && newValue[0] ? newValue : value
      });

      if (!drawerVisible) {
        triggerOnChange(value);
      }

      if (showSelectAll && markersSelected.current.length) {
        dispatch({
          type: "setState",
          payload: {
            selectAllState: checkSelectAllStatus(newValue, optionsState)
          }
        });
      }
    },
    [
      multiple,
      maxSelectedCount,
      dispatch,
      drawerVisible,
      showSelectAll,
      message,
      t,
      triggerOnChange,
      checkSelectAllStatus,
      optionsState
    ]
  );

  const handleScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;

      if (internalLoading) return;
      if (page === totalPages - 1) return;

      if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 100) {
        setScrollLoading(true);
        loadPage(searchValue, page + 1).then(() => {
          setScrollLoading(false);
        });
      }
    },
    [internalLoading, page, loadPage, searchValue, totalPages]
  );

  const handleMarkersChange = useCallback(
    (markers: string[] | number[]) => {
      if (!markers) {
        dispatch({
          type: "setState",
          payload: {
            selectAllState: ""
          }
        });
      }

      markersSelected.current = markers;
      onMarkerChange?.(markers);

      dispatch({
        type: "setState",
        payload: { internalValue: [] }
      });

      markersChanged.current = true;

      void loadPage("", 0, false);
    },
    [dispatch, loadPage, onMarkerChange]
  );

  // ------- EFFECTS ----------

  useEffect(() => {
    dispatch({
      type: "setInternalValue",
      payload: !multiple && !value ? [] : value
    });
  }, [dispatch, value, multiple]);

  useEffect(() => {
    if (!internalValue || !valueToUncheck) return;
    const payload = internalValue.filter(v => v !== valueToUncheck);

    dispatch({
      type: "setInternalValue",
      payload
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueToUncheck]);

  useEffect(() => {
    dispatch({
      type: "setState",
      payload: { internalLoading: loading }
    });
  }, [dispatch, loading]);

  useEffect(() => {
    dispatch({
      type: "setState",
      payload: { optionsState: internalOptions }
    });
  }, [dispatch, internalOptions]);

  // Convert option labels if labelProp is changed
  useEffect(() => {
    if (!labelPropOptions) return;

    if (searchValue) {
      dispatch({
        type: "setState",
        payload: { searchValue: "", page: 0 }
      });

      void loadPage("", 0, false);
      return;
    }

    const payload: Partial<IDrawerSelectState> = {
      optionsState: []
    };

    dispatch({
      type: "remoteLoadDataStart",
      payload
    });

    const options = convertOptions(
      optionsState,
      valueProp,
      labelProp,
      selectedOptions.current,
      value
    );

    payload.optionsState = uniqBy(
      options.selected.concat(options.options),
      "key"
    );

    dispatch({
      type: "remoteLoadDataStop",
      payload
    });
    // eslint-disable-next-line
  }, [labelProp]);

  useEffect(() => {
    if (!asyncData && loadData) {
      void loadPage("", 0, true);
    }
    return () => void 0;
    // eslint-disable-next-line
  }, [asyncData, additionalFilters]);

  useEffect(() => {
    if (!asyncData && loadData) {
      void loadPage(searchValue, 0, true);
    }
    // eslint-disable-next-line
  }, [searchValue, asyncData]);

  // -------- RENDERS ---------

  const tagRender = useCallback<Handler<"tagRender">>(
    ({ label, value, closable, onClose }) => {
      const maxLength = maxTagLength || 20;
      const isLongTag = typeof label === "string" && label?.length > maxLength;

      if (!optionsState || optionsState.length === 0) {
        return (
          <span className="ant-select-selection-placeholder">
            {t("LOADING")}
          </span>
        );
      }

      return (
        <span className="ant-select-selection-item">
          <Tag
            closable={closable}
            onClose={onClose}
            className="ant-select-selection-item-content"
            title={label || value}
          >
            {isLongTag ? `${label.slice(0, maxLength)}...` : label || value}
          </Tag>
        </span>
      );
    },
    [maxTagLength, optionsState, t]
  );

  const listHeight =
    window.innerHeight -
    198 -
    (multiple ? 27 : 0) -
    (showMarkers ? 60 : 0) -
    (showSelectAll && markersSelected.current.length ? 28 : 0) -
    (labelPropOptions ? 30 : 0);

  const dropdownRender = () => {
    return (
      <Drawer
        className={clsx({
          "drawer-select-dropdown": true,
          "drawer-select-dropdown-show-all": showSelectAll
        })}
        title={drawerTitle ? drawerTitle : restProps.placeholder}
        onClose={handleDrawerCancel}
        open={drawerVisible}
        size={
          drawerWidth && window.innerWidth < drawerWidth
            ? window.innerWidth
            : drawerWidth
        }
        actions={
          <>
            <Button onClick={handleDrawerCancel}>{t("CANCEL")}</Button>
            <Button onClick={handleDrawerSubmit} type="primary">
              {t("SUBMIT")}
            </Button>
          </>
        }
      >
        {noticeRender}
        {labelPropOptions}
        {showMarkers && (
          <Markers
            treeData={markersTree}
            value={markersSelected.current}
            onChange={handleMarkersChange}
            loadChildren={loadMarkersChildren}
            placeholder={markersFieldPlaceholder}
            style={{ marginBottom: 10 }}
          />
        )}
        {!hideSearch && (
          <SearchInput
            placeholder={t("SEARCH")}
            value={searchValue}
            onChange={handleSearchInputChange}
            loading={internalLoading}
          />
        )}
        {showSelectAll &&
        !searchValue &&
        markersSelected.current.length &&
        optionsState?.length ? (
          <div className="drawer-tree-select-dropdown-toolbar">
            <Checkbox
              onChange={handleSelectAllChange}
              checked={selectAllState === "checked"}
              indeterminate={selectAllState === "indeterminate"}
            >
              {t("ALL")}
            </Checkbox>
          </div>
        ) : null}
        {(!internalLoading || scrollLoading) && (
          <InnerOptions
            ref={optionsRef}
            options={optionsState}
            remoteSearch={!!loadData}
            searchValue={searchValue}
            height={listHeight}
            value={(internalValue as SafeKey[]) || []}
            keyProp={valueProp}
            labelProp={optionLabelProp || "label"}
            filterProp={optionFilterProp || "label"}
            onCheck={handleTreeCheck}
            onScroll={handleScroll}
          />
        )}
        <div className="drawer-select-loader-container">
          {internalLoading && (
            <>
              {!scrollLoading && (
                <div className="drawer-select-list-placeholder">
                  {t("LOADING")}
                </div>
              )}
              <Skeleton
                title={{ width: 330 }}
                paragraph={{ rows: 1 }}
                loading={true}
                active
              />
            </>
          )}
        </div>
        {multiple && (
          <div className="drawer-select-selected">
            <div className="drawer-select-selected-title">{t("SELECTED")}</div>
            <div className="drawer-select-selected-count">
              {internalValue ? internalValue.length : 0}
            </div>
          </div>
        )}
      </Drawer>
    );
  };

  const properties: SelectProps = {
    ...restProps,
    value: internalValue,
    className: "drawer-select",
    open: false,
    loading: internalLoading,
    tagRender,
    maxTagCount,
    classNames: { popup: { root: "drawer-select-dropdown-fake" } },
    onClick: handleSelectClick,
    allowClear: internalValue && internalValue.length > 0,
    onChange: handleChange,
    showSearch: false
  };

  return (
    <>
      {optionRender ? (
        <Select {...properties} mode="multiple">
          {optionsState && optionsState.map(option => optionRender(option))}
        </Select>
      ) : (
        <Select {...properties} mode="multiple" options={optionsState} />
      )}
      {dropdownRender()}
    </>
  );
};

export default DrawerSelect;
