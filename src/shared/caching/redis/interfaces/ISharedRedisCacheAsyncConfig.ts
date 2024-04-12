import { type FactoryProvider, type ModuleMetadata } from '@nestjs/common';
import { type Redis } from 'ioredis';

export interface ISharedRedisCacheAsyncConfig
  extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Factory function that returns an instance of the provider to be injected.
   */
  useFactory: (...args: any[]) => Promise<Redis> | Redis;

  /**
   * Optional list of providers to be injected into the context of the Factory function.
   */
  inject: FactoryProvider['inject'];
}
