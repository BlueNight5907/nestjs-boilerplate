import { Module, type Provider, Scope } from '@nestjs/common';
import { ApiConfigService } from 'shared/common';
import { format, type LoggerOptions } from 'winston';

import { AuditLoggerService, type ILogger, LoggerService } from '../core';
import { WINSTON_AUDIT_LOGGER_SERVICE, WINSTON_LOGGER_SERVICE } from './tokens';
import { ConsoleTransport, FileTransport } from './transports';
import { WinstonLoggerAdapter } from './winston-logger.adapter';

const LOGGER = Symbol.for('LOGGER');
const AUDIT_LOGGER = Symbol.for('AUDIT_LOGGER');
const LOGGER_OPTIONS = Symbol.for('LOGGER_OPTIONS');
const AUDIT_LOGGER_OPTIONS = Symbol.for('AUDIT_LOGGER_OPTIONS');

const loggerProviders: Provider[] = [
  {
    provide: LOGGER_OPTIONS,
    useFactory: (configService: ApiConfigService): LoggerOptions => ({
      format: format.combine(
        // Add timestamp and format the date
        format.timestamp(),
        // Add ms
        format.ms(),
        // Errors will be logged with stack trace
        format.errors({ stack: true }),
        // Add custom Log fields to the log
        format((info) => {
          // Info contains an Error property
          if (info.error && info.error instanceof Error) {
            info.stack = info.error.stack;
            info.error = undefined;
          }

          const context = info.context ? ` - ${info.context}` : '';

          info.label = `${info.app}${context}`;

          return info;
        })(),
        // Add custom fields to the data property
        format.metadata({
          key: 'data',
          fillExcept: ['timestamp', 'level', 'message'],
        }),
        // Format the log as JSON
        format.json(),
      ),
      transports: [
        ConsoleTransport.forCommonLogger(),
        FileTransport.create({
          fileNamePrefix: configService.appConfig.logPrefix,
        }),
      ],
    }),
    inject: [ApiConfigService],
  },
  {
    provide: LOGGER,
    useFactory: (options: LoggerOptions) => new WinstonLoggerAdapter(options),
    inject: [LOGGER_OPTIONS],
  },
  {
    provide: WINSTON_LOGGER_SERVICE,
    useFactory: (logger: ILogger, configService: ApiConfigService) =>
      new LoggerService(logger, { appName: configService.appConfig.appName }),
    inject: [LOGGER, ApiConfigService],
    scope: Scope.TRANSIENT,
  },
];

const auditLoggerProviders: Provider[] = [
  {
    provide: AUDIT_LOGGER_OPTIONS,
    useFactory: (configService: ApiConfigService): LoggerOptions => ({
      format: format.combine(
        // Add timestamp and format the date
        format.timestamp(),
        // Add ms
        format.ms(),
        // Format the log as JSON
        format.json(),
      ),
      transports: [
        ConsoleTransport.forAuditLogger(),
        FileTransport.create({
          fileNamePrefix: configService.appConfig.auditLogPrefix,
        }),
      ],
    }),
    inject: [ApiConfigService],
  },
  {
    provide: AUDIT_LOGGER,
    useFactory: (options: LoggerOptions) => new WinstonLoggerAdapter(options),
    inject: [AUDIT_LOGGER_OPTIONS],
  },
  {
    provide: WINSTON_AUDIT_LOGGER_SERVICE,
    useFactory: (logger: ILogger, configService: ApiConfigService) =>
      new AuditLoggerService(logger, {
        appName: configService.appConfig.appName,
      }),
    inject: [AUDIT_LOGGER, ApiConfigService],
    scope: Scope.DEFAULT,
  },
];

@Module({
  providers: [...loggerProviders, ...auditLoggerProviders],
  exports: [WINSTON_LOGGER_SERVICE, WINSTON_AUDIT_LOGGER_SERVICE],
})
export class WinstonLoggerModule {}
