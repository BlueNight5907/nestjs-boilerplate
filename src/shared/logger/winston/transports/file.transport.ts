import DailyRotateFile from 'winston-daily-rotate-file';

export interface IFileTransportOptions {
  fileNamePrefix?: string;
}

export class FileTransport {
  public static create(options?: IFileTransportOptions) {
    return new DailyRotateFile({
      dirname: 'logs',
      filename: `${options?.fileNamePrefix ?? 'log'}-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    });
  }
}
