import { Injectable } from '@nestjs/common';
import { type LogLevel } from 'definitions/enums';
import { ContextProvider } from 'providers';

import {
  type ILogData,
  ILogger,
  type ILoggerService,
  ILoggerServiceOptions,
} from '../interfaces';

@Injectable()
export class LoggerService implements ILoggerService {
  private app: string;

  private context?: string;

  constructor(
    private readonly logger: ILogger,
    options: ILoggerServiceOptions,
  ) {
    // Set the source class from the parent class
    this.app = options.appName;
  }

  private getLogData(data?: ILogData): ILogData {
    return {
      ...data,
      app: data?.app ?? this.app,
      sourceClass: this.constructor.name,
      context: data?.context ?? this.context,
      correlationId:
        data?.correlationId ?? ContextProvider.getCurrentContextId(),
    };
  }

  setContext(context: string): void {
    this.context = context;
  }

  public log(level: LogLevel, message: string, data?: ILogData) {
    return this.logger.log(level, message, this.getLogData(data));
  }

  public debug(message: string, data?: ILogData) {
    return this.logger.debug(message, this.getLogData(data));
  }

  public info(message: string, data?: ILogData) {
    return this.logger.info(message, this.getLogData(data));
  }

  public warn(message: string, data?: ILogData) {
    return this.logger.warn(message, this.getLogData(data));
  }

  public error(message: string, data?: ILogData) {
    return this.logger.error(message, this.getLogData(data));
  }

  public fatal(message: string, data?: ILogData) {
    return this.logger.fatal(message, this.getLogData(data));
  }

  public emergency(message: string, data?: ILogData) {
    return this.logger.emergency(message, this.getLogData(data));
  }
}
