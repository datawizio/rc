import ImgCrop from "antd-img-crop";
import { Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Preview } from "./Preview";
import { useConfig } from "@/hooks";

import type { RcFile } from "antd/es/upload";
import type { ImageProps } from "../../types";

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }

  return isJpgOrPng && isLt2M;
};

export const Image: React.FC<ImageProps> = ({
  name,
  value,
  placeholder,
  onChange
}) => {
  const { t } = useConfig();

  const upload = (file: RcFile) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result && onChange)
        onChange({ name, value: reader.result as string });
    };
    return "";
  };

  const handleDelete = () => {
    onChange?.({ name, value: null });
  };

  const uploadButton = value ? (
    <Preview value={value} onDelete={handleDelete} />
  ) : (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">{placeholder}</div>
    </div>
  );
  return (
    <ImgCrop
      cropShape="round"
      modalTitle={t("EDIT_IMAGE")}
      modalOk={t("SUBMIT")}
      modalCancel={t("CANCEL")}
    >
      <Upload.Dragger
        beforeUpload={beforeUpload}
        action={upload}
        listType="picture-card"
        showUploadList={false}
        className="field-image-upload-container"
        customRequest={() => {}}
      >
        {uploadButton}
      </Upload.Dragger>
    </ImgCrop>
  );
};
