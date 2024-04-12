// Update more behavior later
export interface ICacheClient {
  get<T = unknown>(cacheKey: string): Promise<T | undefined>;

  set<T = unknown>(
    cacheKey: string,
    cacheValue: T | Promise<T>,
    ttl?: number,
  ): Promise<void>;

  delete(...keys: string[]): Promise<void>;
}
