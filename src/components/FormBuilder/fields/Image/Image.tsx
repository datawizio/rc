import clsx from "clsx";
import ImgCrop from "antd-img-crop";
import { App, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Preview } from "./Preview";
import { useConfig } from "@/hooks";

import type { FC } from "react";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { ImageProps } from "../../types";

const MAX_IMAGE_SIZE_MB = 2;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);

export const Image: FC<ImageProps> = ({
  name,
  value,
  disabled,
  placeholder,
  onChange,
  maxFileSize = MAX_IMAGE_SIZE_MB,
  shape = "round",
  saveAs = "base64",
  ...props
}) => {
  const { t } = useConfig();
  const { message } = App.useApp();

  const beforeUpload = (file: RcFile, sizeLimit: number) => {
    const isAllowedType = ALLOWED_IMAGE_TYPES.has(file.type);
    const isAllowedSize = file.size / 1024 / 1024 <= sizeLimit;

    if (!isAllowedType) {
      void message.error(t("INVALID_FORMAT"));
    }

    if (!isAllowedSize) {
      void message.error(
        t("FILE_TOO_LARGE", {
          file_name: file.name,
          size: sizeLimit
        })
      );
    }

    return isAllowedType && isAllowedSize;
  };

  const customRequest: UploadProps["customRequest"] = ({ file, onSuccess }) => {
    if (saveAs === "file") {
      onChange?.({ name, value: file as RcFile });
      onSuccess?.({});
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file as Blob);
    reader.onload = () => {
      if (reader.result && onChange) {
        onChange({ name, value: reader.result as string });
      }
      onSuccess?.({});
    };
  };

  const handleDelete = () => {
    onChange?.({ name, value: null });
  };

  const uploadButton = value ? (
    <Preview value={value} onDelete={handleDelete} disabled={disabled} />
  ) : (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">{placeholder}</div>
    </div>
  );

  return (
    <ImgCrop
      cropShape={shape}
      modalTitle={t("EDIT_IMAGE")}
      modalOk={t("SUBMIT")}
      modalCancel={t("CANCEL")}
      {...props}
    >
      <Upload.Dragger
        disabled={disabled}
        beforeUpload={file => beforeUpload(file, maxFileSize)}
        listType="picture-card"
        showUploadList={false}
        className={clsx("field-image-upload-container", `crop-shape-${shape}`)}
        customRequest={customRequest}
      >
        {uploadButton}
      </Upload.Dragger>
    </ImgCrop>
  );
};
