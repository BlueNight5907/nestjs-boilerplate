import { type Job as BullJob, type QueueEvents } from 'bullmq';

import { type IJob } from '../core';
import { Job } from './job.adapter';

export class JobFactory {
  static from<DataType, ResultType>(
    job: BullJob,
    queueEvents: QueueEvents,
  ): IJob<DataType, ResultType> {
    return new Job(job, queueEvents);
  }
}
