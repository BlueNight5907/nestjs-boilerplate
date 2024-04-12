import { type Provider } from '@nestjs/common';
import type NodeCache from 'node-cache';

import { CacheManager, type ICacheClient } from '../core';
import {
  type IMemoryCacheFeatureOptions,
  type ISharedMemoryCacheAsyncConfig,
} from './interfaces';
import { MemoryCacheClientAdapter } from './memory-cache-client.adapter';
import {
  getMemoryCacheFeatureOptionsToken,
  getMemoryCacheManagerToken,
  getSharedMemoryCacheClientToken,
  getSharedMemoryCacheToken,
} from './utils';

export function createSharedAsyncClientsProvider(
  config: ISharedMemoryCacheAsyncConfig,
  configKey?: string,
) {
  const configToken = getSharedMemoryCacheToken(configKey);

  const sharedConfigProvider: Provider = {
    provide: configToken,
    useFactory: config.useFactory,
    inject: config.inject,
  };

  const clientToken = getSharedMemoryCacheClientToken(configKey);

  const clientProvider: Provider = {
    provide: clientToken,
    useFactory: (store: NodeCache) => new MemoryCacheClientAdapter(store),
    inject: [configToken],
  };

  return [sharedConfigProvider, clientProvider];
}

export function createCacheOptionsProvider(
  optionsList: IMemoryCacheFeatureOptions[],
): Provider[] {
  return optionsList.map((options) => {
    const cacheOptionsToken = getMemoryCacheFeatureOptionsToken(options.name);
    const cacheOptionsProvider: Provider = {
      provide: cacheOptionsToken,
      useValue: options,
    };

    return cacheOptionsProvider;
  });
}

export function createCacheManagerProvider(
  optionsList: IMemoryCacheFeatureOptions[],
): Provider[] {
  return optionsList.map((options) => {
    const cacheOptionsToken = getMemoryCacheFeatureOptionsToken(options.name);

    const clientToken = getSharedMemoryCacheClientToken(options.configKey);
    const cacheManagerToken = getMemoryCacheManagerToken(options.name);
    const cacheManagerProvider: Provider = {
      provide: cacheManagerToken,
      useFactory: (
        injectedOptions: IMemoryCacheFeatureOptions,
        client: ICacheClient,
      ) =>
        new CacheManager(client, {
          prefix: `${injectedOptions.name ?? 'DEFAULT_CACHE'}:`,
        }),
      inject: [cacheOptionsToken, clientToken],
    };

    return cacheManagerProvider;
  });
}
