import { type QueueOptions } from 'bullmq';

export type IBullModuleOptions = Omit<
  QueueOptions,
  'settings' | 'skipVersionCheck'
>;
