import Skeleton from "@/components/Skeleton";
import type { FC, Key } from "react";

const randomInteger = (min: number, max: number) => {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const renderItem = (key: Key) => {
  const width = randomInteger(250, 350);
  return (
    <div className="ant-transfer-list-skeleton" key={key}>
      <Skeleton width={16} height={16} />
      <Skeleton width={width} height={16} />
    </div>
  );
};

export interface SkeletonListItemProps {
  count: number;
}

const SkeletonListItem: FC<SkeletonListItemProps> = ({ count }) => {
  return (
    <>
      {Array.from({ length: count }, (_, key) => {
        return renderItem(key);
      })}
    </>
  );
};

export default SkeletonListItem;
