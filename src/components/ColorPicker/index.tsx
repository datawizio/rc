import { Popover } from "antd";
import { SketchPicker } from "react-color";

import type { FC, ReactElement } from "react";
import type { ColorResult } from "react-color";

import "./index.less";

export interface ColorPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  defaultColors?: string[];
  render?: (value: string) => ReactElement;
}

const ColorPicker: FC<ColorPickerProps> = ({
  defaultColors,
  value,
  onChange,
  render
}) => {
  const color = value ?? "#fff";

  const handleChange = (val: ColorResult) => {
    onChange?.(val.hex);
  };

  return (
    <Popover
      trigger="click"
      classNames={{ root: "color-picker-popover" }}
      destroyOnHidden={true}
      content={
        <SketchPicker
          color={color}
          presetColors={defaultColors}
          disableAlpha={true}
          onChange={handleChange}
        />
      }
    >
      {render?.(color) ?? (
        <div className="color-picker" style={{ background: color }}></div>
      )}
    </Popover>
  );
};

export default ColorPicker;
