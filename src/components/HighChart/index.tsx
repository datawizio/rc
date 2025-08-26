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
    {
      config,
      loading,
      responsible = false,
      resizeTimeout = 500,
      constructorType = "chart"
    },
    ref
  ) => {
    const chartRef = useRef<Highcharts.Chart | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const firstTime = useRef<boolean>(true);

    const height = useMemo(() => {
      const heightByConfig = config && config.chart && config.chart.height;
      return heightByConfig || 300;
    }, [config]);

    useEffect(() => {
      if (containerRef.current) {
        if (responsible && firstTime.current) {
          containerRef.current.style.visibility = "hidden";
        }

        chartRef.current = Highcharts[
          constructorType as keyof typeof Highcharts
        ](containerRef.current, config || { title: { text: "" } });
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
        return resizeDetector(
          containerRef.current,
          async () => {
            firstTime.current = false;
            if (containerRef.current) {
              containerRef.current.style.visibility = "visible";
            }

            if (chartRef.current) {
              await chartRef.current.setSize();

              if (
                chartRef.current &&
                chartRef.current.series &&
                chartRef.current.series.length > 0
              ) {
                // @ts-expect-error: Required options are not provided
                chartRef.current.series[0].update();
              }
            }
          },
          resizeTimeout
        );
      }
    }, [resizeTimeout, responsible, chartRef, loading]);

    useImperativeHandle(ref, () => ({
      get chart() {
        return chartRef.current;
      },
      get container() {
        return containerRef.current;
      }
    }));

    if (loading) {
      return <Skeleton height={height} width={"100%"} />;
    }

    return config && config.error ? (
      <div style={{ height }}>{config.error.message}</div>
    ) : (
      <div ref={containerRef} />
    );
  }
);

export default HighChart;
