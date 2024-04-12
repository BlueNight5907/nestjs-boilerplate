import { seconds, type ThrottlerStorage } from '@nestjs/throttler';
import { type ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface';
import { Redis } from 'ioredis';

interface IThrottlerStorageOptions {
  host: string;
  port: number;
  username?: string;
  password?: string;
}
class RedisThrottlerStorage implements ThrottlerStorage {
  private storage: Redis;

  constructor(options: IThrottlerStorageOptions) {
    this.storage = new Redis({
      host: options.host,
      port: options.port,
      username: options.username,
      password: options.password,
    });
  }

  async increment(key: string, ttl: number): Promise<ThrottlerStorageRecord> {
    let totalHits = Number((await this.storage.get(key)) ?? 0);
    let timeToExpire = seconds(await this.storage.ttl(key));

    if (!totalHits) {
      totalHits = 0;
      timeToExpire = ttl;
    }

    await this.storage.set(key, ++totalHits, 'PX', timeToExpire);

    return { totalHits, timeToExpire };
  }
}

export function setupThrottlerStorage(
  options: IThrottlerStorageOptions,
): ThrottlerStorage {
  return new RedisThrottlerStorage(options);
}
