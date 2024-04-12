import { type JobStatus } from 'definitions/enums';

import { type IJob } from './IJob';
import { type IJobOptions } from './IJobOptions';

export interface IAddBulkOptions<DataType> {
  jobName: string;
  data: DataType;
  options?: IJobOptions;
}

export interface IQueue {
  /**
   * add new job to queue
   */
  add<DataType = unknown, ResultType = unknown>(
    jobName: string,
    data: DataType,
    options?: IJobOptions,
  ): Promise<IJob<DataType, ResultType>>;
  /**
   * add new job(s) to queue
   */
  addBulk<DataType = unknown, ResultType = unknown>(
    list: Array<IAddBulkOptions<DataType>>,
  ): Promise<Array<IJob<DataType, ResultType>>>;

  /**
   * get job from queue
   */
  get<DataType = unknown, ResultType = unknown>(
    jobId: string,
  ): Promise<IJob<DataType, ResultType> | undefined>;

  /**
   * remove job(s) from queue
   */
  remove(...jobIds: string[]): Promise<number>;

  /**
   * Cleans jobs from a queue. Similar to drain but keeps jobs within a certain grace period.
   */
  clean(grace: number, limit: number, status?: JobStatus): Promise<string[]>;

  drain(): Promise<void>;
}
