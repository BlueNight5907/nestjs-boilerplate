import { Inject } from '@nestjs/common';

import { getMemoryCacheManagerToken } from './utils';

export function InjectMemoryCache(name?: string) {
  return Inject(getMemoryCacheManagerToken(name));
}
