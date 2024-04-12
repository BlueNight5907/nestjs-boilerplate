import { type IEvent } from './IEvent';

export interface IPublishableEvent extends IEvent {
  readonly publishableEventName: string;
}
