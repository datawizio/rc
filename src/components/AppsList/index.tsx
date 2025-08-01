import { Row } from "antd";
import { useConfig } from "@/hooks";
import { App } from "./components/App";
import { AppsLoader } from "./components/AppsLoader";

import type { FC } from "react";
import type { CardAppProps } from "./components/App";

import "./index.less";

export interface IApp {
  app_id: number | string;
  name: string;
  logo: string;
  dark_logo: string;
  host: string;
  path: string;
  description: string;
  clients?: {
    id: number;
    name: string;
    is_active: boolean;
    client_id?: number;
  }[];
  allowed?: boolean;
}

export interface AppsListProps {
  apps: IApp[];
  loading?: boolean;
  onSelect?: CardAppProps["onButtonClick"];
  disabledApps?: number[];
}

const AppsList: FC<AppsListProps> = ({
  apps,
  loading,
  onSelect,
  disabledApps
}) => {
  const { translate } = useConfig();

  return (
    <Row className="row-apps">
      {loading ? (
        <AppsLoader />
      ) : apps.length > 0 ? (
        apps.map(app => (
          <App
            key={app.app_id}
            {...app}
            disabled={disabledApps && disabledApps.includes(Number(app.app_id))}
            onButtonClick={(clientId, params) => onSelect?.(clientId, params)}
          />
        ))
      ) : (
        <div className="no-apps">{translate("HAVENT_APPS")}</div>
      )}
    </Row>
  );
};

export default AppsList;
