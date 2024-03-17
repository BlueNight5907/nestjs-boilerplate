import { BaseException } from 'common/exception/BaseException';
import { ERROR_CODE } from 'common/exception/error-code';

export class FileNotFoundException extends BaseException {
  private path: string;

  constructor(path: string) {
    super({
      code: ERROR_CODE.FILE_NOT_FOUND,
      args: { path },
    });
    this.path = path;
  }

  get message(): string {
    return `File not found: ${this.path}`;
  }
}
