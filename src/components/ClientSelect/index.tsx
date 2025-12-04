import { Select, Badge } from "antd";
import { useConfig } from "@/hooks";

import type { FC } from "react";
import type { DefaultOptionType, SelectValue } from "antd/es/select";

import "./index.less";

export type ClientsListItem = {
  id: number;
  name: string;
  is_active: boolean;
};

export interface ClientSelectProps {
  clients: ClientsListItem[];
  client: number;
  onChange?: (url: string) => void;
}

const ClientSelect: FC<ClientSelectProps> = ({ clients, client, onChange }) => {
  const { t } = useConfig();

  const handleChange = (value: SelectValue) => {
    const arr = window.location.pathname.split("/").slice(3);
    onChange?.(`/c/${value}/${arr.join("/")}`);
  };

  const options = clients.map<DefaultOptionType>(client => ({
    label: client.name,
    value: client.id,
    isActive: client.is_active
  }));

  return (
    <>
      {clients.length === 1 ? (
        clients[0].name
      ) : (
        <Select
          value={client}
          variant="borderless"
          showSearch={{ optionFilterProp: "label" }}
          notFoundContent={t("NO_DATA")}
          onChange={handleChange}
          className="client-select"
          options={options}
          optionRender={option => (
            <>
              <Badge
                style={{ width: 14 }}
                status="default"
                color={option.data.isActive ? "purple" : undefined}
              />
              {option.label}
            </>
          )}
        />
      )}
      <div className="divider" />
    </>
  );
};

export default ClientSelect;
