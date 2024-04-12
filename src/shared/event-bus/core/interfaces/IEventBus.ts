import { type IEvent } from './IEvent';
import { type IEventSubscriber } from './IEventSubscriber';

export interface IEventBus {
  publish<T extends IEvent>(event: T): Promise<void>;
  addSubscribers(...subscribers: IEventSubscriber[]): void;
  removeSubscribers(...subscribers: IEventSubscriber[]): void;
  on<T = unknown>(eventName: string, handler: (payload: T) => void): void;
  off<T = unknown>(eventName: string, handler: (payload: T) => void): void;
}
