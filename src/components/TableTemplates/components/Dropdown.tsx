import clsx from "clsx";
import { useCallback, useState, useMemo, useEffect } from "react";
import { Input } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useConfig, useDeepEqualMemo } from "@/hooks";

import type { FC, MouseEvent, ChangeEvent, PropsWithChildren } from "react";

export interface DropdownProps {
  isOpen: boolean;
  onCreate: (title: string) => void;
}

const Dropdown: FC<PropsWithChildren<DropdownProps>> = ({
  isOpen,
  onCreate,
  children
}) => {
  const { t } = useConfig();
  const [inputValue, setInputValue] = useState<string>();
  const [isInputValueValid, setIsInputValueValid] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) setIsInputValueValid(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useDeepEqualMemo(isOpen)]);

  const handleChangeInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setIsInputValueValid(Boolean(e.target.value?.trim()));
    setInputValue(e.target.value);
  }, []);

  const handleCreateClick = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation();
      setIsInputValueValid(Boolean(inputValue?.trim()));
      if (inputValue?.trim()) {
        onCreate(inputValue);
        setInputValue("");
      }
    },
    [inputValue, onCreate]
  );
  const className = useMemo(
    () => clsx({ "error-field": !isInputValueValid }),
    [isInputValueValid]
  );

  return (
    <div className="table-templates__dropdown">
      <div className="table-templates__templates">{children}</div>
      <div className="table-templates__footer">
        <Input
          size="small"
          value={inputValue}
          className={className}
          placeholder={t("INPUT_TITLE")}
          onChange={handleChangeInput}
        />
        <SaveOutlined
          onClick={handleCreateClick}
          className="table-templates__icon table-templates__icon--create"
        />
      </div>
    </div>
  );
};

export default Dropdown;
