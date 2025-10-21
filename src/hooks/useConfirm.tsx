import { Modal } from "antd";
import { useCallback } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useConfig } from "./useConfig";

import type { ReactNode } from "react";
import type { ModalFuncProps } from "antd";

export const useConfirm = () => {
  const { t } = useConfig();

  return useCallback(
    (
      msg: string | ReactNode,
      okFn: ModalFuncProps["onOk"],
      content?: string,
      options?: ModalFuncProps
    ) => {
      Modal.confirm({
        title: typeof msg === "string" ? t(msg) : msg,
        content,
        icon: <ExclamationCircleOutlined />,
        okText: t("YES"),
        cancelText: t("CANCEL"),
        onOk: okFn,
        onCancel: () => void 0,
        ...options
      });
    },
    [t]
  );
};
