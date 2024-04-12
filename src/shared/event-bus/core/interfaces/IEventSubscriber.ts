import { type IEvent } from './IEvent';

export interface IEventSubscriber {
  subscribeTo(): IEvent[];
  onEvent(data: IEvent): void;
}
