export const triggerInputChangeValue = (
  input: HTMLInputElement | null,
  value?: string
) => {
  if (!input) return;

  const nativeInputDescriptor = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  );

  nativeInputDescriptor?.set?.call(input, value);
  input.dispatchEvent(new Event("input", { "bubbles": true }));
};
