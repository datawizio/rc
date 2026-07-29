import clsx from "clsx";
import { useCallback, useState, useEffect, useRef } from "react";
import { Input } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useConfig, useDeepEqualMemo } from "@/hooks";

import type {
  FC,
  MouseEvent,
  ChangeEvent,
  KeyboardEvent,
  PropsWithChildren
} from "react";
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

  const submitCreate = useCallback(() => {
    setIsInputValueValid(Boolean(inputValue?.trim()));
    if (!inputValue?.trim()) return;

    onCreate(inputValue);
    setInputValue("");
  }, [inputValue, onCreate]);

  const handleCreateClick = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation();
      submitCreate();
    },
    [submitCreate]
  );

  const handleInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;

      // Prevent Select from treating Enter as option confirm / closing the popup.
      e.preventDefault();
      e.stopPropagation();
      submitCreate();
    },
    [submitCreate]
  );

  const onFooterMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof Element && e.target.closest("input, textarea"))
      return;

    e.preventDefault();
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
          onKeyDown={handleInputKeyDown}
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
