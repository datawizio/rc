import { useMemo } from "react";
import { Menu, Dropdown, Button } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useConfig } from "@/hooks";

import type { FC } from "react";
import type { IHelpMenu } from "../types";

const HelpMenu: FC<IHelpMenu> = ({
  onTutorialLinkClick,
  onHelperClick,
  onVisibleChange,
  tourMenu,
  tutorialDisabled,
  helperDisabled,
  btnDisabled,
  visible
}) => {
  const { t } = useConfig();

  const menu = useMemo(() => {
    return (
      <Menu theme="light" className="help-menu-dropdown">
        {onTutorialLinkClick && (
          <Menu.Item
            key="1"
            disabled={tutorialDisabled}
            onClick={onTutorialLinkClick}
          >
            {t("READ_TUTORIAL")}
          </Menu.Item>
        )}
        {onHelperClick && (
          <Menu.Item key="2" disabled={helperDisabled} onClick={onHelperClick}>
            {t("BES_HELPER")}
          </Menu.Item>
        )}
        {tourMenu}
      </Menu>
    );
  }, [
    onTutorialLinkClick,
    tutorialDisabled,
    t,
    onHelperClick,
    helperDisabled,
    tourMenu
  ]);

  const visibleProps = typeof visible === "boolean" ? { visible } : {};

  return (
    <>
      {(onTutorialLinkClick || onHelperClick || tourMenu) && (
        <Dropdown
          {...visibleProps}
          onOpenChange={onVisibleChange}
          popupRender={() => menu}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            type="link"
            className="help-icon teaching-btn"
            onClick={e => e.preventDefault()}
            icon={<QuestionCircleOutlined />}
            disabled={btnDisabled}
          ></Button>
        </Dropdown>
      )}
    </>
  );
};

export default HelpMenu;
