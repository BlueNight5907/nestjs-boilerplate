import {
  BullModule as BullModule,
  getQueueToken as nestGetQueueToken,
  type SharedBullAsyncConfiguration,
} from '@nestjs/bullmq';
import { type DynamicModule, Module, type Provider } from '@nestjs/common';
import { type Queue, QueueEvents } from 'bullmq';

import { BullQueueAdapter } from './bull-queue.adapter';
import { type IRegisterQueueOptions } from './interfaces';
import { getQueueToken } from './utils';

@Module({})
export class BullMqModule {
  static forRootAsync(
    asyncBullConfig: SharedBullAsyncConfiguration,
  ): DynamicModule;

  static forRootAsync(
    configKey: string,
    asyncBullConfig: SharedBullAsyncConfiguration,
  ): DynamicModule;

  static forRootAsync(
    keyOrAsyncConfig: string | SharedBullAsyncConfiguration,
    asyncBullConfig?: SharedBullAsyncConfiguration,
  ): DynamicModule {
    const [configKey, asyncSharedBullConfig] =
      typeof keyOrAsyncConfig === 'string'
        ? [keyOrAsyncConfig, asyncBullConfig]
        : [undefined, keyOrAsyncConfig];

    if (configKey) {
      return {
        module: BullMqModule,
        imports: [BullModule.forRootAsync(configKey, asyncSharedBullConfig!)],
      };
    }

    return {
      module: BullMqModule,
      imports: [BullModule.forRootAsync(asyncSharedBullConfig!)],
    };
  }

  static registerQueue(
    ...queueOptions: IRegisterQueueOptions[]
  ): DynamicModule {
    const providers: Provider[] = queueOptions.map((option) => ({
      inject: [nestGetQueueToken(option.name)],
      provide: getQueueToken(option.name),
      useFactory: (queue: Queue) => {
        const queueEvents = new QueueEvents(option.name, {
          ...queue.opts,
        });

        return new BullQueueAdapter(queue, queueEvents);
      },
    }));

    return {
      module: class {},
      imports: [BullModule.registerQueue(...queueOptions)],
      providers,
      exports: [...providers],
    };
  }
}
