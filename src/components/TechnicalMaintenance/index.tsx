import { useState, type FC } from "react";
import { Row } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useConfig } from "@/hooks";

import "./index.less";

export interface TechnicalMaintenanceProps {
  messageKey?: string;
}

const TechnicalMaintenance: FC<TechnicalMaintenanceProps> = ({
  messageKey = "THE_SERVICE_IS_TEMPORARILY_UNAVAILABLE"
}) => {
  const { t } = useConfig();
  const [visible, setVisible] = useState<boolean>(true);

  const onClose = () => {
    setVisible(false);
  };

  return visible ? (
    <Row className="maintenance-container">
      <div className="maintenance-container-message">
        <p>{t(messageKey)}</p>
      </div>
      <CloseOutlined
        className="maintenance-container-close-btn"
        onClick={onClose}
      />
    </Row>
  ) : null;
};

export default TechnicalMaintenance;
