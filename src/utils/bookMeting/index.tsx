import i18n from "i18next";
import { Modal } from "antd";

import "./index.less";

const defaultMeetingSrc =
  "https://meetings-eu1.hubspot.com/meetings/olena-dziuban/bes-presentation?embed=true";

// TODO: DELETE THIS FILE
const openBookMeetingModal = (src: string = defaultMeetingSrc) => {
  const hubspotScript: HTMLScriptElement = document.createElement("script");

  hubspotScript.src =
    "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";

  hubspotScript.async = true;
  document.head.appendChild(hubspotScript);

  Modal.info({
    closable: true,
    maskClosable: false,
    okButtonProps: {
      hidden: true
    },
    icon: null,
    width: 1000,
    className: "book-meeting-modal",
    style: {
      top: 20
    },
    content: (
      <div className="book-meeting-modal-container">
        <span className="book-meeting-modal-title">
          {i18n.t("BOOK_MEETING_TITLE")}
        </span>
        <div className="meetings-iframe-container" data-src={src}></div>
      </div>
    ),
    onOk: () => {
      document.head.removeChild(hubspotScript);
    }
  });
};

export default openBookMeetingModal;
