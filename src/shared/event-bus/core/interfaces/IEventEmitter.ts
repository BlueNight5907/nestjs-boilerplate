import { type IEvent } from './IEvent';

export interface IEventEmitter {
  emit(event: IEvent): Promise<void>;
}
