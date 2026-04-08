import { Modal } from "antd";
import { InlineWidget } from "react-calendly";
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

  const handleModalClose = () => {
    onClose();
  };

  return (
    <Modal
      centered={true}
      className="book-meeting-modal"
      open={visible}
      closable={true}
      maskClosable={false}
      width={width}
      footer={null}
      destroyOnHidden={true}
      okButtonProps={{ hidden: true }}
      onCancel={handleModalClose}
    >
      <div className="book-meeting-modal-container">
        <span className="book-meeting-modal-title">{t(titleKey)}</span>
        <InlineWidget
          className="calendly-inline-widget"
          url={`https://calendly.com/${APP_SRC_LIST[app]}?text_color=000&primary_color=582eb2`}
        />
      </div>
    </Modal>
  );
};

export default BookMeetingModal;
