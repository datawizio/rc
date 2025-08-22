import { useTable } from "@/components/Table/hooks/useTable";
import type { FC, PropsWithChildren, HTMLAttributes } from "react";

const HeaderWrapper: FC<PropsWithChildren<HTMLAttributes<HTMLElement>>> = ({
  className,
  children
}) => {
  const { tableState } = useTable();

  if (tableState.dataSource?.length === 0) return null;
  return <thead className={className}>{children}</thead>;
};

export default HeaderWrapper;
