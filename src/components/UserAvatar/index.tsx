import { useMemo, type FC } from "react";
import { Avatar } from "antd";

export interface UserAvatarProps {
  src?: string | null;
  name?: string;
  size?: number;
}

const UserAvatar: FC<UserAvatarProps> = ({ src, name, size }) => {
  const abbr = useMemo(() => {
    if (!name) return null;

    const words = name.split(" ");
    return words.map(w => w[0]).join("");
  }, [name]);

  return (
    <Avatar src={src || undefined} size={size}>
      {abbr}
    </Avatar>
  );
};

UserAvatar.displayName = "UserAvatar";

export default UserAvatar;
