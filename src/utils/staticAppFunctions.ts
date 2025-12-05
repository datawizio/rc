import {
  App,
  Modal as modalApi,
  message as messageApi,
  notification as notificationApi
} from "antd";

import type { MessageInstance } from "antd/es/message/interface";
import type { ModalStaticFunctions } from "antd/es/modal/confirm";
import type { NotificationInstance } from "antd/es/notification/interface";

let message: MessageInstance = messageApi;
let notification: NotificationInstance = notificationApi;
let modal: Omit<ModalStaticFunctions, "warn"> = modalApi;

/**
 * Synchronize Ant Design's static functions (`message`, `notification`, `modal`)
 * with the themed instances provided by the `App` context.
 *
 * By default, this module exports the static functions directly from `antd` (un-themed).
 * Once `useAppFunctions()` is called within a component wrapped by `<App>`,
 * it replaces these default instances with the themed ones from `App.useApp()`.
 *
 * This allows you to use consistent, theme-aware message, modal, and notification APIs
 * across your entire application without manually passing them around.
 */
export const useAppFunctions = () => {
  const staticFunction = App.useApp();
  message = staticFunction.message;
  modal = staticFunction.modal;
  notification = staticFunction.notification;
};

export { message, modal, notification };
