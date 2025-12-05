import Button from "@/components/Button";
import { useConfig } from "@/hooks";
import { useRuleContext } from "@/components/RuleInfo/hooks/useRuleContext";

import type { FC, MouseEvent } from "react";

export interface ShowAllModalProps {
  dimensionName?: string;
}

const ShowAllModal: FC<ShowAllModalProps> = ({ dimensionName }) => {
  const { t } = useConfig();
  const { dispatch } = useRuleContext();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch({
      type: "toggleModalShow",
      payload: {
        show: true,
        defaultActiveKey: dimensionName ? [dimensionName] : []
      }
    });
  };

  return (
    <>
      <Button
        type="link"
        className="show-all-modal-button"
        onClick={handleClick}
      >
        {t("SHOW_ALL")}
      </Button>
    </>
  );
};

export default ShowAllModal;
