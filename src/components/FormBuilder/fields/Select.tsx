import Select from "@/components/Select";
import InfoTooltip from "@/components/InfoTooltip";
import { useMemo } from "react";
import { Form } from "antd";

import type { FC, ReactNode } from "react";
import type { FieldSelectProps } from "../types";

export const FieldSelect: FC<FieldSelectProps> = ({
  allowClear,
  label,
  rules,
  name,
  initialValue,
  placeholder,
  options,
  onChange,
  onDeselect,
  infoTooltip,
  ...restProps
}) => {
  const formItemLabel: ReactNode = useMemo(() => {
    if (label && infoTooltip) {
      return (
        <div className="label-with-info">
          {label}
          <InfoTooltip {...infoTooltip} />
        </div>
      );
    }
    return label;
  }, [infoTooltip, label]);

  const handleFieldChange = (value: any, selected: any) => {
    onChange?.({
      name,
      value,
      selected
    });
  };

  return (
    <Form.Item
      name={name}
      label={formItemLabel}
      rules={rules}
      initialValue={initialValue}
    >
      <Select
        {...restProps}
        options={options}
        placeholder={placeholder}
        onChange={handleFieldChange}
        onDeselect={value => onDeselect?.(value as string)}
        allowClear={allowClear}
      />
    </Form.Item>
  );
};
