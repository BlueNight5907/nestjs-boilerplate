import { type DynamicModule, Module } from '@nestjs/common';
import {
  EventEmitter2,
  EventEmitterModule as NestEventEmitterModule,
} from '@nestjs/event-emitter';
import { type Redis } from 'ioredis';

import {
  type IEventBus,
  type IEventEmitter,
  type IPublishableEvent,
} from '../core';
import { EventBusAdapter } from './event-bus.adapter';
import { EventEmitterAdapter } from './event-emitter.adapter';
import {
  ConfigurableModuleClass,
  type IRedisEventEmitterOptions,
  MODULE_OPTIONS_TOKEN,
} from './event-emitter.module-definition';
import { RedisEventEmitterProxy } from './redis-event-emitter.proxy';
import {
  EE2_EVENT_BUS,
  EE2_EVENT_EMITTER,
  REDIS_EE2_EVENT_EMITTER,
} from './tokens';

const REDIS_PUB_CLIENT = Symbol.for('REDIS_PUB_CLIENT');
const REDIS_SUB_CLIENT = Symbol.for('REDIS_SUB_CLIENT');
const REGISTER_EXTERNAL_EVENTS = Symbol.for('REGISTER_EXTERNAL_EVENTS');

@Module({
  imports: [NestEventEmitterModule.forRoot()],
  providers: [
    {
      provide: REDIS_PUB_CLIENT,
      useFactory: (options: IRedisEventEmitterOptions) => options.pubClient,
      inject: [MODULE_OPTIONS_TOKEN],
    },
    {
      provide: REDIS_SUB_CLIENT,
      useFactory: (options: IRedisEventEmitterOptions) => options.subClient,
      inject: [MODULE_OPTIONS_TOKEN],
    },
    { provide: EE2_EVENT_BUS, useClass: EventBusAdapter },
    {
      provide: EE2_EVENT_EMITTER,
      useFactory: (eventBus: IEventBus) => new EventEmitterAdapter(eventBus),
      inject: [EE2_EVENT_BUS],
    },
    {
      provide: REDIS_EE2_EVENT_EMITTER,
      useFactory: (eventEmitter: IEventEmitter, redisPubClient: Redis) =>
        new RedisEventEmitterProxy(eventEmitter, redisPubClient),
      inject: [EE2_EVENT_EMITTER, REDIS_PUB_CLIENT],
    },
  ],
  exports: [
    EE2_EVENT_BUS,
    EE2_EVENT_EMITTER,
    REDIS_EE2_EVENT_EMITTER,
    REDIS_SUB_CLIENT,
  ],
})
export class EventEmitterModule extends ConfigurableModuleClass {
  static registerEvents(eventsPublishableNames: string[]): DynamicModule {
    return {
      module: class {},
      providers: [
        {
          provide: REGISTER_EXTERNAL_EVENTS,
          useFactory: async (client: Redis, eventEmitter: EventEmitter2) => {
            await Promise.all(
              eventsPublishableNames.map(async (eventPublishableName) => {
                await client.subscribe(
                  eventPublishableName,
                  (error, _count: unknown) => {
                    if (error) {
                      throw error;
                    }
                  },
                );
                client.on('message', (channel: string, message: unknown) => {
                  if (channel !== eventPublishableName) {
                    return;
                  }

                  const normalizedMessage = JSON.parse(
                    `${message}`,
                  ) as IPublishableEvent;

                  void eventEmitter.emit(
                    normalizedMessage.publishableEventName,
                    normalizedMessage,
                  );
                });
              }),
            );

            return client;
          },
          inject: [REDIS_SUB_CLIENT, EventEmitter2],
        },
      ],
    };
  }
}
