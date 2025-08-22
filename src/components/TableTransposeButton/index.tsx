import Button from "@/components/Button";
import { useState, useCallback } from "react";
import { RetweetOutlined } from "@ant-design/icons";
import { useConfig } from "@/hooks";
import { useTable } from "@/components/Table/hooks/useTable";

import type { FC } from "react";

import "./index.less";

export interface TableTransposeButtonProps {
  buttonText?: string;
  onTranspose: (isTransposed: boolean) => void;
  resetTableSearch?: boolean;
}

const TableTransposeButton: FC<TableTransposeButtonProps> = ({
  onTranspose,
  buttonText = "TRANSPOSE",
  resetTableSearch = true
}) => {
  const { translate } = useConfig();
  const { dispatch } = useTable();
  const [isTransposed, setTransposed] = useState(false);

  const resetSearchValue = useCallback(() => {
    if (resetTableSearch) dispatch({ type: "search", payload: "" });
  }, [dispatch, resetTableSearch]);

  const handleTranspose = useCallback(() => {
    setTransposed(!isTransposed);
    onTranspose(!isTransposed);
    resetSearchValue();
    dispatch({ type: "visibleColumnsKeys", payload: [] });
  }, [dispatch, isTransposed, onTranspose, resetSearchValue]);

  return (
    <div className="table-transpose-button table-toolbar--right">
      <Button border={false} onClick={handleTranspose}>
        <RetweetOutlined className="table-transpose-button__icon" />
        {buttonText && translate(buttonText)}
      </Button>
    </div>
  );
};

export default TableTransposeButton;
