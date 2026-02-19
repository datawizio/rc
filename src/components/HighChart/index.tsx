import Highcharts from "highcharts";
import Skeleton from "@/components/Skeleton";
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
  ({ config, loading, constructorType = "chart" }, ref) => {
    const chartRef = useRef<Highcharts.Chart | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const height = useMemo(() => config?.chart?.height || 300, [config]);

    useEffect(() => {
      if (containerRef.current) {
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
    }, [config, constructorType]);

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
