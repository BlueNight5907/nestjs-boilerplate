import { type ArgumentsHost, Catch, NotFoundException } from '@nestjs/common';
import { ERROR_CODE } from 'exceptions/error-code';
import { ERROR_MESSAGE_KEY } from 'translation-keys';

import { BaseFilter, type IParseExceptionResult } from './base.filter';

@Catch(NotFoundException)
export class NotFoundExceptionFilter extends BaseFilter {
  protected parseException(
    exception: NotFoundException,
    _host: ArgumentsHost,
  ): IParseExceptionResult {
    return {
      type: exception.name,
      code: ERROR_CODE.HTTP_NOT_FOUND,
      messageKey: ERROR_MESSAGE_KEY.HTTP_NOT_FOUND,
      status: exception.getStatus(),
    };
  }
}
