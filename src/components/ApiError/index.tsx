import { notification } from "antd";
import type { FC } from "react";

export interface ApiErrorProps {
  errors: string;
}

export interface FCApiError extends FC<ApiErrorProps> {
  showError: (errors: string) => void;
}

const ApiError: FCApiError = ({ errors }) => {
  return <span dangerouslySetInnerHTML={{ __html: errors }} />;
};

ApiError.showError = (errors: string) => {
  notification.error({
    message: <ApiError errors={errors} />
  });
};

export default ApiError;
