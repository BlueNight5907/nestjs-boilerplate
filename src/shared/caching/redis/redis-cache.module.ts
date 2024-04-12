import { type DynamicModule, Module } from '@nestjs/common';

import {
  type IRedisCacheFeatureOptions,
  type ISharedRedisCacheAsyncConfig,
} from './interfaces';
import {
  createCacheManagerProvider,
  createCacheOptionsProvider,
  createSharedAsyncClientsProvider,
} from './redis-cache.providers';

@Module({})
export class RedisCacheModule {
  static forRootAsync(options: ISharedRedisCacheAsyncConfig): DynamicModule;

  static forRootAsync(
    configKey: string,
    options: ISharedRedisCacheAsyncConfig,
  ): DynamicModule;

  static forRootAsync(
    keyOrConfig: string | ISharedRedisCacheAsyncConfig,
    config?: ISharedRedisCacheAsyncConfig,
  ): DynamicModule {
    const [configKey, sharedConfig] =
      typeof keyOrConfig === 'string'
        ? [keyOrConfig, config!]
        : [undefined, keyOrConfig];

    const providers = createSharedAsyncClientsProvider(sharedConfig, configKey);

    const clientProvider = providers[1];

    return {
      global: true,
      module: RedisCacheModule,
      providers,
      imports: sharedConfig.imports,
      exports: [clientProvider],
    };
  }

  static registerCacheManager(
    ...cacheOptionsList: IRedisCacheFeatureOptions[]
  ): DynamicModule {
    const optionsProviders = createCacheOptionsProvider(cacheOptionsList);
    const cacheManagerProvider = createCacheManagerProvider(cacheOptionsList);

    return {
      module: RedisCacheModule,
      providers: [...optionsProviders, ...cacheManagerProvider],
      exports: cacheManagerProvider,
    };
  }
}
