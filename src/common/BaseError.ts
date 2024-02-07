export interface IBaseErrorParams {
  code: number;
  message: string;
  args?: Record<string, unknown>;
  stacktraces?: unknown;
  httpStatus?: number;
}

export class BaseError extends Error {
  public code: number;

  public message: string;

  public args?: Record<string, unknown>;

  public stacktraces?: unknown;

  public httpStatus?: number;

  constructor(options: IBaseErrorParams) {
    super(options.message);
    this.code = options.code;
    this.message = options.message;
    this.args = options.args;
    this.stacktraces = options.stacktraces;
    this.httpStatus = options.httpStatus;
  }
}
