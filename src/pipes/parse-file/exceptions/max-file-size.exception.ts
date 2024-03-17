import { BaseException } from 'common/exception/BaseException';
import { ERROR_CODE } from 'common/exception/error-code';

const KB = 1024;

export class MaxFileSizeException extends BaseException {
  private fileSize: number;

  private field?: string;

  constructor(size: number, field?: string) {
    super({
      code: ERROR_CODE.MAX_FILE_SIZE,
      args: { value: Math.round(size / KB) },
    });

    this.fileSize = Math.round(size / KB);
    this.field = field;
  }

  get message(): string {
    if (!this.field) {
      return `File size should not exceed ${this.fileSize}KB`;
    }

    return `File size of field ${this.field} should not exceed ${this.fileSize}KB`;
  }
}
