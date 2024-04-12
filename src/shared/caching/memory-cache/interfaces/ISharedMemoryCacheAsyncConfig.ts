import { type FactoryProvider, type ModuleMetadata } from '@nestjs/common';
import type NodeCache from 'node-cache';

export interface ISharedMemoryCacheAsyncConfig
  extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Factory function that returns an instance of the provider to be injected.
   */
  useFactory: (...args: any[]) => Promise<NodeCache> | NodeCache;

  /**
   * Optional list of providers to be injected into the context of the Factory function.
   */
  inject: FactoryProvider['inject'];
}
