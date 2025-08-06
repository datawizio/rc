import clsx from "clsx";
import Button from "@/components/Button";
import Badger from "@/components/FaviconBadger";

import { useEffect, useState } from "react";
import { Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useDeepEqualMemo } from "@/hooks";
import { ws } from "@/utils/ws";

import type { FC, MouseEventHandler } from "react";
import type { BadgerOptions } from "@/components/FaviconBadger";
import type { WebSocketMessage } from "@/utils/ws";

import "./index.less";

export interface NotificationButtonProps {
  useWS?: boolean;
  faviconBadgerOptions?: BadgerOptions;
  count: number;
  onClick: MouseEventHandler<HTMLElement>;
  tooltip?: string;
  disabled?: boolean;
}

const badgeOptions: BadgerOptions = { size: 0.35, radius: 50 };
const faviconBadge = new Badger(badgeOptions);

const NotificationButton: FC<NotificationButtonProps> = ({
  count,
  faviconBadgerOptions,
  useWS,
  tooltip,
  disabled,
  onClick
}) => {
  const [state, setState] = useState<number>(count);

  useEffect(() => {
    faviconBadge.value = 0;
    if (!useWS) return;

    const msg: WebSocketMessage = {
      "id": "notifications-count",
      "type": "subscribe",
      "payload": {
        "query":
          "subscription { notificationsCount(pageType: unread_page) {count} }"
      }
    };

    const handleMessage = (data: WebSocketMessage) => {
      const count = data.payload?.data.notificationsCount.count;
      setState(count);
      faviconBadge.value = count;
    };

    ws.subscribe("notifications-count", "notification-btn", handleMessage, msg);
    ws.sendMessage(msg);

    return () => {
      ws.unsubscribe("notifications-count", "notification-btn");
    };
  }, [useWS]);

  useEffect(() => {
    if (!faviconBadgerOptions) return;
    faviconBadge.updateOptions(
      Object.assign(badgeOptions, faviconBadgerOptions)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useDeepEqualMemo(faviconBadgerOptions)]);

  return (
    <Badge
      className={clsx(
        "notification-btn",
        disabled && "notification-btn--disabled"
      )}
      dot={state > 0}
    >
      <Button
        type="link"
        onClick={onClick}
        icon={<BellOutlined />}
        disabled={disabled}
        title={tooltip}
      />
    </Badge>
  );
};

export default NotificationButton;
