import { type DynamicModule, Module } from '@nestjs/common';

import {
  type IMemoryCacheFeatureOptions,
  type ISharedMemoryCacheAsyncConfig,
} from './interfaces';
import {
  createCacheManagerProvider,
  createCacheOptionsProvider,
  createSharedAsyncClientsProvider,
} from './memory-cache.providers';

@Module({})
export class MemoryCacheModule {
  static forRootAsync(options: ISharedMemoryCacheAsyncConfig): DynamicModule;

  static forRootAsync(
    configKey: string,
    options: ISharedMemoryCacheAsyncConfig,
  ): DynamicModule;

  static forRootAsync(
    keyOrConfig: string | ISharedMemoryCacheAsyncConfig,
    config?: ISharedMemoryCacheAsyncConfig,
  ): DynamicModule {
    const [configKey, sharedConfig] =
      typeof keyOrConfig === 'string'
        ? [keyOrConfig, config!]
        : [undefined, keyOrConfig];

    const providers = createSharedAsyncClientsProvider(sharedConfig, configKey);

    const clientProvider = providers[1];

    return {
      global: true,
      module: MemoryCacheModule,
      providers,
      imports: sharedConfig.imports,
      exports: [clientProvider],
    };
  }

  static registerCacheManager(
    ...cacheOptionsList: IMemoryCacheFeatureOptions[]
  ): DynamicModule {
    const optionsProviders = createCacheOptionsProvider(cacheOptionsList);
    const cacheManagerProvider = createCacheManagerProvider(cacheOptionsList);

    return {
      module: MemoryCacheModule,
      providers: [...optionsProviders, ...cacheManagerProvider],
      exports: cacheManagerProvider,
    };
  }
}
