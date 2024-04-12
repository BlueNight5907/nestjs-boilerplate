const DEFAULT = 'default';

export function getSharedRedisCacheToken(key?: string) {
  return Symbol.for(`SharedRedisCache:${key ?? DEFAULT}`);
}

export function getSharedRedisCacheClientToken(key?: string) {
  return Symbol.for(`SharedRedisCacheClient:${key ?? DEFAULT}`);
}

export function getRedisCacheFeatureOptionsToken(key?: string) {
  return Symbol.for(`RedisCacheFeatureOptions:${key ?? DEFAULT}`);
}

export function getRedisCacheManagerToken(key?: string) {
  return Symbol.for(`RedisCacheManager:${key ?? DEFAULT}`);
}
