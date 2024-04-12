import { Module } from '@nestjs/common';
import { type RedisOptions } from 'ioredis';
import { type Options } from 'node-cache';
import { ApiConfigService } from 'shared/common';

import { IORedisFactory } from './ioredis/ioredis.factory';
import { NodeCacheFactory } from './node-cache/node-cache.factory';
import { DEFAULT_IOREDIS_CONFIGS, DEFAULT_NODE_CACHE_CONFIGS } from './tokens';

@Module({
  imports: [],
  providers: [
    {
      provide: DEFAULT_IOREDIS_CONFIGS,
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService): RedisOptions => {
        const redisConfig = configService.redisConfig;

        return {
          name: 'default_ioredis_connection',
          maxRetriesPerRequest: null,
          ...redisConfig,
        };
      },
    },
    {
      provide: DEFAULT_NODE_CACHE_CONFIGS,
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService): Options => {
        const nodeCacheConfig = configService.nodeCacheConfig;

        return {
          ...nodeCacheConfig,
        };
      },
    },
    IORedisFactory,
    NodeCacheFactory,
  ],
  exports: [IORedisFactory, NodeCacheFactory],
})
export class InfraFactoryModule {}
