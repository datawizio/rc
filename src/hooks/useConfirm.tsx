import { Modal } from "antd";
import { useCallback } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useConfig } from "./useConfig";

import type { ReactNode } from "react";
import type { ModalFuncProps } from "antd";

export const useConfirm = () => {
  const { translate } = useConfig();

  return useCallback(
    (
      msg: string | ReactNode,
      okFn: any,
      content?: string,
      options?: ModalFuncProps
    ) => {
      Modal.confirm({
        title: typeof msg === "string" ? translate(msg) : msg,
        content,
        icon: <ExclamationCircleOutlined />,
        okText: translate("YES"),
        cancelText: translate("CANCEL"),
        onOk: () => okFn(),
        onCancel: () => {},
        ...options
      });
    },
    [translate]
  );
};
