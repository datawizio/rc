import clsx from "clsx";
import type { FC, HTMLAttributes, PropsWithChildren } from "react";

export interface RowProps {
  isTotalRow?: (rowKey: string) => boolean;
  className?: string;
}

const Row: FC<
  PropsWithChildren<RowProps & HTMLAttributes<HTMLTableRowElement>>
> = ({ children, isTotalRow, className, ...props }) => {
  const cssClass = clsx(className, {
    "dw-row-total": isTotalRow
      ? isTotalRow((props as Record<string, string>)["data-row-key"])
      : false
  });

  return (
    <tr className={cssClass} {...props}>
      {children}
    </tr>
  );
};

export default Row;
