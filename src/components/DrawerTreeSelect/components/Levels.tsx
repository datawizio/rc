import Select from "@/components/Select";
import type { FC } from "react";

export interface LevelsProps {
  value?: string | number;
  levels?: { value: string | number; label: string }[];
  onChange?: (value: string | number) => void;
}

const Levels: FC<LevelsProps> = ({ value = 1, levels = [], onChange }) => {
  return (
    <Select
      defaultValue={value}
      value={value}
      options={levels}
      onChange={value => onChange?.(value as string | number)}
      className="drawer-tree-select-levels"
    />
  );
};

export default Levels;
