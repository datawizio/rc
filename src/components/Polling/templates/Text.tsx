import { useState } from "react";
import { Button, Input, Space } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useConfig } from "@/hooks";

import type { FC } from "react";
import type { StepProps } from "../types";

const Text: FC<StepProps> = ({ onSubmit }) => {
  const { t } = useConfig();
  const [textValue, setTextValue] = useState<string>("");

  const handleSubmit = () => {
    onSubmit(textValue, true);
  };

  return (
    <div className="polling-text">
      <Space.Compact>
        <EditOutlined />
        <Input maxLength={500} onChange={e => setTextValue(e.target.value)} />
      </Space.Compact>
      <Button
        className="polling-send-btn"
        disabled={!textValue}
        onClick={handleSubmit}
      >
        {t("SEND")}
      </Button>
    </div>
  );
};

export default Text;
