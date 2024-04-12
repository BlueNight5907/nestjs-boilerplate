import type NodeCache from 'node-cache';

import { type ICacheClient } from '../core';

export class MemoryCacheClientAdapter implements ICacheClient {
  constructor(private readonly store: NodeCache) {}

  get<T = unknown>(cacheKey: string): Promise<T | undefined> {
    return Promise.resolve(this.store.get<T>(cacheKey));
  }

  async set<T = unknown>(
    cacheKey: string,
    cacheValue: T | Promise<T>,
    ttl?: number | undefined,
  ): Promise<void> {
    if (ttl) {
      await Promise.resolve(this.store.set(cacheKey, cacheValue, ttl));

      return;
    }

    await Promise.resolve(this.store.set(cacheKey, cacheValue));
  }

  async delete(...keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => this.store.del(key)));
  }
}
