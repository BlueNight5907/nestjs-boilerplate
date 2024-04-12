import { type Job as BullJob, type QueueEvents } from 'bullmq';
import { type JobStatus } from 'definitions/enums';

import { type IJob } from '../core';

export class Job<DataType, ResultType> implements IJob<DataType, ResultType> {
  constructor(
    private readonly job: BullJob,
    private readonly queueEvents: QueueEvents,
  ) {}

  get id() {
    return this.job.id ?? '';
  }

  get data() {
    return this.job.data as DataType;
  }

  get status() {
    return this.job.getState() as Promise<JobStatus>;
  }

  waitUntilFinished(ttl?: number) {
    return this.job.waitUntilFinished(this.queueEvents, ttl);
  }
}
