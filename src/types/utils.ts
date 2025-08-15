export type MaybePromise<T> = T | Promise<T>;

export type HandlerFn<
  T extends Record<string, any>,
  K extends keyof T
> = Extract<NonNullable<T[K]>, CallableFunction>;

export type PartialBy<T extends object, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
