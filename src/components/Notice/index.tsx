import clsx from "clsx";
import type { FC, ReactNode } from "react";

import "./index.less";

export interface NoticeProps {
  content: ReactNode;
  className?: string;
}

const Notice: FC<NoticeProps> = ({ content, className }) => {
  return <div className={clsx("dw-notice", className)}>{content}</div>;
};

export default Notice;
