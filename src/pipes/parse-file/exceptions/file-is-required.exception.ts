import { BaseException } from 'common/exception/BaseException';
import { ERROR_CODE } from 'common/exception/error-code';

export class FileIsRequiredException extends BaseException {
  private field?: string;

  constructor(field?: string) {
    super({
      code: ERROR_CODE.FILE_IS_REQUIRED,
      args: {
        field,
      },
    });
    this.field = field;
  }

  get message(): string {
    if (!this.field) {
      return 'File(s) is required';
    }

    return `File(s) from field "${this.field}" is required`;
  }
}
