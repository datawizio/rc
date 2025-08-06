import Checkbox from "@/components/Checkbox";

import { Button } from "antd";
import { useTranslation } from "react-i18next";

import type { MouseEvent, FC, ReactNode } from "react";
import type { CheckboxChangeEvent } from "antd";
import type { CheckAllStatus } from "@/types/notifications";

import "./index.less";

export interface ListHeaderProps {
  checkedCount: number;
  checkboxStatus: CheckAllStatus;
  total?: number;
  actions?: ReactNode;
  onChecked: (e: CheckboxChangeEvent) => void;
  onCheckAll: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const ListHeader: FC<ListHeaderProps> = ({
  checkboxStatus,
  checkedCount,
  total,
  actions,
  onChecked,
  onCheckAll
}) => {
  const { t } = useTranslation();

  return (
    <div className="dw-list-header">
      <div>
        <Checkbox
          checked={checkboxStatus === "all"}
          indeterminate={checkboxStatus === "partial"}
          onChange={onChecked}
        />
      </div>
      {checkedCount > 0 && (
        <div className="selected-count">
          {t("SELECTED_NOTIFICATIONS", { count: checkedCount, total })}
        </div>
      )}
      {checkboxStatus === "all" && (
        <div className="select-all-container">
          <Button type="link" onClick={onCheckAll}>
            {t("SELECT_ALL_NOTIFICATIONS", { total })}
          </Button>
        </div>
      )}
      <div className="fill-place"></div>
      {actions}
    </div>
  );
};
