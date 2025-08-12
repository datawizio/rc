import type { FC } from "react";
import type { RadioProps, RadioGroupProps as AntRadioGroupProps } from "antd";

export interface RadioGroupProps extends AntRadioGroupProps {
  vertical?: boolean;
}

export type RadioComponent = FC<RadioProps>;

export interface RadioCompoundComponent extends RadioComponent {
  Group: FC<RadioGroupProps>;
}
