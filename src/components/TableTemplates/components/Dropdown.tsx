import clsx from "clsx";
import { useCallback, useState, useEffect, useRef } from "react";
import { Input } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useConfig, useDeepEqualMemo } from "@/hooks";

import type { FC, MouseEvent, ChangeEvent, PropsWithChildren } from "react";
import type { InputRef } from "antd";

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
  const inputRef = useRef<InputRef>(null);
  const [inputValue, setInputValue] = useState<string>();
  const [isInputValueValid, setIsInputValueValid] = useState<boolean>(true);

  const open = useDeepEqualMemo(isOpen);

  useEffect(() => {
    if (!open) setIsInputValueValid(true);
  }, [open]);

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

  const onFooterMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (e.target instanceof HTMLElement && e.target.tagName === "INPUT") {
      inputRef.current?.focus();
    }
  }, []);

  return (
    <div className="table-templates__dropdown">
      <div className="table-templates__templates">{children}</div>
      <div className="table-templates__footer" onMouseDown={onFooterMouseDown}>
        <Input
          ref={inputRef}
          size="small"
          value={inputValue}
          className={clsx({ "error-field": !isInputValueValid })}
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
