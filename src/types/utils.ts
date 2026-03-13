/**
 * A value that can be either a direct value or a Promise resolving to that value.
 *
 * @template T The underlying value type.
 */
export type MaybePromise<T> = T | Promise<T>;

/**
 * Extracts the callable function type from a specific property of a record-like type (e.g. component props type).
 * Ensures the property is non-nullable and a function.
 *
 * @template T Extends a record of string keys to any values.
 * @template K The key of `T` whose function type should be extracted.
 */
export type HandlerFn<
  T extends Record<string, any>,
  K extends keyof T
> = Extract<NonNullable<T[K]>, CallableFunction>;

/**
 * Creates a new type by making a subset of keys optional while keeping the rest unchanged.
 *
 * @template T The source object type.
 * @template K Keys of `T` to mark as optional.
 */
export type PartialBy<T extends object, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

/**
 * Creates a new type by overwriting properties of one type with properties from another.
 * Properties present in both will take their types from `V`.
 *
 * @template U The base object type to be overwritten.
 * @template V The object type providing overriding properties.
 */
export type Overwrite<U extends object, V extends object> = Omit<U, keyof V> &
  V;

/**
 * Rewrites the type of specific parameter in a function type.
 *
 * @template F The original function type.
 * @template Index The index of the parameter to replace.
 * @template NewType The new type for the parameter at the given index.
 */
export type ReplaceParameter<
  F extends (...args: any[]) => any,
  Index extends number,
  NewType
> = F extends (...args: infer Args) => infer Return
  ? (
      ...args: {
        [K in keyof Args]: K extends `${Index}` ? NewType : Args[K];
      }
    ) => Return
  : never;
