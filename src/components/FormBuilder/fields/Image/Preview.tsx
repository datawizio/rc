import { Modal } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useConfig } from "@/hooks";

import type { FC, MouseEvent } from "react";

export interface PreviewProps {
  value: string;
  onDelete: () => void;
}

export const Preview: FC<PreviewProps> = ({ value, onDelete }) => {
  const { translate } = useConfig();

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    Modal.confirm({
      title: translate("DELETE_CONFIRM_PHOTO"),
      icon: <ExclamationCircleOutlined />,
      okText: translate("YES"),
      cancelText: translate("CANCEL"),
      onOk: () => onDelete(),
      onCancel: () => void 0
    });
  };

  return (
    <div className="ant-upload-list ant-upload-list-picture-card">
      <div className="ant-upload-list-picture-card-container">
        <span>
          <div
            className="ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-picture-card"
            onClick={handleClick}
          >
            <div className="ant-upload-list-item-info">
              <span>
                <img
                  src={value}
                  alt="Preview"
                  className="ant-upload-list-item-image"
                />
              </span>
            </div>
            <span className="ant-upload-list-item-actions">
              <DeleteOutlined />
            </span>
          </div>
        </span>
      </div>
    </div>
  );
};
