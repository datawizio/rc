import React, { useCallback, useMemo } from "react";
import InfoTooltip from "@/components/InfoTooltip";
import { Form, Input } from "antd";

import type { InputRef } from "antd";
import type { FieldTextProps } from "../types";

export const FieldText = React.memo(
  React.forwardRef<InputRef, FieldTextProps>(
    ({ onChange, rules, name, label, infoTooltip, ...props }, ref) => {
      const formItemLabel: React.ReactNode = useMemo(() => {
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

      const handleFieldChange = useCallback(
        ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
          onChange?.({ name, value });
        },
        [name, onChange]
      );

      return (
        <Form.Item name={name} label={formItemLabel} rules={rules}>
          <Input {...props} ref={ref} onChange={handleFieldChange} />
        </Form.Item>
      );
    }
  )
);
