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
          color={value ?? "#fff"}
          presetColors={defaultColors}
          disableAlpha={true}
          onChange={handleChange}
        />
      }
    >
      {render?.(value ?? "transparent") ?? (
        <div
          className="color-picker"
          style={{ background: value ?? "transparent" }}
        />
      )}
    </Popover>
  );
};

export default ColorPicker;
