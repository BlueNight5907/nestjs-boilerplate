import { type ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseError } from 'common/BaseError';

import { BaseFilter, type IParseExceptionResult } from './base.filter';

@Catch(BaseError)
export class AppExceptionFilter extends BaseFilter {
  protected parseException(
    exception: BaseError,
    _host: ArgumentsHost,
  ): IParseExceptionResult {
    const status = exception.httpStatus ?? HttpStatus.BAD_REQUEST;

    return {
      messageKey: exception.message,
      status,
      code: exception.code,
      args: exception.args,
      type: exception.constructor.name,
    };
  }
}
