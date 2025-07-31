import clsx from "clsx";
import type { JSX, FC } from "react";

import "./index.less";

export interface NoticeProps {
  content: JSX.Element | null;
  className?: string;
}

const Notice: FC<NoticeProps> = ({ content, className }) => {
  return <div className={clsx("dw-notice", className)}>{content}</div>;
};

export default Notice;
