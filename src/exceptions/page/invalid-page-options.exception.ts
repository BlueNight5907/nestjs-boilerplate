import { BaseError } from 'common/BaseError';
import { ERROR_CODE } from 'exceptions/error-code';
import { ERROR_MESSAGE_KEY } from 'translation-keys';

export class InvalidPageOptionsException extends BaseError {
  constructor(invalidQuery: string) {
    super({
      message: ERROR_MESSAGE_KEY.INVALID_PAGE_OPTIONS_EXCEPTION,
      code: ERROR_CODE.INVALID_PAGE_OPTIONS_EXCEPTION,
      args: {
        invalidQuery,
      },
    });
  }
}
