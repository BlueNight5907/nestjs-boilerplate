import { type LogLevel } from 'definitions/enums';

export interface ILogger {
  log(level: LogLevel, message: string, data?: Record<string, any>): void;
  debug(message: string, data?: Record<string, any>): void;
  info(message: string, data?: Record<string, any>): void;
  warn(message: string, data?: Record<string, any>): void;
  error(message: string, data?: Record<string, any>): void;
  fatal(message: string, data?: Record<string, any>): void;
  emergency(message: string, data?: Record<string, any>): void;
}
