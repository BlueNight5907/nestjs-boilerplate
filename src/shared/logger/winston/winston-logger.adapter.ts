import { LogLevel } from 'definitions/enums';
import { createLogger, type Logger, type LoggerOptions } from 'winston';

import { type ILogger } from '../core/interfaces';

export class WinstonLoggerAdapter implements ILogger {
  private logger: Logger;

  constructor(loggerOptions: LoggerOptions) {
    // Setting log levels for winston
    const levels = {} as Record<LogLevel, number>;
    let cont = 0;

    for (const level of Object.values(LogLevel)) {
      levels[level] = cont;
      cont++;
    }

    this.logger = createLogger({
      level: LogLevel.Info,
      levels,
      ...loggerOptions,
    });
  }

  public log(level: LogLevel, message: string, data?: Record<string, any>) {
    const logData = {
      level,
      message,
      ...data,
    };

    this.logger.log(logData);
  }

  public debug(message: string, data?: Record<string, any>) {
    this.log(LogLevel.Debug, message, data);
  }

  public info(message: string, data?: Record<string, any>) {
    this.log(LogLevel.Info, message, data);
  }

  public warn(message: string, data?: Record<string, any>) {
    this.log(LogLevel.Warn, message, data);
  }

  public error(message: string, data?: Record<string, any>) {
    this.log(LogLevel.Error, message, data);
  }

  public fatal(message: string, data?: Record<string, any>) {
    this.log(LogLevel.Fatal, message, data);
  }

  public emergency(message: string, data?: Record<string, any>) {
    this.log(LogLevel.Emergency, message, data);
  }
}
