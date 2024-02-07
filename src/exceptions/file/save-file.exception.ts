import { BaseError } from 'common/BaseError';
import { ERROR_CODE } from 'exceptions/error-code';
import { ERROR_MESSAGE_KEY } from 'translation-keys';

export class SaveFileException extends BaseError {
  constructor(path: string) {
    super({
      code: ERROR_CODE.SAVE_FILE_ERROR,
      message: ERROR_MESSAGE_KEY.SAVE_FILE_ERROR,
      args: { path },
    });
  }
}
