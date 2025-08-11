import type { FC } from "react";
import type { StepProps } from "../types";

const Marks: FC<StepProps> = ({ onSubmit }) => {
  const handleSubmit = (mark: number) => {
    onSubmit(mark, true);
  };

  return (
    <div className="polling-marks">
      {Array.from({ length: 10 }, (_, index) => {
        const mark = index + 1;

        return (
          <span
            key={mark}
            className="polling-mark"
            onClick={handleSubmit.bind(null, mark)}
          >
            {mark}
          </span>
        );
      })}
    </div>
  );
};

export default Marks;
