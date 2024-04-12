import { Processor, WorkerHost } from '@nestjs/bullmq';
import { type Job } from 'bullmq';

@Processor('test')
export class AuthConsumer extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    console.info(job.name, job.data);
    await new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve(123);
      }, 10_000);
    });
    console.info('done');

    return 'done';
  }
}
