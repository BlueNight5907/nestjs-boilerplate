export interface ISetAction {
  set<T>(cacheKey: string, value: T, ttl?: number): Promise<void>;
  set<T>(
    cacheKey: string,
    getValue: () => T | Promise<T>,
    ttl?: number,
  ): Promise<void>;
}
