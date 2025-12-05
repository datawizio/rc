import type { Locale } from "antd/es/locale";

export type IDirection = "ltr" | "rtl" | undefined;

export const getLanguagesRTL = (): string[] => {
  return ["ar"];
};

export const getLangDirection = (locale?: Locale): IDirection => {
  let direction: IDirection = "ltr";
  const rtlLanguages = getLanguagesRTL();

  if (locale && rtlLanguages.includes(locale.locale)) {
    direction = "rtl";
    setDirectionToHtml(direction);
  }

  return direction;
};

export const setDirectionToHtml = (direction: IDirection): void => {
  const htmlTag = document.querySelector("html");
  if (htmlTag) {
    htmlTag.style.direction = direction!;
    htmlTag.classList.add(direction!);
  }
};
