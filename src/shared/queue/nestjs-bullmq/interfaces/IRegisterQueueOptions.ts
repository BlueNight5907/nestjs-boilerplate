import {
  type BullQueueProcessor,
  type RegisterQueueOptions,
} from '@nestjs/bullmq';

export interface IRegisterQueueOptions extends RegisterQueueOptions {
  /**
   * Queue name
   *
   * @default default
   */
  name: string;
  /**
   * Shared configuration key
   *
   * @default default
   */
  configKey?: string;
  /**
   * Additional queue processors
   */
  processors?: BullQueueProcessor[];
}
