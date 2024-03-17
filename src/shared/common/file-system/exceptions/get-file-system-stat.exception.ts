import { BaseException } from 'common/exception/BaseException';
import { ERROR_CODE } from 'common/exception/error-code';

export class GetFileSystemStatException extends BaseException {
  private path: string;

  constructor(path: string, stack?: string) {
    super({
      code: ERROR_CODE.GET_FILE_SYSTEM_STAT_ERROR,
      args: { path },
      stack,
    });
    this.path = path;
  }

  get message(): string {
    return `Get file system stat failed: ${this.path}`;
  }
}
