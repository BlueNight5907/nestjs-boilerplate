import { type ICronJobOptions } from './ICronJobOptions';

export interface ISchedulerRegistry {
  /**
   * add new job to queue
   */
  add<DataType = unknown>(
    jobName: string,
    data: DataType,
    options?: ICronJobOptions,
  ): Promise<any>;
}
