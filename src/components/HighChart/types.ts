import type { ReactNode } from "react";
import type { Options, Chart } from "highcharts";

export interface IHighChartConfig extends Options {
  error?: { message: ReactNode };
}

export interface HighChartProps {
  /**
   * Configuration object for the Highcharts instance.
   * @see {@link https://api.highcharts.com/highcharts/|HighCharts API}
   */
  config: IHighChartConfig;

  /**
   * Whether the chart should be responsive to container size changes.
   * If true, the chart will reflow on resize events.
   * @default false
   */
  responsible?: boolean;

  /**
   * Debounce time (in milliseconds) for resize handling.
   * Useful for performance optimization during continuous resizing.
   * @default 500
   */
  resizeTimeout?: number;

  /**
   * Type of Highcharts constructor to use.
   * Can be one of the built-in types: "chart", "stockChart", "mapChart", "ganttChart",
   * or a custom string for other constructor variants.
   * @default "chart"
   */
  constructorType?:
    | "chart"
    | "stockChart"
    | "mapChart"
    | "ganttChart"
    | (string & {});

  /**
   * Whether the chart is in a loading state.
   * If true, a loading indicator may be shown instead of the chart.
   */
  loading: boolean;
}

export interface HighChartRef {
  chart: Chart | null;
  container: HTMLDivElement | null;
}
