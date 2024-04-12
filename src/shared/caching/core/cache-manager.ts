import { AbstractCacheManager } from './base';
import { type IValueTransformer } from './interfaces';

export class CacheManager extends AbstractCacheManager {
  get<T>(cacheKey: string): Promise<T | undefined>;

  get<T, V = unknown>(
    cacheKey: string,
    transformer: IValueTransformer<T, V>,
  ): Promise<T>;

  get<T>(cacheKey: string, fallbackValue: T): Promise<T>;

  get<T, V = unknown>(
    cacheKey: string,
    fallbackValue: V,
    transformer: IValueTransformer<T, V>,
  ): Promise<T | undefined>;

  async get<T, V = unknown>(...args: unknown[]): Promise<T | undefined> {
    if (args.length === 1) {
      return this.getCacheValue(args[0] as string);
    }

    if (args.length === 2) {
      if (!this.isTransformer(args[1])) {
        return this.getCacheValueWithFallback<T>(
          args[0] as string,
          args[1] as T,
        );
      }

      return this.getCacheValueWithTransformer(
        args[0] as string,
        args[1] as IValueTransformer<T, V>,
      );
    }

    if (args.length === 3) {
      return this.getCacheValueWithFallbackAndTransformer(
        args[0] as string,
        args[1] as V,
        args[2] as IValueTransformer<T, V>,
      );
    }
  }

  private isTransformer<T, V>(
    param: V | IValueTransformer<T, V>,
  ): param is IValueTransformer<T, V> {
    if (typeof param !== 'object') {
      return false;
    }

    return Boolean((<IValueTransformer<T, V>>param).transform);
  }

  private formatCacheKey(key: string): string {
    if (this.prefix) {
      return `${this.prefix}_${key}`;
    }

    return key;
  }

  private async getCacheValue<T>(cacheKey: string): Promise<T | undefined> {
    return this.cacheClient.get<T>(this.formatCacheKey(cacheKey));
  }

  private async getCacheValueWithFallback<T>(
    cacheKey: string,
    fallbackValue: T,
  ): Promise<T> {
    const cacheValue = await this.getCacheValue<T>(cacheKey);

    if (!cacheValue) {
      return fallbackValue;
    }

    return cacheValue;
  }

  private async getCacheValueWithTransformer<T, V = unknown>(
    cacheKey: string,
    transformer: IValueTransformer<T, V>,
  ): Promise<T | undefined> {
    const cacheValue: V | undefined = await this.getCacheValue<V>(cacheKey);

    return transformer.transform(cacheValue);
  }

  private async getCacheValueWithFallbackAndTransformer<T, V = unknown>(
    cacheKey: string,
    fallbackValue: V,
    transformer: IValueTransformer<T, V>,
  ): Promise<T | undefined> {
    const cacheValue: V =
      (await this.getCacheValue<V>(cacheKey)) ?? fallbackValue;

    return transformer.transform(cacheValue);
  }

  set<T>(cacheKey: string, value: T, ttl?: number | undefined): Promise<void>;

  set<T>(
    cacheKey: string,
    getValue: () => T | Promise<T>,
    ttl?: number | undefined,
  ): Promise<void>;

  set<T>(...args: unknown[]): Promise<void> {
    if (args.length > 3) {
      return Promise.resolve();
    }

    let cacheValue = args[1];

    if (typeof args[2] === 'function') {
      cacheValue = (<() => T | Promise<T>>cacheValue)();
    }

    return this.cacheClient.set(
      this.formatCacheKey(args[0] as string),
      cacheValue,
      args[2] as number,
    );
  }

  delete(...keys: string[]): Promise<void> {
    return this.cacheClient.delete(
      ...keys.map((key) => this.formatCacheKey(key)),
    );
  }
}
