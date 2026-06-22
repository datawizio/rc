import clsx from "clsx";
import { Input } from "antd";

import type { FC } from "react";
import type { SearchProps } from "antd/es/input";

import "./index.less";

const SearchInput: FC<SearchProps> = props => {
  return (
    <Input.Search
      {...props}
      allowClear={true}
      className={clsx("dw-search-input", props.className)}
    />
  );
};

export default SearchInput;
