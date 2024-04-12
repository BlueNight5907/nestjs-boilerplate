import { Inject } from '@nestjs/common';

import { getRedisCacheManagerToken } from './utils';

export function InjectRedisCache(name?: string) {
  return Inject(getRedisCacheManagerToken(name));
}
