import { useContext } from "react";
import ConfigContext from "@/components/ConfigProvider/context";

export const useConfig = () => {
  return useContext(ConfigContext);
};
