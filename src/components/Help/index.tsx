import HelpMenu from "./components/HelpMenu";
import type { FC } from "react";
import type { IHelpMenu } from "./types";

import "./index.less";

const Help: FC<IHelpMenu> = props => {
  return (
    <>
      <HelpMenu {...props} />
      <div className="divider" />
    </>
  );
};

export default Help;
