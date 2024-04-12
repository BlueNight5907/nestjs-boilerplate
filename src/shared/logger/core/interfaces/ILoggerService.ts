import { type LogLevel } from 'definitions/enums';

import { type ILogData } from './ILogData';

export interface ILogAction {
  log(level: LogLevel, message: string, data?: ILogData): void;
}

export interface IDebugAction {
  debug(message: string, data?: ILogData): void;
}

export interface IErrorAction {
  error(message: string, data?: ILogData): void;
}

export interface IInfoAction {
  info(message: string, data?: ILogData): void;
}

export interface IWarnAction {
  warn(message: string, data?: ILogData): void;
}

export interface IFatalAction {
  fatal(message: string, data?: ILogData): void;
}

export interface IEmergencyAction {
  emergency(message: string, data?: ILogData): void;
}

export interface ILoggerService
  extends ILogAction,
    IDebugAction,
    IErrorAction,
    IInfoAction,
    IWarnAction,
    IFatalAction,
    IEmergencyAction {
  setContext(context: string): void;
}
