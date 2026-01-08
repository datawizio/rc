import Highcharts from "highcharts";
import { DarkUnica } from "../themes/darkUnica";
import { getCurrentTheme } from "@/utils/theme";

export const setHighchartsTheme = () => {
  if (getCurrentTheme() === "dark") {
    Highcharts.theme = DarkUnica;
    Highcharts.setOptions(Highcharts.theme);
  }
};
