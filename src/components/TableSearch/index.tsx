import LiteSearchInput from "@/components/LiteSearchInput";
import { useTable } from "@/components/Table/hooks/useTable";
import type { FC } from "react";

import "./index.less";

export interface TableSearchProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

const TableSearch: FC<TableSearchProps> = ({ placeholder, onSearch }) => {
  const {
    dispatch,
    tableState: { searchValue },
    tableProps
  } = useTable();

  const isAsync = tableProps.async;

  const onSearchHandler = (value: string) => {
    if (isAsync) {
      onSearch?.(value);
      dispatch({ type: "search", payload: value });
    } else {
      dispatch({ type: "loading", payload: true });
      setTimeout(() => {
        onSearch?.(value);
        dispatch({ type: "search", payload: value });
        dispatch({ type: "loading", payload: false });
      });
    }
  };

  return (
    <div className="table-search table-toolbar--left">
      <LiteSearchInput
        value={searchValue}
        debounceDelay={1000}
        placeholder={placeholder}
        style={{ width: "230px" }}
        onSearch={value => onSearchHandler(value)}
      />
    </div>
  );
};

export default TableSearch;
