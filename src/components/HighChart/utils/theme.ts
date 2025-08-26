import Highcharts from "highcharts";
import { DarkUnica } from "../themes/darkUnica";

export const setHighchartsTheme = () => {
  if (window.theme === "dark") {
    Highcharts.theme = DarkUnica;
    Highcharts.setOptions(Highcharts.theme);
  }
};
