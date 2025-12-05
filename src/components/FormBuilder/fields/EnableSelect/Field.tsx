import Checkbox from "@/components/Checkbox";
import { useCallback } from "react";

import type { FC, ReactNode } from "react";
import type { IFormFieldChanged, EnableSelectValueType } from "../../types";
import type { CheckboxChangeEvent } from "antd/es/checkbox";

export interface FieldEnableSelectFieldProps {
  name: string | string[];
  renderField: (value?: EnableSelectValueType) => ReactNode;
  placeholder?: string;
  value?: EnableSelectValueType;
  onChange?: (change: IFormFieldChanged<EnableSelectValueType>) => void;
}

export const Field: FC<FieldEnableSelectFieldProps> = ({
  placeholder,
  value,
  name,
  onChange,
  renderField
}) => {
  const renderValueField = useCallback(
    () => renderField(value),
    [renderField, value]
  );

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    onChange?.({
      name,
      value: {
        value: value?.value,
        enabled: e.target.checked
      }
    });
  };

  return (
    <>
      <Checkbox checked={value?.enabled} onChange={handleCheckboxChange}>
        {placeholder}
      </Checkbox>
      {renderValueField()}
    </>
  );
};
