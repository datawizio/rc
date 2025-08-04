import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import type { FC } from "react";

import "./index.less";

const { Text } = Typography;

export interface ExpandButtonProps {
  listOpen: boolean;
  setListOpen: (isOpen: boolean) => void;
}

const ExpandButton: FC<ExpandButtonProps> = ({ listOpen, setListOpen }) => {
  const { t } = useTranslation();

  const handleClick = (isOpen: boolean) => () => {
    setListOpen(isOpen);
  };

  return (
    <span className="expand-button">
      {listOpen ? (
        <Text type="secondary" onClick={handleClick(false)}>
          ...{t("LESS")}
        </Text>
      ) : (
        <Text type="secondary" onClick={handleClick(true)}>
          ...{t("MORE")}
        </Text>
      )}
    </span>
  );
};

export default ExpandButton;
