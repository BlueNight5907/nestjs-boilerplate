export interface IValueTransformer<T, V> {
  transform: (value?: V) => T;
}
