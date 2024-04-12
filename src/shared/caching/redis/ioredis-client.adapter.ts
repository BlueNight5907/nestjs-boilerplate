import { type Redis } from 'ioredis';

import { type ICacheClient } from '../core';

export class IORedisClientAdapter implements ICacheClient {
  constructor(private readonly store: Redis) {}

  async get<T = unknown>(cacheKey: string): Promise<T | undefined> {
    const value = await this.store.get(cacheKey);

    if (value !== null) {
      return JSON.parse(value) as T;
    }

    return undefined;
  }

  async set<T = unknown>(
    cacheKey: string,
    cacheValue: T | Promise<T>,
    ttl?: number | undefined,
  ): Promise<void> {
    const serializedValue = JSON.stringify(await cacheValue);

    await (ttl
      ? this.store.set(cacheKey, serializedValue, 'EX', ttl)
      : this.store.set(cacheKey, serializedValue));
  }

  async delete(...keys: string[]): Promise<void> {
    await this.store.del(...keys);
  }
}
