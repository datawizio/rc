import List from "./components/List";
import Operation from "./components/Operation";
import { useRef, useEffect } from "react";
import { useConfig } from "@/hooks";
import { useTransfer } from "./hooks/useTransfer";

import type { FC, ReactElement, CSSProperties } from "react";
import type { LoadDataParams, LoadDataResponse } from "./types";

import "./index.less";

export interface TransferProps {
  prefixCls?: string;
  className?: string;
  disabled?: boolean;
  targetKeys?: string[];
  selectedKeys?: string[];
  operationDisabled?: boolean;
  onChange?: (
    targetKeys: string[],
    direction: string,
    moveKeys: string[]
  ) => void;
  onSelectChange?: (
    sourceSelectedKeys: string[],
    targetSelectedKeys: string[]
  ) => void;
  style?: CSSProperties;
  sourceTitle?: string;
  sourceLoadData?: (params: LoadDataParams) => Promise<LoadDataResponse>;
  sourceFilters?: any;
  sourceActions?: ReactElement;
  resetSourceChecked?: number;
  resetTargetChecked?: number;
  targetTitle?: string;
  targetLoadData?: (params: LoadDataParams) => Promise<LoadDataResponse>;
  targetFilters?: any;
  targetActions?: ReactElement;
  tooltips?: { throwAll: string; throwChosen: string };
  onMoveToRight?: (keys: string[]) => Promise<void>;
  onMoveAllToRight?: () => Promise<void>;
  onMoveToLeft?: (keys: string[]) => Promise<void>;
  onMoveAllToLeft?: () => Promise<void>;
}

const prefixCls = "ant-transfer";

const Transfer: FC<TransferProps> = ({
  operationDisabled,
  sourceTitle,
  sourceLoadData,
  sourceFilters,
  sourceActions,
  resetSourceChecked,
  resetTargetChecked,
  targetTitle,
  targetLoadData,
  targetFilters,
  targetActions,
  tooltips,
  onMoveToRight,
  onMoveAllToRight,
  onMoveToLeft,
  onMoveAllToLeft
}) => {
  const { translate } = useConfig();

  const [{ sourceChecked, targetChecked }, dispatch] = useTransfer({
    sourceChecked: [],
    targetChecked: []
  });

  const targetListRef = useRef<List>(null);
  const sourceListRef = useRef<List>(null);

  const onLeftItemSelect = (selectedKey: string, checked: boolean) => {
    const index = sourceChecked.indexOf(selectedKey);
    if (index > -1) {
      sourceChecked.splice(index, 1);
    }
    if (checked) {
      sourceChecked.push(selectedKey);
    }
    dispatch({
      type: "setState",
      payload: {
        sourceChecked
      }
    });
  };

  const onLeftItemSelectAll = (selectedKeys: string[]) => {
    dispatch({
      type: "setState",
      payload: {
        sourceChecked: selectedKeys
      }
    });
  };

  const handleLeftScroll = () => {};

  const moveToRight = () => {
    sourceListRef.current?.addExceptedKeys(sourceChecked);
    targetListRef.current?.setState({ dataSource: [], loading: true });
    dispatch({
      type: "setState",
      payload: {
        sourceChecked: []
      }
    });

    onMoveToRight?.(sourceChecked);
  };

  const moveAllToRight = () => {
    sourceListRef.current?.setExceptedKeys(["all"]);
    targetListRef.current?.setState({ dataSource: [], loading: true });
    dispatch({
      type: "setState",
      payload: {
        sourceChecked: []
      }
    });

    onMoveAllToRight?.();
  };

  const moveToLeft = () => {
    targetListRef.current?.addExceptedKeys(targetChecked);
    sourceListRef.current?.setState({ dataSource: [], loading: true });
    dispatch({
      type: "setState",
      payload: {
        targetChecked: []
      }
    });

    onMoveToLeft?.(targetChecked);
  };

  const moveAllToLeft = () => {
    targetListRef.current?.setExceptedKeys(["all"]);
    sourceListRef.current?.setState({ dataSource: [], loading: true });
    dispatch({
      type: "setState",
      payload: {
        targetChecked: []
      }
    });

    onMoveAllToLeft?.();
  };

  const onRightItemSelect = (selectedKey: string, checked: boolean) => {
    const index = targetChecked.indexOf(selectedKey);
    if (index > -1) {
      targetChecked.splice(index, 1);
    }
    if (checked) {
      targetChecked.push(selectedKey);
    }
    dispatch({
      type: "setState",
      payload: {
        targetChecked
      }
    });
  };

  const onRightItemSelectAll = (selectedKeys: string[]) => {
    dispatch({
      type: "setState",
      payload: {
        targetChecked: selectedKeys
      }
    });
  };

  useEffect(() => {
    if (resetSourceChecked) dispatch({ type: "resetSourceChecked" });
  }, [dispatch, resetSourceChecked]);

  useEffect(() => {
    if (resetTargetChecked) dispatch({ type: "resetTargetChecked" });
  }, [dispatch, resetTargetChecked]);

  return (
    <div className="dw-transfer">
      <List
        ref={sourceListRef}
        prefixCls={`${prefixCls}-list`}
        titleText={sourceTitle}
        showSearch={true}
        checkedKeys={sourceChecked}
        loadData={sourceLoadData}
        onItemSelect={onLeftItemSelect}
        onItemSelectAll={onLeftItemSelectAll}
        onScroll={handleLeftScroll}
        direction="left"
        actions={sourceActions}
        $filters={sourceFilters}
        noDataText={translate("NO_DATA")}
        searchText={translate("SEARCH")}
        selectedText={translate("SELECTED")}
      />
      <Operation
        className={`${prefixCls}-operation`}
        rightActive={true}
        moveToRight={moveToRight}
        moveAllToRight={moveAllToRight}
        leftActive={true}
        moveToLeft={moveToLeft}
        moveAllToLeft={moveAllToLeft}
        disabled={operationDisabled}
        tooltips={tooltips}
      />
      <List
        ref={targetListRef}
        prefixCls={`${prefixCls}-list`}
        titleText={targetTitle}
        checkedKeys={targetChecked}
        loadData={targetLoadData}
        onItemSelect={onRightItemSelect}
        onItemSelectAll={onRightItemSelectAll}
        showSearch={true}
        onScroll={() => void 0}
        disabled={false}
        direction="right"
        showSelectAll={true}
        actions={targetActions}
        $filters={targetFilters}
        noDataText={translate("NO_DATA")}
        searchText={translate("SEARCH")}
        selectedText={translate("SELECTED")}
      />
    </div>
  );
};

export default Transfer;
