import { useState, type FC } from "react";
import { Row } from "antd";
import { CloseOutlined } from "@ant-design/icons";

import "./index.less";

export interface AnnouncementProps {
  message: string;
}

const Announcement: FC<AnnouncementProps> = ({ message }) => {
  const [visible, setVisible] = useState<boolean>(true);

  const onClose = () => {
    setVisible(false);
  };

  return visible ? (
    <Row className="announcement-container">
      <div className="announcement-container-message">
        <p
          dangerouslySetInnerHTML={{
            __html: message
          }}
        />
      </div>
      <CloseOutlined
        className="announcement-container-close-btn"
        onClick={onClose}
      />
    </Row>
  ) : null;
};

export default Announcement;
