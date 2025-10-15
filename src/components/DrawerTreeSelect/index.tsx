import clsx from "clsx";
import i18next from "i18next";
import Button from "@/components/Button";
import Drawer from "@/components/Drawer";
import SearchInput from "@/components/SearchInput";
import Switch from "@/components/Switch";
import Checkbox from "@/components/Checkbox";
import Levels from "./components/Levels";
import Markers from "./components/Markers";
import InnerTree from "./components/InnerTree";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Skeleton, Tag, TreeSelect } from "antd";
import { useConfig } from "@/hooks";
import { useDrawerTreeSelect } from "./hooks/useDrawerTreeSelect";
import {
  getAllLeafItems,
  getMainLevelItems,
  isAllItemsChecked,
  calcEmptyIsAll
} from "./utils/tree";

import type { Key, ChangeEvent } from "react";
import type { TreeProps, TreeSelectProps } from "antd";
import type { DataNode } from "rc-tree-select/es/interface";
import type { CheckboxChangeEvent } from "antd";
import type { HandlerFn } from "@/types/utils";
import type { IDrawerTreeSelectState } from "./hooks/useDrawerTreeSelect";
import type {
  SelectValues,
  DrawerTreeSelectCompoundComponent,
  IDrawerTreeSelectFilters
} from "./types";

import "./index.less";

type Handler<Name extends keyof TreeSelectProps> = HandlerFn<
  TreeSelectProps,
  Name
>;

const DrawerTreeSelect: DrawerTreeSelectCompoundComponent<SelectValues> = ({
  additionalFilters,
  asyncData,
  showLevels = false,
  showMarkers = false,
  noticeRender,
  markersRender = null,
  markersTree,
  levels = [],
  level,
  drawerTitle = "",
  drawerWidth = 400,
  selectedMarkers,
  headerHeight,
  treeDefaultExpandedKeys,
  dependentItems,
  treeData,
  treeDataCount = 0,
  value,
  isFlatList = false,
  onChange,
  onCheckedDependentValue,
  onChangeReturnObject,
  onLevelChange,
  onMarkerChange,
  onDrawerCloseCallback,
  onDrawerCancelCallback,
  onDrawerOpenCallback,
  onDrawerSubmitCallback,
  loadData,
  loadChildren,
  loadMarkersChildren,
  showCheckedStrategy,
  strictlyModeCheckbox,
  multiple,
  remoteSearch = false,
  loading,
  showSelectAll: propsShowSelectAll = false,
  selectAllUponLevelChange = true,
  emptyIsAll = false,
  placeholder,
  maxSelected,
  maxTagLength,
  treeCheckStrictly,
  disableParentsOnSearch,
  maxTagCount = 10,
  ...restProps
}) => {
  const { translate } = useConfig();

  const drawerSearchPlaceholder = translate("SEARCH");
  const loadingText = translate("LOADING");
  const submitText = translate("SUBMIT");
  const cancelText = translate("CANCEL");
  const selectAllText = translate("ALL");

  const [
    {
      drawerVisible,
      fakeVisible,
      internalValue,
      selected,
      stateTreeData,
      internalLoading,
      internalLevels,
      selectAllState,
      internalTreeExpandedKeys,
      showSelectAll
    },
    dispatch
  ] = useDrawerTreeSelect({
    showSelectAll: propsShowSelectAll,
    fakeVisible: false,
    drawerVisible: false,
    internalValue: value,
    selected: undefined,
    stateTreeData: treeData,
    internalLoading: loading,
    internalLevels: levels,
    selectAllState: "",
    internalTreeDataCount: 0,
    internalTreeExpandedKeys: []
  });

  const [searchValue, setSearchValue] = useState<string>("");
  const mainLevelItems = useRef<Set<string>>(new Set());
  const allLeafItems = useRef<string[]>([]);

  const markersSelected = useRef<string[] | number[]>(selectedMarkers || []);
  const markersChanged = useRef<boolean>(!!selectedMarkers?.length);

  const searchValueRef = useRef<string>("");
  const prevSearchValueRef = useRef<string>(null);
  const levelChanged = useRef<boolean>(false);
  const levelSelected = useRef<string | number | undefined>(
    showLevels ? level : undefined
  );

  const prevTreeData = useRef<DataNode[] | undefined>(undefined);
  const prevLevel = useRef<string | number | undefined>(undefined);
  const prevMarkersSelected = useRef<string[] | number[]>([]);
  const prevEmptyIsAllRef = useRef<boolean>(false);

  const drawerVisibleRef = useRef<boolean>(false);

  const showAllRef = useRef<boolean>(false);
  const emptyIsAllRef = useRef<boolean>(emptyIsAll);

  const [strictlyMode, setStrictlyMode] = useState(treeCheckStrictly ?? false);

  const internalTreeDefaultExpandedKeys = useMemo(() => {
    if (searchValue && !remoteSearch) return undefined;
    if (prevSearchValueRef.current && !remoteSearch) return [];
    return internalTreeExpandedKeys;
  }, [remoteSearch, searchValue, internalTreeExpandedKeys]);

  useEffect(() => {
    prevSearchValueRef.current = searchValue;
  });

  const isLevelShowed =
    showLevels && internalLevels && internalLevels.length > 1;

  const internalTreeData = useMemo(() => {
    const td = (treeData || stateTreeData)?.map((item): DataNode => {
      const resolvedKey = item.key || item.id;

      return {
        ...item,
        key: resolvedKey,
        value: item.value || resolvedKey
      };
    });

    if (
      !disableParentsOnSearch ||
      !restProps.treeDataSimpleMode ||
      !searchValue
    ) {
      return td;
    }

    return td?.map(item => {
      return item.pId === null ? { ...item, disabled: true } : item;
    });
  }, [
    treeData,
    stateTreeData,
    disableParentsOnSearch,
    restProps.treeDataSimpleMode,
    searchValue
  ]);

  // ----- METHODS -------

  const callOnChange = useCallback(
    (value: any, selected?: any) => {
      if (onChangeReturnObject) {
        // When "Clear All" button is pressed,
        // reset markers and tree data
        if (
          !value.length &&
          !drawerVisibleRef.current &&
          markersSelected.current?.length
        ) {
          resetPrevRefs();
          markersSelected.current = [];
          markersChanged.current = false;
          void internalLoadData();
        }

        onChangeReturnObject({
          value: value,
          level: levelSelected.current,
          markers: markersSelected.current,
          selected,
          drawerVisible: drawerVisibleRef.current
        });

        return;
      }

      onChange?.(value, selected);
    },
    // eslint-disable-next-line
    [onChangeReturnObject, onChange]
  );

  const triggerOnChange = useCallback(
    (value: SelectValues | undefined) => {
      if (!onChange) return;

      if (!multiple) {
        if (Array.isArray(value) && value[0]) {
          return callOnChange(value[0], selected);
        }
        return callOnChange("");
      }

      if (isSelectedAll) {
        dispatch({ type: "resetInternalValue" });
        return callOnChange([]);
      }

      callOnChange(value);
    },
    // eslint-disable-next-line
    [multiple, selected, onChange, selectAllState, emptyIsAll, callOnChange]
  );

  const getAllFilters = (first: boolean, newValue?: string[]) => {
    const filters: IDrawerTreeSelectFilters = {
      search: searchValueRef.current,
      ...additionalFilters
    };

    if (showLevels) {
      filters.level = levelSelected.current;
    }

    if (showMarkers || markersRender) {
      filters.shop_markers = markersSelected.current;
    }

    if (first) {
      filters.value = value;
    } else {
      filters.value = newValue ? newValue : internalValue;
    }

    filters.first = first;

    return filters;
  };

  const internalLoadData = useCallback(
    async (first: boolean = false, value?: string[]) => {
      if (!loadData) return;
      const filters = getAllFilters(first, value);

      emptyIsAllRef.current = calcEmptyIsAll(emptyIsAll, filters);

      dispatch({
        type: "remoteLoadDataStart",
        payload: value
      });

      const { data, levels, expanded, count } = await loadData(filters);

      if (levels && levels.length === 1) {
        levelSelected.current = levels[0].value;
      }

      if (showCheckedStrategy === "SHOW_CHILD") {
        allLeafItems.current = getAllLeafItems(data);
      }

      mainLevelItems.current = getMainLevelItems(
        data,
        levelSelected.current ?? null
      );

      const newState: Partial<IDrawerTreeSelectState> = {
        stateTreeData: data
      };

      if (first) {
        prevTreeData.current = data;
      }

      if (count) {
        newState.internalTreeDataCount = count;
      }

      newState.showSelectAll =
        (count > 0 || data.length > 0) && propsShowSelectAll;

      if (showLevels && levels) {
        newState.internalLevels = levels;
      }

      if (drawerVisibleRef.current) {
        let forceSelectAll = false;

        if (markersChanged.current || levelChanged.current) {
          forceSelectAll = selectAllUponLevelChange;

          // Clear internal value if all markers removed
          if (!markersSelected.current?.length) {
            newState.internalValue = [];
            markersChanged.current = false;
          }
        }

        const s = checkSelectAllStatus(
          value || internalValue,
          !emptyIsAllRef.current,
          forceSelectAll
        );

        newState.selectAllState = s.selectAllState;
        if (s.internalValue) {
          newState.internalValue = s.internalValue;
        }
      }

      dispatch({
        type: "remoteLoadDataStop",
        payload: newState
      });

      if (expanded) {
        dispatch({
          type: "setState",
          payload: {
            internalTreeExpandedKeys: expanded
          }
        });
      }
    },
    // eslint-disable-next-line
    [loadData, showLevels, markersRender, remoteSearch, internalValue, value]
  );

  const checkSelectAllStatus = (
    values: SelectValues | undefined,
    ignoreEmpty: boolean = false,
    forceSelectAll: boolean = false
  ) => {
    if (!values) values = [];
    let checked = true;
    if (!multiple)
      return {
        selectAllState: ""
      };

    if (
      forceSelectAll ||
      (!ignoreEmpty &&
        (!values || !values.length) &&
        emptyIsAll &&
        !searchValueRef.current)
    ) {
      return selectAll();
    }

    if (showCheckedStrategy === "SHOW_PARENT") {
      checked = isAllItemsChecked(values || [], mainLevelItems.current);
    } else {
      checked = values.length === allLeafItems.current.length;
    }

    if (!checked && values.length) {
      return {
        selectAllState: "indeterminate"
      };
    }

    if (checked) {
      return {
        selectAllState: "checked"
      };
    }

    return {
      selectAllState: ""
    };
  };

  const selectAll = () => {
    const state: Partial<IDrawerTreeSelectState> = {
      selectAllState: "checked"
    };
    if (showCheckedStrategy === "SHOW_CHILD") {
      state.internalValue = allLeafItems.current;
      return state;
    }
    if (mainLevelItems.current) {
      state.internalValue = Array.from(mainLevelItems.current);
    }
    return state;
  };

  const savePrevRefs = () => {
    prevLevel.current = levelSelected.current;
    prevTreeData.current = stateTreeData;
    prevMarkersSelected.current = markersSelected.current;
    prevEmptyIsAllRef.current = emptyIsAllRef.current;
  };

  const resetPrevRefs = () => {
    searchValueRef.current = "";
    setSearchValue("");

    prevLevel.current = "1";
    prevTreeData.current = [];
    prevMarkersSelected.current = [];
    prevEmptyIsAllRef.current = emptyIsAll;
  };

  const rollbackRefs = () => {
    levelSelected.current = prevLevel.current;
    markersSelected.current = prevMarkersSelected.current;

    emptyIsAllRef.current = prevEmptyIsAllRef.current;
    mainLevelItems.current = getMainLevelItems(
      prevTreeData.current,
      levelSelected.current
    );
  };

  const openDrawer = () => {
    drawerVisibleRef.current = true;

    savePrevRefs();

    if (showCheckedStrategy === "SHOW_CHILD") {
      allLeafItems.current = getAllLeafItems(stateTreeData);
    }

    const values = internalValue?.map(item => {
      return typeof item === "object" && "value" in item ? item.value : item;
    });

    dispatch({
      type: "openDrawer",
      payload: checkSelectAllStatus(values)
    });

    onDrawerOpenCallback?.();
  };

  const closeDrawer = useCallback(() => {
    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement;
      activeElement.blur();
    }, 50);

    resetPrevRefs();
    drawerVisibleRef.current = false;
    onDrawerCloseCallback?.();
    // eslint-disable-next-line
  }, [onDrawerCloseCallback]);

  const isSelectedAll = useMemo(() => {
    return (
      selectAllState === "checked" &&
      emptyIsAllRef.current &&
      !markersSelected.current
    );
  }, [selectAllState]);

  //  -------- HANDLERS --------

  const handlerDrawerCancel = useCallback(() => {
    const prevValue = !multiple && !value ? [] : value;

    if (prevValue && prevValue.length === 0) showAllRef.current = true;

    dispatch({
      type: "setState",
      payload: {
        stateTreeData: [],
        fakeVisible: false
      }
    });
    setTimeout(() => {
      rollbackRefs();

      dispatch({
        type: "drawerCancel",
        payload: {
          stateTreeData: prevTreeData.current,
          internalValue: prevValue
        }
      });

      onDrawerCancelCallback?.({
        markers: markersSelected.current,
        treeData: treeData
      });

      closeDrawer();

      setTimeout(() => {
        showAllRef.current = false;
      }, 200);
    }, 100);
    // eslint-disable-next-line
  }, [multiple, value, dispatch, onDrawerCancelCallback, closeDrawer]);

  const handlerDrawerSubmit = useCallback(() => {
    if (searchValueRef.current && remoteSearch) {
      searchValueRef.current = "";
      setSearchValue("");
      void internalLoadData();
    }

    closeDrawer();
    dispatch({ type: "drawerSubmit" });
    triggerOnChange(internalValue);
    onDrawerSubmitCallback?.();
  }, [
    remoteSearch,
    closeDrawer,
    dispatch,
    triggerOnChange,
    internalValue,
    onDrawerSubmitCallback,
    internalLoadData
  ]);

  const handleSelectClick = () => {
    if (internalLoading) return;
    openDrawer();
  };

  const handlerSearchInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      searchValueRef.current = e.target.value;
      setSearchValue(searchValueRef.current);

      if (remoteSearch) {
        void internalLoadData();
        return;
      }
    },
    // eslint-disable-next-line
    [internalLoadData]
  );

  const handleTreeSelect = useCallback<HandlerFn<TreeProps, "onSelect">>(
    keys => {
      dispatch({
        type: "setSelected",
        payload: keys
      });
    },
    [dispatch]
  );

  const handleTreeSelectChange = useCallback<Handler<"onChange">>(
    (value, _labels, extra) => {
      const { triggerValue, checked } = extra;

      if (checked && onCheckedDependentValue) {
        onCheckedDependentValue(triggerValue, value);
      }

      let state: Partial<IDrawerTreeSelectState> = {};

      if (multiple) {
        state.internalValue = value;
        if (value) {
          const check = checkSelectAllStatus(value, true);
          state = { ...state, ...check };
        }
      } else {
        state.internalValue = extra.checked ? [extra.triggerValue] : [];
      }

      state.internalTreeDataCount = state.internalValue?.length;

      dispatch({
        type: "setState",
        payload: state
      });

      if (!drawerVisible) {
        triggerOnChange(value);
      }
    },
    // eslint-disable-next-line
    [drawerVisible, triggerOnChange, multiple]
  );

  const handlerTreeExpand = useCallback<Handler<"onTreeExpand">>(
    expandedKeys => {
      dispatch({
        type: "internalTreeExpandedKeys",
        payload: expandedKeys
      });
    },
    [dispatch]
  );

  const handleStrictlyModeChange = (checked: boolean) => {
    setStrictlyMode(checked);
  };

  const handleMarkersChange = (markers: string[] | number[]) => {
    markersSelected.current = markers;
    onMarkerChange?.(markers);
    dispatch({
      type: "setState",
      payload: { internalValue: [] }
    });
    markersChanged.current = true;
    void internalLoadData(false, []);
  };

  const handleLevelChange = (level: string | number) => {
    levelSelected.current = level;
    onLevelChange?.(level.toString());
    dispatch({
      type: "setState",
      payload: { internalValue: [] }
    });
    levelChanged.current = true;
    internalLoadData(false, []).then(() => {
      levelChanged.current = false;
    });
  };

  const handleTreeLoadData: HandlerFn<
    TreeProps<any>,
    "loadData"
  > = async node => {
    const tree = treeData || stateTreeData;

    const index = tree?.findIndex(item => item.pId === node.id);
    if (index !== -1) return;

    const data = await loadChildren?.(node.id, additionalFilters);

    dispatch({
      type: "stateTreeData",
      payload: tree?.concat(data)
    });
  };

  const handleSelectAllChange = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;

    const state = checked
      ? selectAll()
      : { selectAllState: "", internalValue: [] };

    dispatch({
      type: "setState",
      payload: state
    });
  };

  // ---- EFFECTS ------

  useEffect(() => {
    if (!dependentItems?.length) return;

    dispatch({
      type: "internalValue",
      payload: (internalValue || []).concat(dependentItems)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependentItems]);

  useEffect(() => {
    dispatch({
      type: "internalValue",
      payload: !multiple && !value ? [] : value
    });
  }, [value, multiple, dispatch]);

  useEffect(() => {
    if (treeData) {
      mainLevelItems.current = getMainLevelItems(
        treeData,
        levelSelected.current
      );

      if (showCheckedStrategy === "SHOW_CHILD") {
        allLeafItems.current = getAllLeafItems(treeData);
      }

      prevTreeData.current = stateTreeData;
    }

    dispatch({
      type: "setState",
      payload: {
        stateTreeData: treeData,
        internalTreeDataCount: treeData ? treeData.length : 0
      }
    });
    // eslint-disable-next-line
  }, [treeData, treeDataCount, dispatch]);

  useEffect(() => {
    dispatch({
      type: "setState",
      payload: { internalLoading: loading }
    });
  }, [loading, dispatch]);

  useEffect(() => {
    if (!asyncData && loadData) {
      void internalLoadData(true);
    }
    // eslint-disable-next-line
  }, [asyncData, additionalFilters]);

  // -------- RENDERS ---------

  const tagRender = useCallback<NonNullable<TreeSelectProps["tagRender"]>>(
    ({ label, closable, onClose }) => {
      const maxLength = maxTagLength || 20;

      if (internalLoading) {
        const loadingTextClasses = clsx({
          "ant-select-selection-placeholder": true,
          "drawer-tree-select-loading-placeholder": true
        });
        return <span className={loadingTextClasses}>{loadingText}</span>;
      }

      if (isSelectedAll || showAllRef.current) {
        return (
          <span className="ant-select-selection-placeholder">
            {placeholder}
          </span>
        );
      }

      if (internalLoading === false)
        return (
          <span className="ant-select-selection-item">
            <Tag
              closable={closable}
              onClose={onClose}
              className="ant-select-selection-item-content"
            >
              {typeof label === "string" && label?.length > maxLength
                ? `${label.slice(0, maxLength)}...`
                : label}
            </Tag>
          </span>
        );

      return <></>;
    },
    [internalLoading, isSelectedAll, loadingText, maxTagLength, placeholder]
  );

  const maxTagPlaceholder = useCallback<Handler<"maxTagPlaceholder">>(
    props => {
      if (internalLoading !== false || (isSelectedAll && props?.length)) {
        return null;
      }
      return <Tag>{`+${props.length}...`}</Tag>;
    },
    [internalLoading, isSelectedAll]
  );

  const limitExceeded =
    multiple &&
    !!maxSelected &&
    Array.isArray(internalValue) &&
    internalValue.length > maxSelected;

  const dropdownRender = () => {
    return (
      <Drawer
        className={clsx(
          "ant-tree-select-dropdown",
          "ant-theme",
          "ant-select-css-var",
          "ant-tree-select-css-var",
          "drawer-tree-select-dropdown",
          isFlatList && "drawer-tree-select-dropdown-flat-list"
        )}
        title={drawerTitle || placeholder}
        onClose={handlerDrawerCancel}
        open={drawerVisible}
        width={
          window.innerWidth < drawerWidth ? window.innerWidth : drawerWidth
        }
        actions={
          <>
            <Button onClick={handlerDrawerCancel}>{cancelText}</Button>
            <Button
              onClick={handlerDrawerSubmit}
              type="primary"
              disabled={limitExceeded}
            >
              {submitText}
            </Button>
          </>
        }
      >
        {noticeRender}
        {markersRender &&
          markersRender({
            onChange: (selected: string[]) => {
              markersSelected.current = selected;
              markersChanged.current = true;
              internalLoadData().then(() => {
                markersChanged.current = false;
              });
            }
          })}
        {showMarkers && (
          <Markers
            treeData={markersTree}
            value={markersSelected.current}
            onChange={handleMarkersChange}
            loadChildren={loadMarkersChildren}
          />
        )}
        {isLevelShowed && (
          <Levels
            onChange={handleLevelChange}
            value={levelSelected.current}
            levels={internalLevels}
          />
        )}
        <SearchInput
          placeholder={drawerSearchPlaceholder}
          value={searchValueRef.current}
          onChange={handlerSearchInputChange}
          loading={internalLoading}
          className={clsx({
            "search-mode": searchValueRef.current
          })}
        />
        {strictlyModeCheckbox && (
          <Switch
            size="small"
            placeholder={i18next.t("STRICTLY_MODE")}
            onChange={handleStrictlyModeChange}
          />
        )}
        {showSelectAll && !searchValueRef.current && (
          <div className="drawer-tree-select-dropdown-toolbar">
            <Checkbox
              onChange={handleSelectAllChange}
              checked={selectAllState === "checked"}
              indeterminate={selectAllState === "indeterminate"}
            >
              {selectAllText}
            </Checkbox>
          </div>
        )}
        {fakeVisible && (
          <InnerTree
            treeData={internalTreeData}
            simpleMode={Boolean(restProps.treeDataSimpleMode)}
            remoteSearch={remoteSearch}
            searchValue={searchValueRef.current}
            treeNodeFilterProp={restProps.treeNodeFilterProp}
            height={listHeight}
            checkStrictly={strictlyMode}
            internalTreeDefaultExpandedKeys={internalTreeDefaultExpandedKeys}
            defaultExpandedKeys={treeDefaultExpandedKeys}
            checkable={Boolean(restProps.treeCheckable)}
            checkedKeys={(internalValue as Key[]) || []}
            multiple={multiple}
            showCheckedStrategy={
              searchValueRef.current ? "SHOW_CHILD" : showCheckedStrategy
            }
            onSelect={handleTreeSelect}
            setState={state => dispatch({ type: "setState", payload: state })}
            onExpandedKeysChange={handlerTreeExpand}
            loadData={loadChildren ? handleTreeLoadData : undefined}
            checkSelectAllStatus={checkSelectAllStatus}
          />
        )}
        <div className="drawer-select-loader-container">
          {internalLoading && (
            <Skeleton
              title={{ width: 300 }}
              paragraph={{ rows: 1 }}
              loading={true}
              active
            />
          )}
        </div>
        {(multiple || maxSelected) && (
          <div
            className="drawer-tree-select-selected"
            data-error={limitExceeded}
          >
            <div className="drawer-tree-select-selected-title">
              {translate("SELECTED")}
            </div>
            <div className="drawer-tree-select-selected-count">
              {selectAllState === "checked" && !markersChanged.current
                ? selectAllText
                : internalValue && Array.isArray(internalValue)
                  ? internalValue.length
                  : 0}
            </div>
            {maxSelected ? <div>/{maxSelected}</div> : null}
          </div>
        )}
      </Drawer>
    );
  };

  const getMarkersFieldHeight = () => {
    return (
      document.getElementsByClassName("select-markers-field")[0]?.clientHeight +
        12 || 44
    );
  };

  const listHeight =
    window.innerHeight -
    (headerHeight ? headerHeight : 0) -
    204 -
    (showMarkers || markersRender ? getMarkersFieldHeight() : 0) -
    (isLevelShowed ? 44 : 0) -
    (strictlyModeCheckbox ? 30 : 0) -
    (showSelectAll ? 34 : 0);

  return (
    <>
      <TreeSelect
        {...restProps}
        value={internalValue}
        className={clsx({
          "drawer-tree-select": true,
          "drawer-tree-selected-all": isSelectedAll
        })}
        treeData={internalTreeData}
        classNames={{ popup: { root: "drawer-tree-select-dropdown-fake" } }}
        open={false}
        multiple={multiple}
        treeCheckStrictly={
          (remoteSearch && Boolean(searchValueRef.current)) || strictlyMode
        }
        showSearch={false}
        placeholder={placeholder}
        loading={internalLoading}
        showCheckedStrategy={
          searchValueRef.current ? "SHOW_CHILD" : showCheckedStrategy
        }
        onClick={handleSelectClick}
        onChange={handleTreeSelectChange}
        tagRender={tagRender}
        maxTagPlaceholder={maxTagPlaceholder}
        maxTagCount={maxTagCount}
      />
      {dropdownRender()}
    </>
  );
};

DrawerTreeSelect.SHOW_ALL = TreeSelect.SHOW_ALL;
DrawerTreeSelect.SHOW_CHILD = TreeSelect.SHOW_CHILD;
DrawerTreeSelect.SHOW_PARENT = TreeSelect.SHOW_PARENT;

export default DrawerTreeSelect;
