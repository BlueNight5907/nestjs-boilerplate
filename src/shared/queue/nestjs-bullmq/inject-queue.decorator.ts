import { Inject } from '@nestjs/common';

import { getQueueToken } from './utils';

export function InjectQueue(queueName: string) {
  return Inject(getQueueToken(queueName));
}
