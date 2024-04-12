import { type Provider } from '@nestjs/common';
import { type Redis } from 'ioredis';

import { CacheManager, type ICacheClient } from '../core';
import {
  type IRedisCacheFeatureOptions,
  type ISharedRedisCacheAsyncConfig,
} from './interfaces';
import { IORedisClientAdapter } from './ioredis-client.adapter';
import {
  getRedisCacheFeatureOptionsToken,
  getRedisCacheManagerToken,
  getSharedRedisCacheClientToken,
  getSharedRedisCacheToken,
} from './utils';

export function createSharedAsyncClientsProvider(
  config: ISharedRedisCacheAsyncConfig,
  configKey?: string,
) {
  const configToken = getSharedRedisCacheToken(configKey);

  const sharedConfigProvider: Provider = {
    provide: configToken,
    useFactory: config.useFactory,
    inject: config.inject,
  };

  const clientToken = getSharedRedisCacheClientToken(configKey);

  const clientProvider: Provider = {
    provide: clientToken,
    useFactory: (store: Redis) => new IORedisClientAdapter(store),
    inject: [configToken],
  };

  return [sharedConfigProvider, clientProvider];
}

export function createCacheOptionsProvider(
  optionsList: IRedisCacheFeatureOptions[],
): Provider[] {
  return optionsList.map((options) => {
    const cacheOptionsToken = getRedisCacheFeatureOptionsToken(options.name);
    const cacheOptionsProvider: Provider = {
      provide: cacheOptionsToken,
      useValue: options,
    };

    return cacheOptionsProvider;
  });
}

export function createCacheManagerProvider(
  optionsList: IRedisCacheFeatureOptions[],
): Provider[] {
  return optionsList.map((options) => {
    const cacheOptionsToken = getRedisCacheFeatureOptionsToken(options.name);

    const clientToken = getSharedRedisCacheClientToken(options.configKey);
    const cacheManagerToken = getRedisCacheManagerToken(options.name);
    const cacheManagerProvider: Provider = {
      provide: cacheManagerToken,
      useFactory: (
        injectedOptions: IRedisCacheFeatureOptions,
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
