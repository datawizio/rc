import {
  CalendarOutlined,
  ProfileOutlined,
  HistoryOutlined,
  CreditCardOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ContainerOutlined
} from "@ant-design/icons";

import type { ReactElement } from "react";

export enum ColumnIcons {
  Calendar = "calendar",
  Profile = "profile",
  History = "history",
  CreditCard = "credit_card",
  Dollar = "dollar",
  CheckCircle = "check_circle",
  Container = "container"
}

export const columnIcons: Record<ColumnIcons, ReactElement> = {
  [ColumnIcons.Calendar]: <CalendarOutlined />,
  [ColumnIcons.Profile]: <ProfileOutlined />,
  [ColumnIcons.History]: <HistoryOutlined />,
  [ColumnIcons.CreditCard]: <CreditCardOutlined />,
  [ColumnIcons.Dollar]: <DollarOutlined />,
  [ColumnIcons.CheckCircle]: <CheckCircleOutlined />,
  [ColumnIcons.Container]: <ContainerOutlined />
};
