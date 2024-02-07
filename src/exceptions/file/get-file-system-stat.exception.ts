import { BaseError } from 'common/BaseError';
import { ERROR_CODE } from 'exceptions/error-code';
import { ERROR_MESSAGE_KEY } from 'translation-keys';

export class GetFileSystemStatException extends BaseError {
  constructor(path: string) {
    super({
      code: ERROR_CODE.GET_FILE_SYSTEM_STAT_ERROR,
      message: ERROR_MESSAGE_KEY.GET_FILE_SYSTEM_STAT_ERROR,
      args: { path },
    });
  }
}
