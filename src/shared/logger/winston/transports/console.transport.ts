/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { LogLevel } from 'definitions/enums';
import * as winston from 'winston';

enum LogColors {
  red = '\u001B[31m',
  green = '\u001B[32m',
  yellow = '\u001B[33m',
  blue = '\u001B[34m',
  magenta = '\u001B[35m',
  cyan = '\u001B[36m',
  pink = '\u001B[38;5;206m',
}

export class ConsoleTransport {
  public static forCommonLogger() {
    return new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'DD/MM/YYYY, HH:mm:ss',
        }),
        winston.format.printf((log) => {
          const color = this.mapLogLevelColor(log.level as LogLevel);
          const prefix = log.data.label ? `[${log.data.label}]` : '';
          const sourceClass = log.data.sourceClass
            ? this.colorize(LogColors.cyan, `[${log.data.sourceClass}]`)
            : '';

          return `${this.colorize(color, prefix + '  -')} ${log.timestamp}    ${
            log.data.correlationId
              ? `(${this.colorize(
                  LogColors.cyan,
                  String(log.data.correlationId),
                )})`
              : ''
          } ${this.colorize(
            color,
            log.level.toUpperCase(),
          )} ${sourceClass} ${this.colorize(
            color,
            log.message + ' - ' + (log.data.error ?? ''),
          )}${
            log.data.ms === undefined
              ? ''
              : this.colorize(LogColors.yellow, ' ' + log.data.ms)
          }${
            log.data.stack ? this.colorize(color, `  - ${log.data.stack}`) : ''
          }${
            log.data.props
              ? `\n- Props:\n${JSON.stringify(log.data.props, null, 4)}`
              : ''
          }`;
        }),
      ),
    });
  }

  public static forAuditLogger() {
    return new winston.transports.Console({
      format: winston.format.combine(
        // Add ms
        winston.format.timestamp({
          format: 'DD/MM/YYYY, HH:mm:ss',
        }),
        winston.format.printf((log) => {
          const color = this.mapLogLevelColor(log.level as LogLevel);

          const prefix = `[${log.app}]  -`;

          return `${this.colorize(color, prefix)} ${log.timestamp}    ${
            log.contextId
              ? `(${this.colorize(LogColors.cyan, String(log.contextId))})`
              : ''
          } ${this.colorize(color, log.level.toUpperCase())} ${this.colorize(
            color,
            String(log.message),
          )}"${
            log.ms === undefined
              ? ''
              : this.colorize(LogColors.yellow, ' ' + log.ms)
          }`;
        }),
      ),
    });
  }

  private static colorize(color: LogColors, message: string): string {
    return `${color}${message}\u001B[0m`;
  }

  private static mapLogLevelColor(level: LogLevel): LogColors {
    switch (level) {
      case LogLevel.Debug: {
        return LogColors.blue;
      }

      case LogLevel.Info: {
        return LogColors.green;
      }

      case LogLevel.Warn: {
        return LogColors.yellow;
      }

      case LogLevel.Error: {
        return LogColors.red;
      }

      case LogLevel.Fatal: {
        return LogColors.magenta;
      }

      case LogLevel.Emergency: {
        return LogColors.pink;
      }

      default: {
        return LogColors.cyan;
      }
    }
  }
}
