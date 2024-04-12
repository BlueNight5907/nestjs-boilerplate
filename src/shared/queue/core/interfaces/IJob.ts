import { type JobStatus } from 'definitions/enums';

export interface IJob<DataType, ResultType> {
  id: string;
  data: DataType;
  status: Promise<JobStatus>;
  waitUntilFinished(ttl?: number): Promise<ResultType>;
}
