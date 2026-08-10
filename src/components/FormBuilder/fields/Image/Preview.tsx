import clsx from "clsx";
import { App } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useConfig } from "@/hooks";
import { useEffect, useMemo } from "react";

import type { FC, MouseEvent } from "react";

export interface PreviewProps {
  value: string | File;
  onDelete: () => void;
  disabled?: boolean;
}

export const Preview: FC<PreviewProps> = ({ value, onDelete, disabled }) => {
  const { t } = useConfig();
  const { modal } = App.useApp();

  const objectUrl = useMemo(
    () => (value instanceof File ? URL.createObjectURL(value) : null),
    [value]
  );

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const src = objectUrl ?? (value as string);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.stopPropagation();
    modal.confirm({
      title: t("DELETE_CONFIRM_PHOTO"),
      icon: <ExclamationCircleOutlined />,
      okText: t("YES"),
      cancelText: t("CANCEL"),
      onOk: () => onDelete(),
      onCancel: () => void 0
    });
  };

  return (
    <div className="ant-upload-list ant-upload-list-picture-card">
      <div className="ant-upload-list-picture-card-container">
        <span>
          <div
            className={clsx(
              "ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-picture-card",
              disabled && "preview-disabled"
            )}
            onClick={handleClick}
          >
            <div className="ant-upload-list-item-info">
              <span>
                <img
                  src={src}
                  alt="Preview"
                  className="ant-upload-list-item-image"
                />
              </span>
            </div>
            {!disabled && (
              <span className="ant-upload-list-item-actions">
                <DeleteOutlined />
              </span>
            )}
          </div>
        </span>
      </div>
    </div>
  );
};
