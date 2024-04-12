import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { type IEvent, type IEventBus, type IEventSubscriber } from '../core';

@Injectable()
export class EventBusAdapter implements IEventBus {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  publish(event: IEvent): Promise<void> {
    return Promise.resolve(void this.eventEmitter.emit(event.eventName, event));
  }

  addSubscribers(...subscribers: IEventSubscriber[]): void {
    for (const subscriber of subscribers) {
      const eventList = subscriber.subscribeTo();

      for (const event of eventList) {
        this.on(event.eventName, subscriber.onEvent.bind(subscriber));
      }
    }
  }

  removeSubscribers(...subscribers: IEventSubscriber[]): void {
    for (const subscriber of subscribers) {
      const eventList = subscriber.subscribeTo();

      for (const event of eventList) {
        this.off(event.eventName, subscriber.onEvent.bind(subscriber));
      }
    }
  }

  on<T = unknown>(eventName: string, handler: (payload: T) => void): void {
    this.eventEmitter.addListener(eventName, handler);
  }

  off<T = unknown>(eventName: string, handler: (payload: T) => void): void {
    this.eventEmitter.removeListener(eventName, handler);
  }
}
