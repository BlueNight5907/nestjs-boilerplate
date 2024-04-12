import { type IEvent, type IEventSubscriber } from '../interfaces';

export abstract class EventSubscriber implements IEventSubscriber {
  abstract subscribeTo(): IEvent[];

  abstract onEvent(data: IEvent): void;
}
