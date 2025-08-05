import { useCallback, useState, useImperativeHandle, forwardRef } from "react";
import { Spin } from "antd";

import type { PropsWithChildren, UIEventHandler, ReactNode } from "react";

import "./index.less";

export interface InfiniteScrollProps {
  maxPage?: number;
  overflow?: string;
  showLoader?: boolean;
  triggerCoeff?: number;
  height: number | string;
  loader?: () => ReactNode;
  onBottom?: (page: number) => Promise<void> | void;
}

export interface InfiniteScrollRef {
  reset: () => void;
}

const InfiniteScroll = forwardRef<
  InfiniteScrollRef,
  PropsWithChildren<InfiniteScrollProps>
>(
  (
    {
      height,
      loader = DefaultLoader,
      overflow = "auto",
      onBottom,
      children,
      showLoader = false,
      triggerCoeff = 5,
      maxPage = Infinity
    },
    ref
  ) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [scrollIsHandling, setScrollIsHandling] = useState<boolean>(false);

    const scrollIsBottom = useCallback(
      (target: HTMLElement) => {
        const triggerHeight = (target.scrollHeight * triggerCoeff) / 100;
        const triggerZone = target.clientHeight + triggerHeight;
        const scrollPos = target.scrollHeight - target.scrollTop;
        return triggerZone >= scrollPos;
      },
      [triggerCoeff]
    );

    const handleScroll: UIEventHandler<HTMLDivElement> = event => {
      if (scrollIsHandling) return;

      const handle = async (
        handler: (page: number) => Promise<void> | void
      ) => {
        setScrollIsHandling(true);
        await handler(currentPage);
        setScrollIsHandling(false);
      };

      if (
        onBottom &&
        currentPage <= maxPage &&
        scrollIsBottom(event.target as HTMLDivElement)
      ) {
        handle(onBottom).then(() => {
          setCurrentPage(currentPage + 1);
        });
      }
    };

    useImperativeHandle(ref, () => ({
      reset() {
        setCurrentPage(1);
        setScrollIsHandling(false);
      }
    }));

    return (
      <div
        onScroll={handleScroll}
        className="infinite-scroll"
        style={{ height, overflow }}
      >
        {children}
        {showLoader && scrollIsHandling && loader()}
      </div>
    );
  }
);

const DefaultLoader = () => {
  return (
    <div className="infinite-scroll__default-loader">
      <Spin />
    </div>
  );
};

export default InfiniteScroll;
