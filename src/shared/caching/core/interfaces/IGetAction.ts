import { type IValueTransformer } from './IValueTransformer';

export interface IGetAction {
  get<T>(cacheKey: string): Promise<T | undefined>;
  get<T, V = unknown>(
    cacheKey: string,
    transformer: IValueTransformer<T, V>,
  ): Promise<T | undefined>;
  get<T>(cacheKey: string, fallbackValue: T): Promise<T>;
  get<T, V = unknown>(
    cacheKey: string,
    fallbackValue: V,
    transformer: IValueTransformer<T, V>,
  ): Promise<T | undefined>;
}
