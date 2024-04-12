import { type IPublishableEvent } from 'shared/event-bus';

export class TestEvent implements IPublishableEvent {
  static eventName = 'TestEvent';

  static publishableEventName = 'events:new-message';

  eventName: string = TestEvent.eventName;

  publishableEventName: string = TestEvent.publishableEventName;

  constructor(public readonly data: string) {}
}
