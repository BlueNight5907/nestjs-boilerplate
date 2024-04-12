const DEFAULT = 'default';

export function getSharedMemoryCacheToken(key?: string) {
  return Symbol.for(`SharedMemoryCache:${key ?? DEFAULT}`);
}

export function getSharedMemoryCacheClientToken(key?: string) {
  return Symbol.for(`SharedRedisCacheClient:${key ?? DEFAULT}`);
}

export function getMemoryCacheFeatureOptionsToken(key?: string) {
  return Symbol.for(`MemoryCacheFeatureOptions:${key ?? DEFAULT}`);
}

export function getMemoryCacheManagerToken(key?: string) {
  return Symbol.for(`MemoryCacheManager:${key ?? DEFAULT}`);
}
