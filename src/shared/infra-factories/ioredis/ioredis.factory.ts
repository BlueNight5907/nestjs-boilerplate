import { Inject, Injectable } from '@nestjs/common';
import { Redis, RedisOptions } from 'ioredis';

import { DEFAULT_IOREDIS_CONFIGS } from '../tokens';

@Injectable()
export class IORedisFactory {
  private readonly clientMap = new Map<string, Redis>();

  private readonly defaultRedisClient: Redis;

  constructor(
    @Inject(DEFAULT_IOREDIS_CONFIGS)
    private readonly defaultConfigs: RedisOptions,
  ) {
    this.defaultRedisClient = new Redis(defaultConfigs);
  }

  getClient(): Redis;

  getClient(key?: string): Redis | undefined {
    if (!key) {
      return this.defaultRedisClient;
    }

    return this.clientMap.get(key);
  }

  removeClient(key: string): void {
    this.clientMap.delete(key);
  }

  createNewClient(options: RedisOptions): Redis;

  createNewClient(key: string, options: RedisOptions): Redis;

  createNewClient(
    keyOrOptions: string | RedisOptions,
    options?: RedisOptions,
  ): Redis {
    const [key, redisOptions] =
      typeof keyOrOptions === 'string'
        ? [keyOrOptions, options]
        : [undefined, keyOrOptions];

    if (key && this.clientMap.has(key)) {
      throw new Error(`Redis client with key ${key} has already been created`);
    }

    const client = new Redis({ ...this.defaultConfigs, ...redisOptions });

    if (key) {
      this.clientMap.set(key, client);
    }

    return client;
  }
}
