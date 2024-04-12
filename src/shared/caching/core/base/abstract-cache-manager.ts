import { type ICacheClient, type IValueTransformer } from '../interfaces';
import {
  type ICacheManager,
  type ICacheManagerOptions,
} from '../interfaces/ICacheManager';

export abstract class AbstractCacheManager implements ICacheManager {
  protected cacheClient: ICacheClient;

  protected prefix: string;

  constructor(cacheClient: ICacheClient, options: ICacheManagerOptions = {}) {
    this.cacheClient = cacheClient;
    this.prefix = options.prefix ?? '';
  }

  abstract get<T>(cacheKey: string): Promise<T>;

  abstract get<T, V = unknown>(
    cacheKey: string,
    transformer: IValueTransformer<T, V>,
  ): Promise<T>;

  abstract get<T>(cacheKey: string, fallbackValue: T): Promise<T>;

  abstract get<T, V = unknown>(
    cacheKey: string,
    fallbackValue: V,
    transformer: IValueTransformer<T, V>,
  ): Promise<T>;

  abstract set<T>(
    cacheKey: string,
    value: T,
    ttl?: number | undefined,
  ): Promise<void>;

  abstract set<T>(
    cacheKey: string,
    getValue: () => T | Promise<T>,
    ttl?: number | undefined,
  ): Promise<void>;

  abstract delete(...keys: string[]): Promise<void>;
}
