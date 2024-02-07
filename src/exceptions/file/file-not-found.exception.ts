import { BaseError } from 'common/BaseError';
import { ERROR_CODE } from 'exceptions/error-code';
import { ERROR_MESSAGE_KEY } from 'translation-keys';

export class FileNotFoundException extends BaseError {
  constructor(path: string) {
    super({
      code: ERROR_CODE.FILE_NOT_FOUND,
      message: ERROR_MESSAGE_KEY.FILE_NOT_FOUND,
      args: { path },
    });
  }
}
