import type { ReactElement } from "react";

export interface IHelpMenu {
  onTutorialLinkClick?: () => void;
  onHelperClick?: () => void;
  onVisibleChange?: (visible: boolean) => void;
  tourMenu?: ReactElement;
  visible?: boolean;
  tutorialDisabled?: boolean;
  helperDisabled?: boolean;
  btnDisabled?: boolean;
}
