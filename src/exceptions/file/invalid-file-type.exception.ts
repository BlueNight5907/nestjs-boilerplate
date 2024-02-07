import { BaseError } from 'common/BaseError';
import { ERROR_CODE } from 'exceptions/error-code';
import { ERROR_MESSAGE_KEY } from 'translation-keys';

export class InvalidFileTypeException extends BaseError {
  constructor(fileTypes: string[]) {
    super({
      code: ERROR_CODE.INVALID_FILE_TYPE,
      message: ERROR_MESSAGE_KEY.INVALID_FILE_TYPE,
      args: { value: fileTypes.join(', ') },
    });
  }
}
