import { type IEvent, type IEventBus, type IEventEmitter } from '../core';

export class EventEmitterAdapter implements IEventEmitter {
  constructor(private readonly eventBus: IEventBus) {}

  emit(event: IEvent): Promise<void> {
    return this.eventBus.publish(event);
  }
}
