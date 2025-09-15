import ApiError from "@/components/ApiError";
import type { TFunction, TOptions } from "i18next";

export type ApiNotificationError = {
  error_title: string;
  error_type: "error" | "warning";
  error_field?: string;
  error_values?: string[];
};

export type ErrorWithMessage = { message: string; message_params?: TOptions };

export type ErrorsObject =
  | string
  | ErrorWithMessage
  | Record<string, string | string[]>;

export function parseErrorText(errors: ErrorsObject, t: TFunction) {
  if (typeof errors === "string") {
    return t("ERROR_500");
  }

  const withMessage = (errors: any): errors is ErrorWithMessage => {
    return errors.message;
  };

  if (withMessage(errors)) {
    return t(errors.message, errors.message_params);
  }

  return Object.keys(errors)
    .map(key => {
      return Array.isArray(errors[key])
        ? errors[key].map(v => t(v)).join("<br />")
        : t(errors[key]);
    })
    .join("<br />");
}

export function showApiErrors(errors: ErrorsObject, t: TFunction) {
  const msg = parseErrorText(errors, t);
  ApiError.showError(msg);
}

export function showApiNotifications(
  errors: ApiNotificationError[],
  t: TFunction,
  duration?: number
) {
  if (!errors?.length) return;
  errors.forEach((error: ApiNotificationError) => {
    const { error_title, error_values, error_field, error_type } = error;
    const title: string = t(error_title, { column_name: error_field || "" });

    const description = error_values
      ?.map(value => "<li>" + t(value) + "</li>")
      ?.join("");

    ApiError.showNotification(
      title,
      description
        ? `<ul style='padding-left: 0; margin-bottom: 0;'>${description}</ul>`
        : null,
      error_type || "error",
      duration
    );
  });
}
