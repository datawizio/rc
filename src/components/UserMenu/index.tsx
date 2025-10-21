import dayjs from "dayjs";
import Button from "@/components/Button";
import UserAvatar from "@/components/UserAvatar";

import { useCallback, useMemo } from "react";
import { useConfig } from "@/hooks";
import { useLinkGroups } from "./helpers/data";
import { UserMenuItem } from "./components/UserMenuItem";
import { LogOutIcon } from "./images/LogOut";

import type { FC } from "react";
import type { ILinkGroup, ILinkItem } from "./helpers/data";

import "./index.less";

export interface UserMenuProps {
  photo?: string;
  fullName: string;
  email: string;
  handleLogOutClick: () => void;
  expireDateTo?: string;
  handleItemClick?: (item: ILinkItem) => void;
  permissions?: Set<string>;
  path?: string;
}

const DATE_FORMAT = "DD.MM.YYYY";

const UserMenu: FC<UserMenuProps> = ({
  photo,
  fullName,
  email,
  expireDateTo,
  handleLogOutClick,
  handleItemClick,
  permissions,
  path
}) => {
  const { t } = useConfig();

  const checkPermission = useCallback(
    (item: ILinkItem) => {
      return (
        !permissions || !item.permission || permissions.has(item.permission)
      );
    },
    [permissions]
  );

  const linkGroups = useLinkGroups(path);

  const links: Array<ILinkGroup> = useMemo(() => {
    return linkGroups
      .filter(group => group.items.some(checkPermission))
      .map(group => ({
        title: group.title,
        items: group.items.filter(checkPermission)
      }));
  }, [checkPermission, linkGroups]);

  return (
    <div className="user-menu">
      <div className="user-menu-info">
        <UserAvatar src={photo} size={64} name={fullName} />
        <span className="user-menu-info-name">{fullName}</span>
        <span className="user-menu-info-email">{email}</span>
        {expireDateTo && (
          <span className="user-menu-info-date">
            {t("ACCOUNT_IS_ACTIVE_TO")}:{" "}
            {dayjs(expireDateTo).format(DATE_FORMAT)}
          </span>
        )}
      </div>

      <div className="user-menu-items">
        {links.map((group, index) => (
          <div key={index} className="user-menu-items-group">
            {group.title && (
              <span className="user-menu-items-group-title">
                {t(group.title)}
              </span>
            )}
            {group.items.map((item, index) => (
              <UserMenuItem
                key={index}
                photo={item.photo}
                title={t(item.title)}
                description={t(item.description)}
                onClick={() => handleItemClick?.(item)}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="user-menu-button">
        <Button icon={<LogOutIcon />} onClick={handleLogOutClick}>
          {t("LOGOUT")}
        </Button>
      </div>
    </div>
  );
};

export default UserMenu;
