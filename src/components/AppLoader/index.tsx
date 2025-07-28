import clsx from "clsx";
import { useTheme } from "@/hooks";
import type { FC } from "react";

import "./index.less";

export interface AppLoaderProps {
  imageSrc: string;
}

const AppLoader: FC<AppLoaderProps> = ({ imageSrc }) => {
  const theme = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={clsx("loader", isDark && "loader-dark")}>
      <div className="loader-wrapper">
        <div className="loader-container">
          <div className="loader-logo-container">
            <div className="loader-logo">
              <img alt="loader" src={imageSrc} />
            </div>
          </div>
        </div>
        <div className="loader-spinner"></div>
      </div>
    </div>
  );
};

export default AppLoader;
