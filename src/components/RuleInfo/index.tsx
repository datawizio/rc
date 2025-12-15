import React from "react";
import ColoredTags from "@/components/ColoredTags";
import ShowAllModal from "./components/ShowAllModal";

import { Modal } from "antd";
import { ignoredFilters } from "@/utils/filter/constants";
import { CollapseList } from "./components/CollapseList";
import { RuleInfoSection } from "./components/RuleInfoSection";
import { useRuleInfo } from "./reducer";
import { RuleInfoContext } from "./context";
import { parseDimension, parseLogic } from "./helpers";

import type { RuleInfoProps } from "./types";

import "./index.less";

const RuleInfo: React.FC<RuleInfoProps> = ({
  logic,
  widget_params,
  formatDateRange,
  name,
  dtype,
  disabled,
  tooltip
}) => {
  const [state, dispatch] = useRuleInfo({
    logic,
    dtype,
    widget_params,
    formatDateRange,
    name
  });

  const handleCancel = () => {
    dispatch({
      type: "toggleModalShow",
      payload: { show: false, defaultActiveKey: [] }
    });
  };

  const filtersOverflow =
    Array.isArray(state.filters) &&
    !!state.filters?.find(f => (f.values?.length ?? -1) > 2);

  const dimensionsOverflow = (state.dimensions?.values?.length ?? -1) > 2;

  const showAllModalButton = (filtersOverflow || dimensionsOverflow) && (
    <ShowAllModal />
  );

  return (
    <RuleInfoContext.Provider value={{ ruleInfoState: state, dispatch }}>
      <div className="rule-info">
        <RuleInfoSection
          name="CONDITION"
          className="rule-condition"
          disabled={disabled}
          tooltip={tooltip}
        >
          {typeof logic === "string" ? logic : parseLogic(logic)}
        </RuleInfoSection>

        {!!widget_params.dimension && (
          <RuleInfoSection name="DIMENSION" className="rule-dimension">
            <ColoredTags startIndex={2}>
              {parseDimension(
                widget_params.dimension,
                formatDateRange,
                false,
                2
              )}
            </ColoredTags>
          </RuleInfoSection>
        )}

        {!!widget_params.filters?.length && (
          <RuleInfoSection name="FILTERS" className="rule-filters">
            <ColoredTags suffix={showAllModalButton}>
              {widget_params.filters
                .filter(f => !ignoredFilters.includes(f.name))
                .map(f => parseDimension(f, formatDateRange, false, 2))}
            </ColoredTags>
          </RuleInfoSection>
        )}
      </div>

      <Modal
        title={name}
        className="rule-info-modal"
        open={state.modalShow}
        width="65%"
        destroyOnHidden={true}
        afterClose={() => dispatch({ type: "reset" })}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <CollapseList />
      </Modal>
    </RuleInfoContext.Provider>
  );
};

export default React.memo(RuleInfo);
