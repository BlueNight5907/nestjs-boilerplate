import { type Queue, type QueueEvents } from 'bullmq';
import { type JobStatus } from 'definitions/enums';

import {
  type IAddBulkOptions,
  type IJob,
  type IJobOptions,
  type IQueue,
} from '../core';
import { JobFactory } from './job.factory';
import { transformToBullMQJobOptions } from './utils';

export class BullQueueAdapter implements IQueue {
  constructor(
    private readonly queue: Queue,
    private readonly queueEvents: QueueEvents,
  ) {}

  async add<DataType, ResultType>(
    jobName: string,
    data: DataType,
    options?: IJobOptions | undefined,
  ): Promise<IJob<DataType, ResultType>> {
    const bullOptions = transformToBullMQJobOptions({
      queueName: this.queue.name,
      ...options,
    });

    const rawJob = await this.queue.add(jobName, data, bullOptions);

    return JobFactory.from(rawJob, this.queueEvents);
  }

  async addBulk<DataType = unknown, ResultType = unknown>(
    list: Array<IAddBulkOptions<DataType>>,
  ): Promise<Array<IJob<DataType, ResultType>>> {
    const results = await this.queue.addBulk(
      list.map((item) => ({
        name: item.jobName,
        data: item.data,
        opts: transformToBullMQJobOptions({
          queueName: this.queue.name,
          ...item.options,
        }),
      })),
    );

    return results.map((result) => JobFactory.from(result, this.queueEvents));
  }

  async get<DataType = unknown, ResultType = unknown>(
    jobId: string,
  ): Promise<IJob<DataType, ResultType> | undefined> {
    const rawJob = await this.queue.getJob(jobId);

    if (!rawJob) {
      return undefined;
    }

    return JobFactory.from(rawJob, this.queueEvents);
  }

  async remove(...jobIds: string[]): Promise<number> {
    const results = await Promise.all(
      jobIds.map((jobId) => this.queue.remove(jobId)),
    );

    let totals = 0;

    for (const count of results) {
      totals += count;
    }

    return totals;
  }

  clean(
    grace: number,
    limit: number,
    status?: JobStatus | undefined,
  ): Promise<string[]> {
    return this.queue.clean(grace, limit, status);
  }

  drain(): Promise<void> {
    return this.queue.drain(true);
  }
}
