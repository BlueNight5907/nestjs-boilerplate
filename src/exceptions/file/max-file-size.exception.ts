import { BaseError } from 'common/BaseError';
import { ERROR_CODE } from 'exceptions/error-code';
import { ERROR_MESSAGE_KEY } from 'translation-keys';

const KB = 1024;

export class MaxFileSizeException extends BaseError {
  constructor(size: number) {
    super({
      code: ERROR_CODE.MAX_FILE_SIZE,
      message: ERROR_MESSAGE_KEY.MAX_FILE_SIZE,
      args: { value: Math.round(size / KB) },
    });
  }
}
