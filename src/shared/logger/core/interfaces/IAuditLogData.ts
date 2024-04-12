import { type HttpStatus } from '@nestjs/common';
import { type Uuid } from 'definitions/@types';

export interface IAuditLogData {
  contextId?: string;
  app?: string;
  userId?: 'None' | Uuid;
  ipAddress?: string;
  method?: string;
  status?: 'success' | 'error';
  stack?: string;
  cause?: string;
  url?: string;
  httpStatus?: HttpStatus;
  content: Record<string, any>;
}
