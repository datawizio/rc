import BaseSkeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useTheme } from "@/hooks";

import type { SkeletonProps } from "react-loading-skeleton";
import type { FC } from "react";

import "react-loading-skeleton/dist/skeleton.css";

const Skeleton: FC<SkeletonProps> = props => {
  const theme = useTheme();
  const isDark = theme === "dark";

  return (
    <SkeletonTheme
      baseColor={isDark ? "#202020" : undefined}
      highlightColor={isDark ? "#444444" : undefined}
    >
      <BaseSkeleton {...props} />
    </SkeletonTheme>
  );
};

export default Skeleton;
