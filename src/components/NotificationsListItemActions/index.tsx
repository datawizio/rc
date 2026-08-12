import { Button } from "antd";
import { UndoOutlined } from "@ant-design/icons";
import { useConfig } from "@/hooks";
import { DeleteIcon } from "@/components/Icons/DeleteIcon";
import { EnvelopeIcon } from "@/components/Icons/EnvelopeIcon";
import { MailIcon } from "@/components/Icons/MailIcon";
import { OpenPageIcon } from "@/components/Icons/OpenPageIcon";

import type { FC } from "react";
import type {
  INotification,
  NotificationActions,
  NotificationPageType
} from "@/types/notifications";

import "./index.less";

export interface ListItemActionsProps extends NotificationActions {
  item: INotification;
  pageType?: NotificationPageType;
  link?: string | null;
}

const ListItemActions: FC<ListItemActionsProps> = ({
  item,
  pageType = null,
  link,
  onOpenLink,
  onDelete,
  onRestore,
  onMarkAsRead,
  onMarkAsUnread
}) => {
  const { t } = useConfig();

  return (
    <div className="list-item-actions">
      {link && (
        <Button
          type="link"
          icon={<OpenPageIcon />}
          title={t("NAVIGATE_TO")}
          className="dw-list-go-to"
          onClick={onOpenLink}
        />
      )}
      {item.read ? (
        <Button
          type="link"
          icon={<MailIcon />}
          title={t("MARK_AS_UNREAD")}
          className="dw-list-mail"
          onClick={onMarkAsUnread}
        />
      ) : (
        <Button
          type="link"
          icon={<EnvelopeIcon />}
          title={t("MARK_AS_READ")}
          className="dw-list-mail"
          onClick={onMarkAsRead}
        />
      )}
      {pageType === "deleted_page" && (
        <Button
          type="link"
          icon={<UndoOutlined />}
          title={t("REVERT")}
          danger={true}
          className="dw-list-restore"
          onClick={onRestore}
        />
      )}
      <Button
        type="link"
        icon={<DeleteIcon />}
        title={t("DELETE")}
        danger={true}
        className="dw-list-delete"
        onClick={onDelete}
      />
    </div>
  );
};

export default ListItemActions;
