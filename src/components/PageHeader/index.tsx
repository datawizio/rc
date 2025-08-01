import { ArrowLeftOutlined } from "@ant-design/icons";
import type { FC, PropsWithChildren, ReactNode } from "react";

import "./index.less";

export interface PageHeaderProps {
  title: ReactNode;
  className?: string;
  onBack?: () => void;
}

const PageHeader: FC<PropsWithChildren<PageHeaderProps>> = ({
  title,
  className,
  onBack,
  children
}) => {
  return (
    <div className={`page-header ${className}`}>
      {onBack && (
        <span className="page-header-back">
          <ArrowLeftOutlined onClick={onBack} />
        </span>
      )}
      <span className="page-header-title">{title}</span>
      {children}
    </div>
  );
};

export default PageHeader;
