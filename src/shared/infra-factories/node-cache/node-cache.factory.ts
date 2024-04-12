import { Inject } from '@nestjs/common';
import NodeCache, { Options } from 'node-cache';

import { DEFAULT_NODE_CACHE_CONFIGS } from '../tokens';

export class NodeCacheFactory {
  private readonly cacheStoreMap = new Map<string, NodeCache>();

  private readonly defaultCacheStore: NodeCache;

  constructor(
    @Inject(DEFAULT_NODE_CACHE_CONFIGS)
    private readonly defaultConfigs: Options,
  ) {
    this.defaultCacheStore = new NodeCache(defaultConfigs);
  }

  getCacheStore(): NodeCache;

  getCacheStore(key?: string): NodeCache | undefined {
    if (!key) {
      return this.defaultCacheStore;
    }

    return this.cacheStoreMap.get(key);
  }

  removeClient(key: string): void {
    this.cacheStoreMap.delete(key);
  }

  createNewCacheStore(options: Options): NodeCache;

  createNewCacheStore(key: string, options: Options): NodeCache;

  createNewCacheStore(
    keyOrOptions: string | Options,
    options?: Options,
  ): NodeCache {
    const [key, nodeCacheOptions] =
      typeof keyOrOptions === 'string'
        ? [keyOrOptions, options]
        : [undefined, options];

    if (key && this.cacheStoreMap.has(key)) {
      throw new Error(
        `Node Cache store  with key ${key} has already been created`,
      );
    }

    const store = new NodeCache({
      ...this.defaultConfigs,
      ...nodeCacheOptions,
    });

    if (key) {
      this.cacheStoreMap.set(key, store);
    }

    return store;
  }
}
