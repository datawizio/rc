import { useState } from "react";
import { Modal } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import { useConfig } from "@/hooks";

import type { FC } from "react";

import "./index.less";

const APP_SRC_LIST = {
  "BES": "chaikovsky-serhii-datawiz/product-demo-datawiz-bi",
  "PH": "olena-dziuban-datawiz/product-demo-bi"
};

export interface BookMeetingModalProps {
  visible: boolean;
  titleKey?: string;
  width: number;
  onClose: () => void;
  app?: keyof typeof APP_SRC_LIST;
}

const BookMeetingModal: FC<BookMeetingModalProps> = ({
  visible,
  onClose,
  width,
  app = "BES",
  titleKey = "BOOK_MEETING_TITLE"
}) => {
  const { t } = useConfig();
  const [loadedWidget, setLoadedWidget] = useState(false);

  const handleModalClose = () => {
    onClose();
    setLoadedWidget(false);
  };

  useCalendlyEventListener({
    onProfilePageViewed: () => setLoadedWidget(true),
    onEventTypeViewed: () => setLoadedWidget(true)
  });

  return (
    <Modal
      centered={true}
      className="book-meeting-modal"
      open={visible}
      closable={true}
      maskClosable={false}
      width={width}
      footer={null}
      okButtonProps={{ hidden: true }}
      onCancel={handleModalClose}
      destroyOnHidden={true}
    >
      <div className="book-meeting-modal-container">
        <span className="book-meeting-modal-title">{t(titleKey)}</span>
        {!loadedWidget && (
          <div className="book-meeting-modal-widget-loader">
            <LoadingOutlined />
          </div>
        )}
        <InlineWidget
          className="calendly-inline-widget"
          url={`https://calendly.com/${APP_SRC_LIST[app]}`}
          pageSettings={{ textColor: "000", primaryColor: "582eb2" }}
          styles={{ opacity: loadedWidget ? 1 : 0 }}
        />
      </div>
    </Modal>
  );
};

export default BookMeetingModal;
