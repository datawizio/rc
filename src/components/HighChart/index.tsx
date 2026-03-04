import Highcharts from "highcharts";
import Skeleton from "@/components/Skeleton";
import { resizeDetector } from "@/utils/resizeDetector";
import {
  useRef,
  useMemo,
  useEffect,
  useImperativeHandle,
  forwardRef
} from "react";

import type { FC } from "react";
import type { HighChartProps, HighChartRef } from "./types";

import "./index.less";

const HighChart: FC<HighChartProps> = forwardRef<HighChartRef, HighChartProps>(
  (
    { config, loading, responsible = false, constructorType = "chart" },
    ref
  ) => {
    const chartRef = useRef<Highcharts.Chart>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const firstTime = useRef<boolean>(true);

    const height = useMemo(() => config?.chart?.height || 400, [config]);

    useEffect(() => {
      if (containerRef.current) {
        if (responsible && firstTime.current) {
          containerRef.current.style.visibility = "hidden";
        }

        const type = constructorType as keyof typeof Highcharts;

        chartRef.current = Highcharts[type](
          containerRef.current,
          config || { title: { text: "" } }
        );
      }

      return () => {
        if (chartRef.current) {
          chartRef.current.destroy();
          chartRef.current = null;
        }
      };
    }, [config, constructorType, responsible]);

    useEffect(() => {
      if (!loading && responsible && containerRef.current) {
        return resizeDetector(containerRef.current, () => {
          firstTime.current = false;

          if (containerRef.current) {
            containerRef.current.style.visibility = "visible";
          }

          chartRef.current?.reflow();
        });
      }
    }, [responsible, chartRef, loading]);

    useImperativeHandle(ref, () => ({
      get chart() {
        return chartRef.current;
      },
      get container() {
        return containerRef.current;
      }
    }));

    if (loading) {
      return <Skeleton height={height} width="100%" />;
    }

    return config && config.error ? (
      <div style={{ height }}>{config.error.message}</div>
    ) : (
      <div ref={containerRef} style={{ height }} />
    );
  }
);

export default HighChart;
