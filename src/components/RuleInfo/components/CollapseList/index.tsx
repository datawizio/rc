import LiteSearchInput from "@/components/LiteSearchInput";
import { useCallback, useEffect, useMemo } from "react";
import { Collapse, Empty, List } from "antd";
import { useConfig } from "@/hooks";
import { MAX_LENGTH_ITEM_LIST } from "@/components/RuleInfo/helpers";
import { useRuleContext } from "@/components/RuleInfo/hooks/useRuleContext";
import type { DimensionsType, ListType } from "@/components/RuleInfo/types";

import "./index.less";

const ROW_HEIGHT = 40;

export const CollapseList = () => {
  const { t } = useConfig();
  const { ruleInfoState, dispatch } = useRuleContext();
  const { filters, dimensions, countValues } = ruleInfoState;

  useEffect(() => {
    return () => {
      dispatch({ type: "reset" });
    };
  }, [dispatch]);

  const handleSearch = useCallback(
    (value: string, type: ListType, name: string) => {
      dispatch({ type: "search", payload: { value, type, name } });
    },
    [dispatch]
  );

  const renderList = useCallback(
    (dimension: DimensionsType, type: ListType) => {
      const { values } = dimension;
      return (
        <>
          {dimension.originalName &&
            countValues[dimension.originalName] > MAX_LENGTH_ITEM_LIST && (
              <div className="list-search">
                <LiteSearchInput
                  onSearch={value => {
                    if (!dimension.originalName) return;
                    handleSearch(value, type, dimension.originalName);
                  }}
                  placeholder={t("SEARCH")}
                  debounceDelay={500}
                />
              </div>
            )}
          <div
            style={{
              maxHeight: ROW_HEIGHT * MAX_LENGTH_ITEM_LIST,
              overflow: "auto"
            }}
          >
            <List
              size="small"
              dataSource={values}
              renderItem={value => <List.Item>{value}</List.Item>}
              locale={{
                emptyText: (
                  <Empty
                    description={t("NO_DATA_AVAILABLE")}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )
              }}
            />
          </div>
        </>
      );
    },
    [countValues, handleSearch, t]
  );

  const renderExtra = useCallback(
    (item: DimensionsType) => {
      if (!item.originalName) return null;
      const count = countValues[item.originalName];

      if (count > 1) {
        return (
          <div>
            {t("TOTAL")}:&nbsp;{count}
          </div>
        );
      }

      return null;
    },
    [countValues, t]
  );

  const isSingleDimension = (
    dimension: any
  ): dimension is Required<DimensionsType> => {
    return dimension?.displayName && dimension?.originalName;
  };

  const renderDimensionItems = useMemo(() => {
    return isSingleDimension(dimensions) ? (
      <Collapse.Panel
        key={dimensions.originalName}
        extra={renderExtra(dimensions)}
        header={<b>{dimensions.displayName}</b>}
      >
        {renderList(dimensions, "dimension")}
      </Collapse.Panel>
    ) : null;
  }, [dimensions, renderExtra, renderList]);

  const renderFilterItems = useMemo(() => {
    if (!Array.isArray(filters)) return null;

    return filters?.map(filter => {
      if (!filter.originalName) return;

      return (
        <Collapse.Panel
          key={filter.originalName}
          extra={renderExtra(filter)}
          header={<b>{filter.displayName}</b>}
        >
          {renderList(filter, "filters")}
        </Collapse.Panel>
      );
    });
  }, [filters, renderExtra, renderList]);

  return (
    <>
      <Collapse
        accordion={true}
        bordered={false}
        defaultActiveKey={ruleInfoState.defaultActiveKey}
        className="rule-info-collapse-list"
      >
        {renderDimensionItems}
        {renderFilterItems}
      </Collapse>
    </>
  );
};

export default CollapseList;
