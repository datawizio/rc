import { useEffect } from "react";
import { ws, type WebSocketMessage } from "@/utils/ws";

export interface WebSocketSubscriptionParams {
  id: string;
  message?: WebSocketMessage;
  callback: (message: WebSocketMessage) => void;
}

export const useWebSocketSubscription = ({
  id,
  message,
  callback
}: WebSocketSubscriptionParams) => {
  useEffect(() => {
    const subscriptionId = `ws_${Math.random()}`;
    ws.subscribe(id ?? "", subscriptionId, callback, message);

    if (message) {
      ws.sendMessage(message);
    }

    return () => {
      ws.unsubscribe(id ?? "", subscriptionId);
    };
    // eslint-disable-next-line
  }, []);
};
