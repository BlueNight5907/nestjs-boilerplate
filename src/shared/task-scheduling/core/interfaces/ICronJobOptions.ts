import { type IBaseJobScheduleOptions } from './IBaseJobScheduleOptions';

export type FixTimeOptions = IBaseJobScheduleOptions & {
  every: number;
  type: 'fix-time';
};
export type CronExpressionOptions = IBaseJobScheduleOptions & {
  type: 'cron-expression';
  pattern: string;
};

export interface ICronJobOptions {
  jobId?: string;
  attempts?: number;
  priority?: number;
  scheduleOptions: FixTimeOptions | CronExpressionOptions;
}
