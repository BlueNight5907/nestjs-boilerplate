import { BaseError } from 'common/BaseError';
import { ERROR_CODE } from 'exceptions/error-code';
import { ERROR_MESSAGE_KEY } from 'translation-keys';

export class FileIsRequiredException extends BaseError {
  constructor() {
    super({
      code: ERROR_CODE.FILE_IS_REQUIRED,
      message: ERROR_MESSAGE_KEY.FILE_IS_REQUIRED,
    });
  }
}
