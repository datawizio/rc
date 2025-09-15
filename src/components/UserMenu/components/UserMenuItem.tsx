import type { FC, ReactElement } from "react";

export interface UserMenuItemProps {
  photo: ReactElement;
  title: string;
  description: string;
  onClick: () => void;
}

export const UserMenuItem: FC<UserMenuItemProps> = ({
  description,
  photo,
  title,
  onClick
}) => {
  return (
    <div className="user-menu-item" onClick={onClick}>
      {photo}
      <div className="user-menu-item-text">
        <span className="user-menu-item-text-title">{title}</span>
        <span>{description}</span>
      </div>
    </div>
  );
};
