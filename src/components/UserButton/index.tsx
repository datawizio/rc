import clsx from "clsx";
import Button from "@/components/Button";
import UserAvatar from "@/components/UserAvatar";

import { useEffect, useState } from "react";
import { Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";

import type { ReactElement, FC } from "react";
import type { Theme } from "@/utils/theme";

import "./index.less";

export interface UserButtonProps {
  photo: string;
  fullName: string;
  menu: ReactElement;
  showFullName?: boolean;
  theme?: Theme;
  open?: boolean;
  handleOpenChange?: (value: boolean) => void;
}

const UserButton: FC<UserButtonProps> = ({
  photo,
  fullName,
  menu,
  theme,
  showFullName,
  open,
  handleOpenChange
}) => {
  const [visible, setVisible] = useState<boolean>();

  const className = clsx({
    "user-name": true,
    "dw-dark": theme === "dark"
  });

  const handleVisibleChange = (value: boolean) => {
    setVisible(value);
    handleOpenChange?.(value);
  };

  useEffect(() => setVisible(open), [open]);

  return (
    <Dropdown
      popupRender={() => menu}
      className="user-dropdown"
      trigger={["click"]}
      open={visible}
      onOpenChange={handleVisibleChange}
    >
      <Button border={false} className={className}>
        <UserAvatar src={photo} name={fullName} />
        {showFullName && (
          <span className="user-button-fullname">{fullName}</span>
        )}
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default UserButton;
