import { Injectable } from '@nestjs/common';
import { LogLevel } from 'definitions/enums';

import {
  type IAuditLogData,
  type IAuditLoggerService,
  ILogger,
  ILoggerServiceOptions,
} from '../interfaces';

@Injectable()
export class AuditLoggerService implements IAuditLoggerService {
  private app: string;

  constructor(
    private readonly logger: ILogger,
    options: ILoggerServiceOptions,
  ) {
    // Set the source class from the parent class
    this.app = options.appName;
  }

  log(message: string, data: IAuditLogData): void {
    const level = data.status === 'error' ? LogLevel.Error : LogLevel.Info;
    this.logger.log(level, message, {
      ...data,
      app: data.app ?? this.app,
    });
  }
}
