import { useState, useCallback, useMemo } from "react";
import { Select as AntSelect, Tag } from "antd";
import { useDebouncedCallback } from "use-debounce";
import { useConfig } from "@/hooks";

import type { UIEventHandler, ComponentProps } from "react";
import type { BaseOptionType } from "antd/lib/select";
import type { SelectComponent, SelectCompoundComponent } from "./types";

import "./index.less";

const Select: SelectCompoundComponent = ({
  asyncData = false,
  loadingContent = "LOADING",
  notFoundContent = "NO_DATA",
  loadData,
  withPagination = false,
  useCustomTagRender,
  optionRender,
  optionFilterProp,
  optionLabelProp,
  onOpenChange,
  children,
  ...restProps
}) => {
  const { translate: t } = useConfig();

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [rawOptions, setRawOptions] = useState<Record<string, string>>({});
  const [page, setPage] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const dataToOptions = (data: BaseOptionType[]) => {
    return data.map(item => {
      if (optionRender) {
        return optionRender(item);
      }

      return (
        <Select.Option
          key={item.value}
          value={item.value}
          label={item.text}
          disabled={!!item.disabled}
        >
          {item.text}
        </Select.Option>
      );
    });
  };

  const [loadPage] = useDebouncedCallback(
    async (searchValue: string, page: number = 0) => {
      if (!loadData) return;

      setLoading(true);

      try {
        const data = await loadData(searchValue, page);
        const dataIsArray = Array.isArray(data);
        const dataOptions = dataIsArray ? data : data.options;
        const next = dataIsArray ? true : data.next;

        const newRawOptions = options.reduce<Record<string, string>>(
          (acc, item) => {
            return acc[item.value] ? acc : { ...acc, [item.value]: item.text };
          },
          { ...rawOptions }
        );

        setRawOptions(newRawOptions);

        if (page) {
          setOptions(options.concat(dataToOptions(dataOptions)));
        } else {
          setOptions(dataToOptions(dataOptions));
        }

        if (next === null) {
          setIsLast(true);
        }

        setPage(page);
      } catch {
        setIsLast(true);
      } finally {
        setLoading(false);
      }
    },
    500
  );

  const handlePopupScroll = useCallback<UIEventHandler<HTMLDivElement>>(
    e => {
      const target = e.target as HTMLDivElement;

      // Debounce?
      if (loading) return;
      if (
        target.scrollTop + target.offsetHeight >= target.scrollHeight - 100 &&
        !isLast
      ) {
        loadPage(searchValue, page + 1);
      }
    },
    [loading, page, searchValue, isLast, loadPage]
  );

  const handleDropdownVisibleChange = useCallback(
    (open: boolean) => {
      if (open && asyncData) {
        loadPage(searchValue, 0);
        setIsLast(false);
      } else if (!open) {
        setSearchValue("");
        setOptions([]);
      }
    },
    [asyncData, searchValue, loadPage]
  );

  const handleSearch = useCallback(
    (searchString: string) => {
      setSearchValue(searchString);
      setIsLast(false);
      loadPage(searchString);
    },
    [loadPage]
  );

  const searchProps = useMemo(
    () =>
      asyncData && withPagination
        ? {
            searchValue,
            onSearch: handleSearch,
            filterOption: false,
            onPopupScroll: handlePopupScroll
          }
        : {},
    [handleSearch, handlePopupScroll, withPagination, asyncData, searchValue]
  );

  const tagRender: ComponentProps<SelectComponent>["tagRender"] = props => {
    const label =
      typeof props.label === "string" ? props.label : rawOptions[props.value];

    return (
      <span className="ant-select-selection-item">
        <Tag
          closable={props.closable}
          onClose={props.onClose}
          className="ant-select-selection-item-content"
        >
          {label}
        </Tag>
      </span>
    );
  };

  return (
    <AntSelect
      {...restProps}
      {...searchProps}
      optionFilterProp={optionFilterProp || "label"}
      optionLabelProp={optionLabelProp || "label"}
      notFoundContent={loading ? t(loadingContent) : t(notFoundContent)}
      loading={loading}
      tagRender={useCustomTagRender ? tagRender : undefined}
      onOpenChange={asyncData ? handleDropdownVisibleChange : onOpenChange}
    >
      {asyncData ? options : children}
    </AntSelect>
  );
};

Select.Option = AntSelect.Option;
Select.OptGroup = AntSelect.OptGroup;

export default Select;
