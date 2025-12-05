import { Input } from "antd";

import type { FC } from "react";
import type { SearchProps } from "antd/es/input";

const SearchInput: FC<SearchProps> = props => {
  return <Input.Search {...props} allowClear />;
};

export default SearchInput;
