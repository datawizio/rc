import i18next from "i18next";

export const parseErrorText = (errors: Record<string, string[]>) => {
  return Object.keys(errors)
    .map(key => errors[key].map(v => i18next.t(v)).join("<br />"))
    .join("<br />");
};

export const copyToClipboard = (textToCopy: string) => {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(textToCopy);
  }

  const textArea = document.createElement("textarea");
  textArea.value = textToCopy;

  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";

  document.body.appendChild(textArea);

  textArea.focus();
  textArea.select();

  return new Promise<void>((resolve, reject) => {
    const success = document.execCommand("copy");

    if (success) resolve();
    else reject();

    textArea.remove();
  });
};
