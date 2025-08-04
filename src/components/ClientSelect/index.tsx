import clsx from "clsx";
import Select from "@/components/Select";
import { Badge } from "antd";
import { useConfig } from "@/hooks";

import type { FC } from "react";
import type { SelectValue } from "antd/lib/select";
import type { Theme } from "@/utils/theme";

import "./index.less";

export interface ClientSelectProps {
  clients: { id: number; name: string; is_active: boolean }[];
  client: number;
  theme?: Theme;
  onChange?: (url: string) => void;
}

const ClientSelect: FC<ClientSelectProps> = ({
  clients,
  client,
  theme,
  onChange
}) => {
  const { translate: t } = useConfig();

  const handleChange = (value: SelectValue) => {
    const arr = window.location.pathname.split("/").slice(3);
    onChange?.(`/c/${value}/${arr.join("/")}`);
  };

  const className = clsx({
    "client-select": true,
    "dw-dark": theme === "dark"
  });

  return (
    <>
      {clients.length === 1 ? (
        clients[0].name
      ) : (
        <Select
          value={client}
          showSearch
          optionFilterProp="label"
          notFoundContent={t("NO_DATA")}
          onChange={handleChange}
          className={className}
        >
          {clients.map(client => (
            <Select.Option
              key={client.id}
              value={client.id}
              label={client.name}
            >
              <Badge
                style={{ width: 14 }}
                status="default"
                color={client.is_active ? "purple" : undefined}
              />
              {client.name}
            </Select.Option>
          ))}
        </Select>
      )}
      <div className="divider"></div>
    </>
  );
};

export default ClientSelect;
