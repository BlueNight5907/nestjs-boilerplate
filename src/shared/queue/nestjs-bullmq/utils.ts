import { type JobsOptions } from 'bullmq';

import { type IJobOptions } from '../core';

export function getQueueToken(queueName: string) {
  return Symbol.for(`QUEUE_${queueName}`);
}

export function transformToBullMQJobOptions(
  options: IJobOptions & { queueName: string },
): JobsOptions {
  return {
    delay: options.delay,
    jobId: options.jobId,
    attempts: options.attempts,
    priority: options.priority,
    parent: options.parentId
      ? {
          id: options.parentId,
          queue: options.queueName,
        }
      : undefined,
  };
}
