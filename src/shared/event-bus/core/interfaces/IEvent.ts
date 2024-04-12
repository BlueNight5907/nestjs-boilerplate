export interface IEvent<T = unknown> {
  eventName: string;
  data: T;
}
