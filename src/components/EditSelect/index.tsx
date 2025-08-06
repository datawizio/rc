import Button from "@/components/Button";
import Select from "@/components/Select";

import { useCallback, useState, useRef } from "react";
import { Divider, Input } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useConfig } from "@/hooks";

import type { InputRef } from "antd";
import type {
  FC,
  KeyboardEvent,
  MouseEvent,
  ChangeEvent,
  ReactNode
} from "react";

import "./index.less";

export interface IOption {
  key: string;
  title: string;
}

export interface EditSelectProps {
  placeholder: string;
  inputPlaceholder: string;
  options: IOption[];
  loading?: boolean;
  value?: string;
  onChange?: (promotionTypeKey: string) => void;
  onSave?: (promotionType: IOption) => Promise<void> | void;
  onDelete?: (promotionType: IOption) => void;
}

const TITLE_MAX_LENGTH = 200;

const EditSelect: FC<EditSelectProps> = ({
  placeholder,
  inputPlaceholder,
  options,
  loading,
  value,
  onChange,
  onSave,
  onDelete
}) => {
  const { translate: t } = useConfig();

  const [editingOption, setEditingOption] = useState<IOption>({
    key: "new",
    title: ""
  });

  const inputRef = useRef<InputRef>(null);

  const resetEditingOption = useCallback(() => {
    setEditingOption({
      key: "new",
      title: ""
    });
  }, []);

  const handleDeleteItem = useCallback(
    (promoType: IOption, e: MouseEvent) => {
      e.stopPropagation();
      onDelete?.(promoType);
    },
    [onDelete]
  );

  const handleEditItem = useCallback(
    (key: string, title: string, e: MouseEvent) => {
      e.stopPropagation();
      setEditingOption({ key, title });
      inputRef.current?.focus();
    },
    []
  );

  const handleSaveClick = useCallback(
    async (e: KeyboardEvent | MouseEvent) => {
      if (!editingOption.title.trim()) {
        e.preventDefault();
        return;
      }
      await onSave?.(editingOption);
      resetEditingOption();
    },
    [onSave, editingOption, resetEditingOption]
  );

  const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setEditingOption(option => ({ ...option, title }));
  }, []);

  const dropdownRender = useCallback(
    (menu: ReactNode) => (
      <div>
        {menu}
        <Divider />
        <div className="edit-select-dropdown-edit">
          <Input
            value={editingOption.title}
            onChange={handleTitleChange}
            onPressEnter={handleSaveClick}
            placeholder={inputPlaceholder}
            maxLength={TITLE_MAX_LENGTH}
            ref={inputRef}
          />
          <Button
            type="primary"
            onClick={handleSaveClick}
            disabled={!editingOption.title.trim()}
          >
            {editingOption.key === "new" ? t("ADD") : t("SAVE")}
          </Button>
        </div>
      </div>
    ),
    [
      inputPlaceholder,
      t,
      handleTitleChange,
      handleSaveClick,
      editingOption.key,
      editingOption.title
    ]
  );

  return (
    <Select
      classNames={{ popup: { root: "edit-select-dropdown" } }}
      placeholder={placeholder}
      optionLabelProp="label"
      popupRender={dropdownRender}
      loading={loading}
      onChange={value => onChange?.(value as string)}
      value={value || undefined}
      notFoundContent={t("NO_DATA")}
    >
      {options.map(option => (
        <Select.Option
          key={option.key}
          value={option.key}
          label={option.title}
          title={option.title}
        >
          <span className="ant-select-item-option-content-title">
            {option.title}
          </span>
          <EditOutlined
            onClick={handleEditItem.bind(null, option.key, option.title)}
          />
          <DeleteOutlined onClick={handleDeleteItem.bind(null, option)} />
        </Select.Option>
      ))}
    </Select>
  );
};

export default EditSelect;
