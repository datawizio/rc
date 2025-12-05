import { notification } from "@/utils/staticAppFunctions";
import type { FC } from "react";

export interface ApiErrorProps {
  errors: string;
}

export interface ApiErrorComponent extends FC<ApiErrorProps> {
  showError: (errors: string) => void;
  showNotification: (
    message: string,
    description?: string | null,
    type?: "error" | "warning",
    duration?: number
  ) => void;
}

const ApiError: ApiErrorComponent = ({ errors }) => {
  return <span dangerouslySetInnerHTML={{ __html: errors }} />;
};

ApiError.showError = (errors: string) => {
  notification.error({
    message: <ApiError errors={errors} />
  });
};

ApiError.showNotification = (
  message: string,
  description?: string | null,
  type?: "error" | "warning",
  duration: number = 6
) => {
  const notificationFn =
    type === "error" ? notification.error : notification.warning;

  const descriptionContent = description ? (
    <div dangerouslySetInnerHTML={{ __html: description }}></div>
  ) : null;

  notificationFn({
    message,
    description: descriptionContent,
    duration,
    style: {
      width: "440px",
      maxHeight: "600px",
      overflowY: "auto"
    }
  });
};

export default ApiError;
