import { Select, Badge } from "antd";
import { useConfig } from "@/hooks";

import type { FC } from "react";
import type { SelectValue } from "antd/es/select";

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
          options={clients}
          fieldNames={{ value: "id", label: "name" }}
          optionRender={option => (
            <>
              <Badge
                style={{ width: 14 }}
                status="default"
                color={option.data.is_active ? "purple" : undefined}
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
