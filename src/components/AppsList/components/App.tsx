import { useState, type FC } from "react";
import { Badge, Card, Col } from "antd";
import { useConfig, useTheme } from "@/hooks";

import Select from "@/components/Select";
import Button from "@/components/Button";

export interface IClient {
  client_id?: number;
  name: string;
  is_active: boolean;
}

export interface CardAppProps {
  app_id: number | string;
  name: string;
  logo: string;
  dark_logo: string;
  host: string;
  path: string;
  description: string;
  allowed?: boolean;
  clients?: IClient[];
  onButtonClick?: (
    clientId: number | null | undefined,
    params: Pick<CardAppProps, "allowed" | "name" | "clients"> & {
      appId: CardAppProps["app_id"];
      url: string;
    }
  ) => void;
  buttonText?: string;
  showButton?: boolean;
  disabled?: boolean;
}

export const App: FC<CardAppProps> = ({
  app_id,
  name,
  logo,
  dark_logo,
  description,
  clients,
  host,
  path,
  allowed,
  showButton = true,
  disabled = false,
  onButtonClick
}) => {
  const { translate } = useConfig();
  const theme = useTheme();
  const [client, setClient] = useState<number>();

  const showClientSelect = path ? path.match(":client_id") !== null : false;

  const handleChangeClient = (value: number) => {
    setClient(value);
  };

  const getClient = (client: number | undefined) => {
    if (client) return client;
    if (clients && clients.length > 0) return clients[0].client_id;
    return null;
  };

  const handleButtonClick = () => {
    const url = `${host ? host : ""}${path ? path : ""}`;
    onButtonClick?.(getClient(client), {
      appId: app_id,
      url,
      allowed,
      name,
      clients
    });
  };

  return (
    <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
      <Card className="card-app">
        <div className="card-app-logo">
          {logo ? (
            <img src={theme === "dark" ? dark_logo : logo} alt={name} />
          ) : (
            <div className="card-app-name">{name}</div>
          )}
        </div>
        <div className="card-app-description">{translate(description)}</div>
        {showClientSelect && clients && clients.length > 1 && (
          <div className="card-app-clients">
            <Select
              placeholder={translate("SELECT_CLIENT")}
              showSearch
              optionFilterProp="label"
              onChange={value => handleChangeClient(value as number)}
              value={client}
              notFoundContent={translate("NO_DATA")}
            >
              {clients.map(client => (
                <Select.Option
                  key={client.client_id}
                  value={client.client_id}
                  label={client.name}
                >
                  <Badge
                    status="default"
                    color={client.is_active ? "purple" : undefined}
                  />
                  {client.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        )}

        {showButton && (
          <div className="card-app-actions">
            <Button
              type={"primary"}
              block
              disabled={disabled}
              onClick={handleButtonClick}
            >
              {translate(allowed ? "NAVIGATE_TO" : "LEARN_MORE")}
            </Button>
          </div>
        )}
      </Card>
    </Col>
  );
};
