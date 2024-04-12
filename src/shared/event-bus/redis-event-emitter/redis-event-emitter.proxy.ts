import { type Redis } from 'ioredis';

import {
  type IEvent,
  type IEventEmitter,
  type IPublishableEvent,
} from '../core';

export class RedisEventEmitterProxy implements IEventEmitter {
  constructor(
    private readonly originalEventEmitter: IEventEmitter,
    private readonly redisPubClient: Redis,
  ) {}

  async emit(event: IEvent): Promise<void> {
    await this.originalEventEmitter.emit(event);

    if (this.isPublishableEvent(event)) {
      await this.redisPubClient.publish(
        event.publishableEventName,
        JSON.stringify(event),
      );
    }
  }

  private isPublishableEvent(event: unknown): event is IPublishableEvent {
    event = event as IPublishableEvent;

    return Boolean((<IPublishableEvent>event).publishableEventName);
  }
}
