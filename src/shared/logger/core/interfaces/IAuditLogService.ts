import { type IAuditLogData } from './IAuditLogData';

export interface IAuditLoggerService {
  log(message: string, data: IAuditLogData): void;
}
