export interface IBaseExceptionParams {
  code: string;
  args?: Record<string, unknown>;
  stack?: string;
}

export abstract class BaseException extends Error {
  public code: string;

  public args?: Record<string, unknown>;

  constructor(options: IBaseExceptionParams) {
    super();
    this.code = options.code;
    this.args = options.args;

    if (options.stack) {
      this.stack = options.stack;
    }
  }

  abstract get message(): string;
}
