import { BaseException } from 'common/exception/BaseException';
import { ERROR_CODE } from 'common/exception/error-code';

export class SaveFileException extends BaseException {
  constructor(private path: string) {
    super({
      code: ERROR_CODE.SAVE_FILE_ERROR,
      args: { path },
    });
  }

  get message(): string {
    return `Save file to ${this.path} failed`;
  }
}
