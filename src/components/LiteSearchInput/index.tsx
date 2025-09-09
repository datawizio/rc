import { useState, useCallback, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import type { InputHTMLAttributes, FC, ChangeEvent } from "react";

import "./index.less";

export interface LiteSearchInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Delay (in milliseconds) before triggering the `onSearch` callback.
   * @default 0
   */
  debounceDelay?: number;

  /**
   * Called when the clear button is clicked.
   */
  onClear?: () => void;

  /**
   * Called when the input value changes, with debounce applied based on `debounceDelay`.
   */
  onSearch?: (value: string) => void;
}

const LiteSearchInput: FC<LiteSearchInputProps> = ({
  style,
  onClear,
  onSearch,
  onChange,
  debounceDelay = 0,
  ...props
}) => {
  const [value, setValue] = useState(() => props.value || "");

  const [onSearchDebounced] = useDebouncedCallback((value: string) => {
    onSearch?.(value);
  }, debounceDelay);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
      onChange?.(event);
      onSearchDebounced(event.target.value);
    },
    [onChange, onSearchDebounced]
  );

  const handleClear = useCallback(() => {
    setValue("");
    onClear?.();
    onSearchDebounced("");
  }, [onClear, onSearchDebounced]);

  useEffect(() => {
    setValue(props.value ? props.value : "");
  }, [props.value]);

  return (
    <span className="lite-search" style={style}>
      <SearchOutlined className="lite-search__search-icon" />
      <input
        {...props}
        value={value}
        onChange={handleChange}
        className="lite-search__input"
      />
      {value && (
        <CloseOutlined
          onClick={handleClear}
          className="lite-search__cancel-icon"
        />
      )}
    </span>
  );
};

export default LiteSearchInput;
