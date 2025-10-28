import { App } from "antd";
import { useCallback } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useConfig } from "./useConfig";

import type { ReactNode } from "react";
import type { ModalFuncProps } from "antd";

export const useConfirm = () => {
  const { t } = useConfig();
  const { modal } = App.useApp();

  return useCallback(
    (
      message: ReactNode,
      okFn: ModalFuncProps["onOk"],
      content?: string,
      options?: ModalFuncProps
    ) => {
      modal.confirm({
        title: typeof message === "string" ? t(message) : message,
        content,
        icon: <ExclamationCircleOutlined />,
        okText: t("YES"),
        cancelText: t("CANCEL"),
        onOk: okFn,
        onCancel: () => void 0,
        ...options
      });
    },
    [modal, t]
  );
};
