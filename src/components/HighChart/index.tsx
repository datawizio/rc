import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Skeleton from "@/components/Skeleton";
import { useRef, useImperativeHandle, forwardRef } from "react";

import type { FC } from "react";
import type { HighChartProps, HighChartRef } from "./types";

import "./index.less";

const HighChart: FC<HighChartProps> = forwardRef<HighChartRef, HighChartProps>(
  ({ config, loading, constructorType = "chart" }, ref) => {
    const chartRef = useRef<HighchartsReact.RefObject>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const height = config?.chart?.height || 300;

    useImperativeHandle(ref, () => ({
      get chart() {
        return chartRef.current?.chart ?? null;
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
      <HighchartsReact
        ref={chartRef}
        highcharts={Highcharts}
        options={config || { title: { text: "" } }}
        constructorType={constructorType}
        containerProps={{ ref: containerRef }}
      />
    );
  }
);

export default HighChart;
