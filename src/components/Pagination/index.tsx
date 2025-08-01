import { Pagination as AntPagination, type PaginationProps } from "antd";
import type { FC } from "react";

import "./index.less";

const Pagination: FC<PaginationProps> = props => {
  return <AntPagination {...props} />;
};

export default Pagination;
