/**
 * Joins 2 keys as `K`, `K.P`
 * The parenthesis notation is included for embedded columns
 */
type Join<K, P> = K extends string
    ? P extends string
        ? `${K}${'' extends P ? '' : '.'}${P}`
        : never
    : never

/**
 * Get the previous number between 0 and 10. Examples:
 *   Prev[3] = 2
 *   Prev[0] = never.
 *   Prev[20] = 0
 */
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...0[]]

/**
 * Unwrap Promise<T> to T
 */
type UnwrapPromise<T> = T extends Promise<infer U> ? UnwrapPromise<U> : T

/**
 * Unwrap Array<T> to T
 */
type UnwrapArray<T> = T extends Array<infer U> ? UnwrapArray<U> : T

/**
 * Find all the dotted path properties for a given column.
 *
 * T: The column
 * D: max depth
 */
//                                            v Have we reached max depth?
export type Column<T, D extends number = 2> = [D] extends [never]
    ? // yes, stop recursing
      never
    : // Are we extending something with keys?
    T extends Record<string, any>
    ? {
          // For every keyof T, find all possible properties as a string union
          [K in keyof T]-?: K extends string
              ? // Is it string or number (includes enums)?
                T[K] extends string | number
                  ? // yes, add just the key
                    `${K}`
                  : // Is it a Date?
                  T[K] extends Date
                  ? // yes, add just the key
                    `${K}`
                  : // no, is it an array?
                  T[K] extends Array<infer U>
                  ? // yes, unwrap it, and recurse deeper
                    `${K}` | Join<K, Column<UnwrapArray<U>, Prev[D]>>
                  : // no, is it a promise?
                  T[K] extends Promise<infer U>
                  ? // yes, try to infer its return type and recurse
                    U extends Array<infer V>
                      ? `${K}` | Join<K, Column<UnwrapArray<V>, Prev[D]>>
                      : `${K}` | Join<K, Column<UnwrapPromise<U>, Prev[D]>>
                  : // no, we have no more special cases, so treat it as an
                    // object and recurse deeper on its keys
                    `${K}` | Join<K, Column<T[K], Prev[D]>>
              : never
          // Join all the string unions of each keyof T into a single string union
      }[keyof T]
    : ''

type NonNullableKeys<T extends Record<string, any>, G extends Column<T, 10>> =
{
  [K in keyof T]: K extends string 
  ? // Is it string or number (includes enums)?
    T[K] extends (string | number)
      ? // yes, just the key
        K extends G ? T[K] & {} :T[K]
      : // Is it a Date?
      T[K] extends Date
      ? // yes, add just the key
        K extends G ?  T[K] & {}:T[K]
      : // no, is it an array?
      T[K] extends Array<infer U>
      ? // yes, unwrap it, and recurse deeper
        K extends G 
        ? NonNullable<T[K]>
        : U extends Record<string,any>
          ? // yes, make new non null for child
          G extends `${infer CK}.${infer Rest}`
            ? K extends CK
              ? Rest extends Column<U,10>
                  ? NonNullableKeys<U, Rest>[]
                  : T[K]
              :T[K]
            :T[K]
          :T[K]
        : // no, is it a promise?
        T[K] extends Promise<infer U>
        ? // yes, unwrap it, and recurse deeper
          K extends G 
          ? NonNullable<T[K]>
          : U extends Record<string,any>
            ? // yes, make new non null for child
            G extends `${infer CK}.${infer Rest}`
              ? K extends CK
                ? Rest extends Column<U, 10>
                    ? NonNullableKeys<U, Rest>[]
                    : T[K]
                  
                :T[K]
              :T[K]
            :T[K]
        : // no, we have no more special cases, so treat it as an
          // object and recurse deeper on its keys
          K extends G 
          ? NonNullable<T[K]>
          : T[K] extends Record<string,any>
            ? // yes, make new non null for child
            G extends `${infer CK}.${infer Rest}`
              ? K extends CK
                ? Rest extends Column<T[K], 10>
                  ? NonNullableKeys<T[K], Rest>
                  : T[K]
                :T[K]
              :T[K]
            :T[K]
  :never
}

type A = {
  name: string|null;
  info:{
    abc: number| null
  },
  arr:{age:number|null}[]
}


type B = NonNullableKeys<A,"arr.age">

const test:B = {
  info:{
    abc:1
  },
  name:"abc",
  arr:[{
    age:1
  }]
}

