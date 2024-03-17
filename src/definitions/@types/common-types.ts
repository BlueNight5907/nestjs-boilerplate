type Join<K, P> = K extends string
  ? P extends string
    ? `${K}${'' extends P ? '' : '.'}${P | `(${P}` | `${P})`}`
    : never
  : never;

// unwrap Promise type
type UnwrapPromise<T> = T extends Promise<infer U> ? UnwrapPromise<U> : T;

// Unwrap Array type
type UnwrapArray<T> = T extends Array<infer U> ? UnwrapArray<U> : T;

// TODO: puts some comments here, in this ternary of doom
export type Column<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T]-?: K extends string
        ? T[K] extends Date
          ? `${K}`
          : T[K] extends Array<infer U>
          ? `${K}` | Join<K, Column<UnwrapArray<U>>>
          : T[K] extends Promise<infer U>
          ? U extends Array<infer V>
            ? `${K}` | Join<K, Column<UnwrapArray<V>>>
            : `${K}` | Join<K, Column<UnwrapPromise<U>>>
          : `${K}` | Join<K, Column<T[K]>>
        : never;
    }[keyof T]
  : '';

export type Uuid = string & { _uuidBrand: undefined };

export type Constructor<T = any, Arguments extends unknown[] = any[]> = new (
  ...arguments_: Arguments
) => T;

export type KeyOfType<Entity, U> = {
  [P in keyof Required<Entity>]: Required<Entity>[P] extends U
    ? P
    : Required<Entity>[P] extends U[]
    ? P
    : never;
}[keyof Entity];
