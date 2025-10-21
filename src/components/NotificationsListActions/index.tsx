import React, { useContext } from "react";
import Button from "@/components/Button";

import { UndoOutlined } from "@ant-design/icons";
import { useConfig } from "@/hooks";
import { EnvelopeIcon } from "@/components/Icons/EnvelopeIcon";
import { DeleteIcon } from "@/components/Icons/DeleteIcon";
import { MailIcon } from "@/components/Icons/MailIcon";
import { NotificationsListContext } from "@/components/NotificationsList/context";

import type {
  NotificationActions,
  NotificationPageType
} from "@/types/notifications";

import "./index.less";

export type ListActionsProps = Omit<NotificationActions, "onOpenLink"> & {
  pageType?: NotificationPageType;
  unreadNotificationsCount?: number;
};

const ListActions: React.FC<ListActionsProps> = ({
  pageType = null,
  unreadNotificationsCount,
  onMarkAsRead,
  onMarkAsUnread,
  onRestore,
  onDelete
}) => {
  const { t } = useConfig();
  const { state } = useContext(NotificationsListContext);

  const checkedKeysData = state?.dataSource?.filter(item =>
    state.checkedKeys.has(item.id)
  );

  const isSomeRead = checkedKeysData?.some(item => item.read);
  const isSomeUnread = checkedKeysData?.some(item => !item.read);

  const showReadButton = state?.checkedAll
    ? unreadNotificationsCount && unreadNotificationsCount > 0
    : isSomeUnread;

  const showUnreadButton =
    pageType !== "unread_page" &&
    (state?.checkedAll ? unreadNotificationsCount !== state.total : isSomeRead);

  return state?.checkedKeys && state?.checkedKeys.size > 0 ? (
    <div className="notifications-actions">
      {showReadButton && (
        <Button onClick={onMarkAsRead} type="link" icon={<EnvelopeIcon />}>
          {t("MARK_AS_READ")}
        </Button>
      )}
      {showUnreadButton && (
        <Button onClick={onMarkAsUnread} type="link" icon={<MailIcon />}>
          {t("MARK_AS_UNREAD")}
        </Button>
      )}
      {pageType === "deleted_page" && (
        <Button onClick={onRestore} type="link" icon={<UndoOutlined />}>
          {t("REVERT")}
        </Button>
      )}
      <Button onClick={onDelete} type="link" icon={<DeleteIcon />}>
        {t("DELETE")}
      </Button>
    </div>
  ) : null;
};

export default React.memo(ListActions);
