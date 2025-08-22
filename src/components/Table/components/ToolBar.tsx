import type { FC, PropsWithChildren } from "react";

const ToolBar: FC<PropsWithChildren> = ({ children }) => {
  return <div className="dw-table__toolbar">{children}</div>;
};

export default ToolBar;
